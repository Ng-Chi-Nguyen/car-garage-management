import { Outlet, Navigate } from 'react-router-dom';
import { authStorage } from '../features/auth/auth.storage';
import { parseAccessTokenRole } from '../features/auth/auth.session';

const ALLOWED_ROLES = ['Admin', 'NhanVien'];

export default function AuthLayout() {
  const token = authStorage.getToken();
  const role = parseAccessTokenRole(token);
  const isAllowed = token && role && ALLOWED_ROLES.includes(role);

  if (isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Outlet />
  );
}
