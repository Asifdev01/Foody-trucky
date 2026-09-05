import React, { useState } from "react";
import { Box, Typography, Container, TextField, Button } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, Phone, Email, LocationOn, CheckCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  const exploreLinks = [
    { label: "Home", path: "/" },
    { label: "Donate Food", path: "/donate" },
    { label: "Charity Network", path: "/charities" },
    { label: "About Us", path: "/#about-us" },
    { label: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Cookie Policy", path: "/cookies" },
  ];

  return (
    <Box component="footer" className="premium-footer">
      <Container maxWidth="lg">
        <Box className="footer-grid">
          {/* Branding Column */}
          <Box className="footer-branding">
            <Link to="/" className="footer-logo">Share2serve</Link>
            <Typography className="footer-mission">
              Empowering communities by bridging the gap between excess and need. Join us in our mission to eliminate food waste and ensure no one goes hungry.
            </Typography>
            <Box className="footer-social-bar">
              <a href="#" className="social-icon-wrapper"><Facebook fontSize="small" /></a>
              <a href="#" className="social-icon-wrapper"><Twitter fontSize="small" /></a>
              <a href="#" className="social-icon-wrapper"><Instagram fontSize="small" /></a>
              <a href="#" className="social-icon-wrapper"><LinkedIn fontSize="small" /></a>
            </Box>
          </Box>

          {/* Explore Links Column */}
          <Box>
            <Typography variant="h6" className="footer-column-title">Explore</Typography>
            {exploreLinks.map((link) => (
              <Link key={link.label} to={link.path} className="footer-link">
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Legal Links Column */}
          <Box>
            <Typography variant="h6" className="footer-column-title">Legal</Typography>
            {legalLinks.map((link) => (
              <Link key={link.label} to={link.path} className="footer-link">
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Contact Column */}
          <Box>
            <Typography variant="h6" className="footer-column-title">Contact Us</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
              <LocationOn sx={{ color: '#E2672B', fontSize: '1.2rem' }} />
              <Typography variant="body2">123 Impact Way, Global City</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
              <Email sx={{ color: '#E2672B', fontSize: '1.2rem' }} />
              <Typography variant="body2">hello@share2serve.org</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
              <Phone sx={{ color: '#E2672B', fontSize: '1.2rem' }} />
              <Typography variant="body2">+1 (555) 000-SHARE</Typography>
            </Box>
          </Box>

          {/* Newsletter Column */}
          <Box>
            <Typography variant="h6" className="footer-column-title">Stay Updated</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
              Monthly impact reports and new charity partners, straight to your inbox.
            </Typography>
            {subscribed ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#A3C167' }}>
                <CheckCircle fontSize="small" />
                <Typography variant="body2">You're subscribed!</Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="you@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  type="email"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    },
                  }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ flexShrink: 0 }}>
                  Join
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer Bottom */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="footer-bottom-text">
            © {currentYear} Share2serve Inc. All rights reserved. Crafted with passion for the community.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
