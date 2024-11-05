import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Test from './pages/test/Test';
import FlashcardForm from './pages/flashcard/Flashcard';
import QuizForm from './pages/quiz/Quiz';
import FlashcardSetForm from './pages/flashcardset/FlashcardSet';
import ShopUI from './pages/shop/ShopAdmin';
import Shop from './pages/shop/Shop';
import InventoryUI from './pages/shop/Inventory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
          <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
          <Route path="/quiz-form/:setId" element={<QuizForm />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shopadmin" element={<ShopUI/>}/>
          <Route path='/inventory' element={<InventoryUI/>}/>
      </Routes>
    </Router>
  );
}

export default App;
