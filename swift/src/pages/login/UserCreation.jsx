import React, { useState } from "react";
import { userService } from './userService';
import { useNavigate } from 'react-router-dom';
import { usePersonalInfo } from '../../context/PersonalInfoContext'; // Import the context// Import the custom hook

const UserCreation = () => {
  const navigate = useNavigate();
  const { setUserInfo } = usePersonalInfo();  // Access setUserInfo from context
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isEmailValid, setIsEmailValid] = useState(true); // New state for email validation

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordPattern.test(password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);  // Toggle password visibility
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password') {
      if (!validatePassword(value)) {
        setError("Password must be at least 8 characters long and contain at least one special character.");
      } else {
        setError(""); // Clear error if password is valid
      }
    }

    // Check email uniqueness if the email field is changed
    if (name === 'email' && isRegistering) {
      try {
        const emailExists = await userService.emailExists(value);
        setIsEmailValid(!emailExists);
        if (emailExists) {
          setError('Email already in use.');
        } else {
          setError(''); // Clear error if email is valid
        }
      } catch (err) {
        console.error('Error checking email uniqueness:', err.message);
        setError('Could not verify email. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      if (isRegistering) {
        // Check email validity before registration
        if (!isEmailValid) {
          setError('Please use a different email.');
          return;
        }
        if (!validatePassword(formData.password)) {
          setError('Password must be at least 8 characters long and contain at least one special character.');
          return;
        }
  
        // Register the user
        const newUser = await userService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          coinBalance: 0,
          progress_data: 0 // Adding a default value for progress_data to avoid SQL errors
        });
  
        setSuccess('Registration successful! Please login.');
  
        // Save user data to context after successful registration
        setUserInfo(newUser.userId, newUser.username, newUser.email); // Store user info in context
  
        // Redirect user to the home route after registration
        navigate('/home');
  
      } else {
        // Login the user
        const data = await userService.login({
          username: formData.username,
          password: formData.password
        });
  
        if (data.token) {
          // Save user data to context after successful login
          setUserInfo(data.userId, data.username, data.email); // Store user info in context
          setSuccess('Login successful!');
          
          // Redirect user to the home route after login
          navigate('/home');
        } else {
          setError('Login failed. No token provided.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f3f3",
  };

  const formContainerStyle = {
    display: "flex",
    width: "70%",
    maxWidth: "900px",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  };

  const panelStyle = (side) => ({
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: side === (isRegistering ? "left" : "right") ? "#432874" : "#ffffff",
    color: side === (isRegistering ? "left" : "right") ? "#fff" : "#000",
    transition: "background-color 0.6s ease",
  });

  const formContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
  };

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };

  const buttonStyle = {
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#73489c", // Default button color
    color: "#fff", // Default text color
    cursor: "pointer",
  };

  const whiteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#edcd3b", // White background for specific buttons
    color: "#63625d", // Text color for specific buttons
  };

  const linkStyle = {
    marginTop: "1rem",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={panelStyle("left")}>
          {isRegistering ? (
            <div style={formContentStyle}>
              <h2>Create Account</h2>
              <p>Register with your personal details to use all site features.</p>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
              <form style={formStyle} onSubmit={handleSubmit}>
                <input
                  style={inputStyle}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={inputStyle}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: "relative", width: "92%" }}>
                  <input
                    style={{ ...inputStyle, width: "100%" }}
                    type={showPassword ? "text" : "password"} // Show password based on toggle
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={toggleShowPassword}
                    style={{
                      position: "absolute",
                      right: "3px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#007bff"
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                <button style={whiteButtonStyle} type="submit">SIGN UP</button>
              </form>
            </div>
          ) : (
            <div style={formContentStyle}>
              <h2>Sign In</h2>
              <p>or use your email and password</p>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
              <form style={formStyle} onSubmit={handleSubmit}>
                <input
                  style={inputStyle}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <div style={{ position: "relative", width: "92%" }}>
                  <input
                    style={{ ...inputStyle, width: "100%" }}
                    type={showPassword ? "text" : "password"} // Show password based on toggle
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={toggleShowPassword}
                    style={{
                      position: "absolute",
                      right: "3px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#007bff"
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                <button style={buttonStyle} type="submit">SIGN IN</button>
              </form>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={panelStyle("right")}>
          {isRegistering ? (
            <div style={formContentStyle}>
              <h2>Welcome new user</h2>
              <p>Register with your personal details to use all site features.</p>
              <p>Already have an account?</p>
              <button style={buttonStyle} onClick={toggleForm}>LOG IN</button>
            </div>
          ) : (
            <div style={formContentStyle}>
              <h2>Hello, Friend!</h2>
              <p>Welcome back! Please sign in to continue.</p>
              <p>Don’t have an account?</p>
              <button style={whiteButtonStyle} onClick={toggleForm}>CREATE NEW ACCOUNT</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCreation;
