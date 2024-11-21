import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Donors from './components/Donors';
import StudentsList from './components/StudentList';
import Scholarship from './components/Scholarship';
import ViewAwardHistory from './components/ViewAwardHistory';
import Apply from './components/Apply';
import AwardHistory from './components/AwardHistory';
import CNR from './components/CNR';
import MRD from './components/MRD';
import DAC from './components/DAC';
import ApplicationFormMRD from './components/ApplicationFormMRD';
import ApplicationFormCNR from './components/ApplicationFormCNR';
import ApplicationFormDAC from './components/ApplicationFormDAC';
import DonorDetails from './components/DonorDetails';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';

// Create AuthContext
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    console.log("Stored Role on initial load:", storedRole);
    setRole(storedRole);
    setLoading(false);
  }, []);

  const updateRole = (newRole) => {
    console.log("Updating role to:", newRole);
    setRole(newRole);
    if (newRole) {
      sessionStorage.setItem('role', newRole);
    } else {
      sessionStorage.removeItem('role');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ role, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { role } = useContext(AuthContext);
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Helper component to redirect authenticated users
const AuthRedirect = ({ children }) => {
  const { role } = useContext(AuthContext);
  return role ? <Navigate to="/home" replace /> : children;
};

// CatchAllRoute component
const CatchAllRoute = () => {
  const { role } = useContext(AuthContext);
  return <Navigate to={role ? "/home" : "/login"} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            <Route 
              path="/login" 
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } 
            />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/about" element={<About />} />

            {/* Protected routes - require any role */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donors" 
              element={
                <ProtectedRoute>
                  <Donors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studentslist" 
              element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scholarship" 
              element={
                <ProtectedRoute>
                  <Scholarship />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/viewawardhistory" 
              element={
                <ProtectedRoute>
                  <ViewAwardHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply" 
              element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only route */}
            <Route 
              path="/award-history" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AwardHistory />
                </ProtectedRoute>
              } 
            />

            {/* Scholarship application routes */}
            <Route 
              path="/apply/mrd" 
              element={
                <ProtectedRoute>
                  <MRD />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/cnr" 
              element={
                <ProtectedRoute>
                  <CNR />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/dac" 
              element={
                <ProtectedRoute>
                  <DAC />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/apply/dac/applicationformmrd" 
              element={
                <ProtectedRoute>
                  <ApplicationFormMRD />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/dac/applicationformcnr" 
              element={
                <ProtectedRoute>
                  <ApplicationFormCNR />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/dac/applicationformdac" 
              element={
                <ProtectedRoute>
                  <ApplicationFormDAC />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/donors/DonorDetails" 
              element={
                <ProtectedRoute>
                  <DonorDetails />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<CatchAllRoute />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;