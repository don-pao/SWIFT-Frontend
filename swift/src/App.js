import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Test from './pages/test/Test';
import FlashcardForm from './pages/home/Flashcard';
import QuizForm from './pages/home/Quiz';
import FlashcardSetForm from './pages/home/FlashcardSet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
          <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
          <Route path="/quiz-form/:setId" element={<QuizForm />} />
      </Routes>
    </Router>
  );
}

export default App;
