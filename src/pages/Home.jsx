import React, { useEffect, useRef, useState } from 'react'
import { Button, Typography, Box, Container, Grid, IconButton, Avatar } from '@mui/material'
import { ChevronLeft, ChevronRight, LocalShipping, VerifiedUser } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import './Home.css'
import Cardd from '../Cardd'
import CountUp from '../components/ui/CountUp'
import AvatarStack from '../components/ui/AvatarStack'
import CurveDivider from '../components/ui/CurveDivider'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const donorSteps = [
  {
    image: "/step1_donate.png",
    title: "1. Post Excess Food",
    body: "Restaurants, venues, hostels, and stadiums donate excess food via our seamless digital platform."
  },
  {
    image: "/step2_filter.png",
    title: "2. Verify & Sort",
    body: "Our network of certified charities verifies quality and sorts food for distribution to the right channels."
  },
  {
    image: "/step3_pickup.png",
    title: "3. Direct Impact",
    body: "Volunteers and charities pick up the food to serve those in need, ensuring zero waste and maximum reach."
  }
];

const charitySteps = [
  {
    image: "/feedingImg.jpg",
    title: "1. Browse Donations",
    body: "Charities browse available food donations nearby, filtered by type, quantity, and pickup window."
  },
  {
    image: "/food3.jpg",
    title: "2. Accept & Schedule",
    body: "Accept a donation in one tap and coordinate a pickup time directly with the donor."
  },
  {
    image: "/cta_bg.png",
    title: "3. Distribute & Report",
    body: "Distribute meals to your community and track your organization's growing impact over time."
  }
];

const impactCards = [
  {
    image: "/food3.jpg",
    title: "Eco-Friendly Disposal",
    body: "Any food not suitable for human consumption is diverted to composting or animal feed partners."
  },
  {
    image: "/feedingImg.jpg",
    title: "Community Outreach",
    body: "We partner with local shelters and community kitchens to provide hot meals daily using rescued ingredients."
  },
  {
    image: "/cta_bg.png",
    title: "Impact Tracking",
    body: "Donors receive real-time data on the positive environmental and social impact of their contributions."
  }
];

const trustBadges = [
  { name: "Feeding Hope Foundation", color: "6C63FF" },
  { name: "Robin Hood Army", color: "00C853" },
  { name: "Annapurna Seva Trust", color: "FF6B6B" },
  { name: "Akshaya Patra Foundation", color: "FF9100" },
  { name: "Roti Bank India", color: "795548" },
  { name: "No Food Waste", color: "2196F3" },
];

const testimonials = [
  {
    quote: "We used to throw away trays of untouched banquet food every weekend. Now it's picked up within the hour and we get a photo of the meal reaching families the same night.",
    name: "Ravi Shah",
    role: "Owner, Green Leaf Banquets",
  },
  {
    quote: "The pickup requests are organized by distance and food type, so our volunteers aren't guessing anymore. We've doubled the number of families we serve each week.",
    name: "Meera Nair",
    role: "Coordinator, Annapurna Seva Trust",
  },
  {
    quote: "Signing up took five minutes and our first donation was collected the same day. It's the easiest way I've found to make sure good food doesn't go to waste.",
    name: "Arjun Mehta",
    role: "Home donor",
  },
];

function Home() {
  const { token } = useAuth();
  const { hash } = useLocation();
  const [activeTrack, setActiveTrack] = useState("donor");
  const trustScrollRef = useRef(null);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const scrollTrust = (direction) => {
    trustScrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <Box>
            <div className="hero-badge">
              <VerifiedUser sx={{ fontSize: 18 }} /> Verified Charity Network
            </div>
            <Typography className="hero-title" component="h1">
              Turn Surplus Food Into <span className="accent">Real Meals</span>
            </Typography>
            <Typography className="hero-subtitle">
              Share2serve connects restaurants, events, and households with local charities so surplus food
              reaches people who need it — usually within hours, not days.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
              <Link to="/donate" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" size="large">
                  Donate Now
                </Button>
              </Link>
              <Link to="/charities" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" size="large">
                  Explore Charities
                </Button>
              </Link>
            </Box>
            <AvatarStack
              avatars={[
                { src: "https://i.pravatar.cc/64?img=12" },
                { src: "https://i.pravatar.cc/64?img=32" },
                { src: "https://i.pravatar.cc/64?img=45" },
                { src: "https://i.pravatar.cc/64?img=8" },
              ]}
              label="142+ donors already on board"
            />
          </Box>

          <div className="hero-image-wrap">
            <div className="hero-image-blob" />
            <img className="hero-img" src="/hero_premium.png" alt="Volunteers preparing rescued food" />
            <div className="hero-floating-chip">
              <div className="hero-floating-chip-icon">
                <LocalShipping sx={{ color: '#7C9A3C', fontSize: 20 }} />
              </div>
              <div className="hero-floating-chip-text">
                <strong>5,240 kg</strong>
                food rescued this month
              </div>
            </div>
          </div>
        </div>
      </section>

      <CurveDivider fill="#F3E9D8" />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <Box className="stat-card">
            <CountUp end={5240} suffix=" kg" sx={{ color: '#E2672B' }} />
            <div className="stat-label">Food Rescued</div>
          </Box>
          <Box className="stat-card">
            <CountUp end={12800} suffix="+" sx={{ color: '#E2672B' }} />
            <div className="stat-label">Meals Served</div>
          </Box>
          <Box className="stat-card">
            <CountUp end={142} sx={{ color: '#E2672B' }} />
            <div className="stat-label">Active Donors</div>
          </Box>
          <Box className="stat-card">
            <CountUp end={85} suffix="+" sx={{ color: '#E2672B' }} />
            <div className="stat-label">NGO Partners</div>
          </Box>
        </div>
      </section>

      {/* How it Works — dual track */}
      <section className="how-it-works-section">
        <Typography className="section-title">How it Works</Typography>
        <Typography className="section-subtitle">
          Whether you have food to give or a community to feed, getting started takes minutes.
        </Typography>
        <div className="track-tabs">
          <button
            className={`track-tab ${activeTrack === "donor" ? "active" : ""}`}
            onClick={() => setActiveTrack("donor")}
          >
            For Donors
          </button>
          <button
            className={`track-tab ${activeTrack === "charity" ? "active" : ""}`}
            onClick={() => setActiveTrack("charity")}
          >
            For Charities
          </button>
        </div>
        <Cardd cards={activeTrack === "donor" ? donorSteps : charitySteps} />
      </section>

      {/* Trust Strip */}
      <section className="trust-section">
        <div className="trust-header">
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Trusted by these charities
          </Typography>
          <Box>
            <IconButton onClick={() => scrollTrust(-1)} sx={{ bgcolor: '#fff', mr: 1 }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => scrollTrust(1)} sx={{ bgcolor: '#fff' }}>
              <ChevronRight />
            </IconButton>
          </Box>
        </div>
        <div className="trust-scroll" ref={trustScrollRef}>
          {trustBadges.map((b) => (
            <div className="trust-badge" key={b.name}>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=${b.color}&color=fff&bold=true`}
                alt={b.name}
              />
              <span>{b.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <Typography className="section-title">What Our Community Says</Typography>
        <Typography className="section-subtitle">
          Real stories from the donors and charities using Share2serve every week.
        </Typography>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <Typography className="testimonial-quote">&ldquo;{t.quote}&rdquo;</Typography>
              <div className="testimonial-author">
                <Avatar sx={{ bgcolor: '#E2672B', fontWeight: 700 }}>{t.name.charAt(0)}</Avatar>
                <Box>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-role">{t.role}</div>
                </Box>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="overline" className="about-subtitle">WHO WE ARE</Typography>
                <Typography variant="h2" className="about-title">Our Mission & Purpose</Typography>
                <Typography className="about-text">
                  Share2serve is a dedicated platform designed to bridge the gap between food abundance and critical need. Our purpose is to create a seamless ecosystem where businesses with surplus food can easily connect with local charities and NGOs.
                </Typography>
                <Typography className="about-text">
                  By leveraging technology, we streamline the food rescue process, ensuring that perfectly good meals reach those who need them most while significantly reducing environmental waste.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="about-features-container">
                <Box className="about-feature-item">
                  <Typography variant="h6">🌍 Purpose-Driven</Typography>
                  <Typography variant="body2">Dedicated to eliminating hunger and preserving our planet's resources.</Typography>
                </Box>
                <Box className="about-feature-item">
                  <Typography variant="h6">⚡ Real-time Rescue</Typography>
                  <Typography variant="body2">Instant connection between donors and recipients for immediate distribution.</Typography>
                </Box>
                <Box className="about-feature-item">
                  <Typography variant="h6">🤝 Community Growth</Typography>
                  <Typography variant="body2">Building strong local networks of food establishments and charitable partners.</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Auth Call-to-action */}
      {!token && (
        <Container maxWidth="md" sx={{ mb: 10 }}>
          <Box sx={{
            p: 5, textAlign: 'center', background: '#fff',
            borderRadius: '30px', border: '1px solid rgba(36,31,27,0.08)',
            boxShadow: '0 8px 32px rgba(36,31,27,0.06)',
          }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, fontFamily: 'Outfit' }}>
              Want to make an impact?
            </Typography>
            <Typography sx={{ mb: 4, color: '#6B6259' }}>
              Sign up today to join our network of donors and charities. It only takes a minute to start saving lives.
            </Typography>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" size="large">Join the Network</Button>
            </Link>
          </Box>
        </Container>
      )}

      {/* More impact cards */}
      <section style={{ paddingBottom: '100px' }}>
        <Typography className="section-title">Beyond the Plate</Typography>
        <Typography className="section-subtitle">
          Every donation creates ripple effects far beyond a single meal.
        </Typography>
        <Cardd cards={impactCards} />
      </section>
    </div>
  )
}

export default Home
