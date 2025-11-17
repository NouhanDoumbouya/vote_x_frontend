import { useState } from 'react';
import { Navbar } from './Navbar';
import { Poll } from '../App';
import { ArrowLeft, Users, Clock, CheckCircle2, Share2, Tag, TrendingUp, Copy, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

type PollDetailProps = {
  poll: Poll;
  userVote?: string;
  onVote: (pollId: string, optionId: string) => void;
  onBack: () => void;
};

export function PollDetail({ poll, userVote, onVote, onBack }: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(userVote || null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVoteSubmit = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCopyLink = async () => {
    const pollUrl = `${window.location.origin}/?poll=${poll.id}`;
    
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pollUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  const chartData = poll.options.map((option) => ({
    name: option.text.length > 20 ? option.text.substring(0, 20) + '...' : option.text,
    fullName: option.text,
    votes: option.votes,
    percentage: poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0,
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={onBack} />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Polls</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Voting */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poll Header */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span className="text-sm text-blue-400">{poll.category}</span>
                </div>
              </div>
              
              <h1 className="text-white mb-4">{poll.title}</h1>
              <p className="text-slate-400 mb-6">{poll.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Ends in {poll.endsIn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>{poll.totalVotes} total votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>{poll.options.length} options</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-white">Vote Submitted!</h4>
                  <p className="text-slate-400 text-sm">Thank you for participating in this poll</p>
                </div>
              </div>
            )}

            {/* Voting Options */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white">Cast Your Vote</h2>
                {userVote && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Voted</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                  const isSelected = selectedOption === option.id;
                  const isUserVote = userVote === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => !userVote && setSelectedOption(option.id)}
                      className={`relative bg-white/5 rounded-xl p-5 cursor-pointer transition-all overflow-hidden group ${
                        isSelected && !userVote
                          ? 'ring-2 ring-blue-500 bg-blue-500/10'
                          : 'hover:bg-white/10'
                      } ${userVote ? 'cursor-default' : ''} ${
                        isUserVote ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      {/* Vote percentage background */}
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected || isUserVote
                                ? 'border-blue-400 bg-blue-500'
                                : 'border-slate-500 group-hover:border-slate-400'
                            }`}
                          >
                            {(isSelected || isUserVote) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-white">{option.text}</span>
                          {isUserVote && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-slate-400 text-sm">
                            {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                          </span>
                          <span className="text-white min-w-[60px] text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vote Button */}
              {!userVote && (
                <button
                  onClick={handleVoteSubmit}
                  disabled={!selectedOption}
                  className={`w-full py-4 rounded-xl transition-all ${
                    selectedOption
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]'
                      : 'bg-white/5 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {selectedOption ? 'Submit Vote' : 'Select an option to vote'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Share */}
          <div className="space-y-6">
            {/* Share Card */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white mb-4">Share Poll</h3>
              <p className="text-slate-400 text-sm mb-4">
                Invite others to participate in this poll
              </p>
              <button 
                onClick={handleCopyLink}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white mb-4">Poll Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Votes</span>
                  <span className="text-white">{poll.totalVotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Options</span>
                  <span className="text-white">{poll.options.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white">{poll.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            {poll.totalVotes > 0 && (
              <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-white mb-4">Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="votes"
                      label={(entry) => `${entry.percentage}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#ffffff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Chart */}
        {poll.totalVotes > 0 && (
          <div className="mt-8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-white mb-6">Detailed Results</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    return [`${value} votes (${props.payload.percentage}%)`, props.payload.fullName];
                  }}
                />
                <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}