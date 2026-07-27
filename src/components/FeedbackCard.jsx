export default function FeedbackCard({ feedback }) {
  const scores = [
    { label: "Clarity", value: feedback.clarityScore, tip: "How easy to understand" },
    { label: "Directness", value: feedback.directnessScore, tip: "How concise & focused" },
    { label: "Specificity", value: feedback.specificityScore, tip: "Use of examples" },
    { label: "Professionalism", value: feedback.professionalismScore, tip: "Interview-ready tone" },
  ];

  const getProgressColor = (score) => {
    if (!score) return "bg-slate-400";
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-orange-500";
  };

  return (
    <div className="w-full space-y-6">
      {/* Scoring Scale */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3">
          Scoring Scale
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">8-10:</span>
            <span className="text-slate-600 dark:text-slate-400"> Excellent</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">6-7:</span>
            <span className="text-slate-600 dark:text-slate-400"> Good</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">4-5:</span>
            <span className="text-slate-600 dark:text-slate-400"> Developing</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">1-3:</span>
            <span className="text-slate-600 dark:text-slate-400"> Needs work</span>
          </div>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scores.map(({ label, value, tip }, idx) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow duration-300"
            style={{
              animation: `slideIn 0.5s ease-out forwards`,
              animationDelay: `${idx * 0.1}s`,
              opacity: 0,
            }}
          >
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {value || "—"}
            </p>
            {value && (
              <div className="space-y-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${getProgressColor(value)}`}
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{tip}</p>
          </div>
        ))}
      </div>

      {/* Coaching Notes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6">
        {/* What Worked Well */}
        {feedback.strengths && (
          <div
            style={{
              animation: `slideIn 0.6s ease-out forwards`,
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✓</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                What Worked Well
              </h3>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
              {feedback.strengths}
            </div>
          </div>
        )}

        {/* Growth Areas */}
        {feedback.growthAreas && (
          <div
            style={{
              animation: `slideIn 0.6s ease-out forwards`,
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Growth Areas
              </h3>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
              {feedback.growthAreas}
            </div>
          </div>
        )}

        {/* Refined Answer */}
        {feedback.refinedAnswer && (
          <div
            className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 md:p-6"
            style={{
              animation: `slideIn 0.6s ease-out forwards`,
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                Refined Answer
              </h3>
            </div>
            <p className="text-blue-900 dark:text-blue-100 leading-relaxed italic font-medium text-sm">
              "{feedback.refinedAnswer}"
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-4 font-medium">
              This is how a strong candidate would elevate your response
            </p>
          </div>
        )}

        {/* Raw feedback fallback */}
        {feedback.raw && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-200 whitespace-pre-wrap font-mono">
              {feedback.raw}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
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
