import { useState } from "react";
import { useNotecardStore } from "../store";

export default function NotecardDisplay({ cards, masteredCards }) {
  const { markMastered } = useNotecardStore();
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
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Progress
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {progress}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        onClick={handleFlip}
        className={`min-h-72 p-8 md:p-12 rounded-3xl cursor-pointer transition-all transform duration-300 flex items-center justify-center text-center relative overflow-hidden ${
          isFlipped
            ? "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700"
            : "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600"
        } hover:shadow-2xl hover:scale-[1.02] ${
          isMastered ? "ring-4 ring-green-400 ring-offset-4 dark:ring-offset-slate-950" : ""
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-2xl relative z-10">
          <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-6">
            {isFlipped ? "Answer" : "Question"}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>
          <p className="text-white/60 text-xs mt-8 font-medium">
            {isFlipped ? "Click to reveal question" : "Click to reveal answer"}
          </p>
        </div>

        {isMastered && (
          <div className="absolute top-4 right-4 bg-green-400/90 backdrop-blur-sm text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Mastered
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        {!isMastered && (
          <button
            onClick={handleMastered}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Got It! ✓
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
        Space to flip • Arrow keys to navigate
      </p>
    </div>
  );
}
