import React from 'react';

export default function LeaveRequest() {
  return (
    <div className="leave-request-page" style={{
      minHeight: 'calc(100vh - 64px)', // header height
      width: '100%',
      background: 'linear-gradient(120deg, #f6f8fb 60%, #e3eafe 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '48px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 640,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px rgba(44,62,255,0.10)',
        padding: 48,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{marginBottom: '32px', fontWeight: 800, fontSize: '2.2rem', color: '#2563eb'}}>Leave Request</h2>
        <form style={{width: '100%'}}>
          <div style={{marginBottom: 28}}>
            <label style={{fontWeight: 600, color: '#2563eb'}}>Leave Type</label><br/>
            <select style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}}>
              <option value="CL">Casual Leave</option>
              <option value="EL">Earned Leave</option>
              <option value="ML">Medical Leave</option>
            </select>
          </div>
          <div style={{marginBottom: 28}}>
            <label style={{fontWeight: 600, color: '#2563eb'}}>Reason</label><br/>
            <input type="text" style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} placeholder="Enter reason" />
          </div>
          <div style={{marginBottom: 28, display: 'flex', gap: 24}}>
            <div style={{flex: 1}}>
              <label style={{fontWeight: 600, color: '#2563eb'}}>Start Date</label><br/>
              <input type="date" style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} />
            </div>
            <div style={{flex: 1}}>
              <label style={{fontWeight: 600, color: '#2563eb'}}>End Date</label><br/>
              <input type="date" style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '16px', borderRadius: 12, fontWeight: 700, fontSize: '1.15rem', background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 12px rgba(44,62,255,0.10)', marginTop: 12}}>Submit Request</button>
        </form>
      </div>
    </div>
  );
}
