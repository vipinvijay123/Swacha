import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import FacilityDetails from './pages/FacilityDetails';
import Inspections from './pages/Inspections';
import NewInspection from './pages/NewInspection';
import InspectionDetails from './pages/InspectionDetails';
import Standards from './pages/Standards';
import Violations from './pages/Violations';
import CorrectiveActions from './pages/CorrectiveActions';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      </Route>

      {/* Main Dashboard Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/facilities/:id" element={<FacilityDetails />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/inspections/new" element={<NewInspection />} />
        <Route path="/inspections/:id" element={<InspectionDetails />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/corrective-actions" element={<CorrectiveActions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
