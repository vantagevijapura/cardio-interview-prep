import { useNotecardStore } from "../store";
import NotecardDisplay from "./NotecardDisplay";

const CATEGORY_LABELS = {
  researchTalking: "Research Talking Points",
  clinical: "Clinical Pearls",
  behavioral: "Behavioral Frameworks",
};

export default function NotecardGame() {
  const {
    cards,
    masteredCards,
    filterCategory,
    setFilterCategory,
    getVisibleCards,
    getMasteryPercent,
  } = useNotecardStore();

  const visibleCards = getVisibleCards();
  const masteryPercent = getMasteryPercent();
  const categories = Object.keys(cards);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="space-y-8">
        {/* Header with Mastery Progress */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Notecards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Build muscle memory with spaced repetition
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Overall Mastery
              </span>
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {masteryPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Deck Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              filterCategory === null
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            All Cards
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                filterCategory === cat
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Card display */}
        {visibleCards.length > 0 ? (
          <NotecardDisplay cards={visibleCards} masteredCards={masteredCards} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No cards found</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {masteredCards.size}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Mastered
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {visibleCards.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
