import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ChatSection from './components/ChatSection';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

const App = () => {
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <ToastContainer newestOnTop={false}/>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={(name) => setUserName(name)} />} />
        <Route path="/sign-up" element={<SignUpPage/>} />
        <Route path="/chat" element={<ChatSection userName={userName} />} />
      </Routes>
    </Router>
  );
};

export default App;
