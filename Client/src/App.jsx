import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatSection from './components/ChatSection';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const App = () => {
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <ToastContainer newestOnTop={false}/>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={(name) => setUserName(name)} />} />
        <Route path="/chat" element={<ChatSection userName={userName} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
