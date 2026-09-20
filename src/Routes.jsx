import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Box } from "@mui/material";

// Components
import Header from "./components/feature/Header";
import Footer from "./components/feature/Footer";
import AppDrawer from "./components/feature/AppDrawer";
import AdminRoute from "./components/AdminRoute";
import RoleRoute from "./components/RoleRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import CharityDashboard from "./pages/CharityDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Donor from "./pages/admin/Donor";
import FoodDonor from "./pages/admin/FoodDonor";
import Request from "./pages/admin/Request";
import PartnerList from "./pages/admin/PartnerList";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Box sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWithHeader />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Donating is donor-only; the charity dashboard is charity-only */}
          <Route element={<RoleRoute roles={["donor"]} />}>
            <Route path="/donate" element={<Donate />} />
          </Route>
          <Route element={<RoleRoute roles={["charity"]} />}>
            <Route path="/charities" element={<CharityDashboard />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="donor" element={<Donor />} />
            <Route path="fooddonor" element={<FoodDonor />} />
            <Route path="request" element={<Request />} />
            <Route path="partnerlist" element={<PartnerList />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
