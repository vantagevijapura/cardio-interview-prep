import { useState, useEffect } from "react";
import { useInterviewStore } from "../store";
import FeedbackCard from "./FeedbackCard";

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
  const [showFollowUp, setShowFollowUp] = useState(false);

  const categories = [
    "personal",
    "career",
    "behavioral",
    "research",
    "clinical",
    "programFit",
  ];

  useEffect(() => {
    if (!currentQuestion) {
      generateQuestion(category);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);
    setError(null);
    setShowFollowUp(false);

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
    setShowFollowUp(false);
    generateQuestion(category);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setUserAnswer("");
    setFeedback(null);
    setShowFollowUp(false);
    generateQuestion(newCategory);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
        {/* Category selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Question Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Question display */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Interview Question
          </p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {currentQuestion || "Loading..."}
          </p>
        </div>

        {/* Answer form */}
        {!feedback ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !userAnswer.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              {loading ? "Getting feedback..." : "Submit Answer"}
            </button>
          </form>
        ) : null}

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Feedback display */}
        {feedback && <FeedbackCard feedback={feedback} />}

        {/* Next question button */}
        {feedback && (
          <button
            onClick={handleNextQuestion}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
