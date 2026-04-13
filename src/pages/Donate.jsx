import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
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
  PhotoCamera as CameraIcon,
  CheckCircle as CheckIcon,
  Send as SendIcon,
  Fastfood as FastfoodIcon,
  Collections as CollectionsIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import "./Donate.css";

// ==========================================
//  STORAGE KEY
// ==========================================
const STORAGE_KEY = "food_donations";

// ==========================================
//  Helper: Mask sensitive info for privacy
// ==========================================
const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 2) + "****" + phone.slice(-2);
};

const maskEmail = (email) => {
  if (!email) return email;
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return user.slice(0, 2) + "***@" + domain;
};

// ==========================================
//  LazyImage Component
// ==========================================
const LazyImage = ({ src, alt, className = "" }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={`lazy-image ${loaded ? "loaded" : ""} ${className}`}
      onLoad={() => setLoaded(true)}
      data-src={src}
    />
  );
};

// ==========================================
//  ImageCarousel Component
// ==========================================
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="card-carousel">
        <div className="no-image-placeholder">
          <CameraIcon />
          <span style={{ fontSize: "0.85rem" }}>No image available</span>
        </div>
      </div>
    );
  }

  const goTo = (index) => setCurrentIndex(index);
  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="card-carousel">
      <LazyImage src={images[currentIndex]} alt="Food donation" />

      {images.length > 1 && (
        <>
          <button className="carousel-btn prev" onClick={goPrev} aria-label="Previous image">
            <PrevIcon fontSize="small" />
          </button>
          <button className="carousel-btn next" onClick={goNext} aria-label="Next image">
            <NextIcon fontSize="small" />
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentIndex ? "active" : ""}`}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          <div className="image-count-badge">
            <CameraIcon sx={{ fontSize: 14 }} />
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

// ==========================================
//  DonationCard Component
// ==========================================
const DonationCard = ({ donation, index, onToggleStatus }) => {
  const foodTypeClass = donation.foodType?.toLowerCase().replace("-", "-") || "veg";

  return (
    <div className="donation-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <ImageCarousel images={donation.images} />

      <div className="card-body">
        {/* Title + Food Type */}
        <div className="card-top-row">
          <h3 className="card-food-name">{donation.foodName}</h3>
          <span className={`food-type-tag ${foodTypeClass}`}>
            {donation.foodType === "veg" && "🥬 "}
            {donation.foodType === "non-veg" && "🍗 "}
            {donation.foodType === "both" && "🍱 "}
            {donation.foodType === "veg" ? "Veg" : donation.foodType === "non-veg" ? "Non-Veg" : "Both"}
          </span>
        </div>

        {/* Info Rows */}
        <div className="card-info">
          <div className="card-info-row">
            <PeopleIcon />
            <span>Serves <strong>{donation.quantity}</strong> people</span>
          </div>
          <div className="card-info-row">
            <LocationIcon />
            <span>{donation.address}</span>
          </div>
          <div className="card-info-row">
            <TimeIcon />
            <span>{donation.timeSlot ? new Date(donation.timeSlot).toLocaleString() : "Flexible"}</span>
          </div>
        </div>

        {/* Notes */}
        {donation.notes && (
          <div className="card-notes">"{donation.notes}"</div>
        )}

        {/* Status */}
        <div style={{ marginBottom: 14 }}>
          <span className={`status-chip ${donation.status}`}>
            <span className="status-dot" />
            {donation.status === "available" ? "Available" : "Collected"}
          </span>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="donor-info-mini">
            <div className="donor-avatar">
              {donation.donorName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="donor-details">
              <div className="donor-name">{donation.donorName}</div>
              <div className="donor-contact">
                {maskPhone(donation.phone)} · {maskEmail(donation.email)}
              </div>
            </div>
          </div>
          <button
            className={`collect-btn ${donation.status === "available" ? "mark-collected" : "undo-collected"}`}
            onClick={() => onToggleStatus(donation.id)}
          >
            {donation.status === "available" ? (
              <>
                <CheckIcon sx={{ fontSize: 18 }} />
                Mark Collected
              </>
            ) : (
              "↩ Undo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
//  MAIN: Donate Page Component
// ==========================================
const Donate = () => {
  // ----- Form State -----
  const [formData, setFormData] = useState({
    donorName: "",
    phone: "",
    email: "",
    foodType: "veg",
    foodName: "",
    quantity: "",
    address: "",
    timeSlot: "",
    notes: "",
  });

  // ----- Image State -----
  const [selectedImages, setSelectedImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Base64 strings
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ----- Donations State -----
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");

  // ----- UI State -----
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ----- Load from localStorage -----
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDonations(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load donations from storage:", e);
    }
  }, []);

  // ----- Save to localStorage -----
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    } catch (e) {
      console.error("Failed to save donations:", e);
    }
  }, [donations]);

  // ==========================================
  //  Form Handlers
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ==========================================
  //  Image Upload Handlers
  // ==========================================
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const MAX_IMAGES = 5;

  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((f) => ACCEPTED_TYPES.includes(f.type));

    if (validFiles.length !== fileArray.length) {
      setSnackbar({
        open: true,
        message: "Some files were skipped. Only JPG, PNG, and WebP are accepted.",
        severity: "warning",
      });
    }

    const totalAfter = selectedImages.length + validFiles.length;
    if (totalAfter > MAX_IMAGES) {
      setSnackbar({
        open: true,
        message: `Maximum ${MAX_IMAGES} images allowed. ${totalAfter - MAX_IMAGES} file(s) were skipped.`,
        severity: "warning",
      });
    }

    const filesToAdd = validFiles.slice(0, MAX_IMAGES - selectedImages.length);
    if (filesToAdd.length === 0) return;

    // Simulate upload progress
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

    // Generate previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...filesToAdd]);

    // Reset progress after animation
    setTimeout(() => setUploadProgress(0), 1200);
  }, [selectedImages]);

  const handleFileSelect = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = ""; // Reset so same file can be re-selected
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================================
  //  Submit Handler
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.donorName.trim()) {
      setSnackbar({ open: true, message: "Please enter your name", severity: "error" });
      return;
    }
    if (!formData.phone.trim()) {
      setSnackbar({ open: true, message: "Please enter your phone number", severity: "error" });
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
      return;
    }
    if (!formData.foodName.trim()) {
      setSnackbar({ open: true, message: "Please enter the food name", severity: "error" });
      return;
    }
    if (!formData.quantity || Number(formData.quantity) < 1) {
      setSnackbar({ open: true, message: "Please enter a valid serving quantity", severity: "error" });
      return;
    }
    if (!formData.address.trim()) {
      setSnackbar({ open: true, message: "Please enter the pickup address", severity: "error" });
      return;
    }

    setLoading(true);

    // Simulate backend delay
    setTimeout(() => {
      const newDonation = {
        id: Date.now().toString(),
        donorName: formData.donorName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        foodType: formData.foodType,
        foodName: formData.foodName.trim(),
        quantity: formData.quantity,
        address: formData.address.trim(),
        timeSlot: formData.timeSlot,
        notes: formData.notes.trim(),
        images: imagePreviews, // Store base64 for demo
        status: "available",
        createdAt: new Date().toISOString(),
      };

      setDonations((prev) => [newDonation, ...prev]);

      // Reset form
      setFormData({
        donorName: "",
        phone: "",
        email: "",
        foodType: "veg",
        foodName: "",
        quantity: "",
        address: "",
        timeSlot: "",
        notes: "",
      });
      setSelectedImages([]);
      setImagePreviews([]);
      setLoading(false);
      setShowSuccess(true);
    }, 1000);
  };

  // ==========================================
  //  Status Toggle
  // ==========================================
  const toggleStatus = (id) => {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "available" ? "collected" : "available" }
          : d
      )
    );
    setSnackbar({
      open: true,
      message: "Status updated successfully!",
      severity: "success",
    });
  };

  // ==========================================
  //  Filter
  // ==========================================
  const filteredDonations = donations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  // ==========================================
  //  Render
  // ==========================================
  return (
    <div className="donate-page">
      {/* ===== HERO ===== */}
      <header className="donate-hero">
        <div className="donate-hero-icon">
          <FastfoodIcon />
        </div>
        <h1>Donate Food, Share Love</h1>
        <p>
          Your surplus food can fill someone's plate. Fill the form below to donate and make a difference today.
        </p>
      </header>

      <div className="donate-content">
        {/* ===== DONATION FORM ===== */}
        <section className="donate-form-section">
          <form className="donate-form-card" onSubmit={handleSubmit} noValidate>
            {/* --- Donor Information --- */}
            <div className="form-section-label">Donor Information</div>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#6C63FF" }} />
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
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#6C63FF" }} />
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
                  placeholder="john@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* --- Food Details --- */}
            <div className="form-section-label">Food Details</div>

            {/* Food Type Toggle */}
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
                    className={`food-type-btn ${formData.foodType === type.value ? "active" : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, foodType: type.value }))}
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
                  fullWidth
                  label="Food Name / Title"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Biryani, Pasta, Sandwiches"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RestaurantIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity (serves how many)"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 25"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* --- Pickup Details --- */}
            <div className="form-section-label">Pickup Details</div>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pickup Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter complete address for pickup"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Available Time Slot"
                  name="timeSlot"
                  type="datetime-local"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={1}
                  placeholder="Any special instructions..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                        <NotesIcon sx={{ color: "#6C63FF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* --- Image Upload --- */}
            <div className="form-section-label">Food Images</div>
            <div
              className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload food images"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFileSelect}
              />
              <div className="upload-zone-icon">
                <UploadIcon />
              </div>
              <h4>Drag & drop images here</h4>
              <p>
                or click to browse · JPG, PNG, WebP · Max {MAX_IMAGES} images
                {selectedImages.length > 0 && ` · ${selectedImages.length}/${MAX_IMAGES} selected`}
              </p>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="image-preview-item">
                    <img src={src} alt={`Preview ${i + 1}`} />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      aria-label={`Remove image ${i + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="donate-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <SendIcon sx={{ fontSize: 22 }} />
                  Submit Donation
                </>
              )}
            </button>
          </form>
        </section>

        {/* ===== SECTION DIVIDER ===== */}
        <div className="section-divider">
          <div className="divider-line" />
          <div className="divider-icon">🍽️</div>
          <div className="divider-line" />
        </div>

        {/* ===== DONATIONS LIST ===== */}
        <section className="donations-section">
          <div className="donations-header">
            <h2>
              <InventoryIcon sx={{ color: "#6C63FF", fontSize: 32 }} />
              All Donations
              <span className="count-badge">{donations.length}</span>
            </h2>
            <div className="filter-chips">
              {[
                { value: "all", label: "🔥 All" },
                { value: "available", label: "🟠 Available" },
                { value: "collected", label: "🟢 Collected" },
              ].map((f) => (
                <button
                  key={f.value}
                  className={`filter-chip ${filter === f.value ? "active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="empty-donations animate-fade">
              <span className="empty-icon">
                {filter === "all" ? "🍲" : filter === "available" ? "📦" : "✅"}
              </span>
              <h3>
                {filter === "all"
                  ? "No donations yet"
                  : filter === "available"
                  ? "No available donations"
                  : "No collected donations"}
              </h3>
              <p>
                {filter === "all"
                  ? "Be the first to share surplus food and make a difference!"
                  : `No donations with "${filter}" status at the moment.`}
              </p>
            </div>
          ) : (
            <div className="donation-cards-grid">
              {filteredDonations.map((donation, i) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  index={i}
                  onToggleStatus={toggleStatus}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-checkmark">
              <CheckIcon />
            </div>
            <h3>Donation Submitted!</h3>
            <p>
              Thank you for your generosity. Your food donation has been listed
              and is now visible to charities and volunteers.
            </p>
            <button onClick={() => setShowSuccess(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ===== SNACKBAR ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
