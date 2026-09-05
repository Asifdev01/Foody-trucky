import React, { useState } from "react";
import { Grid, TextField, Button, Box, Typography, Alert, CircularProgress, Divider } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailError = touched.email && !isValidEmail(email) ? "Enter a valid email address" : "";
  const passwordError = touched.password && !password ? "Password is required" : "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");

    if (!isValidEmail(email) || !password) return;

    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
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
            Every meal starts with someone who cares.
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>
            Log in to track your donations and see the impact you're making.
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

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Welcome back</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>Log in to continue making an impact.</Typography>

          {error && (
            <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} noValidate>
            <TextField
              label="Email" fullWidth margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password" type="password" fullWidth margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={!!passwordError}
              helperText={passwordError}
            />

            <Typography sx={{ cursor: "pointer", fontSize: "0.8rem", textAlign: "right", color: "text.secondary", mt: 1 }}>
              forgot password?
            </Typography>

            <Button
              type="submit" variant="contained" color="primary" fullWidth
              disabled={loading}
              sx={{ mt: 3, py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link style={{ color: "#E2672B", fontWeight: 600 }} to="/signup">Sign up</Link>
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

export default LoginPage;
