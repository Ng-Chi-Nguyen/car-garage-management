import { Outlet, Navigate } from 'react-router-dom';
import { authStorage } from '../features/auth/auth.storage';

export default function AuthLayout() {
  if (authStorage.getToken()) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Outlet />
  );
}
