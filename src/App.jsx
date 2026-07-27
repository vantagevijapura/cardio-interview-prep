import { useState } from "react";
import ChatMode from "./components/ChatMode";
import NotecardGame from "./components/NotecardGame";
import "./App.css";

function App() {
  const [mode, setMode] = useState("home"); // 'home', 'chat', 'cards'
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              CardioInterview
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Fellowship Interview Prep Tool
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            {mode !== "home" && (
              <button
                onClick={() => setMode("home")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        {mode === "home" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Ace Your Cardiology Fellowship Interview
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Practice interview questions with AI feedback, master key facts with spaced repetition, and build confidence before your big day.
              </p>
            </div>

            {/* Mode selector */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Chat Mode */}
              <div
                onClick={() => setMode("chat")}
                className="cursor-pointer group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all p-8 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
              >
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Chat Practice
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Practice interview questions with real-time AI feedback on clarity, specificity, and professionalism.
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2 mb-6">
                  <li>✓ 7 question categories</li>
                  <li>✓ Performance scoring</li>
                  <li>✓ Follow-up questions</li>
                  <li>✓ Session history</li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all group-hover:translate-y-1">
                  Start Practicing →
                </button>
              </div>

              {/* Notecard Mode */}
              <div
                onClick={() => setMode("cards")}
                className="cursor-pointer group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all p-8 border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400"
              >
                <div className="text-5xl mb-4">🎴</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Notecards
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Spaced repetition learning for fellowship facts, clinical pearls, and interview frameworks.
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2 mb-6">
                  <li>✓ Fellowship stats & facts</li>
                  <li>✓ Clinical pearls</li>
                  <li>✓ Behavioral frameworks</li>
                  <li>✓ Mastery tracking</li>
                </ul>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all group-hover:translate-y-1">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* Info section */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  65-66% Match Rate
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Cardiology is highly competitive. Prep matters.
                </p>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-3xl mb-3">📚</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  4.5× Better Odds
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  3+ publications significantly boost your chances.
                </p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Real Feedback
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  AI-powered coaching mirrors real interviewer feedback.
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "chat" && <ChatMode />}
        {mode === "cards" && <NotecardGame />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Built for cardiology fellowship applicants during ERAS season</p>
      </footer>
    </div>
  );
}

export default App;
