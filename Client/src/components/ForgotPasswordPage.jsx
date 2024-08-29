import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPasswordContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const ForgotPasswordForm = styled(Form)`
  background: #e6f0ff;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to send reset instructions');
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordForm onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Reset Instructions
        </Button>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
