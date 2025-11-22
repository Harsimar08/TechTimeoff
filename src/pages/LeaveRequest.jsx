import React, { useState, useEffect } from 'react';

export default function LeaveRequest() {
  const [leaveType, setLeaveType] = useState('CL');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notifyUser, setNotifyUser] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch existing leaves on component mount
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      // Fetch user's leave requests
      fetch(`http://localhost:5000/api/leaves?username=${username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('Recent stored leave requests:', data.leaves);
            setLeaves(data.leaves);
          }
        })
        .catch(err => console.error('Error fetching leaves:', err));

      // Fetch available users for notification
      fetch(`http://localhost:5000/api/users`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAvailableUsers(data.users);
          }
        })
        .catch(err => console.error('Error fetching users:', err));
    }
  }, []);

  // Calculate days between dates
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.max(1, (end - start) / (1000 * 60 * 60 * 24) + 1);
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    let username = localStorage.getItem('username');
    if (!username) {
      username = 'adi'; // default to 'adi' user
      localStorage.setItem('username', username);
    }

    // Validate required fields
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: startDate,
          to: endDate,
          type: leaveType,
          note: reason,
          notify: notifyUser || null,
          username
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('New leave request stored:', {
          from: startDate,
          to: endDate,
          type: leaveType,
          note: reason,
          notify: notifyUser,
          username
        });
        setMessage('Leave request submitted successfully!');
        
        // Refresh leaves list
        const leavesRes = await fetch(`http://localhost:5000/api/leaves?username=${username}`);
        const leavesData = await leavesRes.json();
        if (leavesData.success) {
          setLeaves(leavesData.leaves);
        }
        
        // Clear form
        setReason('');
        setStartDate('');
        setEndDate('');
        setNotifyUser('');
      } else {
        setMessage('Failed to submit leave request: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Error submitting leave request: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users based on search
  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(notifyUser.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(notifyUser.toLowerCase()))
  );

  return (
    <div className="leave-request-page" style={{
      minHeight: 'calc(100vh - 64px)',
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
        <form onSubmit={handleSubmit} style={{width: '100%'}}>
          {/* Leave Type */}
          <div style={{marginBottom: 28}}>
            <label style={{fontWeight: 600, color: '#2563eb'}}>Leave Type</label><br/>
            <select 
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}}
            >
              <option value="CL">Casual Leave</option>
              <option value="EL">Earned Leave</option>
              <option value="ML">Medical Leave</option>
            </select>
          </div>

          {/* Reason */}
          <div style={{marginBottom: 28}}>
            <label style={{fontWeight: 600, color: '#2563eb'}}>Reason</label><br/>
            <input 
              type="text" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} 
              placeholder="Enter reason" 
            />
          </div>

          {/* Dates */}
          <div style={{marginBottom: 28, display: 'flex', gap: 24}}>
            <div style={{flex: 1}}>
              <label style={{fontWeight: 600, color: '#2563eb'}}>Start Date</label><br/>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} 
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{fontWeight: 600, color: '#2563eb'}}>End Date</label><br/>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} 
              />
            </div>
          </div>

          {/* Days Display */}
          {(startDate && endDate) && (
            <div style={{marginBottom: 28, padding: '12px', backgroundColor: '#e3eafe', borderRadius: 8, textAlign: 'center', color: '#2563eb', fontWeight: 600}}>
              Total Days: {calculateDays().toFixed(0)} days
            </div>
          )}

          {/* Notify User */}
          <div style={{marginBottom: 28, position: 'relative'}}>
            <label style={{fontWeight: 600, color: '#2563eb'}}>Notify User</label><br/>
            <input 
              type="text" 
              value={notifyUser}
              onChange={(e) => {
                setNotifyUser(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              style={{width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: '1.05rem'}} 
              placeholder="Search employee name or email" 
            />
            
            {/* User Search Dropdown */}
            {searchOpen && notifyUser && filteredUsers.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #e6e9ef',
                borderRadius: 8,
                marginTop: 4,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setNotifyUser(user.username);
                      setSearchOpen(false);
                    }}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #e6e9ef',
                      cursor: 'pointer',
                      ':hover': {backgroundColor: '#f8fafc'}
                    }}
                  >
                    <div style={{fontWeight: 600, color: '#2563eb'}}>{user.username}</div>
                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
              color: message.includes('success') ? '#166534' : '#991b1b',
            }}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary" 
            style={{
              width: '100%', 
              padding: '16px', 
              borderRadius: 12, 
              fontWeight: 700, 
              fontSize: '1.15rem', 
              background: submitting ? '#94a3b8' : 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)', 
              color: '#fff', 
              border: 'none', 
              boxShadow: '0 2px 12px rgba(44,62,255,0.10)', 
              marginTop: 12,
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        
        {/* Display existing leave requests */}
        <div style={{marginTop: '48px', width: '100%'}}>
          <h3 style={{color: '#2563eb', marginBottom: '24px'}}>Your Leave Requests</h3>
          {leaves.map(leave => (
            <div key={leave.id} style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span style={{color: '#2563eb', fontWeight: '600'}}>
                  {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  backgroundColor: leave.status === 'Pending' ? '#fef9c3' : '#dcfce7',
                  color: leave.status === 'Pending' ? '#854d0e' : '#166534',
                  fontSize: '0.875rem'
                }}>
                  {leave.status}
                </span>
              </div>
              <div style={{color: '#64748b'}}>{leave.note || 'No reason provided'}</div>
              {leave.notify && (
                <div style={{fontSize: '0.875rem', color: '#7c3aed', marginTop: '8px', fontWeight: 500}}>
                  📧 Notified: {leave.notify}
                </div>
              )}
              <div style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '8px'}}>
                Submitted on: {new Date(leave.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {leaves.length === 0 && (
            <div style={{textAlign: 'center', color: '#64748b', padding: '32px'}}>
              No leave requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}