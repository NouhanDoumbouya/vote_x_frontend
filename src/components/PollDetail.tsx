import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  Tag,
  TrendingUp,
  Copy,
  Check,
  Trash2,
  UserPlus,
  Lock,
  ShieldCheck,
} from "lucide-react";

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
  Pie,
} from "recharts";

import {
  getAllowedUsers,
  removeAllowedUser,
  addAllowedUser,
  deletePoll,
} from "../lib/polls";

import { Poll } from "../types/Poll";

type Props = {
  poll: Poll;
  userVote?: number | null;
  onVote: (pollId: number, optionId: number) => void;
  onBack: () => void;
};

export function PollDetail({ poll, userVote, onVote, onBack }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    userVote ?? null
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [allowedUsers, setAllowedUsers] = useState(poll.allowed_users || []);
  const [newAllowedUser, setNewAllowedUser] = useState("");
  const [loadingAllowedUsers, setLoadingAllowedUsers] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = poll.is_owner === true;

  // Load allowed users
  useEffect(() => {
    if (poll.visibility === "restricted") {
      (async () => {
        setLoadingAllowedUsers(true);
        try {
          const users = await getAllowedUsers(poll.id);
          setAllowedUsers(users);
        } finally {
          setLoadingAllowedUsers(false);
        }
      })();
    }
  }, [poll.visibility, poll.id]);

  useEffect(() => {
    setSelectedOption(userVote ?? null);
  }, [userVote]);

  const handleVoteSubmit = () => {
    if (selectedOption !== null) {
      onVote(poll.id, selectedOption);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  };

  // Copy link
  const handleCopyLink = async () => {
    const pollUrl = `${window.location.origin}/poll/${poll.id}`;

    try {
      await navigator.clipboard.writeText(pollUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pollUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Add allowed user
  const handleAddAllowedUser = async () => {
    if (!newAllowedUser.trim()) return;

    try {
      const updated = await addAllowedUser(poll.id, newAllowedUser.trim());
      setAllowedUsers(updated);
      setNewAllowedUser("");
    } catch {
      alert("Failed to add user");
    }
  };

  // Remove allowed user
  const handleRemove = async (email: string) => {
    try {
      const updated = await removeAllowedUser(poll.id, email);
      setAllowedUsers(updated);
    } catch {
      alert("Failed to remove user");
    }
  };

  // Chart data
  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
  const chartData = poll.options.map((opt) => ({
    name: opt.text.length > 20 ? opt.text.slice(0, 20) + "…" : opt.text,
    fullName: opt.text,
    votes: opt.votes,
    percentage:
      poll.totalVotes > 0
        ? ((opt.votes / poll.totalVotes) * 100).toFixed(1)
        : "0",
  }));

  // ---- Visibility Badge ----
  const renderVisibilityBadge = () => {
    const currentEmail = localStorage.getItem("user_email");
    const isAllowed = poll.allowed_users?.some(
      (u) => u.email === currentEmail
    );

    if (poll.visibility === "public")
      return (
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-xs">
          🌍 Public
        </span>
      );

    if (poll.visibility === "private")
      return (
        <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs">
          🔒 {poll.is_owner ? "Private (Yours)" : "Private"}
        </span>
      );

    if (poll.visibility === "restricted")
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs border ${
            isAllowed
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-purple-500/10 border-purple-500/20 text-purple-400"
          }`}
        >
          {isAllowed ? "🟢 Allowed" : "🛡️ Restricted"}
        </span>
      );
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-md text-center">
            <h2 className="text-white text-xl mb-4">Delete Poll?</h2>
            <p className="text-slate-400 mb-6">
              This action cannot be undone. Are you sure?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await deletePoll(poll.id);
                    setShowDeleteModal(false);
                    onBack();
                  } catch {
                    alert("Failed to delete poll.");
                  }
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Polls</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span className="text-sm text-blue-400">
                    {poll.category || "General"}
                  </span>
                </div>

                {/* Visibility Badge */}
                {renderVisibilityBadge()}
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
                  <p className="text-slate-400 text-sm">Thank you for voting.</p>
                </div>
              </div>
            )}

            {/* Voting */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-white mb-6">Cast Your Vote</h2>

              <div className="space-y-3 mb-6">
                {poll.options.map((opt) => {
                  const isUserVote = userVote === opt.id;
                  const isSelected = selectedOption === opt.id && !userVote;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => userVote == null && setSelectedOption(opt.id)}
                      className={`bg-white/5 p-5 rounded-xl cursor-pointer transition-all
                        ${isSelected ? "ring-2 ring-blue-500" : ""}
                        ${isUserVote ? "ring-2 ring-emerald-500" : ""}
                        ${userVote ? "cursor-default" : "hover:bg-white/10"}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">{opt.text}</span>

                        <div className="text-right text-white">
                          <div>{opt.votes} votes</div>
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
                    selectedOption
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-white/5 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {selectedOption ? "Submit Vote" : "Select an option"}
                </button>
              )}
            </div>

            {/* BAR CHART */}
            {poll.totalVotes > 0 && (
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h2 className="text-white mb-6">Detailed Results</h2>

                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8" }}
                      stroke="rgba(255,255,255,0.3)"
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8" }}
                      stroke="rgba(255,255,255,0.3)"
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "white",
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

            {/* PIE CHART */}
            {poll.totalVotes > 0 && (
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h2 className="text-white mb-6">Vote Distribution</h2>

                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="votes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
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

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* SHARE + DELETE GROUP */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-white mb-2">Poll Actions</h3>

              {/* Copy Link */}
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

              {/* Delete Button */}
              {isOwner && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Poll
                </button>
              )}
            </div>

            {/* ALLOWED USERS */}
            {poll.visibility === "restricted" && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Allowed Users
                </h3>

                {loadingAllowedUsers ? (
                  <p className="text-slate-400">Loading...</p>
                ) : (
                  <>
                    {allowedUsers.length === 0 && (
                      <p className="text-slate-400 text-sm">No allowed users yet.</p>
                    )}

                    <ul className="space-y-2">
                      {allowedUsers.map((user) => (
                        <li
                          key={user.id}
                          className="flex items-center justify-between bg-white/5 p-3 rounded-xl"
                        >
                          <span className="text-white">{user.email}</span>

                          {isOwner && (
                            <button
                              onClick={() => handleRemove(user.email)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>

                    {isOwner && (
                      <div className="flex mt-4 gap-2">
                        <input
                          type="email"
                          placeholder="Add user by email"
                          value={newAllowedUser}
                          onChange={(e) => setNewAllowedUser(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                        />

                        <button
                          onClick={handleAddAllowedUser}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
