// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPolls, getUserVote } from "../lib/polls";
import { Poll } from "../types/Poll";
import { Home } from "../components/Home";

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const backend = await getPolls();
        const fm: Poll[] = [];
        const vm: Record<number, number> = {};

        for (const p of backend) {
          const v = await getUserVote(p.id);
          if (v) vm[p.id] = v;

          fm.push({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category || "General",
            endsIn: p.ends_in,
            totalVotes: p.total_votes,
            visibility: p.visibility,
            allow_guest_votes: p.allow_guest_votes,
            is_owner: p.is_owner,
            allowed_users: p.allowed_users,
            createdAt: new Date(p.created_at),

            options: p.options.map((o) => ({
              id: o.id,
              text: o.text,
              votes: o.votes,
            })),
          });
        }

        setPolls(fm);
        setUserVotes(vm);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <Home
      polls={polls}
      userVotes={userVotes}
      onPollClick={(id: number) => navigate(`/poll/${id}`)}
      onNavigate={(view?: string) => {
        if (view === "create-poll") navigate("/create");
        else navigate("/");
      }}
    />
  );
}
