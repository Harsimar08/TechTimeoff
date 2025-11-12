import React, {useState, useEffect} from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import FacultyDashboard from './pages/FacultyDashboard'
import CoordinatorDashboard from './pages/CoordinatorDashboard'
import ChiefCoordinatorDashboard from './pages/ChiefCoordinatorDashboard'
import PrincipalDashboard from './pages/PrincipalDashboard'
import Profile from './pages/Profile'
import RequestDrawer from './components/RequestDrawer2'
import LeaveBalance from './pages/LeaveBalance'
import { useAuth } from './contexts/AuthContext'

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    switch(user.role) {
      case 'faculty':
        return <Navigate to="/faculty/dashboard" replace />
      case 'coordinator':
        return <Navigate to="/coordinator/dashboard" replace />
      case 'chief_coordinator':
        return <Navigate to="/chief-coordinator/dashboard" replace />
      case 'principal':
        return <Navigate to="/principal/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }
  
  return children
}

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/auth/callback'

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    )
  }

  return (
    <div className="app-root">
      <Header onOpenRequest={()=>setOpenDrawer(true)} onToggleSidebar={()=>setSidebarOpen(v=>!v)} sidebarOpen={sidebarOpen} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
        <main className={`main-root ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty/dashboard" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } />
            
            {/* Coordinator Routes */}
            <Route path="/coordinator/dashboard" element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Chief Coordinator Routes */}
            <Route path="/chief-coordinator/dashboard" element={
              <ProtectedRoute allowedRoles={['chief_coordinator']}>
                <ChiefCoordinatorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Principal Routes */}
            <Route path="/principal/dashboard" element={
              <ProtectedRoute allowedRoles={['principal']}>
                <PrincipalDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shared Routes - All authenticated users */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/leave-balance" element={
              <ProtectedRoute>
                <LeaveBalance />
              </ProtectedRoute>
            } />
            
            {/* Backward compatibility - redirect old /dashboard to appropriate role dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <FacultyDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      <RequestDrawer open={openDrawer} onClose={()=>setOpenDrawer(false)} />
    </div>
  )
}