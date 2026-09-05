import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import { apiFetch } from "../api/client";

const Charity = () => {
  const [charities, setCharities] = useState([]);
  const [foodDonations, setFoodDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [adminMode, setAdminMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const categories = ["Food", "Education", "Healthcare", "Housing", "Disaster Relief", "Other"];

  // Fetch charities
  useEffect(() => {
    fetchCharities();
    fetchFoodDonations();
  }, [category, sortBy]);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      let url = "/api/charities?";

      if (category) url += `category=${category}&`;
      if (sortBy) url += `sortBy=${sortBy}`;

      const response = await apiFetch(url);
      if (!response.ok) throw new Error("Failed to fetch charities");

      const data = await response.json();
      setCharities(data.data || []);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodDonations = async () => {
    try {
      setLoadingDonations(true);
      const response = await apiFetch("/api/food-donations/available");
      if (!response.ok) throw new Error("Failed to fetch food donations");

      const data = await response.json();
      setFoodDonations(data.data || []);
    } catch (error) {
      console.error("Error fetching food donations:", error);
      setFoodDonations([]);
    } finally {
      setLoadingDonations(false);
    }
  };

  // Open charity details
  const handleViewDetails = (charity) => {
    setSelectedCharity(charity);
    setModalOpen(true);
  };

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = JSON.parse(atob(token.split(".")[1]));
        setAdminMode(user.role === "admin");
      } catch {
        setAdminMode(false);
      }
    }
  }, []);

  // Handle edit
  const handleEdit = (charity) => {
    setEditForm(charity);
    setEditModalOpen(true);
    setModalOpen(false);
  };

  // Save edited charity
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/charities/${editForm._id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update charity");

      setMessage("Charity updated successfully!");
      setMessageType("success");
      setEditModalOpen(false);
      fetchCharities();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (charityId) => {
    if (!window.confirm("Are you sure you want to delete this charity?")) return;

    try {
      setLoading(true);
      const response = await apiFetch(`/api/charities/${charityId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete charity");

      setMessage("Charity deleted successfully!");
      setMessageType("success");
      setModalOpen(false);
      fetchCharities();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          🤝 Partner Charities & NGOs
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore our trusted partner organizations making a real difference in communities
        </Typography>
      </Box>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="mostHelped">Most People Helped</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Charities Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : charities.length === 0 ? (
        <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
          No charities found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {charities.map((charity) => (
            <Grid item xs={12} sm={6} md={4} key={charity._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.3s, boxShadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleViewDetails(charity)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={charity.image}
                  alt={charity.name}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Name */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", minHeight: "60px" }}>
                    {charity.name}
                  </Typography>

                  {/* Category Badge */}
                  <Box sx={{ mb: 1 }}>
                    <Chip label={charity.category} size="small" color="primary" variant="outlined" />
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Rating value={charity.rating} readOnly precision={0.1} size="small" />
                    <Typography variant="body2" color="textSecondary">
                      {charity.rating} ({charity.reviews})
                    </Typography>
                  </Box>

                  {/* Certified Badge */}
                  {charity.certified && (
                    <Chip
                      label="✓ Certified"
                      size="small"
                      sx={{ backgroundColor: "#4caf50", color: "white", mb: 1 }}
                    />
                  )}

                  {/* Description Preview */}
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, height: "60px", overflow: "hidden" }}>
                    {charity.description}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Est.
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {charity.yearEstablished}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Helped
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {(charity.peopleHelped / 1000).toFixed(1)}K+
                      </Typography>
                    </Box>
                  </Box>

                  {/* View Details Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(charity);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Available Food Donations Section */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#B1DD2B" }}>
            🍽️ Available Food Donations
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Browse available food donations that charities can request
          </Typography>
        </Box>

        {loadingDonations ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : foodDonations.length === 0 ? (
          <Card sx={{ p: 3 }}>
            <Typography align="center" color="textSecondary">
              No food donations currently available
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {foodDonations.map((donation) => (
              <Grid item xs={12} sm={6} md={4} key={donation._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, boxShadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Donation Type Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {donation.foodType}
                      </Typography>
                      <Chip
                        label={donation.status}
                        size="small"
                        color={donation.status === "Pending" ? "warning" : "success"}
                        variant="outlined"
                      />
                    </Box>

                    {/* Donor Information */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Donor
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "500" }}>
                        {donation.donorName}
                      </Typography>
                    </Box>

                    {/* Quantity */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Available Quantity
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#B1DD2B" }}>
                        {donation.quantity} {donation.unit}
                      </Typography>
                    </Box>

                    {/* Description */}
                    {donation.description && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          Details
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {donation.description.substring(0, 100)}
                          {donation.description.length > 100 ? "..." : ""}
                        </Typography>
                      </Box>
                    )}

                    {/* Donation Date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Posted:
                      </Typography>
                      <Typography variant="caption">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* Contact Donor */}
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        {donation.donorEmail}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Details Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        {selectedCharity && (
          <>
            <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white", fontWeight: "bold" }}>
              {selectedCharity.name}
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {/* Image */}
              <Box
                component="img"
                src={selectedCharity.image}
                alt={selectedCharity.name}
                sx={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: 1, mb: 2 }}
              />

              {/* Rating & Certification */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box>
                  <Rating value={selectedCharity.rating} readOnly precision={0.1} />
                  <Typography variant="body2">
                    {selectedCharity.rating} out of 5 ({selectedCharity.reviews} reviews)
                  </Typography>
                </Box>
                {selectedCharity.certified && (
                  <Chip label="✓ Certified" sx={{ backgroundColor: "#4caf50", color: "white" }} />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Category & Years */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {selectedCharity.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Established
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {selectedCharity.yearEstablished}
                  </Typography>
                </Grid>
              </Grid>

              {/* Mission */}
              <Typography variant="caption" color="textSecondary">
                Mission
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
                "{selectedCharity.mission}"
              </Typography>

              {/* Description */}
              <Typography variant="caption" color="textSecondary">
                About
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedCharity.description}
              </Typography>

              {/* Contact Information */}
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                Contact Information
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body2">{selectedCharity.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2">{selectedCharity.phone}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <LocationIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {selectedCharity.address}, {selectedCharity.city} {selectedCharity.zipCode}
                </Typography>
              </Box>

              {/* Social Links */}
              {selectedCharity.socialLinks && Object.keys(selectedCharity.socialLinks).some((k) => selectedCharity.socialLinks[k]) && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {selectedCharity.socialLinks.facebook && (
                      <Button
                        size="small"
                        startIcon={<FacebookIcon />}
                        href={`https://facebook.com/${selectedCharity.socialLinks.facebook}`}
                        target="_blank"
                      >
                        Facebook
                      </Button>
                    )}
                    {selectedCharity.socialLinks.twitter && (
                      <Button
                        size="small"
                        startIcon={<TwitterIcon />}
                        href={`https://twitter.com/${selectedCharity.socialLinks.twitter}`}
                        target="_blank"
                      >
                        Twitter
                      </Button>
                    )}
                    {selectedCharity.socialLinks.instagram && (
                      <Button
                        size="small"
                        startIcon={<InstagramIcon />}
                        href={`https://instagram.com/${selectedCharity.socialLinks.instagram}`}
                        target="_blank"
                      >
                        Instagram
                      </Button>
                    )}
                  </Box>
                </>
              )}

              {/* Stats */}
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                Impact
              </Typography>
              <Typography variant="body2">
                ✨ <strong>{selectedCharity.peopleHelped.toLocaleString()}</strong> people helped
              </Typography>

              {/* Website Button */}
              {selectedCharity.website && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<OpenIcon />}
                  href={selectedCharity.website}
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  Visit Website
                </Button>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              {adminMode && (
                <>
                  <Button
                    onClick={() => handleEdit(selectedCharity)}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedCharity._id)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Charity</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editForm && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
              />
              <TextField
                fullWidth
                label="People Helped"
                type="number"
                value={editForm.peopleHelped}
                onChange={(e) => setEditForm({ ...editForm, peopleHelped: parseInt(e.target.value) })}
              />
              <TextField
                fullWidth
                label="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Charity;
