import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TextField,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Notes as NotesIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Send as SendIcon,
  Fastfood as FastfoodIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import DonationCard from "../components/donation/DonationCard";
import "./Donate.css";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 1.4 * 1024 * 1024; // stays under the backend's base64 size cap

const emptyForm = {
  donorPhone: "",
  dietaryType: "veg",
  foodName: "",
  quantity: "",
  address: "",
  timeSlot: "",
  notes: "",
};

const DIETARY_TO_BACKEND = { veg: "Vegetarian", "non-veg": "Non-Vegetarian", both: "Both" };

const Donate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [donations, setDonations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const fetchMine = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await apiFetch("/api/food-donations/mine");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your donations");
      setDonations(data.data || []);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_IMAGE_BYTES);

    if (validFiles.length !== fileArray.length) {
      notify("Some files were skipped — only JPG/PNG/WebP under ~1.4MB are accepted.", "warning");
    }

    const totalAfter = selectedImages.length + validFiles.length;
    const filesToAdd = validFiles.slice(0, MAX_IMAGES - selectedImages.length);
    if (totalAfter > MAX_IMAGES) {
      notify(`Maximum ${MAX_IMAGES} images allowed.`, "warning");
    }
    if (filesToAdd.length === 0) return;

    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 80);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...filesToAdd]);
    setTimeout(() => setUploadProgress(0), 1200);
  }, [selectedImages]);

  const handleFileSelect = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.donorPhone.trim()) return notify("Please enter your phone number", "error");
    if (!formData.foodName.trim()) return notify("Please enter the food name", "error");
    if (!formData.quantity || Number(formData.quantity) <= 0) return notify("Please enter a valid quantity", "error");
    if (!formData.address.trim()) return notify("Please enter the pickup address", "error");

    try {
      setSubmitting(true);
      const res = await apiFetch("/api/food-donations", {
        method: "POST",
        body: JSON.stringify({
          foodName: formData.foodName.trim(),
          dietaryType: DIETARY_TO_BACKEND[formData.dietaryType],
          quantity: Number(formData.quantity),
          unit: "kg",
          donorPhone: formData.donorPhone.trim(),
          address: formData.address.trim(),
          timeSlot: formData.timeSlot ? new Date(formData.timeSlot).toISOString() : undefined,
          notes: formData.notes.trim(),
          images: imagePreviews,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit donation");

      setFormData(emptyForm);
      setSelectedImages([]);
      setImagePreviews([]);
      setShowSuccess(true);
      fetchMine();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donate-page">
      <header className="donate-hero">
        <div className="donate-hero-icon"><FastfoodIcon /></div>
        <h1>Donate Food, Share Love</h1>
        <p>Your surplus food can fill someone's plate. Fill the form below to donate and make a difference today.</p>
      </header>

      <div className="donate-content">
        <section className="donate-form-section">
          <form className="donate-form-card" onSubmit={handleSubmit} noValidate>
            <div className="form-section-label">Donor Information</div>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Full Name" value={user?.name || ""} disabled
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Phone Number" name="donorPhone" type="tel"
                  value={formData.donorPhone} onChange={handleChange} required
                  placeholder="+91 98765 43210"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Email Address" value={user?.email || ""} disabled
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            <div className="form-section-label">Food Details</div>
            <div style={{ marginBottom: 24 }}>
              <div className="food-type-group">
                {[
                  { value: "veg", emoji: "🥬", label: "Vegetarian" },
                  { value: "non-veg", emoji: "🍗", label: "Non-Vegetarian" },
                  { value: "both", emoji: "🍱", label: "Both" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`food-type-btn ${formData.dietaryType === type.value ? "active" : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, dietaryType: type.value }))}
                  >
                    <span className="food-type-emoji">{type.emoji}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Food Name / Title" name="foodName"
                  value={formData.foodName} onChange={handleChange} required
                  placeholder="e.g., Biryani, Pasta, Sandwiches"
                  InputProps={{ startAdornment: <InputAdornment position="start"><RestaurantIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Quantity (serves how many)" name="quantity" type="number"
                  value={formData.quantity} onChange={handleChange} required
                  placeholder="e.g., 25" inputProps={{ min: 1 }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            <div className="form-section-label">Pickup Details</div>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Pickup Address" name="address"
                  value={formData.address} onChange={handleChange} required
                  placeholder="Enter complete address for pickup"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Available Time Slot" name="timeSlot" type="datetime-local"
                  value={formData.timeSlot} onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><TimeIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Additional Notes (Optional)" name="notes"
                  value={formData.notes} onChange={handleChange} multiline rows={1}
                  placeholder="Any special instructions..."
                  InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}><NotesIcon sx={{ color: "#E2672B" }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            <div className="form-section-label">Food Images</div>
            <div
              className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button" tabIndex={0} aria-label="Upload food images"
            >
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleFileSelect} />
              <div className="upload-zone-icon"><UploadIcon /></div>
              <h4>Drag & drop images here</h4>
              <p>
                or click to browse · JPG, PNG, WebP · Max {MAX_IMAGES} images
                {selectedImages.length > 0 && ` · ${selectedImages.length}/${MAX_IMAGES} selected`}
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="image-preview-item">
                    <img src={src} alt={`Preview ${i + 1}`} />
                    <button type="button" className="image-remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(i); }} aria-label={`Remove image ${i + 1}`}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="donate-submit-btn" disabled={submitting}>
              {submitting ? <div className="spinner" /> : <><SendIcon sx={{ fontSize: 22 }} />Submit Donation</>}
            </button>
          </form>
        </section>

        <div className="section-divider">
          <div className="divider-line" /><div className="divider-icon">🍽️</div><div className="divider-line" />
        </div>

        <section className="donations-section">
          <div className="donations-header">
            <h2><InventoryIcon sx={{ color: "#E2672B", fontSize: 32 }} />My Donations<span className="count-badge">{donations.length}</span></h2>
          </div>

          {loadingList ? (
            <CircularProgress size={28} />
          ) : donations.length === 0 ? (
            <div className="empty-donations animate-fade">
              <span className="empty-icon">🍲</span>
              <h3>No donations yet</h3>
              <p>Be the first to share surplus food and make a difference!</p>
            </div>
          ) : (
            <div className="donation-cards-grid">
              {donations.map((d, i) => <DonationCard key={d._id} donation={d} index={i} />)}
            </div>
          )}
        </section>
      </div>

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-checkmark"><CheckIcon /></div>
            <h3>Donation Submitted!</h3>
            <p>Thank you for your generosity. Your food donation is now pending review from a charity.</p>
            <button onClick={() => setShowSuccess(false)}>Continue</button>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "14px", fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Donate;
