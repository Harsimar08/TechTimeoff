import React from 'react'

export default function Header({onOpenRequest, onToggleSidebar, sidebarOpen}){
  return (
    <div className={`topbar ${sidebarOpen ? 'shifted' : ''}`} style={{
      position: 'relative', // Ensure navbar is not fixed or sticky
      top: 'unset',
      left: 'unset',
      zIndex: 200,
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 2px 8px rgba(44,62,255,0.07)',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="brand">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            outline: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 36,
            width: 36,
            marginRight: 6,
            borderRadius: 6,
            transition: 'background 0.2s',
            backgroundColor: sidebarOpen ? 'rgba(37,99,235,0.08)' : 'transparent',
            boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
            border: sidebarOpen ? '1px solid #2563eb' : '1px solid transparent',
            zIndex: 101
          }}
          aria-label="Toggle sidebar"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="6" width="28" height="3" rx="1.5" fill="#2563eb" />
            <rect y="13" width="28" height="3" rx="1.5" fill="#2563eb" />
            <rect y="20" width="28" height="3" rx="1.5" fill="#2563eb" />
          </svg>
        </button>
        <div className="logo">TT</div>
        <div>
          <div style={{fontWeight:700}}>TeachTimeOff</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Leave Approval Management</div>
        </div>
      </div>

      <div className="top-right">
        <button
          className="btn btn-ghost request-leave-btn"
          onClick={onOpenRequest}
          style={{
            background: 'linear-gradient(90deg, rgba(14, 70, 192, 0.7) 0%, rgba(26, 70, 227, 0.7) 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(44, 62, 255, 0.18)',
            padding: '10px 32px',
            fontSize: '1rem',
            letterSpacing: '0.5px',
            border: '1px solid rgba(255,255,255,0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.07)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(44, 62, 255, 0.28)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(44, 62, 255, 0.18)';
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
            background: 'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 60%)',
            mixBlendMode: 'screen',
            animation: 'shine 2.5s linear infinite'
          }} />
          <span style={{position:'relative',zIndex:2}}>Request Leave</span>
        </button>
        <div className="top-user">
          <div style={{textAlign:'right'}}>
            <div className="name">Kritika Yadav</div>
            <div style={{fontSize:12,color:'var(--muted)'}}>Admin</div>
          </div>
          <img src="https://i.pravatar.cc/100?img=12" alt="avatar" />
        </div>
      </div>
    </div>
  )
}