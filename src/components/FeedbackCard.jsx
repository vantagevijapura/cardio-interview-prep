export default function FeedbackCard({ feedback }) {
  const scores = [
    { label: "Clarity", value: feedback.clarityScore },
    { label: "Directness", value: feedback.directnessScore },
    { label: "Specificity", value: feedback.specificityScore },
    { label: "Professionalism", value: feedback.professionalismScore },
  ];

  const getScoreColor = (score) => {
    if (!score) return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    if (score >= 8) return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
  };

  const getProgressColor = (score) => {
    if (!score) return "bg-gray-400";
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="max-w-2xl bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-6 py-6 space-y-6">
      {/* Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {scores.map(({ label, value }) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                {label}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {value || "—"}
              </span>
            </div>
            {value && (
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor(value)}`}
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-700"></div>

      {/* Feedback Sections */}
      <div className="space-y-4">
        {/* Strengths */}
        {feedback.strengths && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✓</span>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                What Worked Well
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {feedback.strengths}
            </p>
          </div>
        )}

        {/* Growth Areas */}
        {feedback.growthAreas && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Growth Areas
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {feedback.growthAreas}
            </p>
          </div>
        )}

        {/* Follow-up Question */}
        {feedback.followUpQuestion && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Follow-up Question
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm italic leading-relaxed">
              "{feedback.followUpQuestion}"
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              You might hear this in a real interview
            </p>
          </div>
        )}

        {/* Raw feedback if JSON parsing failed */}
        {feedback.raw && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {feedback.raw}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
