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
        300
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="space-y-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                category === cat
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Conversation Container */}
        <div className="space-y-6">
          {/* AI Question */}
          <div className="flex justify-start">
            <div className="max-w-2xl bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-6 py-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Interview Question
              </p>
              <p className="text-lg text-gray-900 dark:text-white font-medium leading-relaxed">
                {currentQuestion || "Loading..."}
              </p>
            </div>
          </div>

          {/* User Answer */}
          {userAnswer && !feedback && (
            <div className="flex justify-end">
              <div className="max-w-2xl bg-blue-600 rounded-2xl rounded-tr-none px-6 py-4">
                <p className="text-white leading-relaxed">{userAnswer}</p>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          {feedback && (
            <div className="flex justify-start">
              <div className="w-full">
                <FeedbackCard feedback={feedback} />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-2xl bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">
                    Analyzing your response...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex justify-start">
              <div className="max-w-2xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-2xl rounded-tl-none px-6 py-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  {error}
                </p>
                <p className="text-red-700 dark:text-red-300 text-xs mt-2">
                  (Make sure this app is deployed to Cloudflare Pages for AI
                  feedback)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pt-4">
          {!feedback ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-48 min-h-12 transition-all"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswer("");
                    handleNextQuestion();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  disabled={loading}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Submit"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
