import api from "./api";

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
  options: PollOption[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getPolls(): Promise<Poll[]> {
  const res = await api.get<PaginatedResponse<Poll>>("/api/polls/");
  return res.data.results;
}

export async function getPoll(pollId: string | number): Promise<Poll> {
  const res = await api.get<Poll>(`/api/polls/${pollId}/`);
  return res.data;
}

export async function getPollByShareId(shareId: string): Promise<Poll> {
  const res = await api.get<Poll>(`/api/polls/share/${shareId}/`);
  return res.data;
}

export async function createPoll(data: {
  title: string;
  description: string;
  category: string;
  expires_at: string | null;
  visibility: string;
  allow_guest_votes: boolean;
  options: string[];
}) {
  const res = await api.post("/api/polls/", data);
  return res.data;
}
