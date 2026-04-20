import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminDashboard from './pages/AdminDashboard';
import AdminRules from './pages/AdminRules';
import AdminRecommendationHistory from './pages/AdminRecommendationHistory';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

          {/* ── Admin (ADMIN role required) ──────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rules"
            element={
              <AdminRoute>
                <AdminRules />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/history"
            element={
              <AdminRoute>
                <AdminRecommendationHistory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AnalyticsDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ── Catch-all ────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Floating assistant — available on all pages */}
        <AssistantWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}
