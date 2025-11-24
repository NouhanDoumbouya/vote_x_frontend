// src/components/Home.tsx
import { useState } from "react";
import { Navbar } from "./Navbar";
import { PollCard } from "./PollCard";
import { Poll } from "../types/Poll";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

type HomeProps = {
  polls: Poll[];
  userVotes: Record<number, number>;
  onPollClick: (pollId: number) => void;
  onNavigate: (view: string) => void;
};

export function Home({ polls, userVotes, onPollClick, onNavigate }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  /** FIX: Convert null category → "Uncategorized" */
  const categories = [
    "all",
    ...Array.from(
      new Set(polls.map((p) => p.category ?? "Uncategorized"))
    ),
  ];

  /** Apply search + category filter */
  const filteredPolls = polls.filter((poll) => {
    const category = poll.category ?? "Uncategorized";

    const matchesSearch =
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalVotes = polls.reduce((acc, p) => acc + p.totalVotes, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-2 mb-6">
            <div className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Real-time Polling Platform
              </span>
            </div>
          </div>

          <h1 className="text-6xl text-white mb-6 max-w-3xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Shape Decisions Together
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl">
            Create polls, gather opinions, and visualize results in real-time. Make
            data-driven decisions with your community.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {/* CREATE POLL BUTTON */}
            <button
              onClick={() => onNavigate("create-poll")}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r 
                from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 
                hover:to-blue-400 transition-all shadow-xl shadow-blue-500/25 
                hover:shadow-blue-500/40 hover:scale-105"
            >
              <span>Create Your First Poll</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* EXPLORE POLLS BUTTON */}
            <button
              onClick={() =>
                document.getElementById("polls-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white 
                rounded-xl hover:bg-white/10 transition-all border 
                border-white/10 backdrop-blur-sm"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Explore Polls</span>
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-3xl text-white mb-2">{polls.length}</div>
              <div className="text-slate-400">Active Polls</div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-3xl text-white mb-2">{totalVotes}</div>
              <div className="text-slate-400">Total Votes</div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-3xl text-white mb-2">
                {categories.length - 1}
              </div>
              <div className="text-slate-400">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section id="polls-section" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* SEARCH INPUT */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search polls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 
                rounded-xl text-white placeholder:text-slate-500 focus:outline-none 
                focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center gap-2 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white border-none outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* POLL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              hasVoted={userVotes[poll.id] !== undefined}
              onClick={() => onPollClick(poll.id)}
            />
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredPolls.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-white mb-2">No polls found</h3>
            <p className="text-slate-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
