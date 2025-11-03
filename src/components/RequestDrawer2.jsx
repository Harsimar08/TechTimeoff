import React, { useState, useEffect } from 'react'

export default function RequestDrawer({ open, onClose }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [type, setType] = useState('')
  const [note, setNote] = useState('')
  const [notify, setNotify] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!open) {
      // reset form when drawer closed
      setFrom('')
      setTo('')
      setType('')
      setNote('')
      setNotify('')
      setShowModal(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault()
    // Simulate submission: persist small record in localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
      recent.unshift({ id: Date.now(), from, to, type, note, notify, status: 'Pending' })
      localStorage.setItem('leaveRequests', JSON.stringify(recent))
    } catch (err) {
      // ignore
    }
    setShowModal(true)
    // optionally auto close drawer after a short delay
    setTimeout(() => {
      setShowModal(false)
      onClose()
    }, 2200)
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Request Leave</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>From</label>
              <input value={from} onChange={e=>setFrom(e.target.value)} type="date" style={{ display: 'block', width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
            </div>
            <div style={{ width: 80, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{(from && to) ? Math.max(1, (new Date(to)-new Date(from))/(1000*60*60*24)+1) : '0 days'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>To</label>
              <input value={to} onChange={e=>setTo(e.target.value)} type="date" style={{ display: 'block', width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>Select type of leave you want to apply</label>
            <select value={type} onChange={e=>setType(e.target.value)} style={{ display: 'block', width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }}>
              <option value="">Select</option>
              <option>Comp Offs - Not Available</option>
              <option>Earned Leave - 10.42 days available</option>
              <option>Floater Leave - Not Available</option>
              <option>Marriage Leave - 5 days available</option>
              <option>Paternity Leave - 5 days available</option>
              <option>Shared Leave - Not Available</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>Note</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Type here" style={{ display: 'block', width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)', minHeight: 120 }} />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>Notify</label>
            <input value={notify} onChange={e=>setNotify(e.target.value)} placeholder="Search employee" style={{ display: 'block', width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Request</button>
          </div>
        </form>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Request Submitted</div>
              <div style={{color:'var(--muted)',marginBottom:12}}>Your leave request has been submitted.</div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                <button className="btn btn-ghost" onClick={()=>{setShowModal(false); onClose()}}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}