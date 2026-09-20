import React, { useState } from "react";
import { Grid, TextField, Button, Box, Typography, Alert, CircularProgress, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// Mirrors the backend's actual password policy (authValidators.js): min 6 chars,
// at least one letter and one number — shown here so users get the real rule,
// not a stricter or looser one that would just surface as a server error later.
const isValidPassword = (value) => value.length >= 6 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "donor" });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const errors = {
    name: touched.name && !formData.name.trim() ? "Please enter your name" : "",
    email: touched.email && !isValidEmail(formData.email) ? "Enter a valid email address" : "",
    password: touched.password && !isValidPassword(formData.password)
      ? "At least 6 characters, with a letter and a number"
      : "",
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    setError("");

    if (!formData.name.trim() || !isValidEmail(formData.email) || !isValidPassword(formData.password)) return;

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      login(data.user, data.token, data.refreshToken);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Illustrative panel */}
      <Grid
        item xs={12} md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "flex-end",
          position: "relative",
          backgroundImage: "url(/food3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 6,
        }}
      >
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(36,31,27,0.75), rgba(36,31,27,0.05))",
        }} />
        <Box sx={{ position: "relative", color: "#fff" }}>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 1 }}>
            Join a network already feeding thousands.
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>
            Sign up in under a minute — no paperwork, just impact.
          </Typography>
        </Box>
      </Grid>

      {/* Form panel */}
      <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          <Typography
            component={Link} to="/"
            sx={{
              display: "block", mb: 4, fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "1.75rem", color: "text.primary", textDecoration: "none",
            }}
          >
            Share<span style={{ color: "#E2672B" }}>2</span>serve
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Create an account</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>Start donating or receiving food in minutes.</Typography>

          {error && (
            <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignup} noValidate>
            <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>I am signing up as a</Typography>
            <ToggleButtonGroup
              value={formData.role}
              exclusive
              fullWidth
              onChange={(e, value) => value && setFormData((prev) => ({ ...prev, role: value }))}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="donor">Food Donor</ToggleButton>
              <ToggleButton value="charity">Charity</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              name="name" label="Full name" fullWidth margin="normal"
              value={formData.name} onChange={handleChange}
              onBlur={() => handleBlur("name")}
              error={!!errors.name} helperText={errors.name}
            />
            <TextField
              name="email" label="Email" fullWidth margin="normal"
              value={formData.email} onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={!!errors.email} helperText={errors.email}
            />
            <TextField
              name="password" label="Password" type="password" fullWidth margin="normal"
              value={formData.password} onChange={handleChange}
              onBlur={() => handleBlur("password")}
              error={!!errors.password}
              helperText={errors.password || "At least 6 characters, with a letter and a number"}
            />

            <Button
              type="submit" variant="contained" color="primary" fullWidth
              disabled={loading}
              sx={{ mt: 3, py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign up"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link style={{ color: "#E2672B", fontWeight: 600 }} to="/login">Login</Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">or continue with</Typography>
          </Divider>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button fullWidth variant="outlined" color="inherit" startIcon={<GoogleIcon />} sx={{ borderColor: "divider" }}>
              Google
            </Button>
            <Button fullWidth variant="outlined" color="inherit" startIcon={<AppleIcon />} sx={{ borderColor: "divider" }}>
              Apple
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
