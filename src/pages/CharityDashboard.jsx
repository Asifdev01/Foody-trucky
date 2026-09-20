import React, { useState, useEffect, useCallback } from "react";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { VolunteerActivism as VolunteerIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import DonationCard from "../components/donation/DonationCard";
import "./Donate.css";

const CharityDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const fetchAvailable = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/food-donations/available");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load donations");
      setDonations(data.data || []);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAvailable(); }, [fetchAvailable]);

  const act = async (id, action, successMsg) => {
    try {
      setBusyId(id);
      const res = await apiFetch(`/api/food-donations/${id}/${action}`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action} donation`);
      notify(successMsg, "success");
      fetchAvailable();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const currentUserId = user?.id || user?._id;
  const pending = donations.filter((d) => d.status === "Pending");
  const mine = donations.filter((d) => d.status === "Accepted" && String(d.charity) === String(currentUserId));

  return (
    <div className="donate-page">
      <header className="donate-hero">
        <div className="donate-hero-icon"><VolunteerIcon /></div>
        <h1>Rescue Surplus Food</h1>
        <p>Accept available donations and track what your organization has collected.</p>
      </header>

      <div className="donate-content">
        {loading ? (
          <CircularProgress size={28} />
        ) : (
          <>
            <section className="donations-section">
              <div className="donations-header">
                <h2><InventoryIcon sx={{ color: "#E2672B", fontSize: 32 }} />Available Donations<span className="count-badge">{pending.length}</span></h2>
              </div>
              {pending.length === 0 ? (
                <div className="empty-donations animate-fade">
                  <span className="empty-icon">📦</span>
                  <h3>No available donations</h3>
                  <p>Check back soon — new donations show up here as donors submit them.</p>
                </div>
              ) : (
                <div className="donation-cards-grid">
                  {pending.map((d, i) => (
                    <DonationCard
                      key={d._id} donation={d} index={i} busy={busyId === d._id}
                      footerAction={{ label: "Accept", onClick: () => act(d._id, "accept", "Donation accepted.") }}
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="section-divider">
              <div className="divider-line" /><div className="divider-icon">✅</div><div className="divider-line" />
            </div>

            <section className="donations-section">
              <div className="donations-header">
                <h2><InventoryIcon sx={{ color: "#E2672B", fontSize: 32 }} />My Accepted Donations<span className="count-badge">{mine.length}</span></h2>
              </div>
              {mine.length === 0 ? (
                <div className="empty-donations animate-fade">
                  <span className="empty-icon">✅</span>
                  <h3>No accepted donations</h3>
                  <p>Donations you accept will appear here until marked distributed.</p>
                </div>
              ) : (
                <div className="donation-cards-grid">
                  {mine.map((d, i) => (
                    <DonationCard
                      key={d._id} donation={d} index={i} busy={busyId === d._id}
                      footerAction={{ label: "Mark Distributed", onClick: () => act(d._id, "distribute", "Donation marked as distributed.") }}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

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

export default CharityDashboard;
