// src/pages/PollPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPoll,
  getUserVote,
  submitVote,
  deletePoll,
  Poll as BackendPoll,
} from "../lib/polls";

import { PollDetail } from "../components/PollDetail";
import { Poll } from "../types/Poll";

export default function PollPage() {
  const { id } = useParams();
  const pollId = Number(id);
  const navigate = useNavigate();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await getPoll(pollId);
        const v = await getUserVote(pollId);

        const formatted: Poll = {
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category || "General",
          endsIn: p.ends_in,
          totalVotes: p.total_votes,
          createdAt: new Date(p.created_at),
          visibility: p.visibility,
          is_owner: p.is_owner,
          allow_guest_votes: p.allow_guest_votes,
          allowed_users: p.allowed_users,
          options: p.options.map((o) => ({
            id: o.id,
            text: o.text,
            votes: o.votes,
          })),
        };

        setPoll(formatted);
        setUserVote(v);
      } catch (e) {
        console.error("Failed loading poll", e);
        alert("Poll not found");
        navigate("/");
      }
    }

    load();
  }, [pollId]);

  const handleVote = async (optionId: number) => {
    try {
      await submitVote(optionId);

      const updated = await getPoll(pollId);

      setPoll({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        category: updated.category || "General",
        endsIn: updated.ends_in,
        totalVotes: updated.total_votes,
        createdAt: new Date(updated.created_at),
        visibility: updated.visibility,
        is_owner: updated.is_owner,
        allow_guest_votes: updated.allow_guest_votes,
        allowed_users: updated.allowed_users,
        options: updated.options.map((o) => ({
          id: o.id,
          text: o.text,
          votes: o.votes,
        })),
      });

      setUserVote(optionId);
    } catch {
      alert("Failed to submit vote");
    }
  };

  if (!poll) return null;

  return (
    <PollDetail
      poll={poll}
      userVote={userVote}
      onVote={(pollId, optionId) => handleVote(optionId)}
      onBack={() => navigate("/")}
    />
  );
}
