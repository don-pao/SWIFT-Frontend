import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './homePage/Home';
import FlashcardForm from './homePage/Flashcard';
import QuizForm from './homePage/Quiz';
import FlashcardSetForm from './homePage/FlashcardSet';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
          <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
          <Route path="/quiz-form/:setId" element={<QuizForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
