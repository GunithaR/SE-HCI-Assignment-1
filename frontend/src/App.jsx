import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import AssistantWidget from './components/AssistantWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Wizard from './pages/Wizard';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* ── Public ──────────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/results" element={<Results />} />

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
