import { Poll } from "../types/Poll";
import {
  Clock,
  Users,
  CheckCircle2,
  TrendingUp,
  Tag
} from "lucide-react";

// The PollCard receives the poll, voting status, and click callback.
type PollCardProps = {
  poll: Poll;
  hasVoted: boolean;
  onClick: (pollId: number) => void;
};

export function PollCard({ poll, hasVoted, onClick }: PollCardProps) {
  const isOwner = poll.is_owner === true;

  // Decide which visibility badge to show.
  const renderVisibilityBadge = () => {
    const baseStyle =
      "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium";

    // PUBLIC
    if (poll.visibility === "public") {
      return (
        <div className={`${baseStyle} bg-blue-500/10 border-blue-500/20 text-blue-400`}>
          🌍 Public
        </div>
      );
    }

    // PRIVATE
    if (poll.visibility === "private") {
      return (
        <div className={`${baseStyle} bg-red-500/10 border-red-500/20 text-red-400`}>
          🔒 {isOwner ? "Private (Yours)" : "Private"}
        </div>
      );
    }

    // RESTRICTED
    if (poll.visibility === "restricted") {
      const currentUserEmail = localStorage.getItem("user_email");
      const isAllowed = poll.allowed_users?.some(
        (u) => u.email === currentUserEmail
      );

      if (isAllowed) {
        return (
          <div
            className={`${baseStyle} bg-emerald-500/10 border-emerald-500/20 text-emerald-400`}
          >
            🟢 Allowed
          </div>
        );
      }

      return (
        <div
          className={`${baseStyle} bg-purple-500/10 border-purple-500/20 text-purple-400`}
        >
          🛡️ Restricted
        </div>
      );
    }

    return null;
  };

  // Find top voting option
  const topOption =
    poll.options.length > 0
      ? poll.options.reduce((prev, curr) =>
          curr.votes > prev.votes ? curr : prev
        )
      : null;

  const topPercentage =
    poll.totalVotes > 0 && topOption
      ? ((topOption.votes / poll.totalVotes) * 100).toFixed(0)
      : 0;

  return (
    <div
      onClick={() => onClick(poll.id)}
      className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02]
                 backdrop-blur-sm rounded-2xl p-6 border border-white/10
                 hover:border-blue-500/50 transition-all cursor-pointer
                 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Category + Visibility */}
      <div className="flex items-center justify-between mb-4">
        {/* Category */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Tag className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-blue-400">{poll.category}</span>
        </div>

        {/* Visibility status */}
        {renderVisibilityBadge()}
      </div>

      {/* Title */}
      <h3 className="text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
        {poll.title}
      </h3>

      {/* Description */}
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

      {/* Top option */}
      {poll.totalVotes > 0 && topOption && (
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

      {/* Action button */}
      <button
        className={`w-full py-3 rounded-xl transition-all group-hover:shadow-lg 
        ${
          hasVoted
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25"
        }`}
      >
        {hasVoted ? "View Results" : "Vote Now"}
      </button>
    </div>
  );
}
