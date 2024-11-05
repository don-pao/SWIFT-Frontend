import React, { useEffect, useState } from 'react';
import { userService } from '../login/userService';
import { useNavigate } from 'react-router-dom';

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
      console.log("Username set to:", currentUser.username); // Log username
      console.log("Email set to:", currentUser.email); // Log email
    }
  };
  
  const handleUsernameChange = async (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);

    // Check if the username exists
    try {
      const exists = await userService.usernameExists(newUsername);
      if (exists) {
        alert('Username is already taken. Please choose a different one.');
        // Optionally, you can reset the username to the previous value or maintain the existing one.
      }
    } catch (error) {
      console.error('Error checking username:', error);
      alert('Error checking username. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!username || !email || !confirmPassword) {
      alert('All fields must be filled out, including password confirmation.');
      return;
    }
  
    if (username !== user.username) {
      try {
        const exists = await userService.usernameExists(username);
        if (exists) {
          alert('Username is already taken. Please choose a different one.');
          return;
        }
      } catch (error) {
        console.error('Error checking username:', error.message);
        alert('Error checking username. Please try again.');
        return;
      }
    }
  

    try {
      // Step 1: Verify password using verifyPassword method in userService
      const isPasswordValid = await userService.verifyPassword(user.username, confirmPassword);
      if (!isPasswordValid) {
        alert('Invalid password. Please try again.');
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

      alert('Profile updated successfully.');
      setIsEditing({ username: false, email: false, password: false });

    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    const userID = user.userId;
    const confirmation = window.confirm('Are you sure you want to delete your account?');
    if (confirmation) {
      try {
        const message = await userService.deleteUser(userID);
        console.log(message);
        userService.logout();
        
        // Redirect to Login page after account deletion
        navigate('/login');
      } catch (error) {
        console.error(error.message);
      }
    }
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
                onChange={(e) => setEmail(e.target.value)}
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
          <div style={styles.profileItem}>
            <label style={styles.profileLabel}>Current Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.profileInput}
                placeholder="Enter current password to verify changes"
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
        <div style={styles.logoutContainer}>
          <span onClick={handleLogout} style={styles.logoutLink}>Logout</span>
        </div>
      </div>
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
    marginTop: '20px',
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
  logoutContainer: {
    textAlign: 'right',
    marginTop: '20px',
  },
  logoutLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};

export default UserProfile;