import React, { useState } from "react";
import { Container, Grid, TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100vh", display: "flex" }}>
      <Grid container sx={{ flex: 1 }}>
        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", backgroundImage: "url(/food3.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}></Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 360 }}>
            <Typography variant="h6" component="a" href="/" sx={{ mb: 4, fontFamily: "Kaushan Script, serif", fontWeight: 500, fontSize: '3rem', color: 'black', textDecoration: 'none' }}>
              Share2serve
            </Typography>

            <Typography variant="h4" gutterBottom>Create an account</Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSignup} style={{ width: '100%' }}>
              <TextField 
                name="name"
                label="Full name" 
                fullWidth 
                margin="normal" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <TextField 
                name="email"
                label="Email" 
                fullWidth 
                margin="normal" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <TextField 
                name="password"
                label="Password" 
                type="password" 
                fullWidth 
                margin="normal" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading}
                sx={{ mt: 4, bgcolor: "#87A920", padding: "10px 20px", "&:hover": { bgcolor: "#6e8f1a" } }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign up"}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account? 
                <Link style={{ textDecoration: "none", marginLeft: '5px', color: '#87A920' }} to="/login">Login</Link>
              </Typography>
            </Box>

            <Typography sx={{ mt: 3, fontSize: "0.8rem", opacity: "0.5" }}>or Sign up with</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="outlined" sx={{ borderRadius: "20px", color: "black", borderColor: "#87A920" }}>
                <GoogleIcon />
              </Button>
              <Button variant="outlined" sx={{ borderRadius: "20px", color: "black", borderColor: "#87A920" }}>
                <AppleIcon />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Signup;
