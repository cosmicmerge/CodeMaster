import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });


  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(Array.isArray(data) ? data : data.problems || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(Array.isArray(data) ? data : data.solved || []);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const solvedSet = useMemo(() => {
    return new Set(
      solvedProblems.map((sp) => (typeof sp === "string" ? sp : sp._id))
    );
  }, [solvedProblems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const difficultyVal = problem.difficulty || problem.difficultyLevel || "";
      const tagsVal = Array.isArray(problem.tags) ? problem.tags.join(" ") : problem.tags || "";

      const matchesSearch = problem.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        filters.difficulty === "all" ||
        difficultyVal.toLowerCase() === filters.difficulty.toLowerCase();
      const matchesTag =
        filters.tag === "all" ||
        tagsVal.toLowerCase().includes(filters.tag.toLowerCase());
      const isSolved = solvedSet.has(problem._id);
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "solved" && isSolved) ||
        (filters.status === "unsolved" && !isSolved);

      return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
    });
  }, [problems, filters, searchQuery, solvedSet]);

  const solvedCount = solvedProblems.length;
  const totalCount = problems.length;

  return (
    <div className="min-h-screen bg-[#090d16] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Subtle Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d131f]/75 border-b border-white/6 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              &lt;/&gt;
            </div>
            <div>
              <Link
                to="/"
                className="text-xl font-bold tracking-tight text-white flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-xl"
              >
                CodeHub
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-mono tracking-normal">
                  v1.0
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/[0.14] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 cursor-pointer shadow-sm">
                  <div className="w-7 h-7 rounded-xl bg-linear-to-tr from-indigo-500/30 to-purple-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center border border-indigo-400/30 shadow-inner">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-zinc-200">
                    {user.username || "User"}
                  </span>
                  <svg
                    className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2.5 w-52 p-1.5 bg-[#121826]/95 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="px-3.5 py-2.5 border-b border-white/6 text-xs text-zinc-400">
                    Signed in as
                    <p className="font-semibold text-zinc-100 truncate mt-0.5">
                      {user.emailId || user.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-1 px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-2 cursor-pointer outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-8 relative z-10">
        
        {/* Banner Card / Summary Tracker */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#131b2e]/90 via-[#0f1624]/90 to-[#0c121d]/90 border border-white/8 p-7 sm:p-9 shadow-xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Problem Solving Hub
              </h1>
              <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
                Sharpen your problem-solving capabilities, master algorithms, and prepare for interviews.
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-5 bg-white/3 border border-white/8 rounded-2xl px-5 py-4 backdrop-blur-lg self-start sm:self-auto shadow-inner">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Solved Challenges
                  </p>
                  <p className="text-2xl font-bold text-white mt-0.5">
                    {solvedCount}{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      / {totalCount}
                    </span>
                  </p>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-mono text-sm font-bold text-indigo-400 shadow-sm">
                  {totalCount > 0 ? `${Math.round((solvedCount / totalCount) * 100)}%` : "0%"}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="bg-[#111726]/80 backdrop-blur-md border border-white/[0.07] rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search problems by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/3 border border-white/6 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            </div>

            {/* Rounded Filter Selectors */}
            <div className="flex flex-wrap gap-2.5">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="bg-white/3 border border-white/8 hover:border-white/[0.14] rounded-2xl px-4 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
              >
                <option value="all" className="bg-[#111726]">All Status</option>
                <option value="solved" className="bg-[#111726]">Solved</option>
                <option value="unsolved" className="bg-[#111726]">Unsolved</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="bg-white/3 border border-white/8 hover:border-white/[0.14] rounded-2xl px-4 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
              >
                <option value="all" className="bg-[#111726]">All Difficulties</option>
                <option value="easy" className="bg-[#111726]">Easy</option>
                <option value="medium" className="bg-[#111726]">Medium</option>
                <option value="hard" className="bg-[#111726]">Hard</option>
              </select>

              <select
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                className="bg-white/3 border border-white/8 hover:border-white/[0.14] rounded-2xl px-4 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
              >
                <option value="all" className="bg-[#111726]">All Topics</option>
                <option value="array" className="bg-[#111726]">Array</option>
                <option value="linkedList" className="bg-[#111726]">Linked List</option>
                <option value="graph" className="bg-[#111726]">Graph</option>
                <option value="dp" className="bg-[#111726]">Dynamic Programming</option>
              </select>
            </div>
          </div>
        </section>

        {/* Problems Listing */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3">
            <span>Challenges ({filteredProblems.length})</span>
            <span>Action</span>
          </div>

          {filteredProblems.length === 0 ? (
            <div className="bg-[#111726]/60 border border-white/6 rounded-3xl p-14 text-center space-y-3.5 backdrop-blur-sm">
              <div className="w-13 h-13 rounded-2xl bg-white/3 border border-white/6 text-zinc-400 flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
                Ø
              </div>
              <h3 className="text-base font-semibold text-zinc-200">No problems found</h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                No challenges match your selected filters. Try searching for a different keyword or resetting filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredProblems.map((problem) => {
                const isSolved = solvedSet.has(problem._id);
                const difficulty = problem.difficulty || problem.difficultyLevel || "Medium";
                const displayTags = Array.isArray(problem.tags) ? problem.tags.join(", ") : problem.tags;

                return (
                  <div
                    key={problem._id}
                    className="group bg-[#111726]/70 hover:bg-[#141b2c] border border-white/6 hover:border-indigo-500/30 rounded-2xl p-4 sm:px-6 sm:py-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          to={`/problem/${problem._id}`}
                          className="text-base font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors duration-200 outline-none"
                        >
                          {problem.title}
                        </Link>
                        {isSolved && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-sm">
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Solved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold px-3 py-0.5 rounded-full border shadow-xs ${getDifficultyBadgeClasses(difficulty)}`}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                        {displayTags && (
                          <span className="text-[11px] font-medium bg-white/3 text-zinc-300 border border-white/8 px-3 py-0.5 rounded-full">
                            {displayTags}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Link
                        to={`/problem/${problem._id}`}
                        className="px-4.5 py-2 rounded-xl bg-white/5 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-semibold border border-white/8 hover:border-indigo-500 shadow-sm hover:shadow-indigo-600/20 transition-all duration-200 active:scale-95"
                      >
                        {isSolved ? "Practice Again" : "Solve Challenge"} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function getDifficultyBadgeClasses(difficulty = "") {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "hard":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default:
      return "bg-zinc-800 text-zinc-300 border-zinc-700/60";
  }
}