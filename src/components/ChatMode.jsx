import { useState, useEffect, useRef } from "react";
import { useInterviewStore } from "../store";
import FeedbackCard from "./FeedbackCard";

const CATEGORY_LABELS = {
  personal: "Personal",
  career: "Career",
  behavioral: "Behavioral",
  research: "Research",
  clinical: "Clinical",
  programFit: "Program Fit",
};

export default function ChatMode() {
  const {
    currentQuestion,
    category,
    setCategory,
    generateQuestion,
    addToHistory,
  } = useInterviewStore();

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const categories = Object.keys(CATEGORY_LABELS);

  useEffect(() => {
    if (!currentQuestion) {
      generateQuestion(category);
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        200
      ) + "px";
    }
  }, [userAnswer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer,
          question: currentQuestion,
          category,
          mode: "chat",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const data = await response.json();
      setFeedback(data);
      addToHistory(currentQuestion, userAnswer, data);
    } catch (err) {
      setError(err.message || "Error getting feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer("");
    setFeedback(null);
    generateQuestion(category);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setUserAnswer("");
    setFeedback(null);
    generateQuestion(newCategory);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header with Categories */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card */}
          <div
            className="animate-fadeIn opacity-0 animation-delay-0"
            style={{
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 md:p-8 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Interview Question
              </p>
              <p className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion || "Loading question..."}
              </p>
            </div>
          </div>

          {/* User Answer Bubble */}
          {userAnswer && !feedback && !loading && (
            <div
              className="flex justify-end"
              style={{
                animation: "fadeInUp 0.4s ease-out forwards",
              }}
            >
              <div className="max-w-2xl bg-blue-600 dark:bg-blue-700 rounded-2xl rounded-tr-none px-6 py-4 shadow-sm">
                <p className="text-white leading-relaxed">{userAnswer}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div
              className="flex justify-start"
              style={{
                animation: "fadeInUp 0.4s ease-out forwards",
              }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite 0.2s",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite 0.4s",
                      }}
                    ></div>
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                    Coach is reviewing your answer...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Card */}
          {feedback && (
            <div
              style={{
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <FeedbackCard feedback={feedback} />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              className="flex justify-start"
              style={{
                animation: "fadeInUp 0.4s ease-out forwards",
              }}
            >
              <div className="max-w-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-none px-6 py-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          {!feedback ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Share your answer here..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-20 max-h-32 transition-all duration-200"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswer("");
                    handleNextQuestion();
                  }}
                  disabled={loading}
                  className="px-5 py-2.5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {loading ? "Analyzing..." : "Submit Answer"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
