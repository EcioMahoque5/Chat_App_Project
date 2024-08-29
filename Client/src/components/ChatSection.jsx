import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import Message from './Message';
import { BsSendFill } from "react-icons/bs";
import Axios from './AxiosInstance';

const socket = io('http://localhost:5000');

const ChatSectionWrapper = styled(Container)`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(circle at 15% 55%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 15%,transparent 15%, transparent 100%),
                    radial-gradient(circle at 89% 23%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 60%,transparent 60%, transparent 100%),
                    radial-gradient(circle at 58% 94%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 48%,transparent 48%, transparent 100%),
                    radial-gradient(circle at 54% 93%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 42%,transparent 42%, transparent 100%),
                    radial-gradient(circle at 53% 32%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 24%,transparent 24%, transparent 100%),
                    linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));
`;

const ChatBox = styled.div`
  width: 51.5rem;
  max-width: 90%;
  background: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
`;

const Brand = styled(Row)`
  background: #e6f0ff;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const BrandTitle = styled.h1`
  font-size: 1.5rem;
  color: #333333;
  margin: 0;
`;

const MessageArea = styled.div`
  height: 31.25rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #ffffff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding-top: 2.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
  background: #f5f5f5;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const MessageInput = styled.textarea`
  width: 100%;
  border: none;
  padding: 20px;
  font-size: 1rem;
  outline: none;
  background: inherit;
  resize: none;
  border-bottom-left-radius: 8px;
`;

const SendButton = styled(Button)`
  background: inherit;
  border: none;
  display: flex;
  align-items: center;
  padding: 0 20px;
  &:hover {
    background: #C6C6C6;
  }
`;

function ChatSection({ userFullName, userName, chatRoom, user_id }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageAreaRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userFullName) {
            navigate('/');
        }

        const handleMessage = (msg) => {
            if (msg && msg.user && msg.message) {
                setMessages((prevMessages) => [...prevMessages, msg]);
                scrollToBottom();
            } else {
                console.error('Received invalid message:', msg);
            }
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, [userFullName, navigate]);

    useEffect(() => {
        if (chatRoom) {
            Axios.post('messages', { chat_room: chatRoom })
                .then((response) => {
                    const mappedMessages = response.data.map(msg => ({
                        userName: msg.user,
                        message: msg.content || 'No message content',
                        user_id: msg.user_id,
                        timestamp: msg.timestamp
                    }));
                    setMessages(mappedMessages);
                    scrollToBottom();
                })
                .catch((error) => {
                    console.error('Error fetching messages:', error);
                });

            socket.emit('join', { chatRoom });
        }

        return () => {
            if (chatRoom) {
                socket.emit('leave', { chatRoom });
            }
        };
    }, [chatRoom]);

    const sendMessage = () => {
        const msg = {
            user: userName,
            userName: userFullName,
            chatRoom: chatRoom,
            user_id: user_id,
            message: message.trim(),
        };
        if (msg.message) {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setMessage('');
            socket.emit('message', msg);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.altKey) {
                setMessage((prev) => prev + '\n');
            } else {
                e.preventDefault(); // Prevent the default action of Enter key
                sendMessage();
            }
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <ChatSectionWrapper>
            <ChatBox>
                <Brand as={Row}>
                    <Col xs="auto">
                        <BsSendFill size={35} />
                    </Col>
                    <Col>
                        <BrandTitle>TalkSpace</BrandTitle>
                    </Col>
                    <Col xs="auto">
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Col>
                </Brand>
                <MessageArea ref={messageAreaRef}>
                    {messages.map((msg, index) => {
                        return (
                            <Message
                                key={index}
                                user={msg.user || 'Unknown User'}
                                text={msg.message || 'No message content'}
                                userName={msg.userName}
                                type={msg.user_id === user_id ? 'outgoing' : 'incoming'}
                            />
                        )
                    })}
                </MessageArea>
                <InputWrapper>
                    <MessageInput
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message"
                    />
                    <SendButton onClick={sendMessage}>
                        <BsSendFill size={20} />
                    </SendButton>
                </InputWrapper>
            </ChatBox>
        </ChatSectionWrapper>
    );
}

export default ChatSection;