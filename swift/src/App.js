import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/UserCreation'
import UserProfile from './pages/userProfile/UserProfile'

import Test from './pages/test/Test';
import FlashcardForm from './pages/flashcard/Flashcard';
import QuizForm from './pages/quiz/Quiz';
import FlashcardSetForm from './pages/flashcardset/FlashcardSet';
import Shop from './pages/shop/Shop';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/test" element={<Test />} />
        <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
          <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
          <Route path="/quiz-form/:setId" element={<QuizForm />} />
          <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
