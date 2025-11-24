import { useState } from "react";
import { Navbar } from "./Navbar";
import {
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  Clock,
  Tag,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
} from "lucide-react";
import api from "../lib/api";
import toast from "react-hot-toast";

type CreatePollProps = {
  onCreatePoll: (pollData: {
    title: string;
    description: string;
    category: string;
    expires_at: string | null;
    visibility: "public" | "private" | "restricted";
    allow_guest_votes: boolean;
    options: string[];
    allowed_users: string[]; // NEW
  }) => void;
  onBack: () => void;
};

// Convert dropdown duration → ISO timestamp
function convertDurationToDate(duration: string): string | null {
  const now = new Date();

  const daysMap: Record<string, number> = {
    "1 day": 1,
    "2 days": 2,
    "3 days": 3,
    "5 days": 5,
    "1 week": 7,
    "2 weeks": 14,
    "1 month": 30,
  };

  const addDays = daysMap[duration];
  if (!addDays) return null;

  now.setDate(now.getDate() + addDays);
  return now.toISOString();
}

export function CreatePoll({ onCreatePoll, onBack }: CreatePollProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("3 days");
  const [category, setCategory] = useState("General");
  const [visibility, setVisibility] =
    useState<"public" | "private" | "restricted">("public");
  const [allowGuestVotes, setAllowGuestVotes] = useState(false);

  // NEW — allowed user emails
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [newAllowedEmail, setNewAllowedEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "General",
    "Technology",
    "Education",
    "Food & Dining",
    "Events",
    "Entertainment",
    "Sports",
    "Lifestyle",
  ];

  const durations = [
    "1 day",
    "2 days",
    "3 days",
    "5 days",
    "1 week",
    "2 weeks",
    "1 month",
  ];

  /** Add option */
  const addOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  /** Remove option */
  const removeOption = (index: number) => {
    if (options.length > 2)
      setOptions(options.filter((_, i) => i !== index));
  };

  /** Update option */
  const updateOption = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  /** Add allowed email */
  const addAllowedUser = async () => {
    const email = newAllowedEmail.trim().toLowerCase();
    if (!email) return;

    type LookupResponse = {
      exists: boolean;
      email: string;
      username: string;
    };

    try {
      const res = await api.get<LookupResponse>(
        `api/auth/lookup/?email=${encodeURIComponent(email)}`
      );

      if (!res.data.exists) {
        toast.error("This email does not match any registered user.");
        return;
      }

      if (allowedUsers.includes(email)) {
        toast.error("User already added.");
        return;
      }

      setAllowedUsers([...allowedUsers, email]);
      setNewAllowedEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to lookup user.");
    }
  };


  /** Remove allowed email */
  const removeAllowedUser = (email: string) => {
    setAllowedUsers(allowedUsers.filter((e) => e !== email));
  };

  /** Validation */
  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = "Title is required";
    else if (title.trim().length < 5)
      errs.title = "Title must be at least 5 characters";

    if (!description.trim())
      errs.description = "Description is required";
    else if (description.trim().length < 10)
      errs.description = "Description must be at least 10 characters";

    const validOpts = options.filter((o) => o.trim());
    if (validOpts.length < 2)
      errs.options = "At least 2 options are required";

    const unique = new Set(validOpts.map((o) => o.toLowerCase()));
    if (unique.size !== validOpts.length)
      errs.options = "Options must be unique";

    if (visibility === "restricted" && allowedUsers.length === 0) {
      errs.allowed = "Restricted polls must have at least one allowed user";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /** Submit poll */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const validOpts = options.filter((o) => o.trim());

    onCreatePoll({
      title: title.trim(),
      description: description.trim(),
      category,
      expires_at: convertDurationToDate(duration),
      visibility,
      allow_guest_votes: allowGuestVotes,
      options: validOpts,
      allowed_users: allowedUsers.filter(email => email.trim() !== ""),
    });
  };


  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">Create New Poll</h1>
            <p className="text-slate-400">
              Gather opinions and make informed decisions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8">
            <label className="block text-white mb-3">
              Poll Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3.5 bg-white/5 border ${
                errors.title ? "border-red-500/50" : "border-white/10"
              } rounded-xl text-white`}
              placeholder="What's your question?"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">
                {errors.title}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8">
            <label className="block text-white mb-3">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3.5 bg-white/5 border ${
                errors.description
                  ? "border-red-500/50"
                  : "border-white/10"
              } rounded-xl text-white resize-none`}
              placeholder="Explain what your poll is about..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">
                {errors.description}
              </p>
            )}
          </div>

          {/* OPTIONS */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8">
            <label className="block text-white mb-4">
              Poll Options <span className="text-red-400">*</span>
            </label>

            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {errors.options && (
              <p className="text-red-400 text-sm mb-2">
                {errors.options}
              </p>
            )}

            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border-dashed border border-white/10 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Option
              </button>
            )}
          </div>

          {/* CATEGORY + DURATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CATEGORY */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
              <label className="block text-white mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* DURATION */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
              <label className="block text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Duration
              </label>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                {durations.map((dur) => (
                  <option
                    key={dur}
                    value={dur}
                    className="bg-slate-900"
                  >
                    {dur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VISIBILITY + GUEST + ALLOWED USERS */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 space-y-6">
            {/* VISIBILITY */}
            <div>
              <label className="block text-white mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-300" />
                Visibility
              </label>

              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(
                    e.target.value as "public" | "private" | "restricted"
                  )
                }
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                <option value="public" className="bg-slate-900">
                  Public (everyone)
                </option>
                <option value="private" className="bg-slate-900">
                  Private (only you)
                </option>
                <option value="restricted" className="bg-slate-900">
                  Restricted (allowed users only)
                </option>
              </select>
            </div>

            {/* GUEST VOTES */}
            <div>
              <label className="block text-white mb-3 flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-green-300" />
                Allow Guest Votes
              </label>
              <input
                type="checkbox"
                checked={allowGuestVotes}
                onChange={(e) =>
                  setAllowGuestVotes(e.target.checked)
                }
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* ALLOWED USERS — ONLY WHEN RESTRICTED */}
            {visibility === "restricted" && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <h3 className="text-white mb-3 flex items-center gap-2">
                  Allowed Users
                </h3>

                {/* Existing allowed emails */}
                {allowedUsers.length > 0 && (
                  <ul className="space-y-2 mb-3">
                    {allowedUsers.map((email) => (
                      <li
                        key={email}
                        className="flex items-center justify-between bg-white/5 p-3 rounded-xl"
                      >
                        <span className="text-white">{email}</span>

                        <button
                          onClick={() => removeAllowedUser(email)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add allowed user */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={newAllowedEmail}
                    onChange={(e) =>
                      setNewAllowedEmail(e.target.value)
                    }
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />

                  <button
                    type="button"
                    onClick={addAllowedUser}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {errors.allowed && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.allowed}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl shadow-lg"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
