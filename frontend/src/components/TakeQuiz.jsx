import React, { useState, useEffect } from 'react';
import { quizApi } from '../api/quizApi';
import { Play, CheckCircle, AlertCircle, Award, RotateCcw, ChevronRight, ChevronLeft, Loader2, HelpCircle } from 'lucide-react';

const TakeQuiz = ({ initialQuizId = null }) => {
  const [quizIdInput, setQuizIdInput] = useState(initialQuizId ? String(initialQuizId) : '');
  const [activeQuizId, setActiveQuizId] = useState(initialQuizId || null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionString }
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);

  // If initialQuizId changes externally, trigger load
  useEffect(() => {
    if (initialQuizId) {
      setQuizIdInput(String(initialQuizId));
      fetchQuiz(initialQuizId);
    }
  }, [initialQuizId]);

  const fetchQuiz = async (idToFetch) => {
    const idNum = parseInt(idToFetch, 10);
    if (!idNum || isNaN(idNum)) {
      setError('Please enter a valid numeric Quiz ID.');
      return;
    }

    setLoading(true);
    setError('');
    setScore(null);
    setUserAnswers({});
    setCurrentIndex(0);

    try {
      const data = await quizApi.getQuiz(idNum);
      if (!data || data.length === 0) {
        setError(`No questions found for Quiz ID #${idNum}. Make sure the quiz exists in backend.`);
        setQuestions([]);
      } else {
        setQuestions(data);
        setActiveQuizId(idNum);
      }
    } catch (err) {
      setError(err.message || `Failed to fetch quiz #${idNum}. Is backend running on port 8765?`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSubmit = (e) => {
    e.preventDefault();
    fetchQuiz(quizIdInput);
  };

  const handleSelectOption = (questionId, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizId) return;

    // Convert userAnswers map into List<Response> expected by backend: [{ id: questionId, response: "selectedText" }]
    const responsePayload = questions.map((q) => ({
      id: q.id,
      response: userAnswers[q.id] || '',
    }));

    setSubmitting(true);
    setError('');

    try {
      const calculatedScore = await quizApi.submitQuiz(activeQuizId, responsePayload);
      setScore(calculatedScore);
    } catch (err) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setScore(null);
    setQuestions([]);
    setActiveQuizId(null);
    setQuizIdInput('');
    setUserAnswers({});
    setCurrentIndex(0);
    setError('');
  };

  // If Score is received, render Score Screen
  if (score !== null) {
    const percentage = Math.round((score / questions.length) * 100) || 0;
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-slate-400 text-sm">Quiz ID #{activeQuizId}</p>
          </div>

          <div className="py-6 px-4 bg-slate-950/80 rounded-2xl border border-slate-800 max-w-sm mx-auto">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {score} / {questions.length}
            </div>
            <div className="text-sm font-semibold text-slate-400 mt-2">
              Score: {percentage}%
            </div>
          </div>

          <p className="text-slate-300 text-sm">
            {percentage >= 80 
              ? '🎉 Outstanding performance! You have mastered this category.'
              : percentage >= 50
              ? '👍 Good job! Keep practicing to improve further.'
              : '💪 Keep learning and try again!'}
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Quiz ID is entered and questions are loaded, render Quiz Player
  if (questions.length > 0 && activeQuizId) {
    const currentQuestion = questions[currentIndex];
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
      currentQuestion.option4,
    ].filter(Boolean); // Filter out empty options if any

    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        {/* Header & Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
              Quiz #{activeQuizId}
            </span>
            <span>
              Question {currentIndex + 1} of {questions.length} ({answeredCount} answered)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
            {currentIndex + 1}. {currentQuestion.questionTitle}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {options.map((option, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base">{option}</span>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-500/20 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Submit Quiz
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default Entry View: Enter Quiz ID
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Play className="w-7 h-7 fill-current ml-1" />
          </div>
          <h2 className="text-2xl font-bold text-white">Enter Quiz ID</h2>
          <p className="text-slate-400 text-sm">
            Enter the ID of a Quiz created in the backend to start your test.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quiz ID
            </label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={quizIdInput}
              onChange={(e) => setQuizIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-lg font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading Quiz...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TakeQuiz;
