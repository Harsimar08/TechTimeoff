import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardChart from '../components/DashboardChart'

const recent = [
  {id:1, name:'Alice', type:'CL', reason:'Vacation', start:'12-Jan-2024', end:'15-Jan-2024', status:'Approved'},
  {id:2, name:'Bob', type:'ML', reason:'Sickness', start:'05-Sep-2023', end:'07-Sep-2023', status:'Pending'},
  {id:3, name:'Carol', type:'EL', reason:'Seminar', start:'20-Jul-2023', end:'21-Jul-2023', status:'Approved'},
]

export default function Dashboard(){
  const navigate = useNavigate()
  const [profile, setProfile] = React.useState({ name: 'kritika', email: 'kritika.yadav@jims.edu', department: 'Computer Applications' })

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('profileUser')
      if (raw) setProfile(JSON.parse(raw))
    } catch (err) {
      // ignore
    }
  }, [])

  return (
    <div>
      <div className="page-title">
        <div>
          <h2 style={{margin:0}}>Welcome, {profile.name.split(' ')[0] || profile.name}</h2>
          <div style={{color:'var(--muted)'}}>Faculty Dashboard</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="profile-card">
            <img src="https://i.pravatar.cc/150?img=12" alt="avatar" />
            <div className="profile-meta">
              <div className="title">{profile.name}</div>
              <div className="muted">{profile.email}</div>
              <div style={{marginTop:8}}>{profile.department || 'Computer Applications'} — Assistant Professor</div>
            </div>
            </div>
              <div className="history-card" style={{marginTop:16}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontWeight:700,fontSize:18}}>Leave History</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <select style={{padding:8,borderRadius:6,border:'1px solid var(--border)'}}> 
                      <option>All Types</option>
                      <option>Earned Leave</option>
                      <option>Floater Leave</option>
                      <option>Sick Leave</option>
                    </select>
                    <select style={{padding:8,borderRadius:6,border:'1px solid var(--border)'}}>
                      <option>All Status</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>
                    <input placeholder="Search" style={{padding:8,borderRadius:6,border:'1px solid var(--border)'}} />
                  </div>
                </div>

                <div style={{marginTop:12,overflowX:'auto'}}>
                  <table className="leave-history-table">
                    <thead>
                      <tr>
                        <th>Leave Dates</th>
                        <th>Leave Type</th>
                        <th>Status</th>
                        <th>Requested By</th>
                        <th>Action Taken On</th>
                        <th>Leave Note</th>
                        <th>Reject/Cancellation Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {dates:'23 Oct - 24 Oct 2025\n2 Days', type:'Earned Leave\nRequested on 29 Sep 2025', status:'Approved\nby Amit Bora', requestedBy:'Himanshu Gola', actionOn:'06 Oct 2025', note:'Taking leave for family commitment.'},
                        {dates:'01 Oct 2025\n1 Day', type:'Floater Leave\nRequested on 24 Sep 2025', status:'Approved\nby Amit Bora', requestedBy:'Himanshu Gola', actionOn:'25 Sep 2025', note:'Floater Leave'},
                        {dates:'26 Sept 2025\n1 Day', type:'Sick Leave\nRequested on 26 Sep 2025', status:'Approved\nby Amit Bora', requestedBy:'Himanshu Gola', actionOn:'29 Sep 2025', note:'Not well today, will be on sick leave.'},
                        {dates:'11 Jul 2025\n1 Day', type:'Sick Leave\nRequested on 11 Jul 2025', status:'Approved\nby Amit Bora', requestedBy:'Himanshu Gola', actionOn:'14 Jul 2025', note:'Taking one day sick leave , as not feeling well.'},
                        {dates:'19 May 2025\n1 Day', type:'Earned Leave\nRequested on 05 May 2025', status:'Approved\nby Amit Bora', requestedBy:'Himanshu Gola', actionOn:'12 May 2025', note:'Family Commitment'}
                      ].map((r,idx)=> (
                        <tr key={idx}>
                          <td style={{whiteSpace:'pre-line'}}>{r.dates}</td>
                          <td style={{whiteSpace:'pre-line'}}>{r.type}</td>
                          <td><span style={{color:'#10b981',fontWeight:700}}>{r.status.split('\n')[0]}</span><div style={{fontSize:12,color:'var(--muted)'}}>{r.status.split('\n')[1]}</div></td>
                          <td>{r.requestedBy}</td>
                          <td>{r.actionOn}</td>
                          <td style={{maxWidth:240}}>{r.note}</td>
                          <td>—</td>
                          <td>---</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                  <div style={{color:'var(--muted)'}}>1 to 5 of 10</div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-ghost">‹</button>
                    <button className="btn btn-ghost">›</button>
                  </div>
                </div>
              </div>
          </div>

        <aside className="right-summary">
          <div className="summary-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontWeight:700}}>Leave Summary</div>
              <div style={{color:'var(--muted)',fontSize:13}}>Year</div>
            </div>
            <div style={{marginTop:12}}>
              <div className="summary-row"><div className="summary-title">CL</div><div className="summary-value">4</div></div>
              <div className="summary-row"><div className="summary-title">EL</div><div className="summary-value">8</div></div>
              <div className="summary-row"><div className="summary-title">ML</div><div className="summary-value">2</div></div>
            </div>
          </div>

          <div className="upcoming-card">
            <div style={{fontWeight:700}}>Upcoming Leave</div>
            <div style={{marginTop:10}}>
              <div className="upcoming-item"><div>CL</div><div>16-Mar-2024 — 18-Mar-2024</div></div>
              <div className="upcoming-item"><div>- Vacation</div></div>
            </div>
          </div>
        </aside>
      </div>

      <div className="content-row">
        <div style={{width: '100%'}}>
          <DashboardChart />
        </div>
      </div>

      
    </div>
  )
}