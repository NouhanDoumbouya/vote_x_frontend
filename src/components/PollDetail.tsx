import { useState } from 'react';
import { Navbar } from './Navbar';
import { Poll } from '../App';
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  Share2,
  Tag,
  TrendingUp,
  Copy,
  Check
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

type PollDetailProps = {
  poll: Poll;
  userVote?: number;
  onVote: (pollId: number, optionId: number) => void;
  onBack: () => void;
};

export function PollDetail({ poll, userVote, onVote, onBack }: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(userVote ?? null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVoteSubmit = () => {
    if (selectedOption !== null) {
      onVote(poll.id, selectedOption);   // numeric IDs OK
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCopyLink = async () => {
    const pollUrl = `${window.location.origin}/poll/${poll.id}`;

    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = pollUrl;
      textarea.style.position = 'fixed';
      textarea.style.left = '-99999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const chartData = poll.options.map((option) => ({
    name: option.text.length > 20 ? option.text.substring(0, 20) + '...' : option.text,
    fullName: option.text,
    votes: option.votes,
    percentage:
      poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={onBack} />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Polls</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* POLL HEADER */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-3 h-3 text-blue-400" />
                <span className="text-sm text-blue-400">{poll.category}</span>
              </div>

              <h1 className="text-white mb-4">{poll.title}</h1>

              <p className="text-slate-400 mb-6">{poll.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Ends in {poll.endsIn}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{poll.totalVotes} votes</span>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>{poll.options.length} options</span>
                </div>
              </div>
            </div>

            {/* SUCCESS BANNER */}
            {showSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-white">Vote Submitted!</h4>
                  <p className="text-slate-400 text-sm">Thank you for participating.</p>
                </div>
              </div>
            )}

            {/* VOTING */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-white mb-6">Cast Your Vote</h2>

              <div className="space-y-3 mb-6">
                {poll.options.map((option) => {
                  const percentage =
                    poll.totalVotes > 0
                      ? (option.votes / poll.totalVotes) * 100
                      : 0;

                  const isSelected = selectedOption === option.id;
                  const isUserVote = userVote === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() =>
                        userVote == null && setSelectedOption(option.id)
                      }
                      className={`relative bg-white/5 p-5 rounded-xl cursor-pointer transition-all
                        ${isSelected && !userVote ? 'ring-2 ring-blue-500' : ''}
                        ${isUserVote ? 'ring-2 ring-emerald-500' : ''}
                        ${userVote ? 'cursor-default' : 'hover:bg-white/10'}
                      `}
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500/20 transition-all"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                              isSelected || isUserVote
                                ? 'border-blue-400 bg-blue-500'
                                : 'border-slate-500'
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

                        <div className="text-right text-white">
                          <div>{option.votes} votes</div>
                          <div>{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!userVote && (
                <button
                  onClick={handleVoteSubmit}
                  disabled={selectedOption === null}
                  className={`w-full py-4 rounded-xl ${
                    selectedOption !== null
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {selectedOption ? 'Submit Vote' : 'Select an option'}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">
            {/* SHARE */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-white mb-4">Share Poll</h3>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl hover:bg-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* QUICK STATS */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-white mb-4">Poll Statistics</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-slate-400">
                  <span>Total Votes</span>
                  <span className="text-white">{poll.totalVotes}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Options</span>
                  <span className="text-white">{poll.options.length}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Category</span>
                  <span className="text-white">{poll.category}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Status</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* PIE CHART */}
            {poll.totalVotes > 0 && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
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
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* BAR CHART */}
        {poll.totalVotes > 0 && (
          <div className="bg-white/5 p-8 mt-8 rounded-2xl border border-white/10">
            <h2 className="text-white mb-6">Detailed Results</h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8' }}
                  stroke="rgba(255,255,255,0.3)"
                />

                <YAxis tick={{ fill: '#94a3b8' }} stroke="rgba(255,255,255,0.3)" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#ffffff'
                  }}
                />

                <Bar dataKey="votes">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
