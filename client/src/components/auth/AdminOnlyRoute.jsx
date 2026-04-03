import React from "react";
import { Navigate } from "react-router-dom";
import { authStorage } from "../../features/auth/auth.storage";
import { parseAccessTokenRole } from "../../features/auth/auth.session";

export function AdminOnlyRoute({ children }) {
  const role = parseAccessTokenRole(authStorage.getToken());
  if (role !== "Admin") {
    return <Navigate to="/settings" replace />;
  }
  return children;
}
