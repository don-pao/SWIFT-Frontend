import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import axios from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import { useTheme } from '../context/ThemeContext';

const pages = [
  { label: 'Home', path: '/home' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Shop', path: '/shop' },
  { label: 'Flashcard', path: '/flashcard-set-form' },
];
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const { personalInfo } = usePersonalInfo();
  const { theme } = useTheme();
   // Access userID from the context

   useEffect(() => {
        if (personalInfo?.userId) {
            fetchCoinBalance();
        }
    }, [personalInfo]);

    const fetchCoinBalance = async () => {
        if (!personalInfo?.userId) {
            console.error('User ID is required to fetch coin balance.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/${personalInfo.userId}/coin-balance`);
            setCoinBalance(response.data); // Assuming API returns the balance directly
        } catch (error) {
            console.error('Error fetching coin balance:', error);
        }
    };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === 'Profile') {
      navigate('/user-profile');
    } else if (setting === 'Logout') {
      // Assume there's a logout function in context or service
      navigate('/login');
    }
    setAnchorElUser(null);
  };
  
  return (
    <AppBar position="static" sx={{ backgroundColor: theme.appBarBackground, // Dynamic AppBar background
      transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <IconButton component={Link} to="/home" sx={{ color: 'inherit' }}>
          <img 
            src="/images/themes/SWIFT_logo.png" 
            alt="SWIFT Logo" 
            style={{ height: '40px', display: 'block' }} 
          />
        </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Typography
                    component={Link}
                    to={page.path}
                    sx={{ textAlign: 'center', color: 'inherit', textDecoration: 'none' }}
                  >
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block', fontWeight: 'bold' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Coin Icon and Amount */}
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/images/themes/coin.png`}
              alt="Coin"
              sx={{ width: 20, height: 20, mr: 0.5 }}
            />
            <Typography variant="body1" sx={{ color: 'white', mr: 2 }}>
              {coinBalance} {/* Display coin amount */}
            </Typography>
            {/* Profile Icon */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircle sx={{ color: 'white', fontSize: '30px' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
