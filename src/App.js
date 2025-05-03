import React from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import SearchPage from "./pages/SearchPage";
import Navbar from "./components/Navbar";
import APIDocumentation from "./pages/APIDocumentation";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";  // Make sure this matches your file name
import Unauthorized from "./pages/Unauthorized";
import PendingApproval from './pages/PendingApproval';

function App() {
  return (
    
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 w-full">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/api-docs" element={<APIDocumentation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

            
            {/* Protected routes - Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRoles={['admin', 'superadmin']}>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            
            {/* Protected routes - Super Admin */}
            <Route
              path="/super-admin"
              element={
                <PrivateRoute requiredRoles={['superadmin']}>
                  <SuperAdminPage />
                </PrivateRoute>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
