import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Settings</Typography>
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <SettingsIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 0.5 }}>Nothing to configure yet</Typography>
        <Typography color="text.secondary">
          Account and platform settings will be available here soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
