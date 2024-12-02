import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { userService } from '../login/userService';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Password confirmation input
  const [isEditing, setIsEditing] = useState({ username: false, email: false });

  // State to manage visibility of passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hover state for buttons
  const [isHoveredUpdate, setIsHoveredUpdate] = useState(false);
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);

   // Store original values to reset if "Cancel" is clicked
   const [originalValues, setOriginalValues] = useState({});

   // Modal Message box
   const [modalOpen, setModalOpen] = useState(false);
   const [modalMessage, setModalMessage] = useState('');
   const [isConfirm, setIsConfirm] = useState(false);
   const [onConfirm, setOnConfirm] = useState(null); // Store confirm callback

  const [quizScores, setQuizScores] = useState([]);
  const [averageScore, setAverageScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const fetchUserData = () => {
    const currentUser = userService.getCurrentUser();
    console.log("Current user from service:", currentUser); // Log current user
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      fetchQuizData(currentUser.userId);
      setOriginalValues({
        username: currentUser.username,
        email: currentUser.email,
      });
      console.log("Username set to:", currentUser.username); // Log username
      console.log("Email set to:", currentUser.email); // Log email
    }
  };

  // Fetch quiz data and average score
  const fetchQuizData = async (userId) => {
    try {
      const quizResponse = await fetch(`http://localhost:8080/api/quiz/getQuizzesByUserId/${userId}`);
      
      // Check if the response is JSON
      if (quizResponse.ok && quizResponse.headers.get("Content-Type").includes("application/json")) {
        const quizzes = await quizResponse.json();
        setQuizScores(quizzes);
      } else {
        const errorText = await quizResponse.text();
        console.error("Received non-JSON response:", errorText);
      }
      
      const averageResponse = await fetch(`http://localhost:8080/api/quiz/getAverageScoreByUserId/${userId}`);
      if (averageResponse.ok && averageResponse.headers.get("Content-Type").includes("application/json")) {
        const average = await averageResponse.json();
        setAverageScore(average);
      } else {
        const errorText = await averageResponse.text();
        console.error("Received non-JSON response:", errorText);
      }
  
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };
  

  // Prepare data for the chart
  const chartData = {
    labels: quizScores.map(quiz => quiz.title), // Quiz titles on the x-axis
    datasets: [
      {
        label: 'Quiz Scores',
        data: quizScores.map(quiz => quiz.userScore), // User scores on the y-axis
        fill: false,
        borderColor: '#512da8',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Quiz Scores',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Quiz Titles',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Scores',
        },
        min: 0,
        max: 100,
      },
    },
  };

  const openModal = (message, isConfirm = false, confirmCallback = null) => {
    setModalMessage(message);
    setIsConfirm(isConfirm);
    setOnConfirm(() => confirmCallback); // Assign callback to onConfirm
    setModalOpen(true);
  };
  
  const handleBack = () => {
    // Reset fields to original values
    setUsername(originalValues.username);
    setEmail(originalValues.email);
    setPassword('');
    setConfirmPassword('');
    setIsEditing({ username: false, email: false, password: false });

    // Navigate back to the home page
    navigate('/home');
  };

  const handleUsernameChange = async (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);

    if (newUsername && newUsername !== user.username) {
    // Check if the username exists
      try {
        const exists = await userService.usernameExists(newUsername);
        if (exists) {
          openModal('Username is already taken. Please choose a different one.');
          setUsername(user.username); 
          // Optionally, you can reset the username to the previous value or maintain the existing one.
        }
      } catch (error) {
        console.error('Error checking username:', error);
        openModal('Error checking username. Please try again.');
      }
    }
  };

  // In UserProfile component
  const handleEmailChange = async (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (newEmail !== user.email) { // Only check if email has changed
      try {
        const exists = await userService.emailExists(newEmail);
        if (exists) {
          openModal('Email is already taken. Please choose a different one.');
          setEmail(user.email); 
          // Optionally, reset email or keep current value
        }
      } catch (error) {
        console.error('Error checking email:', error);
        openModal('Error checking email. Please try again.');
      }
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && hasSpecialChar.test(password);
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!username || !email || !confirmPassword) {
      openModal('All fields must be filled out, including password confirmation.');
      return;
    }

    if (password && !validatePassword(password)) {
      openModal('Password must be at least 8 characters long and must contain at least one special character.');
      return;
    }
  
    // Replace confirmation with modal
      openModal('Are you sure you want to save these changes?', true, async () => {
        try {
          // Step 1: Verify password using verifyPassword method in userService
          const isPasswordValid = await userService.verifyPassword(user.username, confirmPassword);
          if (!isPasswordValid) {
            openModal('Invalid password. Please try again.');
            return;
          }

          // Step 2: If password is valid, proceed with the update
          const userID = user.userId;
          const updatedUser = { username, email };

          if (password) {
            updatedUser.password = password;
          }

          await userService.updateUserDetails(userID, updatedUser);

          // Update local state to reflect changes
          setUser(prevUser => ({ ...prevUser, username, email }));
          setPassword(''); // Clear the password field after update
          setConfirmPassword(''); // Clear the confirmPassword field after update

          openModal('Profile updated successfully.');
          setIsEditing({ username: false, email: false, password: false });

        } catch (error) {
          console.error("Error updating profile:", error.message);
          openModal(error.message);
        }
      });
    };

    const handleDelete = () => {
      const confirmCallback = async () => {
        try {
          await userService.deleteUser(user.userId);
          userService.logout();
          navigate('/login');
        } catch (error) {
          console.error(error.message);
        }
      };
  
      openModal('Are you sure you want to delete your account?', true, confirmCallback);
    };

    const handleModalClose = () => {
      setModalOpen(false);
      setIsConfirm(false);
      setOnConfirm(null);
    };
  
    const handleConfirm = () => {
      if (onConfirm) onConfirm();
      handleModalClose();
    };

  const handleLogout = () => {
    userService.logout();
    // Redirect to Login page after logout
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileContainer}>
        <h2 style={styles.profileTitle}>User Profile</h2>

        {/* Display quiz scores in a line chart */}
        <div style={{ marginBottom: '30px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Display average score */}
        <div style={{ marginBottom: '20px' }}>
          <h2>Average Score: {averageScore.toFixed(2)}%</h2><br></br>
        </div>

        <form onSubmit={handleUpdate}>
          <div style={styles.profileItem}>
            <label style={styles.profileLabel}>Username</label>
            {isEditing.username ? (
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange} 
                style={styles.profileInput}
                required
              />
            ) : (
              <div style={styles.profileValue}>{username}</div>
            )}
            <button
              style={styles.profileEditBtn}
              onClick={() => setIsEditing({ ...isEditing, username: !isEditing.username })}
              type="button"
            >
              {isEditing.username ? 'Save' : 'Edit'}
            </button>
          </div>

          <div style={styles.profileItem}>
            <label style={styles.profileLabel}>Email</label>
            {isEditing.email ? (
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                style={styles.profileInput}
                required
              />
            ) : (
              <div style={styles.profileValue}>{email}</div>
            )}
            <button
              style={styles.profileEditBtn}
              onClick={() => setIsEditing({ ...isEditing, email: !isEditing.email })}
              type="button"
            >
              {isEditing.email ? 'Save' : 'Edit'}
            </button>
          </div>

           {/* Editable Password Field */}
          <div style={styles.profileItem}>
            <label style={styles.profileLabel}>New Password</label>
            {isEditing.password ? (
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.profileInput}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showHideButton}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            ) : (
              <div style={styles.profileValue}>••••••••</div>
            )}
            <button
              style={styles.profileEditBtn}
              onClick={() => setIsEditing({ ...isEditing, password: !isEditing.password })}
              type="button"
            >
              {isEditing.password ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Password confirmation input */}
          <div style={styles.centeredProfileItem}>
          <label style={styles.centeredProfileLabel}>Enter current password to verify changes</label>
          <div style={styles.centeredPasswordContainer}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.centeredProfileInput} // Use the new centered input style
              placeholder="Current Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.showHideButton}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

          <button
            type="submit"
            style={{
              ...styles.updateBtn,
              backgroundColor: isHoveredUpdate ? '#aa8cde' : styles.updateBtn.backgroundColor,
            }}
            onMouseEnter={() => setIsHoveredUpdate(true)}
            onMouseLeave={() => setIsHoveredUpdate(false)}
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={handleDelete}
          style={{
            ...styles.deleteBtn,
            backgroundColor: isHoveredDelete ? '#ef5350' : styles.deleteBtn.backgroundColor,
          }}
          onMouseEnter={() => setIsHoveredDelete(true)}
          onMouseLeave={() => setIsHoveredDelete(false)}
        >
          Delete Account
        </button>
        <div style={styles.linkContainer}>
          <span onClick={handleBack} style={styles.backLink}>Back</span>
          <span onClick={handleLogout} style={styles.logoutLink}>Logout</span>
        </div>
      </div>

       {/* Modal for alerts and confirmations */}
       <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 300,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="h2">
            {modalMessage}
          </Typography>
           {isConfirm ? (
            <>
              <Button
                onClick={handleConfirm}
                sx={{
                  mt: 2,
                  mr: 1,
                  bgcolor: '#4a148c',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#380d6f',
                  },
                }}
                variant="contained"
              >
                Confirm
              </Button>
              <Button
                onClick={handleModalClose}
                sx={{
                  mt: 2,
                  bgcolor: '#f44336',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#d32f2f',
                  },
                }}
                variant="contained"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleModalClose}
              sx={{
                mt: 2,
                bgcolor: '#e1bee7',
                color: '#4a148c',
                '&:hover': {
                  bgcolor: '#d1a4e5',
                },
              }}
              variant="contained"
            >
              OK
            </Button>
          )}
        </Box>
            </Modal>

    </div>
  );
};
const styles = {
  pageContainer: {
    minHeight: '20vh',
    background: 'linear-gradient(135deg, #e8eaf6, #f3e5f5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
  },
  profileContainer: {
    width: '100%',
    maxWidth: '500px',
    padding: '50px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    margin: '0px',
    transition: 'transform 0.3s ease',
  },
  profileTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#512da8',
    marginBottom: '20px',
  },
  profileItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  profileLabel: {
    fontWeight: '600',
    color: '#6a1b9a',
    flex: 1,
    textAlign: 'left',
  },
  profileValue: {
    flex: 2,
    padding: '8px',
    fontSize: '1rem',
    backgroundColor: '#f3f3f3',
    borderRadius: '4px',
  },
  profileInput: {
    flex: 2,
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  profileEditBtn: {
    flex: .5,
    backgroundColor: '#e1bee7',
    color: '#4a148c',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  showHideButton: {
    backgroundColor: '#4a148c',
    color: '#e1bee7',
    border: 'none',
    padding: '6px 12px',
    marginLeft: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },

  centeredProfileItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  centeredProfileLabel: {
    fontWeight: '600',
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: '8px', // Spacing between label and input
    marginTop: '20px',
  },
  centeredPasswordContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Space between input and button
  },
  centeredProfileInput: {
    width: '100%',
    maxWidth: '300px', // Set a max width for the input field
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center', // Center text inside input field
  },
  updateBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#512da8',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    marginBottom: '10px',
  },
  deleteBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#d32f2f',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  linkContainer: {
    textAlign: 'left',
    marginTop: '20px',
  },
  backLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  logoutLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
    marginLeft: '400px',
  },
};

export default UserProfile;