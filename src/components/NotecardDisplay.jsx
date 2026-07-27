import { useState } from "react";
import { useNotecardStore } from "../store";

export default function NotecardDisplay({ cards, masteredCards }) {
  const { toggleFlip, markMastered, goToNext } = useNotecardStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) return null;

  const currentCard = cards[currentIndex];
  const isMastered = masteredCards.has(currentCard.id);
  const progress = `${currentIndex + 1} / ${cards.length}`;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    markMastered(currentCard.id);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Card Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {progress}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        onClick={handleFlip}
        className={`min-h-64 p-8 rounded-xl cursor-pointer transition-all transform duration-300 flex items-center justify-center text-center ${
          isFlipped
            ? "bg-gradient-to-br from-purple-500 to-purple-600"
            : "bg-gradient-to-br from-blue-500 to-blue-600"
        } hover:shadow-xl hover:scale-105 ${
          isMastered ? "ring-4 ring-green-400" : ""
        }`}
      >
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-4">
            {isFlipped ? "Answer" : "Question"}
          </p>
          <p className="text-2xl font-bold text-white leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
          <p className="text-white/50 text-xs mt-6">Click to flip</p>
        </div>
      </div>

      {/* Status indicator */}
      {isMastered && (
        <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 rounded text-green-800 dark:text-green-300 text-center font-semibold">
          ✓ Mastered
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        {!isMastered && (
          <button
            onClick={handleMastered}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
          >
            Got It! ✓
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Press Space to flip • Arrow keys to navigate
      </p>
    </div>
  );
}
