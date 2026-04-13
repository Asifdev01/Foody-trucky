import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You do not have the required permissions to access this page. This area is restricted to administrators only.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#87A920",
            "&:hover": { bgcolor: "#6e8f1a" },
            px: 4,
            py: 1,
            borderRadius: 2,
          }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotAuthorized;
