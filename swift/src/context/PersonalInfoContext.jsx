import React, { createContext, useState, useContext,useEffect  } from 'react';
import axios from 'axios';

// Create the context
const PersonalInfoContext = createContext();

// Provider component
export const PersonalInfoProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    userId: null,  // Initially set to null
    username: '',
    email: '',
  });

  // Function to update user info after login
  const setUserInfo = (userId, username, email) => {
    console.log('User Info Updated:', userId, username, email);
    setPersonalInfo({ userId, username, email });

        // Save to localStorage
        localStorage.setItem('personalInfo', JSON.stringify({ userId, username, email }));
  };

    // Fetch user data from localStorage on mount
    useEffect(() => {
      const savedUserInfo = localStorage.getItem('personalInfo');
      if (savedUserInfo) {
        setPersonalInfo(JSON.parse(savedUserInfo));
      }
    }, []);

  // Example of setting user info after successful login
const fetchUserData = async () => {
    try {
      const response = await axios.get('your-api-endpoint-to-fetch-user');
      const { userId, username, email } = response.data;
      
      // Now, update the context with the fetched user data
      setUserInfo(userId, username, email);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <PersonalInfoContext.Provider value={{ personalInfo, setUserInfo }}>
      {children}
    </PersonalInfoContext.Provider>
  );
};

// Custom hook to use the context
export const usePersonalInfo = () => useContext(PersonalInfoContext);
