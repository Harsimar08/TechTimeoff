import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Header({onOpenRequest, onToggleSidebar, sidebarOpen}){
  const { user } = useAuth()

  return (
    <div className="topbar" style={{
      width: '100%',
      position: 'relative',
      top: 'unset',
      left: 'unset',
      zIndex: 1000,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="brand" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingLeft: '8px',
        marginLeft: sidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          style={{
            background: sidebarOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 36,
            width: 36,
            borderRadius: 8,
            transition: 'all 0.3s ease',
            boxShadow: sidebarOpen ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = sidebarOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
          aria-label="Toggle sidebar"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="6" width="28" height="3" rx="1.5" fill="white" />
            <rect y="13" width="28" height="3" rx="1.5" fill="white" />
            <rect y="20" width="28" height="3" rx="1.5" fill="white" />
          </svg>
        </button>
        <div className="logo" style={{
          background: 'linear-gradient(135deg, #007bffff 0%, #4e7affff 100%)',
          color: '#d3e52fff',
          boxShadow: '0 4px 12px rgba(0, 115, 255, 0.4)',
          fontWeight: 900,
          flexShrink: 0
        }}>TT</div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          <div style={{fontWeight: 800, color: 'white', fontSize: 18, textShadow: '0 2px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap'}}>TeachTimeOff</div>
          <div style={{fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 500, whiteSpace: 'nowrap'}}>Leave Management System</div>
        </div>
      </div>

      <div className="top-right" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          className="btn btn-ghost request-leave-btn"
          onClick={onOpenRequest}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            color: '#764ba2',
            fontWeight: 800,
            borderRadius: '24px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
            padding: '12px 36px',
            fontSize: '15px',
            letterSpacing: '0.5px',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)';
          }}
        >
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            borderRadius: '24px',
            background: 'linear-gradient(120deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
            mixBlendMode: 'overlay',
            animation: 'shine 3s linear infinite'
          }} />
          <span style={{position: 'relative', zIndex: 2}}>✨ Request Leave</span>
        </button>
        <div className="top-user" style={{
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}>
          <div style={{textAlign: 'right'}}>
            <div className="name" style={{color: 'white', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
              {user?.name || 'User'}
            </div>
            <div style={{fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600}}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') : 'Faculty'}
            </div>
          </div>
          <img 
            src={user?.profileImage || "https://i.pravatar.cc/100?img=12"} 
            alt="avatar" 
            style={{
              border: '3px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover'
            }} 
          />
        </div>
      </div>
      
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
