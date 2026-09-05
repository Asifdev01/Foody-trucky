import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Container,
  Button, Drawer, List, ListItem, ListItemText,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
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
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar className="navbar-container">
            {/* Logo - Desktop & Mobile */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              className="logo-text"
              sx={{ textDecoration: 'none', display: { xs: 'none', md: 'flex' } }}
            >
              Share<span className="logo-accent">2</span>serve
            </Typography>

            {/* Mobile Menu Icon */}
            <IconButton
              size="large"
              onClick={() => setOpenDrawer(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Mobile View */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              className="logo-text"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', textDecoration: 'none' }}
            >
              Share<span className="logo-accent">2</span>serve
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
                  <Button onClick={handleLogout} variant="text" color="inherit">
                    Logout
                  </Button>
                </Box>
              ) : (
                <Button component={Link} to="/login" variant="contained" color="primary">
                  Get Started
                </Button>
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
        PaperProps={{ className: 'mobile-drawer-content' }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: '100%', maxWidth: 300 } }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography className="logo-text" sx={{ mt: 4, mb: 4, justifyContent: 'center', display: 'flex' }}>
            Share<span className="logo-accent">2</span>serve
          </Typography>
        </Box>
        <List>
          {pages.map((item) => (
            <ListItem
              key={item.label}
              component={Link}
              to={item.link}
              onClick={() => setOpenDrawer(false)}
              className="mobile-nav-link"
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ style: { fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' } }}
              />
            </ListItem>
          ))}
          {/* Mobile auth action */}
          <Box sx={{ mt: 4, px: 4 }}>
            {token ? (
              <Button fullWidth onClick={handleLogout} variant="outlined" color="primary" sx={{ py: 1.5 }}>
                Logout
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={() => { navigate('/login'); setOpenDrawer(false); }}
                variant="contained"
                color="primary"
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
