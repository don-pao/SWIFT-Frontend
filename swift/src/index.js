import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PersonalInfoProvider } from './context/PersonalInfoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PersonalInfoProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </PersonalInfoProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
