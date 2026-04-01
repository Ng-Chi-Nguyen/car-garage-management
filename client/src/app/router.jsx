import { createBrowserRouter, Navigate } from 'react-router-dom';
import { routeManifest } from './routeManifest';
import AppShell from '../layouts/AppShell';
import AuthLayout from '../layouts/AuthLayout';
import { authStorage } from '../features/auth/auth.storage';

// Eagerly import all page components
const pages = import.meta.glob('../pages/**/*.jsx', { eager: true });

// Helper to resolve component from manifest path
const resolveComponent = (componentPath) => {
  // Map 'src/pages/...' to '../pages/...'
  const globKey = componentPath.replace('src/pages', '../pages');
  const module = pages[globKey];
  
  if (!module) {
    console.warn(`Component not found for path: ${componentPath}`);
    const Fallback = () => (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
        Component Missing: {componentPath}
      </div>
    );
    return Fallback;
  }
  
  return module.default;
};

// Group routes by layout
const authRoutes = routeManifest
  .filter(route => route.layout === 'auth')
  .map(route => {
    const Component = resolveComponent(route.componentPath);
    return {
      path: route.path,
      element: <Component />
    };
  });

const appRoutes = routeManifest
  .filter(route => route.layout === 'app')
  .map(route => {
    const Component = resolveComponent(route.componentPath);
    return {
      path: route.path,
      element: <Component />
    };
  });

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    element: <AuthLayout />,
    children: authRoutes
  },
  {
    element: <AppShell />,
    children: appRoutes
  }
]);
