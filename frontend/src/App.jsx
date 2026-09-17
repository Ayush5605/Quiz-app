import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TakeQuiz from './components/TakeQuiz';
import CreateQuiz from './components/CreateQuiz';
import QuestionManager from './components/QuestionManager';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeQuizId, setActiveQuizId] = useState(null);

  const handleStartQuizWithId = (quizId) => {
    setActiveQuizId(quizId);
    setActiveTab('take-quiz');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <Home setActiveTab={setActiveTab} onStartQuizWithId={handleStartQuizWithId} />
        )}

        {activeTab === 'take-quiz' && (
          <TakeQuiz initialQuizId={activeQuizId} />
        )}

        {activeTab === 'create-quiz' && (
          <CreateQuiz onQuizCreated={() => setActiveTab('take-quiz')} />
        )}

        {activeTab === 'questions' && (
          <QuestionManager />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>QuizMaster Microservices Platform • Spring Boot + React JS</span>
          <span className="text-slate-600">API Gateway: http://localhost:8765</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
