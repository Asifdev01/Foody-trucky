import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotAuthorized from "../pages/NotAuthorized";

const AdminRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) return null; // Wait for auth check

  // If not logged in, go to login
  if (!token) return <Navigate to="/login" />;

  // If logged in but not admin, show not authorized
  if (user?.role !== "admin") return <NotAuthorized />;

  // If admin, proceed
  return <Outlet />;
};

export default AdminRoute;
