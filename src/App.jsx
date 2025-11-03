import React, {useState} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import RequestDrawer from './components/RequestDrawer2'
import LeaveRequest from './pages/LeaveRequest'

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <div className="app-root">
      <Header onOpenRequest={()=>setOpenDrawer(true)} onToggleSidebar={()=>setSidebarOpen(v=>!v)} sidebarOpen={sidebarOpen} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
        <main className={`main-root ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leave-request" element={<LeaveRequest />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <RequestDrawer open={openDrawer} onClose={()=>setOpenDrawer(false)} />
    </div>
  )
}