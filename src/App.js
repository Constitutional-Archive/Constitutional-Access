import React from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";


import RoleRedirect from "./pages/RoleRedirect";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import SuperAdminPage from "./pages/SuperAdminPage";
import SearchPage from "./pages/SearchPage";
import Navbar from "./components/Navbar";
import APIDocumentation from "./pages/APIDocumentation";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import ContactPage from "./pages/ContactPage";
import Unauthorized from "./pages/Unauthorized";
import PendingApproval from "./pages/PendingApproval";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 w-full">
          <Routes>

            {/* 👇 Redirects based on role after login */}
            <Route path="/" element={<HomePage />} />
            <Route path="/redirect" element={<RoleRedirect />} />

            {/* Public */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/api-docs" element={<APIDocumentation />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

            {/* Protected: Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRoles={['admin', 'super_admin']}>
                  <AdminPage />
                </PrivateRoute>
              }
            />

            {/* Protected: Super Admin */}
            <Route
              path="/super-admin"
              element={
                <PrivateRoute requiredRoles={['super_admin']}>
                  <SuperAdminPage />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
