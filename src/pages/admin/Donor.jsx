import React, { useState, useEffect } from "react";
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box, Alert, Chip, Skeleton,
} from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";

const Donor = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await apiFetch("/api/donors");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch donors");
        }

        setDonors(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonors();
    }
  }, [token]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Donors List</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((__, j) => (
                    <TableCell key={j}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : donors.length > 0 ? (
              donors.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === "Active" ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <PeopleOutline sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                    <Typography color="text.secondary">No donors yet</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Donor;
