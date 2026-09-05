import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { Apartment } from "@mui/icons-material";

const PartnerList = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Partner List</Typography>
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <Apartment sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 0.5 }}>No partners listed yet</Typography>
        <Typography color="text.secondary">
          Corporate and NGO partners will be listed here once onboarded.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PartnerList;
