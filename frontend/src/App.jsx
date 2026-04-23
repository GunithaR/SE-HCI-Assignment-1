import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import AssistantWidget from './components/AssistantWidget';
import VisitTracker from './components/VisitTracker';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Wizard from './pages/Wizard';
import Results from './pages/Results';
import ProductDetails from './pages/ProductDetails';
import AdminDashboardUnified from './pages/AdminDashboardUnified';

/* Layout wrapper — shows Navbar on all pages */
function AppLayout() {
  const location = useLocation();
  const hideChatbotPaths = ['/login', '/register'];
  const showChatbot = !hideChatbotPaths.includes(location.pathname);

  return (
    <>
      <Navbar />
      <VisitTracker />

      <Routes>
        {/* ── Public ──────────────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ── Admin (unified dashboard with sidebar) ───────────────────── */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboardUnified />
            </AdminRoute>
          }
        />

        {/* ── Catch-all ────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating assistant — hidden on login and register */}
      {showChatbot && <AssistantWidget />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
