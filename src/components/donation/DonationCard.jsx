import React, { useState, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  CheckCircle as CheckIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import StatusChip from "../ui/StatusChip";

const DIETARY_LABELS = { veg: "Vegetarian", "non-veg": "Non-Vegetarian", both: "Both" };

// ==========================================
//  LazyImage
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
//  ImageCarousel
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
//  DonationCard
// ==========================================
const DonationCard = ({ donation, index, footerAction, busy }) => {
  const dietaryClass = (donation.dietaryType || "").toLowerCase().startsWith("non")
    ? "non-veg"
    : donation.dietaryType === "Both"
    ? "both"
    : "veg";

  return (
    <div className="donation-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <ImageCarousel images={donation.images} />

      <div className="card-body">
        <div className="card-top-row">
          <h3 className="card-food-name">{donation.foodName || donation.foodType}</h3>
          <span className={`food-type-tag ${dietaryClass}`}>
            {dietaryClass === "veg" && "🥬 "}
            {dietaryClass === "non-veg" && "🍗 "}
            {dietaryClass === "both" && "🍱 "}
            {DIETARY_LABELS[dietaryClass]}
          </span>
        </div>

        <div className="card-info">
          <div className="card-info-row">
            <PeopleIcon />
            <span><strong>{donation.quantity}</strong> {donation.unit}</span>
          </div>
          {donation.address && (
            <div className="card-info-row">
              <LocationIcon />
              <span>{donation.address}</span>
            </div>
          )}
          <div className="card-info-row">
            <TimeIcon />
            <span>{donation.timeSlot ? new Date(donation.timeSlot).toLocaleString() : "Flexible"}</span>
          </div>
        </div>

        {donation.description && <div className="card-notes">"{donation.description}"</div>}
        {donation.notes && <div className="card-notes">"{donation.notes}"</div>}

        <div className="card-footer" style={{ justifyContent: footerAction ? "space-between" : "flex-start" }}>
          <StatusChip status={donation.status} />
          {footerAction && (
            <button
              className="collect-btn mark-collected"
              disabled={busy}
              onClick={footerAction.onClick}
            >
              {busy ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <>
                  <CheckIcon sx={{ fontSize: 18 }} />
                  {footerAction.label}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
