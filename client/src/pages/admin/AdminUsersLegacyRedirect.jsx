import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy redirect for /admin/users -> /settings/employees
 * Added during intake-redesign-brand-model-customer-flow to preserve external links.
 */
export default function AdminUsersLegacyRedirect() {
  return <Navigate to="/settings/employees" replace />;
}
