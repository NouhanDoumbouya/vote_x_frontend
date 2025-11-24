// src/pages/CreatePollPage.tsx
import { useNavigate } from "react-router-dom";
import { CreatePoll } from "../components/CreatePoll";
import { createPoll } from "../lib/polls";

export default function CreatePollPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      <CreatePoll
        onCreatePoll={async (data) => {
          try {
            await createPoll(data);
            navigate("/"); // back home after creation
          } catch (err) {
            console.error("Failed to create poll", err);
            alert("Failed to create poll.");
          }
        }}
        onBack={() => navigate("/")}
      />
    </div>
  );
}
