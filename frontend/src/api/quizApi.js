import axios from 'axios';

// Use relative URLs which will be proxied by Vite to http://localhost:8765
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for error logging
const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
  throw error.response?.data || new Error(`${message}: ${error.message}`);
};

export const questionApi = {
  // Get all questions
  getAllQuestions: async () => {
    try {
      const response = await api.get('/question-service/questions/allQuestions');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch questions');
    }
  },

  // Get questions by category
  getQuestionsByCategory: async (category) => {
    try {
      const response = await api.get(`/question-service/questions/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch questions for category: ${category}`);
    }
  },

  // Add a new question
  addQuestion: async (questionData) => {
    try {
      const response = await api.post('/question-service/questions/add', questionData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to add question');
    }
  },

  // Update question
  updateQuestion: async (questionData) => {
    try {
      const response = await api.put('/question-service/questions/update', questionData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update question');
    }
  },

  // Delete question
  deleteQuestion: async (id) => {
    try {
      const response = await api.delete(`/question-service/questions/delete/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to delete question with ID: ${id}`);
    }
  },
};

export const quizApi = {
  // Create a new quiz
  createQuiz: async (quizDTO) => {
    try {
      const response = await api.post('/quiz-service/quiz/create', quizDTO);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create quiz');
    }
  },

  // Get questions for a specific quiz ID
  getQuiz: async (id) => {
    try {
      const response = await api.get(`/quiz-service/quiz/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to load quiz with ID: ${id}`);
    }
  },

  // Submit quiz answers and calculate score
  submitQuiz: async (id, responses) => {
    try {
      const response = await api.post(`/quiz-service/quiz/submit/${id}`, responses);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to submit quiz with ID: ${id}`);
    }
  },
};

export default { questionApi, quizApi };
