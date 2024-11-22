import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log("Token sent:", token); // Log the token to verify it's being sent

        const response = await axios.get("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users.");
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  // CSS styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#432874',
      color: '#fff',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    error: {
      color: 'red',
      marginTop: '20px',
      textAlign: 'center',
    },
    noUsers: {
      textAlign: 'center',
      color: '#555',
    },
    button: {
      display: 'block',
      margin: '20px auto',
      backgroundColor: '#432874',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#7225f7',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      {error && <p style={styles.error}>{error}</p>}
      {!error && users.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userID}>
                <td style={styles.td}>{user.userID}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noUsers}>No users found.</p>
      )}
      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={logout}
      >
        Logout
      </button>
      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={() => navigate('/shopadmin')}
      >
        Go to ShopAdmin
      </button>
    </div>
  );
};

export default AdminDashboard;
