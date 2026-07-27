import { useNotecardStore } from "../store";
import NotecardDisplay from "./NotecardDisplay";

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
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
        {/* Mastery progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Overall Mastery
            </h2>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {masteryPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        {/* Category selector */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Decks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All Cards
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  filterCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Card display */}
        {visibleCards.length > 0 ? (
          <NotecardDisplay cards={visibleCards} masteredCards={masteredCards} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No cards found</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {masteredCards.size}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Mastered
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {visibleCards.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Cards
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
