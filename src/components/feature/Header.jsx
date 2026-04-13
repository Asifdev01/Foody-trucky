import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Container,
  Button, Drawer, List, ListItem, ListItemText, 
} from '@mui/material';
import { Menu as MenuIcon, Adb as AdbIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const pages = [
  { label: 'Home', link: '/' },
  { label: 'Donate Food', link: '/donate' },
  { label: 'Charities', link: '/charities' },
  { label: 'About us', link: '/#about-us' },
  { label: 'Contact', link: '/contact' },
  { label: 'Admin', link: '/admin/dashboard' },
];

function Header() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        className="premium-navbar"
      >
        <Container maxWidth="xl">
          <Toolbar className="navbar-container">
            {/* Logo - Desktop & Mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#3b82f6' }} />
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                className="logo-text"
                sx={{
                  textDecoration: 'none',
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                Share2serve
              </Typography>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              size="large"
              color="inherit"
              onClick={() => setOpenDrawer(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Mobile View */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              className="logo-text"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Share2serve
            </Typography>

            {/* Desktop Nav Links */}
            <Box className="nav-links-container" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {pages.map((item) => (
                <Link key={item.label} to={item.link} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ flexGrow: 0, ml: 2, display: 'flex', alignItems: 'center' }}>
              {token ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography className="user-name-display" sx={{ display: { xs: 'none', lg: 'block' } }}>
                    Welcome, <span>{user?.name?.split(' ')[0]}</span>
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    variant="text"
                    className="logout-button"
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    className="cta-button"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          className: "mobile-drawer-content"
        }}
        sx={{ 
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: '100%', maxWidth: 300 }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography className="logo-text" sx={{ mt: 4, mb: 4 }}>
            Share2serve
          </Typography>
        </Box>
        <List>
          {pages.map((item) => (
            <ListItem
              button
              key={item.label}
              component={Link}
              to={item.link}
              onClick={() => setOpenDrawer(false)}
              className="mobile-nav-link"
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  style: { 
                    fontWeight: 500, 
                    fontSize: '1.2rem',
                    textAlign: 'center'
                  } 
                }} 
              />
            </ListItem>
          ))}
          {/* Mobile auth action */}
          <Box sx={{ mt: 4, px: 4 }}>
            {token ? (
              <Button
                fullWidth
                onClick={handleLogout}
                className="logout-button"
                sx={{ py: 1.5 }}
              >
                Logout
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={() => { navigate('/login'); setOpenDrawer(false); }}
                className="cta-button"
                sx={{ py: 1.5 }}
              >
                Log In
              </Button>
            )}
          </Box>
        </List>
      </Drawer>
    </>
  );
}

export default Header;