import { useState } from "react";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, CssBaseline, Box, Button,
} from "@mui/material";
import {
  Dashboard, People, Settings, Notifications, Menu as MenuIcon,
} from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { DRAWER_WIDTH } from "../../constant/constant";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AppDrawer = ({ HomeMenuItems }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("Dashboard");

  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleButtonClick = (text, path) => {
    setActiveButton(text);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const AdminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Donors", icon: <People />, path: "/admin/donor" },
    { text: "Food Donated", icon: <VolunteerActivismIcon />, path: "/admin/fooddonor" },
    { text: "Requests", icon: <PlaylistAddIcon />, path: "/admin/request" },
    { text: "Partners", icon: <ApartmentIcon />, path: "/admin/partnerlist" },
    { text: "Notifications", icon: <Notifications />, path: "/admin/notifications" },
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  const menuItems = HomeMenuItems || AdminMenuItems;

  const drawer = (
    <div>
      {HomeMenuItems && (
        <Toolbar>
          <Typography variant="title" sx={{ textDecoration: "none" }}>
            <a href="/admin/dashboard">Share2serve</a>
          </Typography>
        </Toolbar>
      )}
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            selected={activeButton === text}
            onClick={() => handleButtonClick(text, path)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "#fff",
                "& .MuiListItemIcon-root": { color: "#fff" },
              },
              "&.Mui-selected:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          color="default"
          elevation={0}
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { sm: `${DRAWER_WIDTH}px` },
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" mt={1} gutterBottom>
                {activeButton}
              </Typography>
            </Box>

            {/* Auth button in admin AppBar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {token ? (
                <>
                  <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                    Hi, {user?.name?.split(" ")[0]}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button variant="contained" size="small" color="primary">
                    Login
                  </Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            width: DRAWER_WIDTH,
            flexShrink: 0,
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default AppDrawer;
