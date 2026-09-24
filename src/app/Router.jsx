import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Spinner from "../shared/components/Spinner.jsx";

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Still trying to restore session from cookie — don't redirect yet
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center text-superstar-blue">
        <Spinner size={36} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

// Redirect already-authenticated users away from login page
function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/admin", element: <AdminDashboardPage /> }],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
