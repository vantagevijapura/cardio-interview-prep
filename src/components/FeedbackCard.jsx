export default function FeedbackCard({ feedback }) {
  const scores = [
    { label: "Clarity", value: feedback.clarityScore },
    { label: "Directness", value: feedback.directnessScore },
    { label: "Specificity", value: feedback.specificityScore },
    { label: "Professionalism", value: feedback.professionalismScore },
  ];

  const getScoreColor = (score) => {
    if (!score) return "bg-gray-200";
    if (score >= 8) return "bg-green-200 text-green-800";
    if (score >= 6) return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Scores */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Scores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scores.map(({ label, value }) => (
            <div
              key={label}
              className={`p-4 rounded-lg text-center ${getScoreColor(value)}`}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-2xl font-bold">{value || "—"}/10</div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {feedback.strengths && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded">
          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
            ✓ What Worked Well
          </h4>
          <p className="text-gray-800 dark:text-gray-200">{feedback.strengths}</p>
        </div>
      )}

      {/* Growth Areas */}
      {feedback.growthAreas && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Growth Areas
          </h4>
          <p className="text-gray-800 dark:text-gray-200">{feedback.growthAreas}</p>
        </div>
      )}

      {/* Follow-up Question */}
      {feedback.followUpQuestion && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600 rounded">
          <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
            🎯 Follow-up Question
          </h4>
          <p className="text-gray-800 dark:text-gray-200 italic">
            {feedback.followUpQuestion}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            This is a follow-up you might hear in a real interview. Consider your response below.
          </p>
        </div>
      )}

      {/* Raw feedback if JSON parsing failed */}
      {feedback.raw && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {feedback.raw}
          </p>
        </div>
      )}
    </div>
  );
}
