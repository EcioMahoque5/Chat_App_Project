import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatSection from './components/ChatSection';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

const App = () => {
  const [userName, setUserName] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [userId, setUserId] = useState(0);

  const handleLogin = (username, password, chatRoom, firstName, otherNames, user_id) => {
    setUserName(username);
    setUserFullName(`${firstName} ${otherNames}`);
    setChatRoom(chatRoom);
    setUserId(user_id);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/chat" element={<ChatSection userFullName={userFullName} userName={userName} chatRoom={chatRoom} user_id={userId}/>} />
      </Routes>
    </Router>
  );
};

export default App;
