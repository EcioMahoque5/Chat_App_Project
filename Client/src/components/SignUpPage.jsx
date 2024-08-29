import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import Axios from './AxiosInstance';
import { toast, Slide, ToastContainer } from 'react-toastify';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

const SignUpContainer = styled(Container)`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(circle at 15% 55%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 15%,transparent 15%, transparent 100%),radial-gradient(circle at 89% 23%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 60%,transparent 60%, transparent 100%),radial-gradient(circle at 58% 94%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 48%,transparent 48%, transparent 100%),radial-gradient(circle at 54% 93%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 42%,transparent 42%, transparent 100%),radial-gradient(circle at 53% 32%, hsla(164,0%,78%,0.03) 0%, hsla(164,0%,78%,0.03) 24%,transparent 24%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));
`;

const SignUpForm = styled(Form)`
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
  color: #007bff;

  &:hover {
    color: #0056b3;
    transition: all 0.3s ease-in-out 0s;
  }
`;

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  otherNames: yup.string().required('Other names are required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUpPage = ({ onSignUp }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { firstName, otherNames, username, password } = values;

    try {
      const response = await Axios.post('/create_user', {
        first_name: firstName,
        other_names: otherNames,
        username,
        password
      });

      if (response.data.success) {
        toast.success(response.data.message, {
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          transition: Slide,
          progress: undefined,
          theme: 'colored',
          closeButton: false,
          position: 'top-right'
        });
        navigate('/');
      } else {
        toast.error(response.data.message, {
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          transition: Slide,
          progress: undefined,
          theme: 'colored',
          closeButton: false,
          position: 'top-right'
        });
      }
    } catch (error) {
      toast.error('An error occurred during sign up', {
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        transition: Slide,
        progress: undefined,
        theme: 'colored',
        closeButton: false,
        position: 'top-right'
      });
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <SignUpContainer>
      <Formik
        initialValues={{ firstName: '', otherNames: '', username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, values, isSubmitting }) => (
          <SignUpForm onSubmit={handleSubmit}>
            <Row>
              <Col sm="6">
                <Form.Group>
                  <Form.Label className='mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                    First Name
                  </Form.Label>
                  <Field
                    type="text"
                    name="firstName"
                    as={Form.Control}
                    placeholder="Enter your first name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    isInvalid={!!values.firstName && !values.firstName.trim()}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="firstName" />
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm="6">
                <Form.Group>
                  <Form.Label className='mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                    Other Names
                  </Form.Label>
                  <Field
                    type="text"
                    name="otherNames"
                    as={Form.Control}
                    placeholder="Enter your other names"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.otherNames}
                    isInvalid={!!values.otherNames && !values.otherNames.trim()}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="otherNames" />
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group as={Row}>
              <Form.Label column sm="4" className='mt-3 mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>
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
              <Form.Label column sm="4" className='mt-3 mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>
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
              <Form.Label column sm="4" className='mt-3 mb-1' style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                Confirm Password
              </Form.Label>
              <Col sm="12">
                <Field
                  type="password"
                  name="confirmPassword"
                  as={Form.Control}
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  isInvalid={!!values.confirmPassword && !values.confirmPassword.trim()}
                />
                <Form.Control.Feedback type="invalid">
                  <ErrorMessage name="confirmPassword" />
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <div className="d-md-flex justify-content-md-end">
              <StyledButton type="submit" className='mt-4' disabled={isSubmitting}>
                Sign Up
              </StyledButton>
            </div>

            <div className="w-100 text-center mt-3">
              <p className="mb-0">Already have an account?</p>
              <StyledA href="/">Login</StyledA>
            </div>
          </SignUpForm>
        )}
      </Formik>
      
    </SignUpContainer>
  );
};

export default SignUpPage;
