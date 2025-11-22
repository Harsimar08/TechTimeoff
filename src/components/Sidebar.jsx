import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({open, onClose}){
  const { user } = useAuth()
  
  // Derive profile data directly from user (no local state for user data)
  const profile = {
    name: user?.name || user?.fullName || 'User',
    email: user?.email || '',
    department: user?.department || 'Computer Applications',
    role: user?.role || 'faculty',
    profileImage: user?.avatar || user?.profileImage || null
  }
  
  // Role display mapping
  const roleDisplay = {
    'faculty': 'Faculty Member',
    'coordinator': 'Coordinator',
    'chief_coordinator': 'Chief Coordinator',
    'principal': 'Principal'
  }
  
  // Clean up old localStorage keys on mount (one-time cleanup)
  useEffect(() => {
    // Remove old authentication data if it exists
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser')
      console.log('🧹 Cleaned up old currentUser from localStorage')
    }
    if (localStorage.getItem('profileUser')) {
      localStorage.removeItem('profileUser')
      console.log('🧹 Cleaned up old profileUser from localStorage')
    }
  }, [])
  
  return (
    <aside
      className="sidebar"
      style={{
        position: 'fixed',
        top: 0,
        left: open ? 0 : -240,
        height: '100vh',
        width: '240px',
        background: 'rgba(24, 41, 89, 0.98)',
        boxShadow: '2px 0 16px rgba(44,62,255,0.07)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '24px',
        backdropFilter: 'blur(2px)',
        transition: 'left 0.3s',
      }}
    >
      <div style={{display:'flex',alignItems:'center',gap:10}}>
          <img src={profile.profileImage || "https://i.pravatar.cc/150?img=12"} alt="Profile" style={{width:44,height:44,borderRadius:8}}/>
        <div>
          <div style={{fontWeight:700}}>{profile.name}</div>
          <div style={{fontSize:12,opacity:0.85}}>{roleDisplay[profile.role]}</div>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            display: 'none',
          }}
          className="sidebar-close-btn"
          aria-label="Close sidebar"
        >×</button>
      </div>
      {/* Close button for sidebar */}
      {open && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 28,
            cursor: 'pointer',
            zIndex: 102
          }}
          aria-label="Close sidebar"
        >×</button>
      )}
      <div className="nav-section">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'active':''}>
          <span className="icon">🏠</span>
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'active':''}>
          <span className="icon">👤</span>
          Profile
        </NavLink>
        <NavLink to="/leave-balance" className={({isActive})=> isActive? 'active':''}>
          <span className="icon">📊</span>
          Leave Balance
        </NavLink>
        <a href="#">📅 Holidays</a>
        <a href="#">⏻ Logout</a>
      </div>
    </aside>
  )
}