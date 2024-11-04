import ResponsiveAppBar from './Appbar';
import Body from './Body';
import AvatarTheme from './Theme';
import FlashcardForm from './Flashcard';
import QuizForm from './Quiz';
import FlashcardSetForm from './FlashcardSet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <AvatarTheme/>
      <Router>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
        <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
        <Route path="/quiz-form/:setId" element={<QuizForm />} />
      </Routes>
    </Router>
    </div>
  );
}

export default Home;
