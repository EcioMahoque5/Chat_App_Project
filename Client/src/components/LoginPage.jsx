import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled(Container)`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(circle at 15% 55%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 15%,transparent 15%, transparent 100%),radial-gradient(circle at 89% 23%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 60%,transparent 60%, transparent 100%),radial-gradient(circle at 58% 94%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 48%,transparent 48%, transparent 100%),radial-gradient(circle at 54% 93%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 42%,transparent 42%, transparent 100%),radial-gradient(circle at 53% 32%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 24%,transparent 24%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));
`;

const LoginForm = styled(Form)`
  background: #e6f0ff;
  color: #333333;
  padding: 30px;
  width: 55%;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.9);
  border-radius: 8px;
`;

const StyledButton = styled(Button)`
  font-size: 1.2rem;
  width: 12rem;
  height: 3rem;
  font-weight: 500;
  background-color: #007bff;
  border: none;
  color: #ffffff;
  &:hover {
    background-color: #0056b3;
  }
`;

const LoginPage = ({ onLogin }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name);
            navigate('/chat');
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                    <Form.Label column sm="4" className='mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>Enter your name:</Form.Label>
                    <Col sm="12">
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </Col>
                </Form.Group>
                <div className="d-md-flex justify-content-md-end">
                    <StyledButton type="submit" className='mt-4'>Join Chat</StyledButton>
                </div>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginPage;
