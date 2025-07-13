import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

function RegisterPage() {
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Account Name validation
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    } else if (formData.accountName.trim().length < 2) {
      newErrors.accountName = 'Account name must be at least 2 characters';
    } else if (formData.accountName.trim().length > 50) {
      newErrors.accountName = 'Account name must be less than 50 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    } else if (formData.password.length > 50) {
      newErrors.password = 'Password must be less than 50 characters';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Make API call to your register endpoint
      const response = await axios.post('http://localhost:8080/api/accounts/register', {
        accountName: formData.accountName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      // Check if registration was successful
      if (response.status === 200 && response.data.accountId) {
        setSuccessMessage('Registration successful! You can now login with your credentials.');
        
        // Clear form data
        setFormData({
          accountName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
          setErrors({ general: 'Invalid input data. Please check your information.' });
        } else if (error.response.status === 409) {
          setErrors({ general: 'Account with this email already exists.' });
        } else if (error.response.status === 422) {
          setErrors({ general: 'Validation failed. Please check your input.' });
        } else {
          setErrors({ general: `Registration failed: ${error.response.data?.message || 'Server error'}` });
        }
      } else if (error.request) {
        // Network error
        setErrors({ general: 'Network error. Please check your connection.' });
      } else {
        // Other error
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: '450px', width: '100%' }}>
            <Card className="login-card shadow-lg fade-in custom-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                  <p className="text-muted">Join Orchid Garden today</p>
                </div>
                
                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="success" className="mb-3">
                    {successMessage}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaUser className="me-2" />
                      Account Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="Enter your account name"
                      isInvalid={!!errors.accountName}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.accountName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      isInvalid={!!errors.email}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaLock className="me-2" />
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3 fw-semibold shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>
                
                <div className="text-center">
                  <small className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default RegisterPage; 