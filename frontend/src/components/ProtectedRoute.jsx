import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.role === "admin" ? children : <Navigate to="/" />;
};