require("dotenv").config();
const mongoose = require("mongoose");
const Charity = require("../models/Charity");

const charities = [
  {
    name: "Global Food Relief Foundation",
    category: "Food",
    description: "Providing nutritious meals and food assistance to underprivileged communities across the globe.",
    mission: "To eliminate hunger and food insecurity through sustainable food donations and community programs.",
    email: "contact@globalfoodrelief.org",
    phone: "+1-800-FOOD-001",
    address: "123 Main Street",
    city: "New York",
    zipCode: "10001",
    website: "https://globalfoodrelief.org",
    rating: 4.8,
    reviews: 342,
    yearEstablished: 2010,
    peopleHelped: 150000,
    certified: true,
    socialLinks: {
      facebook: "GlobalFoodRelief",
      twitter: "@GlobalFoodRelief",
      instagram: "@globalfoodrelief",
    },
  },
  {
    name: "Education for All Initiative",
    category: "Education",
    description: "Empowering underprivileged children with quality education and vocational training programs.",
    mission: "To ensure every child has access to education regardless of their economic background.",
    email: "info@educationforall.org",
    phone: "+1-800-EDU-0002",
    address: "456 Education Lane",
    city: "Los Angeles",
    zipCode: "90001",
    website: "https://educationforall.org",
    rating: 4.6,
    reviews: 285,
    yearEstablished: 2012,
    peopleHelped: 50000,
    certified: true,
    socialLinks: {
      facebook: "EducationForAll",
      twitter: "@EducationForAll",
      instagram: "@educationforall",
    },
  },
  {
    name: "Heart Care Medical Charity",
    category: "Healthcare",
    description: "Providing affordable healthcare services and medical assistance to low-income families.",
    mission: "To provide quality healthcare to those who cannot afford it.",
    email: "support@heartcaremedical.org",
    phone: "+1-800-HEART-003",
    address: "789 Medical Plaza",
    city: "Chicago",
    zipCode: "60601",
    website: "https://heartcaremedical.org",
    rating: 4.7,
    reviews: 412,
    yearEstablished: 2008,
    peopleHelped: 75000,
    certified: true,
    socialLinks: {
      facebook: "HeartCareMedical",
      twitter: "@HeartCareMedical",
      instagram: "@heartcaremedical",
    },
  },
  {
    name: "Shelter & Hope Housing",
    category: "Housing",
    description: "Addressing homelessness by providing safe housing and support services.",
    mission: "To ensure everyone has a safe place to call home.",
    email: "contact@shelterhope.org",
    phone: "+1-800-HOUSE-004",
    address: "321 Help Street",
    city: "San Francisco",
    zipCode: "94101",
    website: "https://shelterhope.org",
    rating: 4.5,
    reviews: 198,
    yearEstablished: 2015,
    peopleHelped: 30000,
    certified: true,
    socialLinks: {
      facebook: "ShelterAndHope",
      twitter: "@ShelterHope",
      instagram: "@shelterhope",
    },
  },
  {
    name: "Emergency Relief International",
    category: "Disaster Relief",
    description: "Rapid response emergency aid and long-term recovery support for disaster-affected communities.",
    mission: "To provide immediate humanitarian assistance during disasters and support recovery.",
    email: "aid@emergencyrelief.org",
    phone: "+1-800-AID-00005",
    address: "654 Relief Avenue",
    city: "Washington DC",
    zipCode: "20001",
    website: "https://emergencyrelief.org",
    rating: 4.9,
    reviews: 567,
    yearEstablished: 2005,
    peopleHelped: 200000,
    certified: true,
    socialLinks: {
      facebook: "EmergencyReliefInternational",
      twitter: "@EmergencyRelief",
      instagram: "@emergencyrelief",
    },
  },
  {
    name: "Community Development Alliance",
    category: "Other",
    description: "Building sustainable communities through infrastructure, skill development, and economic empowerment.",
    mission: "To create thriving communities with sustainable development and local empowerment.",
    email: "community@cdalliance.org",
    phone: "+1-800-COMM-006",
    address: "987 Development Road",
    city: "Boston",
    zipCode: "02101",
    website: "https://cdalliance.org",
    rating: 4.4,
    reviews: 156,
    yearEstablished: 2011,
    peopleHelped: 45000,
    certified: true,
    socialLinks: {
      facebook: "CommunityDevelopmentAlliance",
      twitter: "@CDAlliance",
      instagram: "@cdalliance",
    },
  },
];

const seedCharities = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI is not defined in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB for seeding...");

    // Clear existing charities
    await Charity.deleteMany({});
    console.log("Cleared existing charities");

    // Insert sample charities
    const insertedCharities = await Charity.insertMany(charities);
    console.log(`✅ Successfully added ${insertedCharities.length} charities!`);

    insertedCharities.forEach((charity) => {
      console.log(`  📌 ${charity.name} - Rating: ${charity.rating}/5`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding charities:", error.message);
    process.exit(1);
  }
};

seedCharities();
