// src/lib/polls.ts
import api from "./api";

export interface SimpleUser {
  id: number;
  username: string;
  email: string;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  category: string | null;
  created_at: string;
  expires_at: string | null;
  ends_in: string;
  total_votes: number;
  visibility: "public" | "private" | "restricted";
  shareable_id: string;
  is_active: boolean;
  allow_guest_votes: boolean;
  is_owner: boolean;
  allowed_users: SimpleUser[];
  options: PollOption[];
}

export async function getPolls(): Promise<Poll[]> {
  const res = await api.get<{ results: Poll[] }>("/api/polls/");
  return res.data.results;
}

export async function getPoll(pollId: number): Promise<Poll> {
  const res = await api.get<Poll>(`/api/polls/${pollId}/`);
  return res.data;
}

export async function getUserVote(pollId: number): Promise<number | null> {
  const res = await api.get<{ voted_option_id: number | null }>(
    `/api/votes/me/${pollId}/`
  );
  return res.data.voted_option_id;
}

export async function submitVote(optionId: number) {
  const res = await api.post("/api/votes/", { option: optionId });
  return res.data;
}

export async function createPoll(data: {
  title: string;
  description: string;
  category: string;
  expires_at: string | null;
  visibility: "public" | "private" | "restricted";
  allow_guest_votes: boolean;
  options: string[];
  allowed_users?: string[];
}): Promise<Poll> {
  const res = await api.post<Poll>("/api/polls/", data);
  return res.data;
}

export async function deletePoll(pollId: number) {
  const res = await api.delete(`/api/polls/${pollId}/delete/`);
  return res.data;
}


export async function getAllowedUsers(
  pollId: number
): Promise<SimpleUser[]> {
  const res = await api.get(`/api/polls/${pollId}/allowed-users/`);
  return res.data as SimpleUser[];
}

export async function addAllowedUser(
  pollId: number,
  email: string
): Promise<SimpleUser[]> {
  const res = await api.post<SimpleUser[]>(
    `/api/polls/${pollId}/allowed-users/`,
    { email }
  );
  return res.data;
}

export async function removeAllowedUser(
  pollId: number,
  email: string
): Promise<SimpleUser[]> {
  const res = await api.delete<SimpleUser[]>(
    `/api/polls/${pollId}/allowed-users/`,
    {
      data: { email },
      headers: { "Content-Type": "application/json" },
    } as any
  );

  return res.data;
}
