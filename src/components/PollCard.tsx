import { Poll } from '../App';
import { Clock, Users, CheckCircle2, TrendingUp, Tag } from 'lucide-react';

type PollCardProps = {
  poll: Poll;
  hasVoted: boolean;
  onClick: () => void;
};

export function PollCard({ poll, hasVoted, onClick }: PollCardProps) {
  const topOption = poll.options.reduce((prev, current) => 
    (current.votes > prev.votes) ? current : prev
  );

  const topPercentage = poll.totalVotes > 0 
    ? ((topOption.votes / poll.totalVotes) * 100).toFixed(0)
    : 0;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all" />
      
      <div className="relative flex flex-col h-full">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Tag className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">{poll.category}</span>
          </div>
          {hasVoted && (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Poll Title */}
        <h3 className="text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {poll.title}
        </h3>
        
        {/* Poll Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {poll.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{poll.endsIn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
        </div>

        {/* Leading Option */}
        {poll.totalVotes > 0 && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Leading</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {topPercentage}%
              </span>
            </div>
            <p className="text-white text-sm truncate">{topOption.text}</p>
          </div>
        )}

        <div className="flex-1" />

        {/* CTA */}
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25">
          {hasVoted ? 'View Results' : 'Vote Now'}
        </button>
      </div>
    </div>
  );
}
