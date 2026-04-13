import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  TextField, Grid, InputAdornment, Snackbar, Alert,
} from "@mui/material";
import {
  Person as PersonIcon, Phone as PhoneIcon, Email as EmailIcon,
  LocationOn as LocationIcon, AccessTime as TimeIcon,
  People as PeopleIcon, CloudUpload as UploadIcon,
  CheckCircle as CheckIcon, Fastfood as FastfoodIcon,
  NavigateBefore as PrevIcon, NavigateNext as NextIcon,
  Star as StarIcon, VolunteerActivism as HandshakeIcon,
  Description as DescIcon, Badge as BadgeIcon,
  PhotoCamera as CameraIcon, Send as SendIcon,
  StoreMallDirectory as FoodBankIcon,
} from "@mui/icons-material";
import "./CharityNetwork.css";

// ==========================================
//  DATA: Pre-loaded Charities
// ==========================================
const INITIAL_CHARITIES = [
  {
    id: "c1", name: "Feeding Hope Foundation", location: "Mumbai, Maharashtra",
    logo: "https://ui-avatars.com/api/?name=FH&background=6C63FF&color=fff&size=128&bold=true",
    rating: 4.8, totalRatings: 234, peopleServed: 45200, yearsOfService: 12,
    totalDonations: 1890, activeVolunteers: 320,
    description: "One of India's largest food rescue organizations, collecting surplus food from restaurants, hotels, and events to feed the hungry.",
    fullDescription: "Feeding Hope Foundation has been at the forefront of food rescue in India since 2014. We work with over 500 food partners across Mumbai to ensure no edible food goes to waste. Our trained volunteers collect, sort, and distribute food within hours of collection.",
    mission: "To eliminate food waste and hunger simultaneously by creating efficient food distribution networks.",
    vision: "A world where no one goes hungry while food goes to waste.",
    areas: ["South Mumbai", "Bandra", "Andheri", "Thane", "Navi Mumbai"],
    phone: "+91 98765 43210", email: "contact@feedinghope.org",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Rahul K.", stars: 5, text: "Amazing organization! They picked up our wedding food within an hour." },
      { author: "Priya M.", stars: 5, text: "Truly making a difference in the community. Great team!" },
    ],
  },
  {
    id: "c2", name: "Annapurna Seva Trust", location: "Delhi, NCR",
    logo: "https://ui-avatars.com/api/?name=AS&background=FF6B6B&color=fff&size=128&bold=true",
    rating: 4.6, totalRatings: 187, peopleServed: 38500, yearsOfService: 8,
    totalDonations: 1450, activeVolunteers: 245,
    description: "Dedicated to serving nutritious meals to underprivileged communities across the Delhi NCR region daily.",
    fullDescription: "Annapurna Seva Trust operates multiple community kitchens across Delhi NCR. We serve over 2,000 meals daily through our network of volunteers and partner organizations.",
    mission: "To ensure every person in Delhi NCR has access to at least one nutritious meal a day.",
    vision: "No empty plates in our community.",
    areas: ["Central Delhi", "South Delhi", "Noida", "Gurugram"],
    phone: "+91 98765 11111", email: "info@annapurnaseva.org",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Amit S.", stars: 4, text: "Very organized and responsive. Food gets distributed quickly." },
    ],
  },
  {
    id: "c3", name: "Robin Hood Army", location: "Bangalore, Karnataka",
    logo: "https://ui-avatars.com/api/?name=RA&background=00C853&color=fff&size=128&bold=true",
    rating: 4.9, totalRatings: 512, peopleServed: 82000, yearsOfService: 10,
    totalDonations: 3200, activeVolunteers: 580,
    description: "A volunteer-led organization that collects surplus food from restaurants and communities to serve less fortunate people.",
    fullDescription: "Robin Hood Army is a zero-funds volunteer organization. Our Robins collect surplus food from restaurants and the community to serve the less fortunate. We operate in 200+ cities.",
    mission: "To be the bridge between excess and hunger through people power.",
    vision: "Every city, every day — no one sleeps hungry.",
    areas: ["Koramangala", "Indiranagar", "Whitefield", "Electronic City", "Yelahanka"],
    phone: "+91 98765 22222", email: "hello@robinhoodarmy.com",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Sneha R.", stars: 5, text: "Incredible volunteer network! Highly efficient and compassionate." },
      { author: "Vikram P.", stars: 5, text: "The best food charity I've worked with. Well organized!" },
      { author: "Anita D.", stars: 4, text: "Great initiative. Would love to see them in more cities." },
    ],
  },
  {
    id: "c4", name: "Akshaya Patra Foundation", location: "Hyderabad, Telangana",
    logo: "https://ui-avatars.com/api/?name=AP&background=FF9100&color=fff&size=128&bold=true",
    rating: 4.7, totalRatings: 345, peopleServed: 120000, yearsOfService: 22,
    totalDonations: 5400, activeVolunteers: 890,
    description: "The world's largest NGO-run mid-day meal programme, feeding millions of children across India every day.",
    fullDescription: "Akshaya Patra runs centralized kitchens that prepare millions of meals daily for school children. Our state-of-the-art kitchens ensure hygiene and nutrition in every meal served.",
    mission: "No child in India shall be deprived of education because of hunger.",
    vision: "Unlimited food for education.",
    areas: ["Hyderabad", "Secunderabad", "Warangal", "Karimnagar"],
    phone: "+91 98765 33333", email: "info@akshayapatra.org",
    availability: "busy",
    gallery: [
      "https://images.unsplash.com/photo-1504159506876-f8338247a14a?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Sanjay M.", stars: 5, text: "Massive scale operation with incredible impact. Proud supporter!" },
    ],
  },
  {
    id: "c5", name: "No Food Waste", location: "Chennai, Tamil Nadu",
    logo: "https://ui-avatars.com/api/?name=NW&background=2196F3&color=fff&size=128&bold=true",
    rating: 4.5, totalRatings: 156, peopleServed: 28000, yearsOfService: 6,
    totalDonations: 980, activeVolunteers: 165,
    description: "A grassroots movement turning leftover food from events and restaurants into meals for the homeless and needy.",
    fullDescription: "No Food Waste started as a small initiative in Chennai and has grown into a citywide movement. We use WhatsApp groups and a mobile app to coordinate food collection in real-time.",
    mission: "Zero food waste, zero hunger — simple as that.",
    vision: "A city where excess food reaches those who need it within the hour.",
    areas: ["T. Nagar", "Adyar", "Anna Nagar", "Porur", "Tambaram"],
    phone: "+91 98765 44444", email: "team@nofoodwaste.in",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Meena K.", stars: 5, text: "Super quick response. They use tech effectively!" },
      { author: "Ravi T.", stars: 4, text: "Good initiative, growing fast in Chennai." },
    ],
  },
  {
    id: "c6", name: "Sewa Kitchen Collective", location: "Pune, Maharashtra",
    logo: "https://ui-avatars.com/api/?name=SK&background=E91E63&color=fff&size=128&bold=true",
    rating: 4.3, totalRatings: 98, peopleServed: 15600, yearsOfService: 4,
    totalDonations: 620, activeVolunteers: 95,
    description: "Community kitchen providing free meals and distributing surplus food to slum areas and rural communities around Pune.",
    fullDescription: "Sewa Kitchen Collective brings volunteers and donors together through community cooking events. We believe shared meals build shared communities.",
    mission: "Building community through the act of sharing food.",
    vision: "Every neighborhood a caring kitchen.",
    areas: ["Kothrud", "Hinjewadi", "Wakad", "Pimpri"],
    phone: "+91 98765 55555", email: "hello@sewakitchen.org",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Pooja D.", stars: 4, text: "Wonderful community-driven approach to fighting hunger." },
    ],
  },
  {
    id: "c7", name: "Roti Bank India", location: "Kolkata, West Bengal",
    logo: "https://ui-avatars.com/api/?name=RB&background=795548&color=fff&size=128&bold=true",
    rating: 4.4, totalRatings: 142, peopleServed: 22000, yearsOfService: 7,
    totalDonations: 890, activeVolunteers: 210,
    description: "Collecting rotis and bread from households and bakeries to feed the urban poor across Kolkata's streets.",
    fullDescription: "Roti Bank India partners with bakeries and households to collect fresh bread daily. Our fleet of cycle-powered volunteers ensures quick distribution across the city.",
    mission: "No roti should go to the bin when someone sleeps without one.",
    vision: "A hunger-free Kolkata by 2030.",
    areas: ["Park Street", "Salt Lake", "Howrah", "New Town", "Dum Dum"],
    phone: "+91 98765 66666", email: "contact@rotibank.in",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1586444248879-d8087e3fecd8?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Suman G.", stars: 5, text: "Unique concept. Love the cycle-powered delivery!" },
      { author: "Bhaskar R.", stars: 4, text: "Kolkata needs more organizations like this." },
    ],
  },
  {
    id: "c8", name: "Meals On Wheels India", location: "Ahmedabad, Gujarat",
    logo: "https://ui-avatars.com/api/?name=MW&background=009688&color=fff&size=128&bold=true",
    rating: 4.6, totalRatings: 201, peopleServed: 34000, yearsOfService: 9,
    totalDonations: 1320, activeVolunteers: 275,
    description: "Delivering hot, nutritious meals to the elderly, disabled, and homebound individuals across Ahmedabad.",
    fullDescription: "Meals On Wheels India ensures that those who cannot access food themselves receive hot meals daily at their doorstep. We serve senior citizens, disabled persons, and recovering patients.",
    mission: "No one too old, too sick, or too alone to eat well.",
    vision: "Doorstep nutrition for every homebound individual in India.",
    areas: ["Satellite", "SG Highway", "Maninagar", "Navrangpura"],
    phone: "+91 98765 77777", email: "care@mealsonwheels.in",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Kavita P.", stars: 5, text: "My grandmother receives meals daily. Lifesaving service!" },
    ],
  },
  {
    id: "c9", name: "Zero Hunger Project", location: "Jaipur, Rajasthan",
    logo: "https://ui-avatars.com/api/?name=ZH&background=673AB7&color=fff&size=128&bold=true",
    rating: 4.2, totalRatings: 89, peopleServed: 11500, yearsOfService: 3,
    totalDonations: 410, activeVolunteers: 78,
    description: "A tech-enabled food rescue startup connecting surplus food with hunger hotspots across Jaipur using data analytics.",
    fullDescription: "Zero Hunger Project uses data analytics and real-time mapping to identify where surplus food is and where hunger exists. Our platform matches them instantly.",
    mission: "Using data and technology to solve the hunger-waste paradox.",
    vision: "AI-powered hunger elimination.",
    areas: ["Malviya Nagar", "Vaishali", "Mansarovar", "C-Scheme"],
    phone: "+91 98765 88888", email: "info@zerohunger.in",
    availability: "offline",
    gallery: [
      "https://images.unsplash.com/photo-1504159506876-f8338247a14a?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Deepak J.", stars: 4, text: "Innovative tech approach. The app is really useful!" },
    ],
  },
  {
    id: "c10", name: "Food For All Network", location: "Lucknow, Uttar Pradesh",
    logo: "https://ui-avatars.com/api/?name=FA&background=FF5722&color=fff&size=128&bold=true",
    rating: 4.5, totalRatings: 167, peopleServed: 26000, yearsOfService: 5,
    totalDonations: 780, activeVolunteers: 140,
    description: "A network of volunteers and food donors working together to eliminate hunger in Uttar Pradesh's capital city.",
    fullDescription: "Food For All Network connects corporates, restaurants, and individuals with communities in need. Our weekly food drives are the largest in Lucknow.",
    mission: "Every meal shared is a life changed.",
    vision: "Lucknow without hunger.",
    areas: ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar"],
    phone: "+91 98765 99999", email: "team@foodforall.org",
    availability: "active",
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=300&h=300&fit=crop",
    ],
    reviews: [
      { author: "Neha S.", stars: 5, text: "Great community spirit! The weekly drives are amazing." },
      { author: "Farhan K.", stars: 4, text: "Very responsive team. Food gets distributed same day." },
    ],
  },
];

const CHARITIES_KEY = "charity_network_data";
const DONATIONS_KEY = "food_donations";

// ==========================================
//  Utility: Star display
// ==========================================
const Stars = ({ rating, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="cn-stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`cn-star ${i < full || (i === full && half) ? "" : "empty"}`}
          style={{ fontSize: size }}>★</span>
      ))}
    </span>
  );
};

// ==========================================
//  DonationMiniCarousel
// ==========================================
const DonationMiniCarousel = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images?.length) {
    return (
      <div className="cn-donation-carousel" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
        <CameraIcon sx={{ fontSize: 32, opacity: 0.4 }} />&nbsp;No image
      </div>
    );
  }
  return (
    <div className="cn-donation-carousel">
      <img src={images[idx]} alt="Food" loading="lazy" />
      {images.length > 1 && (
        <>
          <button className="cn-carousel-nav prev" onClick={(e) => { e.stopPropagation(); setIdx(p => p === 0 ? images.length - 1 : p - 1); }}>
            <PrevIcon sx={{ fontSize: 18 }} />
          </button>
          <button className="cn-carousel-nav next" onClick={(e) => { e.stopPropagation(); setIdx(p => p === images.length - 1 ? 0 : p + 1); }}>
            <NextIcon sx={{ fontSize: 18 }} />
          </button>
        </>
      )}
    </div>
  );
};

// ==========================================
//  CharityCard Component
// ==========================================
const CharityCard = ({ charity, index, onViewDetails, onConnect }) => (
  <div className="cn-charity-card" style={{ animationDelay: `${index * 0.06}s` }}>
    <div className="cn-card-header">
      <img src={charity.logo} alt={charity.name} className="cn-card-logo" />
      <div className="cn-card-title-area">
        <h3 className="cn-card-name">{charity.name}</h3>
        <span className="cn-card-location">📍 {charity.location}</span>
      </div>
      <span className={`cn-card-avail ${charity.availability}`}>
        {charity.availability}
      </span>
    </div>
    <div className="cn-card-body">
      <p className="cn-card-desc">{charity.description}</p>
      <div className="cn-rating">
        <Stars rating={charity.rating} />
        <span className="cn-rating-text">{charity.rating} ({charity.totalRatings} reviews)</span>
      </div>
      <div className="cn-card-stats">
        <div className="cn-card-stat">
          <div className="cn-card-stat-val">{(charity.peopleServed / 1000).toFixed(1)}K</div>
          <div className="cn-card-stat-lbl">Served</div>
        </div>
        <div className="cn-card-stat">
          <div className="cn-card-stat-val">{charity.totalDonations}</div>
          <div className="cn-card-stat-lbl">Donations</div>
        </div>
        <div className="cn-card-stat">
          <div className="cn-card-stat-val">{charity.activeVolunteers}</div>
          <div className="cn-card-stat-lbl">Volunteers</div>
        </div>
      </div>
    </div>
    <div className="cn-card-actions">
      <button className="cn-btn cn-btn-outline" onClick={() => onViewDetails(charity)}>
        View Details
      </button>
      <button className="cn-btn cn-btn-primary" onClick={() => onConnect(charity)}>
        <HandshakeIcon sx={{ fontSize: 18 }} /> Connect
      </button>
    </div>
  </div>
);

// ==========================================
//  CharityDetailModal Component
// ==========================================
const CharityDetailModal = ({ charity, onClose, onRate }) => {
  const [rateStars, setRateStars] = useState(0);
  const [rateHover, setRateHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitReview = () => {
    if (rateStars === 0) return;
    onRate(charity.id, rateStars, review);
    setRateStars(0);
    setReview("");
  };

  return (
    <div className="cn-modal-overlay" onClick={onClose}>
      <div className="cn-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cn-modal-close" onClick={onClose}>✕</button>

        <div className="cn-modal-header">
          <img src={charity.logo} alt={charity.name} className="cn-modal-logo" />
          <div className="cn-modal-title-area">
            <h2>{charity.name}</h2>
            <span className="cn-card-location" style={{ fontSize: "0.95rem" }}>
              📍 {charity.location}
              <span className={`cn-card-avail ${charity.availability}`} style={{ marginLeft: 10 }}>
                {charity.availability}
              </span>
            </span>
            <div className="cn-rating" style={{ marginTop: 8 }}>
              <Stars rating={charity.rating} size={18} />
              <span className="cn-rating-text">{charity.rating} ({charity.totalRatings} reviews)</span>
            </div>
          </div>
        </div>

        <div className="cn-modal-body">
          {/* Impact Stats */}
          <div className="cn-modal-section">
            <h3>Impact Dashboard</h3>
            <div className="cn-modal-stats">
              <div className="cn-modal-stat">
                <div className="cn-modal-stat-val">{charity.peopleServed.toLocaleString()}</div>
                <div className="cn-modal-stat-lbl">People Served</div>
              </div>
              <div className="cn-modal-stat">
                <div className="cn-modal-stat-val">{charity.totalDonations.toLocaleString()}</div>
                <div className="cn-modal-stat-lbl">Donations</div>
              </div>
              <div className="cn-modal-stat">
                <div className="cn-modal-stat-val">{charity.activeVolunteers}</div>
                <div className="cn-modal-stat-lbl">Volunteers</div>
              </div>
              <div className="cn-modal-stat">
                <div className="cn-modal-stat-val">{charity.yearsOfService}</div>
                <div className="cn-modal-stat-lbl">Years Active</div>
              </div>
            </div>
            {/* Progress toward goal */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#888", fontWeight: 600 }}>
                <span>Goal: 100K People Served</span>
                <span>{Math.min(100, Math.round(charity.peopleServed / 1000))}%</span>
              </div>
              <div className="cn-progress">
                <div className="cn-progress-fill" style={{ width: `${Math.min(100, charity.peopleServed / 1000)}%` }} />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="cn-modal-section">
            <h3>About</h3>
            <p className="cn-modal-text">{charity.fullDescription}</p>
          </div>

          {/* Mission & Vision */}
          <div className="cn-modal-section">
            <h3>Mission & Vision</h3>
            <p className="cn-modal-text"><strong>Mission:</strong> {charity.mission}</p>
            <p className="cn-modal-text" style={{ marginTop: 8 }}><strong>Vision:</strong> {charity.vision}</p>
          </div>

          {/* Distribution Areas */}
          <div className="cn-modal-section">
            <h3>Distribution Areas</h3>
            <div className="cn-areas">
              {charity.areas.map((a) => (
                <span key={a} className="cn-area-tag">📍 {a}</span>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {charity.gallery?.length > 0 && (
            <div className="cn-modal-section">
              <h3>Gallery</h3>
              <div className="cn-gallery">
                {charity.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="cn-modal-section">
            <h3>Contact Information</h3>
            <div className="cn-contact-grid">
              <div className="cn-contact-item">
                <PhoneIcon /> {charity.phone}
              </div>
              <div className="cn-contact-item">
                <EmailIcon /> {charity.email}
              </div>
              <div className="cn-contact-item">
                <LocationIcon /> {charity.location}
              </div>
              <div className="cn-contact-item">
                <TimeIcon /> {charity.yearsOfService} years of service
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="cn-modal-section">
            <h3>Reviews & Ratings</h3>
            {charity.reviews?.length > 0 ? (
              <div className="cn-reviews-list">
                {charity.reviews.map((r, i) => (
                  <div key={i} className="cn-review">
                    <div className="cn-review-header">
                      <span className="cn-review-author">{r.author}</span>
                      <Stars rating={r.stars} size={14} />
                    </div>
                    <p className="cn-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="cn-modal-text" style={{ color: "#999" }}>No reviews yet. Be the first!</p>
            )}

            {/* Rate This Charity */}
            <div style={{ marginTop: 20, padding: 20, background: "#f9f9fb", borderRadius: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontWeight: 700, color: "#333" }}>Rate this charity</h4>
              <div className="cn-rate-input">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button"
                    className={`cn-rate-star ${s <= (rateHover || rateStars) ? "filled" : ""}`}
                    onClick={() => setRateStars(s)}
                    onMouseEnter={() => setRateHover(s)}
                    onMouseLeave={() => setRateHover(0)}
                  >★</button>
                ))}
              </div>
              <TextField
                fullWidth size="small" multiline rows={2}
                placeholder="Write a review (optional)..."
                value={review} onChange={(e) => setReview(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <button className="cn-btn cn-btn-primary" style={{ width: "100%" }}
                onClick={handleSubmitReview} disabled={rateStars === 0}>
                <StarIcon sx={{ fontSize: 18 }} /> Submit Rating
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
//  MAIN: CharityNetwork Page
// ==========================================
const CharityNetwork = () => {
  // --- State ---
  const [charities, setCharities] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("charities");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterRating, setFilterRating] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Registration form
  const [regForm, setRegForm] = useState({
    name: "", regNumber: "", contactPerson: "", phone: "", email: "",
    address: "", description: "",
  });
  const [regLogo, setRegLogo] = useState(null);
  const [regLogoPreview, setRegLogoPreview] = useState("");
  const [regGallery, setRegGallery] = useState([]);
  const [regGalleryPreviews, setRegGalleryPreviews] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // --- Load data ---
  useEffect(() => {
    setTimeout(() => {
      try {
        const saved = localStorage.getItem(CHARITIES_KEY);
        if (saved) {
          setCharities(JSON.parse(saved));
        } else {
          setCharities(INITIAL_CHARITIES);
          localStorage.setItem(CHARITIES_KEY, JSON.stringify(INITIAL_CHARITIES));
        }
      } catch {
        setCharities(INITIAL_CHARITIES);
      }

      try {
        const savedDonations = localStorage.getItem(DONATIONS_KEY);
        if (savedDonations) setDonations(JSON.parse(savedDonations));
      } catch {}

      setLoading(false);
    }, 800); // Simulate loading for skeleton UI
  }, []);

  // Save charities
  useEffect(() => {
    if (charities.length > 0) {
      localStorage.setItem(CHARITIES_KEY, JSON.stringify(charities));
    }
  }, [charities]);

  // Save donations
  useEffect(() => {
    if (donations.length > 0) {
      localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    }
  }, [donations]);

  // --- Computed ---
  const totalStats = useMemo(() => ({
    charities: charities.length,
    peopleServed: charities.reduce((a, c) => a + c.peopleServed, 0),
    totalDonations: charities.reduce((a, c) => a + c.totalDonations, 0),
    volunteers: charities.reduce((a, c) => a + c.activeVolunteers, 0),
  }), [charities]);

  const topCharities = useMemo(() =>
    [...charities].sort((a, b) => b.peopleServed - a.peopleServed).slice(0, 5),
    [charities]
  );

  const filteredCharities = useMemo(() => {
    let list = [...charities];
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
      );
    }
    // Filter 4★+
    if (filterRating) list = list.filter(c => c.rating >= 4);
    // Sort
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "impact") list.sort((a, b) => b.peopleServed - a.peopleServed);
    else if (sortBy === "recent") list.sort((a, b) => b.yearsOfService - a.yearsOfService);
    return list;
  }, [charities, searchQuery, sortBy, filterRating]);

  const availableDonations = donations.filter(d => d.status === "available");

  // --- Handlers ---
  const handleAcceptDonation = (donationId) => {
    setDonations(prev => prev.map(d =>
      d.id === donationId ? { ...d, status: "collected" } : d
    ));
    // Randomly assign to a charity and add to stats
    if (charities.length > 0) {
      const randomIdx = Math.floor(Math.random() * charities.length);
      setCharities(prev => prev.map((c, i) =>
        i === randomIdx ? {
          ...c,
          peopleServed: c.peopleServed + (parseInt(donations.find(d => d.id === donationId)?.quantity) || 10),
          totalDonations: c.totalDonations + 1,
        } : c
      ));
    }
    setNotification({ text: "Donation accepted!", sub: "A charity will arrange pickup soon." });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRateCharity = (charityId, stars, reviewText) => {
    setCharities(prev => prev.map(c => {
      if (c.id !== charityId) return c;
      const newTotal = c.totalRatings + 1;
      const newAvg = parseFloat(((c.rating * c.totalRatings + stars) / newTotal).toFixed(1));
      const newReviews = reviewText
        ? [...(c.reviews || []), { author: "You", stars, text: reviewText }]
        : [...(c.reviews || []), { author: "You", stars, text: `Rated ${stars} stars` }];
      return { ...c, rating: newAvg, totalRatings: newTotal, reviews: newReviews };
    }));
    setSnackbar({ open: true, message: "Rating submitted! Thank you.", severity: "success" });
  };

  const handleConnect = (charity) => {
    setSnackbar({
      open: true,
      message: `Pickup request sent to ${charity.name}! They'll contact you soon.`,
      severity: "success",
    });
  };

  // Registration
  const handleRegChange = (e) => {
    setRegForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setRegLogo(file); setRegLogoPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - regGallery.length);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegGallery(p => [...p, file]);
        setRegGalleryPreviews(p => [...p, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.contactPerson || !regForm.phone || !regForm.email || !regForm.address) {
      setSnackbar({ open: true, message: "Please fill all required fields.", severity: "error" });
      return;
    }
    setRegLoading(true);
    setTimeout(() => {
      const newCharity = {
        id: `c_${Date.now()}`,
        name: regForm.name,
        location: regForm.address,
        logo: regLogoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(regForm.name.slice(0, 2))}&background=6C63FF&color=fff&size=128&bold=true`,
        rating: 0, totalRatings: 0, peopleServed: 0, yearsOfService: 0,
        totalDonations: 0, activeVolunteers: 0,
        description: regForm.description || `${regForm.name} — a new charity on our platform.`,
        fullDescription: regForm.description || `Welcome ${regForm.name}! This charity has just joined our network.`,
        mission: "To serve the community through food distribution.",
        vision: "A hunger-free future.",
        areas: [regForm.address.split(",")[0]?.trim() || "Local Area"],
        phone: regForm.phone, email: regForm.email,
        availability: "active",
        gallery: regGalleryPreviews,
        reviews: [],
      };
      setCharities(prev => [newCharity, ...prev]);
      setRegForm({ name: "", regNumber: "", contactPerson: "", phone: "", email: "", address: "", description: "" });
      setRegLogo(null); setRegLogoPreview(""); setRegGallery([]); setRegGalleryPreviews([]);
      setRegLoading(false);
      setRegSuccess(true);
    }, 1200);
  };

  // ==========================================
  //  RENDER
  // ==========================================
  return (
    <div className="cn-page">
      {/* Notification */}
      {notification && (
        <div className="cn-notification">
          <div className="cn-notif-icon">✓</div>
          <div>
            <div className="cn-notif-text">{notification.text}</div>
            <div className="cn-notif-sub">{notification.sub}</div>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="cn-hero">
        <div className="cn-hero-badge">🤝 Social Impact Platform</div>
        <h1>Charity Network</h1>
        <p>Connect with trusted charities, donate food, and track your impact — all in one place.</p>
      </header>

      <div className="cn-content">
        {/* Stats Banner */}
        <div className="cn-stats-banner">
          <div className="cn-stat-card">
            <div className="cn-stat-icon purple">🏛️</div>
            <div className="cn-stat-value">{totalStats.charities}</div>
            <div className="cn-stat-label">Charities</div>
          </div>
          <div className="cn-stat-card">
            <div className="cn-stat-icon green">👥</div>
            <div className="cn-stat-value">{(totalStats.peopleServed / 1000).toFixed(0)}K+</div>
            <div className="cn-stat-label">People Served</div>
          </div>
          <div className="cn-stat-card">
            <div className="cn-stat-icon orange">🍱</div>
            <div className="cn-stat-value">{(totalStats.totalDonations / 1000).toFixed(1)}K</div>
            <div className="cn-stat-label">Donations</div>
          </div>
          <div className="cn-stat-card">
            <div className="cn-stat-icon blue">🙋</div>
            <div className="cn-stat-value">{totalStats.volunteers.toLocaleString()}</div>
            <div className="cn-stat-label">Volunteers</div>
          </div>
        </div>

        {/* Top Performing Charities */}
        <section className="cn-top-section">
          <div className="cn-section-header">
            <h2 className="cn-section-title">🏆 Top Performing Charities</h2>
          </div>
          <div className="cn-top-scroll">
            {topCharities.map((c, i) => (
              <div key={c.id} className="cn-top-card" onClick={() => setSelectedCharity(c)} style={{ cursor: "pointer" }}>
                <div className="cn-top-rank">#{i + 1}</div>
                <img src={c.logo} alt={c.name} className="cn-top-logo" />
                <div className="cn-top-name">{c.name}</div>
                <div className="cn-top-location">📍 {c.location}</div>
                <div className="cn-rating" style={{ marginBottom: 4 }}>
                  <Stars rating={c.rating} size={14} />
                  <span className="cn-rating-text" style={{ fontSize: "0.78rem" }}>{c.rating}</span>
                </div>
                <div className="cn-top-stats">
                  <div className="cn-top-stat">
                    <strong>{(c.peopleServed / 1000).toFixed(1)}K</strong>Served
                  </div>
                  <div className="cn-top-stat">
                    <strong>{c.activeVolunteers}</strong>Volunteers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <div className="cn-tabs">
          <button className={`cn-tab ${activeTab === "charities" ? "active" : ""}`}
            onClick={() => setActiveTab("charities")}>
            🏛️ Charities <span className="tab-count">{charities.length}</span>
          </button>
          <button className={`cn-tab ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}>
            🍱 Available Food <span className="tab-count">{availableDonations.length}</span>
          </button>
          <button className={`cn-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}>
            ➕ Join as Charity
          </button>
        </div>

        {/* ====== CHARITIES TAB ====== */}
        {activeTab === "charities" && (
          <>
            {/* Search & Filter */}
            <div className="cn-search-bar">
              <input
                type="text"
                className="cn-search-input"
                placeholder="Search charities by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className={`cn-filter-btn ${filterRating ? "active" : ""}`}
                onClick={() => setFilterRating(p => !p)}
              >
                ⭐ 4★ & Above
              </button>
              <select
                className="cn-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="impact">Sort: Most Impact</option>
                <option value="recent">Sort: Most Experienced</option>
              </select>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="cn-skeleton">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="cn-skeleton-card">
                    <div className="cn-skeleton-line h60 w40" />
                    <div className="cn-skeleton-line w80" />
                    <div className="cn-skeleton-line w60" />
                    <div className="cn-skeleton-line" />
                    <div className="cn-skeleton-line w40" />
                  </div>
                ))}
              </div>
            ) : filteredCharities.length === 0 ? (
              <div className="cn-empty">
                <span className="cn-empty-icon">🔍</span>
                <h3>No charities found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="cn-charity-grid">
                {filteredCharities.map((c, i) => (
                  <CharityCard
                    key={c.id}
                    charity={c}
                    index={i}
                    onViewDetails={setSelectedCharity}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ====== DONATIONS TAB ====== */}
        {activeTab === "donations" && (
          <>
            <div className="cn-section-header">
              <h2 className="cn-section-title">
                <FastfoodIcon sx={{ color: "var(--cn-primary)" }} />
                Available Food Donations
                <span className="cn-count">{availableDonations.length}</span>
              </h2>
            </div>
            {availableDonations.length === 0 ? (
              <div className="cn-empty">
                <span className="cn-empty-icon">📦</span>
                <h3>No food available right now</h3>
                <p>New donations will appear here automatically when donors post them.</p>
              </div>
            ) : (
              <div className="cn-donations-grid">
                {availableDonations.map((d, i) => (
                  <div key={d.id} className="cn-donation-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <DonationMiniCarousel images={d.images} />
                    <div className="cn-donation-body">
                      <h3 className="cn-donation-name">{d.foodName}</h3>
                      <div className="cn-donation-info">
                        <span><PeopleIcon /> Serves {d.quantity} people</span>
                        <span><LocationIcon /> {d.address}</span>
                        <span><TimeIcon /> {d.timeSlot ? new Date(d.timeSlot).toLocaleString() : "Flexible"}</span>
                        <span><PersonIcon /> {d.donorName}</span>
                      </div>
                      <div className="cn-donation-footer">
                        <span className={`cn-donation-status ${d.status}`}>
                          {d.status}
                        </span>
                        <button className="cn-accept-btn" onClick={() => handleAcceptDonation(d.id)}>
                          <CheckIcon sx={{ fontSize: 18 }} /> Accept Donation
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collected section */}
            {donations.filter(d => d.status === "collected").length > 0 && (
              <>
                <div className="cn-section-header" style={{ marginTop: 48 }}>
                  <h2 className="cn-section-title">
                    ✅ Recently Collected
                    <span className="cn-count">{donations.filter(d => d.status === "collected").length}</span>
                  </h2>
                </div>
                <div className="cn-donations-grid">
                  {donations.filter(d => d.status === "collected").slice(0, 6).map((d, i) => (
                    <div key={d.id} className="cn-donation-card" style={{ animationDelay: `${i * 0.06}s`, opacity: 0.8 }}>
                      <DonationMiniCarousel images={d.images} />
                      <div className="cn-donation-body">
                        <h3 className="cn-donation-name">{d.foodName}</h3>
                        <div className="cn-donation-info">
                          <span><PeopleIcon /> Serves {d.quantity} people</span>
                          <span><LocationIcon /> {d.address}</span>
                        </div>
                        <div className="cn-donation-footer">
                          <span className="cn-donation-status collected">Collected</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ====== REGISTER TAB ====== */}
        {activeTab === "register" && (
          <>
            <div className="cn-section-header">
              <h2 className="cn-section-title">
                ➕ Register Your Charity
              </h2>
            </div>
            <form className="cn-reg-card" onSubmit={handleRegSubmit}>
              <div className="cn-reg-label">Organization Details</div>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Organization Name" name="name" required
                    value={regForm.name} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FoodBankIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Registration Number" name="regNumber"
                    value={regForm.regNumber} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Contact Person" name="contactPerson" required
                    value={regForm.contactPerson} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" name="phone" required type="tel"
                    value={regForm.phone} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email Address" name="email" required type="email"
                    value={regForm.email} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Address / Location" name="address" required
                    value={regForm.address} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" name="description" multiline rows={3}
                    placeholder="Tell us about your organization..."
                    value={regForm.description} onChange={handleRegChange}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}><DescIcon sx={{ color: "#6C63FF" }} /></InputAdornment> }} />
                </Grid>
              </Grid>

              {/* Logo Upload */}
              <div className="cn-reg-label">Logo</div>
              <div className="cn-reg-upload" onClick={() => logoInputRef.current?.click()}>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} />
                {regLogoPreview ? (
                  <img src={regLogoPreview} alt="Logo" style={{ width: 80, height: 80, borderRadius: 18, objectFit: "cover" }} />
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 32, color: "#6C63FF", mb: 1 }} />
                    <div style={{ fontWeight: 600, color: "#555" }}>Click to upload logo</div>
                  </>
                )}
              </div>

              {/* Gallery Upload */}
              <div className="cn-reg-label" style={{ marginTop: 20 }}>Gallery Images</div>
              <div className="cn-reg-upload" onClick={() => galleryInputRef.current?.click()}>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                <UploadIcon sx={{ fontSize: 28, color: "#6C63FF" }} />
                <div style={{ fontWeight: 600, color: "#555", fontSize: "0.9rem" }}>
                  Upload gallery images (max 5)
                  {regGalleryPreviews.length > 0 && ` · ${regGalleryPreviews.length}/5 selected`}
                </div>
              </div>
              {regGalleryPreviews.length > 0 && (
                <div className="cn-reg-preview">
                  {regGalleryPreviews.map((src, i) => (
                    <img key={i} src={src} alt={`Gallery ${i}`} className="cn-reg-preview-img" />
                  ))}
                </div>
              )}

              <button type="submit" className="cn-reg-submit" disabled={regLoading}>
                {regLoading ? <div className="cn-spinner" /> : (
                  <><SendIcon sx={{ fontSize: 20 }} /> Register Charity</>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* ====== Detail Modal ====== */}
      {selectedCharity && (
        <CharityDetailModal
          charity={selectedCharity}
          onClose={() => setSelectedCharity(null)}
          onRate={handleRateCharity}
        />
      )}

      {/* ====== Registration Success ====== */}
      {regSuccess && (
        <div className="cn-modal-overlay" onClick={() => setRegSuccess(false)}>
          <div className="cn-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cn-success-check">🎉</div>
            <h3>Charity Registered!</h3>
            <p>Your organization has been added to our network. You can now start accepting food donations.</p>
            <button onClick={() => { setRegSuccess(false); setActiveTab("charities"); }}>
              View All Charities
            </button>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          severity={snackbar.severity} variant="filled"
          sx={{ borderRadius: "14px", fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CharityNetwork;
