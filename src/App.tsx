import { useEffect, useState } from 'react';
import { Home } from './components/Home';
import { PollDetail } from './components/PollDetail';
import { CreatePoll } from './components/CreatePoll';
import { getPolls, createPoll} from './lib/polls';

// ------------------------------
// TYPES
// ------------------------------
export type PollOption = {
  id: number;
  text: string;
  votes: number;
};

export type Poll = {
  id: number;
  title: string;
  description: string;
  endsIn: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: Date;
  isLocal?: boolean;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'poll-detail' | 'create-poll'>('home');
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);

  // -----------------------------------------
  // DEMO POLLS (kept for UI richness)
  // -----------------------------------------
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      title: "AI Club President Election",
      description:
        "Vote for your preferred candidate to lead the AI Club next semester. This is an important decision that will shape our club's future direction.",
      endsIn: "2 days",
      category: "Education",
      options: [
        { id: 11, text: "Sarah Chen - Focus on Research & Publications", votes: 45 },
        { id: 12, text: "Marcus Johnson - Industry Partnerships", votes: 32 },
        { id: 13, text: "Emily Rodriguez - Community Outreach", votes: 28 },
      ],
      totalVotes: 105,
      createdAt: new Date("2025-11-10"),
      isLocal: true,
    },
    {
      id: 2,
      title: "Best Programming Language 2025",
      description:
        "Which programming language do you think will dominate in 2025? Share your prediction based on current trends.",
      endsIn: "5 days",
      category: "Technology",
      options: [
        { id: 21, text: "Python", votes: 67 },
        { id: 22, text: "JavaScript", votes: 54 },
        { id: 23, text: "Rust", votes: 42 },
        { id: 24, text: "Go", votes: 31 },
      ],
      totalVotes: 194,
      createdAt: new Date("2025-11-08"),
      isLocal: true,
    },
  ]);

  // -----------------------------------------
  // USER VOTES (pollId → optionId)
  // -----------------------------------------
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});

  // -----------------------------------------
  // LOAD BACKEND POLLS
  // -----------------------------------------
  useEffect(() => {
    async function loadBackendPolls() {
      try {
        const backend = await getPolls();

        const formatted: Poll[] = backend.map((bp) => ({
          id: bp.id,
          title: bp.title,
          description: bp.description,
          endsIn: bp.ends_in,
          category: bp.category || "General",
          totalVotes: bp.total_votes,
          options: bp.options.map((o) => ({
            id: o.id,
            text: o.text,
            votes: o.votes,
          })),
          createdAt: new Date(bp.created_at),
          isLocal: false,
        }));

        // Backend polls first
        setPolls((prev) => [...formatted, ...prev]);
      } catch (error) {
        console.error("Failed to load backend polls:", error);
      }
    }

    loadBackendPolls();
  }, []);

  // -----------------------------------------
  // VOTING LOGIC
  // -----------------------------------------
  const handleVote = (pollId: number, optionId: number) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;

        const previousVote = userVotes[pollId];

        return {
          ...poll,
          options: poll.options.map((opt) => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (previousVote && opt.id === previousVote)
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          }),
          totalVotes: previousVote ? poll.totalVotes : poll.totalVotes + 1,
        };
      })
    );

    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
  };

  // -----------------------------------------
  // LOCAL POLL CREATION
  // -----------------------------------------
const handleCreatePoll = async (data: {
  title: string;
  description: string;
  options: string[];
  duration: string;
  category: string;
}) => {
  // Convert “3 days” → real ISO timestamp
  const now = new Date();
  const expiration = new Date(now);

  const durationMap: Record<string, number> = {
    "1 day": 1, "2 days": 2, "3 days": 3, "5 days": 5,
    "1 week": 7, "2 weeks": 14,
    "1 month": 30,
  };

  const days = durationMap[data.duration] || 3;
  expiration.setDate(now.getDate() + days);

  try {
    // Define the backend types and cast the unknown result to them
    type BackendOption = {
      id: number;
      text: string;
      votes: number;
    };

    type BackendPoll = {
      id: number;
      title: string;
      description: string;
      ends_in: string;
      category: string;
      options: BackendOption[];
      total_votes: number;
      created_at: string;
    };

    const backendPoll = (await createPoll({
      title: data.title,
      description: data.description,
      category: data.category,
      expires_at: expiration.toISOString(),
      visibility: "public",
      allow_guest_votes: true,
      options: data.options,
    })) as BackendPoll;

    // Format into frontend shape
    const formatted: Poll = {
      id: backendPoll.id,
      title: backendPoll.title,
      description: backendPoll.description,
      endsIn: backendPoll.ends_in,
      category: backendPoll.category,
      options: backendPoll.options.map((o) => ({
        id: o.id,
        text: o.text,
        votes: o.votes,
      })),
      totalVotes: backendPoll.total_votes,
      createdAt: new Date(backendPoll.created_at),
      isLocal: false,
    };

    // Add new poll at top
    setPolls((prev) => [formatted, ...prev]);

    setCurrentView("home");
  } catch (err) {
    console.error("Failed to create poll:", err);
    alert("Failed to create poll");
  }
};


  // -----------------------------------------
  // NAVIGATION
  // -----------------------------------------
  const handlePollClick = (pollId: number) => {
    setSelectedPollId(pollId);
    setCurrentView("poll-detail");
  };

  const handleBackToHome = () => {
    setSelectedPollId(null);
    setCurrentView("home");
  };

  const handleNavigate = (view: string) => {
    if (view === "home") handleBackToHome();
    else if (view === "create-poll") setCurrentView("create-poll");
  };

  const selectedPoll = polls.find((p) => p.id === selectedPollId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {currentView === "home" && (
        <Home
          polls={polls}
          userVotes={userVotes}
          onPollClick={handlePollClick}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === "poll-detail" && selectedPoll && (
        <PollDetail
          poll={selectedPoll}
          userVote={userVotes[selectedPoll.id]}
          onVote={handleVote}
          onBack={handleBackToHome}
        />
      )}

      {currentView === "create-poll" && (
        <CreatePoll onCreatePoll={handleCreatePoll} onBack={handleBackToHome} />
      )}
    </div>
  );
}
