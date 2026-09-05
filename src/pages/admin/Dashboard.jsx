import React from "react";
import { Grid, Paper, Typography, Box, Avatar } from "@mui/material";
import { People, Fastfood, PendingActions } from "@mui/icons-material";
import CountUp from "../../components/ui/CountUp";

const metrics = [
  { label: "Total Donors", value: 128, icon: <People />, color: "#E2672B" },
  { label: "Food Donated", value: 452, suffix: " kg", icon: <Fastfood />, color: "#7C9A3C" },
  { label: "Active Requests", value: 15, icon: <PendingActions />, color: "#2F6F82" },
];

const activity = [
  { text: 'New donation from "Green Grocers"', time: "5 mins ago" },
  { text: '"Helping Hands" request approved', time: "20 mins ago" },
  { text: 'New donor signed up: "City Bakery"', time: "1 hour ago" },
];

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {metrics.map((m) => (
          <Grid item xs={12} md={4} key={m.label}>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: `${m.color}1A`, color: m.color, width: 56, height: 56 }}>
                {m.icon}
              </Avatar>
              <Box>
                <CountUp end={m.value} suffix={m.suffix || ""} variant="h4" sx={{ color: m.color }} />
                <Typography variant="body2" color="text.secondary">{m.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <Paper sx={{ p: 1 }}>
          {activity.map((a, i) => (
            <Box
              key={a.text}
              sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                px: 2, py: 1.5,
                borderBottom: i < activity.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2">{a.text}</Typography>
              <Typography variant="caption" color="text.secondary">{a.time}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
