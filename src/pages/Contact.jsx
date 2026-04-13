import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  SupportAgent as SupportAgentIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [filter, setFilter] = useState("all");

  // Load issues from localStorage on mount
  useEffect(() => {
    const savedIssues = localStorage.getItem("support_issues");
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    }
  }, []);

  // Save issues to localStorage when they change
  useEffect(() => {
    localStorage.setItem("support_issues", JSON.stringify(issues));
  }, [issues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.description) {
      setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newIssue = {
        id: Date.now(),
        ...formData,
        status: "pending",
        date: new Date().toLocaleString(),
      };

      setIssues((prev) => [newIssue, ...prev]);
      setFormData({ name: "", phone: "", email: "", description: "" });
      setLoading(false);
      setSnackbar({ open: true, message: "Support ticket submitted successfully!", severity: "success" });
    }, 800);
  };

  const handleToggleStatus = (id) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, status: issue.status === "pending" ? "resolved" : "pending" }
          : issue
      )
    );
  };

  const handleDelete = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
    setSnackbar({ open: true, message: "Issue removed", severity: "info" });
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true;
    return issue.status === filter;
  });

  return (
    <Box className="contact-container animate-fade-in">
      <header className="contact-header">
        <SupportAgentIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
        <Typography variant="h1">How can we help you?</Typography>
        <Typography variant="body1">
          Have a question or facing an issue? Send us a message and our team will get back to you soon.
        </Typography>
      </header>

      <div className="contact-grid">
        <form className="contact-form-card" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issue Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Please describe your issue in detail..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <MessageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)",
                  borderRadius: "12px",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Support Request"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

      <Box className="support-section">
        <div className="section-title">
          <Typography variant="h2">Submitted Issues</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["all", "pending", "resolved"].map((f) => (
              <Chip
                key={f}
                label={f.charAt(0).toUpperCase() + f.slice(1)}
                onClick={() => setFilter(f)}
                color={filter === f ? "primary" : "default"}
                variant={filter === f ? "filled" : "outlined"}
                clickable
                icon={f === "all" ? <FilterListIcon /> : undefined}
              />
            ))}
          </Box>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <Typography variant="h4" className="empty-state-icon">
              📭
            </Typography>
            <Typography variant="h6">No issues found</Typography>
            <Typography variant="body2">
              {filter === "all"
                ? "You haven't submitted any support requests yet."
                : `No ${filter} issues matching your criteria.`}
            </Typography>
          </div>
        ) : (
          <div className="issue-list">
            {filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className={`issue-card ${issue.status} animate-fade-in`}
                elevation={0}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <div className="issue-header">
                    <div className="user-info">
                      <span className="user-name">{issue.name}</span>
                      <div className="user-contact">
                        <span>
                          <EmailIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "text-bottom" }} />
                          {issue.email}
                        </span>
                        <span>
                          <PhoneIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "text-bottom" }} />
                          {issue.phone}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`status-badge ${
                        issue.status === "pending" ? "status-pending" : "status-resolved"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <div className="issue-body">{issue.description}</div>

                  <div className="issue-footer">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flexGrow: 1, alignSelf: "center" }}
                    >
                      Submitted on {issue.date}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(issue.id)}
                      title="Remove"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Button
                      size="small"
                      variant={issue.status === "resolved" ? "outlined" : "contained"}
                      color={issue.status === "resolved" ? "inherit" : "success"}
                      startIcon={issue.status === "resolved" ? null : <CheckCircleIcon />}
                      onClick={() => handleToggleStatus(issue.id)}
                    >
                      {issue.status === "resolved" ? "Reopen" : "Mark as Resolved"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
