import { useState } from 'react';
import { Home } from './components/Home';
import { PollDetail } from './components/PollDetail';
import { CreatePoll } from './components/CreatePoll';

export type Poll = {
  id: string;
  title: string;
  description: string;
  endsIn: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: Date;
};

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'poll-detail' | 'create-poll'>('home');
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      title: 'AI Club President Election',
      description: 'Vote for your preferred candidate to lead the AI Club next semester. This is an important decision that will shape our club\'s future direction.',
      endsIn: '2 days',
      category: 'Education',
      options: [
        { id: '1a', text: 'Sarah Chen - Focus on Research & Publications', votes: 45 },
        { id: '1b', text: 'Marcus Johnson - Industry Partnerships', votes: 32 },
        { id: '1c', text: 'Emily Rodriguez - Community Outreach', votes: 28 },
      ],
      totalVotes: 105,
      createdAt: new Date('2025-11-10'),
    },
    {
      id: '2',
      title: 'Best Programming Language 2025',
      description: 'Which programming language do you think will dominate in 2025? Share your prediction based on current trends.',
      endsIn: '5 days',
      category: 'Technology',
      options: [
        { id: '2a', text: 'Python', votes: 67 },
        { id: '2b', text: 'JavaScript', votes: 54 },
        { id: '2c', text: 'Rust', votes: 42 },
        { id: '2d', text: 'Go', votes: 31 },
      ],
      totalVotes: 194,
      createdAt: new Date('2025-11-08'),
    },
    {
      id: '3',
      title: 'Campus Food Court Options',
      description: 'What new restaurant should we add to the campus food court? Your vote will help administration make this decision.',
      endsIn: '3 days',
      category: 'Food & Dining',
      options: [
        { id: '3a', text: 'Sushi Bar', votes: 89 },
        { id: '3b', text: 'Mexican Grill', votes: 76 },
        { id: '3c', text: 'Vegan Cafe', votes: 54 },
        { id: '3d', text: 'Pizza Place', votes: 62 },
      ],
      totalVotes: 281,
      createdAt: new Date('2025-11-09'),
    },
    {
      id: '4',
      title: 'Study Session Time Preference',
      description: 'When should we schedule our weekly group study sessions? Choose the time that works best for your schedule.',
      endsIn: '1 day',
      category: 'Education',
      options: [
        { id: '4a', text: 'Monday Evening (6-8 PM)', votes: 23 },
        { id: '4b', text: 'Wednesday Afternoon (3-5 PM)', votes: 31 },
        { id: '4c', text: 'Friday Morning (10-12 PM)', votes: 18 },
      ],
      totalVotes: 72,
      createdAt: new Date('2025-11-11'),
    },
    {
      id: '5',
      title: 'Next Hackathon Theme',
      description: 'Choose the theme for our upcoming 48-hour hackathon event. This will determine the focus and prizes.',
      endsIn: '7 days',
      category: 'Events',
      options: [
        { id: '5a', text: 'AI & Machine Learning', votes: 112 },
        { id: '5b', text: 'Sustainability Tech', votes: 87 },
        { id: '5c', text: 'FinTech Innovation', votes: 65 },
      ],
      totalVotes: 264,
      createdAt: new Date('2025-11-05'),
    },
    {
      id: '6',
      title: 'Favorite IDE',
      description: 'What\'s your go-to integrated development environment? We\'re gathering data for a developer tools workshop.',
      endsIn: '4 days',
      category: 'Technology',
      options: [
        { id: '6a', text: 'VS Code', votes: 156 },
        { id: '6b', text: 'IntelliJ IDEA', votes: 43 },
        { id: '6c', text: 'Vim', votes: 28 },
        { id: '6d', text: 'Sublime Text', votes: 19 },
      ],
      totalVotes: 246,
      createdAt: new Date('2025-11-07'),
    },
  ]);

  const [userVotes, setUserVotes] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;

        const previousVote = userVotes[pollId];
        
        return {
          ...poll,
          options: poll.options.map((option) => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            if (previousVote && option.id === previousVote) {
              return { ...option, votes: Math.max(0, option.votes - 1) };
            }
            return option;
          }),
          totalVotes: previousVote ? poll.totalVotes : poll.totalVotes + 1,
        };
      })
    );

    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
  };

  const handleCreatePoll = (pollData: { title: string; description: string; options: string[]; duration: string; category: string }) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      title: pollData.title,
      description: pollData.description,
      endsIn: pollData.duration,
      category: pollData.category,
      options: pollData.options.map((option, index) => ({
        id: `${Date.now()}-${index}`,
        text: option,
        votes: 0,
      })),
      totalVotes: 0,
      createdAt: new Date(),
    };

    setPolls((prev) => [newPoll, ...prev]);
    setCurrentView('home');
  };

  const handlePollClick = (pollId: string) => {
    setSelectedPollId(pollId);
    setCurrentView('poll-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPollId(null);
  };

  const handleNavigate = (view: string) => {
    if (view === 'home') {
      handleBackToHome();
    } else if (view === 'create-poll') {
      setCurrentView('create-poll');
    }
  };

  const selectedPoll = polls.find((poll) => poll.id === selectedPollId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {currentView === 'home' && (
        <Home
          polls={polls}
          userVotes={userVotes}
          onPollClick={handlePollClick}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'poll-detail' && selectedPoll && (
        <PollDetail
          poll={selectedPoll}
          userVote={userVotes[selectedPoll.id]}
          onVote={handleVote}
          onBack={handleBackToHome}
        />
      )}
      {currentView === 'create-poll' && (
        <CreatePoll
          onCreatePoll={handleCreatePoll}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}
