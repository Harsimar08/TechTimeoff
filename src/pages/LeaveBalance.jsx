import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

// fallback static types used when backend data is empty
const fallbackLeaveTypes = [
  { id: 'comp', name: 'Comp Offs', available: 0, consumed: 0, quota: 0, color: '#F87171' },
  { id: 'earned', name: 'Earned Leave', available: 10.42, consumed: 10, quota: 15, color: '#F59E0B', carryOver: 7.92, accruedSoFar: 12.5 },
  { id: 'marriage', name: 'Marriage Leave', available: 5, consumed: 0, quota: 5, color: '#10B981' },
  { id: 'shared', name: 'Shared Leave', available: 0, consumed: 0, quota: 0, color: '#6366F1' },
  { id: 'sick', name: 'Sick Leave', available: 3, consumed: 3, quota: 6, color: '#8B5CF6' },
  { id: 'unpaid', name: 'Unpaid Leave', available: 0, consumed: 0, color: '#EC4899' }
]

function CircleGraph({ available, consumed, quota, color }) {
  const radius = 50
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (available / (quota || 1)) * circumference

  return (
    <svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
      <circle
        stroke="var(--border)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + ' ' + circumference}
        strokeLinecap="round"
        style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        style={{fill: 'var(--muted)', fontSize: '14px'}}
      >
        {available}d
      </text>
    </svg>
  )
}

export default function LeaveBalance() {
  const { user, loading } = useAuth()
  const [leaveTypes, setLeaveTypes] = useState(fallbackLeaveTypes)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      if (loading) return
      if (!user || !user.username) {
        setLoadingData(false)
        return
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      try {
        const res = await fetch(`${API_URL}/leave-balances?username=${encodeURIComponent(user.username)}`)
        const data = await res.json()
        if (data.success && Array.isArray(data.balances) && data.balances.length) {
          // map balances to leaveTypes array
          const mapped = data.balances.map(b => ({
            id: b.leave_type || b.leaveType || b.type,
            name: (b.leave_type || b.leaveType || b.type).replace(/_/g, ' '),
            available: Number(b.days_available) || 0,
            consumed: Number(b.days_consumed) || 0,
            quota: null,
            color: '#667eea'
          }))
          setLeaveTypes(mapped)
        }
      } catch (err) {
        console.error('Failed to load leave balances', err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchBalances()
  }, [user, loading])

  return (
    <div>
      <div className="page-title">
        <div>
          <h2 style={{margin:0}}>Leave Balances</h2>
          <div style={{color:'var(--muted)'}}>Overview of your leave quotas and usage</div>
        </div>
      </div>

      <div className="grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
        {loadingData ? (
          <div>Loading leave balances…</div>
        ) : (
          leaveTypes.map(type => (
            <div key={type.id} className="balance-card" style={{background:'var(--panel)', padding:20, borderRadius:8, border:'1px solid var(--border)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:16, fontWeight:600, marginBottom:4}}>{type.name}</div>
                  {type.available === 0 && !type.consumed && (
                    <div style={{fontSize:13, color:'var(--muted)'}}>No data to display</div>
                  )}
                </div>
                <button className="btn btn-ghost" style={{fontSize:13}}>View details</button>
              </div>

              {(type.available > 0 || type.consumed > 0) && (
                <>
                  <div style={{display:'flex', justifyContent:'center', margin:'20px 0'}}>
                    <CircleGraph
                      available={type.available}
                      consumed={type.consumed}
                      quota={type.quota}
                      color={type.color}
                    />
                  </div>
                  
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, fontSize:13}}>
                    <div>
                      <div style={{color:'var(--muted)'}}>Available</div>
                      <div style={{fontWeight:500}}>{type.available} days</div>
                    </div>
                    <div>
                      <div style={{color:'var(--muted)'}}>Consumed</div>
                      <div style={{fontWeight:500}}>{type.consumed} days</div>
                    </div>
                    {type.quota && (
                      <>
                        <div>
                          <div style={{color:'var(--muted)'}}>Annual Quota</div>
                          <div style={{fontWeight:500}}>{type.quota} days</div>
                        </div>
                        {type.accruedSoFar && (
                          <div>
                            <div style={{color:'var(--muted)'}}>Accrued so far</div>
                            <div style={{fontWeight:500}}>{type.accruedSoFar} days</div>
                          </div>
                        )}
                        {type.carryOver && (
                          <div>
                            <div style={{color:'var(--muted)'}}>Carry Over</div>
                            <div style={{fontWeight:500}}>{type.carryOver} days</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}