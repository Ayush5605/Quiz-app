import React, { useState, useEffect } from 'react';
import { questionApi } from '../api/quizApi';
import { Database, Plus, Search, Filter, Trash2, Edit3, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null for Add, Question object for Edit
  
  const initialForm = {
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    rightAnswer: '',
    category: 'Java',
    difficultyLevel: 'Easy',
  };
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterData();
  }, [questions, selectedCategory, searchQuery]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await questionApi.getAllQuestions();
      setQuestions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch questions. Check if Question-Service is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = [...questions];

    if (selectedCategory !== 'ALL') {
      result = result.filter(
        (q) => q.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.questionTitle?.toLowerCase().includes(qLower) ||
          q.category?.toLowerCase().includes(qLower)
      );
    }

    setFilteredQuestions(result);
  };

  const categories = Array.from(
    new Set(questions.map((q) => q.category).filter(Boolean))
  );

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      id: q.id,
      questionTitle: q.questionTitle || '',
      option1: q.option1 || '',
      option2: q.option2 || '',
      option3: q.option3 || '',
      option4: q.option4 || '',
      rightAnswer: q.rightAnswer || '',
      category: q.category || 'Java',
      difficultyLevel: q.difficultyLevel || 'Easy',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete question #${id}?`)) return;

    try {
      await questionApi.deleteQuestion(id);
      setActionSuccess(`Question #${id} deleted successfully.`);
      setTimeout(() => setActionSuccess(''), 4000);
      fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to delete question.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.questionTitle || !formData.rightAnswer) {
      alert('Question title and right answer are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingQuestion) {
        await questionApi.updateQuestion(formData);
        setActionSuccess('Question updated successfully!');
      } else {
        await questionApi.addQuestion(formData);
        setActionSuccess('New question added successfully!');
      }
      setTimeout(() => setActionSuccess(''), 4000);
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      alert(err.message || 'Failed to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Question Bank
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage repository questions used by Quiz-Service to build quizzes.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Question
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search questions by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
          >
            <option value="ALL">All Categories ({questions.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Table / Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span>Loading questions from microservices...</span>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 space-y-3">
          <Database className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-lg font-medium text-slate-300">No questions found</p>
          <p className="text-sm text-slate-500">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'Try changing your search query or category filter.'
              : 'Add questions to populate your question bank.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      ID #{q.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {q.category || 'General'}
                    </span>
                    {q.difficultyLevel && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        q.difficultyLevel.toLowerCase() === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : q.difficultyLevel.toLowerCase() === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {q.difficultyLevel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white pt-1">
                    {q.questionTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-sm">
                {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => {
                  if (!opt) return null;
                  const isRight = q.rightAnswer === opt;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isRight
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-bold mr-2 text-slate-500">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </span>
                      {isRight && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingQuestion ? `Edit Question #${editingQuestion.id}` : 'Add New Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Question Title
                </label>
                <textarea
                  rows="3"
                  value={formData.questionTitle}
                  onChange={(e) => setFormData({ ...formData, questionTitle: e.target.value })}
                  placeholder="Enter the question text here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Option 1</label>
                  <input
                    type="text"
                    value={formData.option1}
                    onChange={(e) => setFormData({ ...formData, option1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Option 2</label>
                  <input
                    type="text"
                    value={formData.option2}
                    onChange={(e) => setFormData({ ...formData, option2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Option 3</label>
                  <input
                    type="text"
                    value={formData.option3}
                    onChange={(e) => setFormData({ ...formData, option3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Option 4</label>
                  <input
                    type="text"
                    value={formData.option4}
                    onChange={(e) => setFormData({ ...formData, option4: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Right Answer (Exact text matching one of the options)
                </label>
                <input
                  type="text"
                  value={formData.rightAnswer}
                  onChange={(e) => setFormData({ ...formData, rightAnswer: e.target.value })}
                  placeholder="e.g. Option 1 text"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Difficulty</label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
