import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const Notifications = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Notifications</Typography>
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <NotificationsIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 0.5 }}>No notifications yet</Typography>
        <Typography color="text.secondary">
          System alerts and activity updates will appear here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Notifications;
