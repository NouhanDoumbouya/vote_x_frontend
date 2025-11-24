export type PollOption = {
  id: number;
  text: string;
  votes: number;
};

export type SimpleUser = {
  id: number;
  username: string;
  email: string;
};

export type Poll = {
  id: number;
  title: string;
  description: string;
  category: string | null;   // <-- FIXED
  endsIn: string;
  totalVotes: number;
  visibility: "public" | "private" | "restricted";
  allow_guest_votes: boolean;
  is_owner: boolean;
  allowed_users: { id: number; username: string; email: string }[];
  createdAt: Date;

  options: {
    id: number;
    text: string;
    votes: number;
  }[];
};

