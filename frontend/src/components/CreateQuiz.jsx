import React, { useState } from 'react';
import { quizApi } from '../api/quizApi';
import { PlusCircle, CheckCircle, AlertCircle, Loader2, Sparkles, Play, ArrowRight } from 'lucide-react';

const CreateQuiz = ({ onQuizCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryName: 'Java',
    numQuestions: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const categories = ['Java', 'Python', 'JavaScript', 'Spring Boot', 'Database', 'General'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a title for the quiz.');
      return;
    }
    if (!formData.categoryName.trim()) {
      setError('Please select or enter a category name.');
      return;
    }
    if (formData.numQuestions < 1) {
      setError('Number of questions must be at least 1.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await quizApi.createQuiz(formData);
      // Backend returns string "success"
      setCreatedSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create quiz. Make sure questions exist for this category.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedSuccess(false);
    setFormData({
      title: '',
      categoryName: 'Java',
      numQuestions: 5,
    });
    setError('');
  };

  if (createdSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Quiz Created Successfully!</h2>
            <p className="text-slate-400 text-sm">
              Your quiz <span className="text-indigo-400 font-semibold">"{formData.title}"</span> has been generated with {formData.numQuestions} questions from category "{formData.categoryName}".
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => onQuizCreated && onQuizCreated()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Go to Take Quiz
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Create Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Quiz Generator
          </div>
          <h2 className="text-2xl font-bold text-white">Create a New Quiz</h2>
          <p className="text-slate-400 text-sm">
            Orchestrated via Quiz-Service to automatically fetch questions from Question-Service.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Core Java Basics Quiz"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData((prev) => ({ ...prev, categoryName: cat }))}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    formData.categoryName === cat
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="categoryName"
              placeholder="Or enter custom category"
              value={formData.categoryName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              name="numQuestions"
              min="1"
              max="50"
              value={formData.numQuestions}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
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
                <Loader2 className="w-5 h-5 animate-spin" /> Generating Quiz...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Generate Quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
