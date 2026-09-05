import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { apiFetch } from "../../api/client";
import StatusChip from "../../components/ui/StatusChip";

const FoodDonor = () => {
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    foodType: "Fruits",
    quantity: "",
    unit: "kg",
    description: "",
    notes: "",
  });

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const foodTypes = ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Bakery", "Cooked Food", "Other"];
  const units = ["kg", "liter", "pieces", "boxes", "packets"];
  const statuses = ["Pending", "Accepted", "Distributed", "Rejected"];

  // Fetch donations on component load
  useEffect(() => {
    fetchDonations();
  }, []);

  // Fetch all food donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/food-donations");

      if (!response.ok) throw new Error("Failed to fetch donations");

      const data = await response.json();
      setDonations(data.data || []);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or update food donation
  const handleAddDonation = async (e) => {
    e.preventDefault();

    if (!formData.donorName || !formData.donorEmail || !formData.quantity) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/food-donations/${editingId}` : "/api/food-donations";

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save donation");

      setMessage(editingId ? "Donation updated successfully!" : "Food donation added successfully!");
      setMessageType("success");

      // Reset form
      setFormData({
        donorName: "",
        donorEmail: "",
        foodType: "Fruits",
        quantity: "",
        unit: "kg",
        description: "",
        notes: "",
      });
      setEditingId(null);

      // Refresh donations
      fetchDonations();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Edit donation
  const handleEdit = (donation) => {
    setFormData({
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      description: donation.description,
      notes: donation.notes,
    });
    setEditingId(donation._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete donation
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/food-donations/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete donation");

      setMessage("Donation deleted successfully!");
      setMessageType("success");
      setDeleteDialogOpen(false);
      setDeleteId(null);
      fetchDonations();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusChange = async (donationId, newStatus) => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/food-donations/${donationId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setMessage("Status updated successfully!");
      setMessageType("success");
      fetchDonations();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        🍎 Food Donations Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* Add/Edit Form */}
      <Card sx={{ p: 3, mb: 4, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {editingId ? "Edit Donation" : "Add New Food Donation"}
        </Typography>

        <form onSubmit={handleAddDonation}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Donor Name *"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                placeholder="Enter donor name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Donor Email *"
                name="donorEmail"
                type="email"
                value={formData.donorEmail}
                onChange={handleInputChange}
                placeholder="Enter donor email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Food Type *</InputLabel>
                <Select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleInputChange}
                  label="Food Type *"
                >
                  {foodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Quantity *"
                name="quantity"
                type="number"
                inputProps={{ step: "0.1", min: "0" }}
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  label="Unit"
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add details about the food (e.g., expiry date, packaging)"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : editingId ? "Update Donation" : "Add Donation"}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        donorName: "",
                        donorEmail: "",
                        foodType: "Fruits",
                        quantity: "",
                        unit: "kg",
                        description: "",
                        notes: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* Donations Table */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          📋 All Food Donations ({donations.length})
        </Typography>

        {loading && !editingId ? (
          <Box sx={{ py: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height={52} sx={{ my: 0.5 }} />
            ))}
          </Box>
        ) : donations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>No food donations yet</Typography>
            <Typography color="text.secondary">Add one above to get started!</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "background.default" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Donor Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Food Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation._id} hover>
                    <TableCell>{donation.donorName}</TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell>{donation.foodType}</TableCell>
                    <TableCell>
                      {donation.quantity} {donation.unit}
                    </TableCell>
                    <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={donation.status}
                          onChange={(e) => handleStatusChange(donation._id, e.target.value)}
                          renderValue={(value) => (
                            <StatusChip status={value} sx={{ pointerEvents: "none" }} />
                          )}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(donation)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(donation._id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Donation?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this food donation? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodDonor;
