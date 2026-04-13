import React, { useEffect } from 'react'
import { Button, Typography, Box, Container, Grid } from '@mui/material'
import { useLocation } from 'react-router-dom'
import './Home.css'
import Cardd from '../Cardd'
import MyButton from '../components/ui/MyButton'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const processCards = [
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

function Home() {
  const { token, user } = useAuth();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <img className="hero-img" src="/hero_premium.png" alt="Feeding community" />
        <Box className="hero-overlay">
          <Typography variant="h1" className="hero-title">
            Donate Food,<br />Change Lives
          </Typography>
          <Typography className="hero-subtitle">
            We connect businesses with local charities to rescue perfectly good food that would otherwise go to waste. Join the mission to end hunger and protect the planet.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/donate" style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                className="cta-button"
                sx={{ 
                  px: 4, py: 1.8, fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                }}
              >
                DONATE NOW
              </Button>
            </Link>
            <Link to="/charities" style={{ textDecoration: 'none' }}>
              <Button 
                variant="outlined" 
                className="logout-button"
                sx={{ px: 4, py: 1.8, fontSize: '1.1rem' }}
              >
                EXPLORE PARTNERS
              </Button>
            </Link>
          </Box>
        </Box>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="about-content-box">
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

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">5,240 kg</div>
            <div className="stat-label">Food Rescued</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12,800+</div>
            <div className="stat-label">Meals Served</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">142</div>
            <div className="stat-label">Active Donors</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">85+</div>
            <div className="stat-label">NGO Partners</div>
          </div>
        </div>
      </section>

      {/* Auth Call-to-action */}
      {!token && (
        <Container maxWidth="md" sx={{ my: 10 }}>
          <Box sx={{ 
            p: 5, textAlign: 'center', background: 'rgba(255,255,255,0.03)', 
            borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, fontFamily: 'Outfit' }}>
              Want to make an impact?
            </Typography>
            <Typography sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}>
              Sign up today to join our network of donors and charities. It only takes a minute to start saving lives.
            </Typography>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="contained" className="cta-button">Join the Network</Button>
            </Link>
          </Box>
        </Container>
      )}

      {/* Process Section */}
      <section>
        <Typography variant="h2" className="section-title">How it Works</Typography>
        <Cardd cards={processCards} />
      </section>

      {/* Impact Facts Section */}
      <section className="impact-facts">
        <div className="facts-content">
          <div className="facts-title">A CLEAR SOLUTION</div>
          <Typography variant="h3" className="facts-main-text">
            Bridging the gap between excess and need.
          </Typography>
          <Typography className="facts-sub-text">
            Share2serve connects hospitality and food service organizations with excess food by simplifying the process of locating, verifying, and transporting these resources. 
            We turn potential waste into a powerful tool for social good.
          </Typography>
        </div>
      </section>

      {/* More impact cards */}
      <section style={{ paddingBottom: '100px' }}>
        <Cardd cards={impactCards} />
      </section>
    </div>
  )
}

export default Home
