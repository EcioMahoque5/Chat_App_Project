import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatSection from './components/ChatSection';
import LoginPage from './components/LoginPage';

const App = () => {
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={(name) => setUserName(name)} />} />
        <Route path="/chat" element={<ChatSection userName={userName} />} />
      </Routes>
    </Router>
  );
};

export default App;