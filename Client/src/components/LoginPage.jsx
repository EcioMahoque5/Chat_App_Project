import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import Axios from './AxiosInstance';
import { toast, Slide } from 'react-toastify';
import { setTokens } from '../utils/helpers';
import * as yup from 'yup';

const LoginContainer = styled(Container)`
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
  width: 100%;
  height: 3rem;
  font-weight: 500;
  background-color: #007bff;
  border: none;
  color: #ffffff;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledA = styled.a`
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    outline: none;
    border: none;
    color: #007bff;

    &:hover, :active, :focus{
        color: #0056b3;
        transition: all 0.3s ease-in-out 0s;
    }
`;

const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    chatRoom: yup.string().required('Chat room name is required'),
});

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const { username, password, chatRoom } = values;

        try {
            const response = await Axios.post('/login', { username, password, chatRoom });

            if (response.data.success) {
                toast.success(response.data.message, {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    transition: Slide,
                    theme: 'colored',
                    closeButton: false,
                    position: 'top-right'
                });

                setTokens(response.data.access_token);
                
                const { first_name, other_names, user_id} = response.data.user;
                onLogin(username, password, chatRoom, first_name, other_names, user_id);

                navigate('/chat');
            } else {
                toast.error(response.data.message, {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    transition: Slide,
                    theme: 'colored',
                    closeButton: false,
                    position: 'top-right'
                });
            }
            resetForm();
        } catch (error) {
            toast.error('Validation errors', {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                transition: Slide,
                theme: 'colored',
                closeButton: false,
                position: 'top-right'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LoginContainer>
            <Formik
                initialValues={{ username: '', password: '', chatRoom: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, handleBlur, values, isSubmitting }) => (
                    <LoginForm onSubmit={handleSubmit}>

                        <h3 className="text-center mb-0">Welcome to TalkSpace</h3>
                        <p className="text-center mb-1">Enter your details below to proceed</p>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4" className='mb-1' style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                                Username
                            </Form.Label>
                            <Col sm="12">
                                <Field
                                    type="text"
                                    name="username"
                                    as={Form.Control}
                                    placeholder="Enter your username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    isInvalid={!!values.username && !values.username.trim()}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <ErrorMessage name="username" />
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4" className='mt-3 mb-1' style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                                Password
                            </Form.Label>
                            <Col sm="12">
                                <Field
                                    type="password"
                                    name="password"
                                    as={Form.Control}
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    isInvalid={!!values.password && !values.password.trim()}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <ErrorMessage name="password" />
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4" className='mt-3 mb-1' style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                                Chat Room Name
                            </Form.Label>
                            <Col sm="12">
                                <Field
                                    type="text"
                                    name="chatRoom"
                                    as={Form.Control}
                                    placeholder="Enter chat room name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.chatRoom}
                                    isInvalid={!!values.chatRoom && !values.chatRoom.trim()}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <ErrorMessage name="chatRoom" />
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <div className="d-md-flex justify-content-md-end">
                            <StyledButton type="submit" className='mt-4' disabled={isSubmitting}>
                                Login
                            </StyledButton>
                        </div>

                        <div className="w-100 text-center mt-3">
                            <p className="mb-0">Don't have an account?</p>
                            <StyledA href="/sign-up">Sign Up</StyledA>
                        </div>
                    </LoginForm>
                )}
            </Formik>
        </LoginContainer>
    );
};

export default LoginPage;
