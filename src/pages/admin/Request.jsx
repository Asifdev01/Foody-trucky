import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { PlaylistAddCheck } from "@mui/icons-material";

const Request = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Donation Requests</Typography>
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <PlaylistAddCheck sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 0.5 }}>No requests yet</Typography>
        <Typography color="text.secondary">
          Requests from charities and individuals in need will appear here once submitted.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Request;
