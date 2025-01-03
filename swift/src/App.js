import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PersonalInfoProvider } from './context/PersonalInfoContext'; 
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/home/Home';
import Login from './pages/login/UserCreation';
import UserProfile from './pages/userProfile/UserProfile';
import FlashcardForm from './pages/flashcard/Flashcard';
import QuizForm from './pages/quiz/Quiz';
import FlashcardSetForm from './pages/flashcardset/FlashcardSet';
import ShopUI from './pages/shop/ShopAdmin';
import Shop from './pages/shop/Shop';
import InventoryUI from './pages/shop/Inventory';
import AdminLoginAndRegister from './pages/admin/AdminLoginAndRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AnswerForm from './pages/quiz/Answer';
import FlashcardReview from './pages/flashcardset/FlashcardReview'; 

function AppContent() {
  const { theme } = useTheme();
  const isAdminAuthenticated = () => !!localStorage.getItem('adminToken');

  return (
    <div 
      style={{ 
        backgroundColor: theme.pageBackground, 
        minHeight: '100vh',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/flashcard-set-form" element={<FlashcardSetForm />} />
          <Route path="/flashcard-form/:setId" element={<FlashcardForm />} />
          <Route path="/quiz-form/:setId" element={<QuizForm />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shopadmin" element={<ShopUI />} />
          <Route path='/inventory' element={<InventoryUI />} />
          <Route path="/answer-form/:quizId" element={<AnswerForm />} />
          <Route path="/review/:setId" element={<FlashcardReview />} />
          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              isAdminAuthenticated() ? <Navigate to="/admin/dashboard" /> : <AdminLoginAndRegister />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              isAdminAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin/login" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <PersonalInfoProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </PersonalInfoProvider>
  );
}

export default App;