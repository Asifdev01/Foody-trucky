import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotAuthorized from "../pages/NotAuthorized";

// Restricts a route to a fixed set of roles (e.g. only "donor", only "charity").
const RoleRoute = ({ roles }) => {
  const { user, token, loading } = useAuth();

  if (loading) return null;
  if (!token) return <Navigate to="/login" />;
  if (!roles.includes(user?.role)) return <NotAuthorized />;

  return <Outlet />;
};

export default RoleRoute;
