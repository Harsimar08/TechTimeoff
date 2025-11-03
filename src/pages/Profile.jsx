import React, { useState, useRef, useEffect } from 'react'

export default function Profile() {
  const fileInputRef = useRef(null)
  const [profileImage, setProfileImage] = useState(null)
  const [editMode, setEditMode] = useState({})

  const [user, setUser] = useState({
    name: 'Kritika Yadav',
    email: 'kritika.yadav@jims.edu',
    role: 'Teacher',
    department: 'Computer Applications',
    joiningDate: '2020-09-01',
    qualification: 'MCA',
    specialization: 'Web Development',
    phone: '+91 999-999-9999',
    gender: 'Female'
  })

  const balances = [
    { type: 'Casual', days: 6 },
    { type: 'Sick', days: 4 },
    { type: 'Earned', days: 2 }
  ]

  const calculateExperience = (joiningDate) => {
    try {
      const join = new Date(joiningDate)
      const today = new Date()
      let years = today.getFullYear() - join.getFullYear()
      let months = today.getMonth() - join.getMonth()
      if (months < 0) {
        years -= 1
        months += 12
      }
      return `${years} years ${months} months`
    } catch (err) {
      return '-'
    }
  }

  // Image handling: resize+compress before saving to localStorage to avoid quota issues
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let { width, height } = img
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setProfileImage(dataUrl)
        try {
          localStorage.setItem('profileImage', dataUrl)
        } catch (err) {
          // ignore storage errors
        }
      }
      img.onerror = () => {
        // fallback: store raw result
        try {
          setProfileImage(reader.result)
          localStorage.setItem('profileImage', reader.result)
        } catch (err) {}
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    try { localStorage.removeItem('profileImage') } catch (err) {}
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  // editing helpers: only one field editable at a time
  const startEdit = (field) => setEditMode({ [field]: true })
  const saveField = (field, value) => {
    setUser((prev) => {
      const next = { ...prev, [field]: value }
      try {
        localStorage.setItem('profileUser', JSON.stringify(next))
      } catch (err) {}
      return next
    })
    setEditMode({})
  }

  // load saved profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('profileUser')
      if (saved) setUser(JSON.parse(saved))
      const img = localStorage.getItem('profileImage')
      if (img) setProfileImage(img)
    } catch (err) {}
  }, [])

  // persist user on change (catch-all)
  useEffect(() => {
    try {
      localStorage.setItem('profileUser', JSON.stringify(user))
    } catch (err) {}
  }, [user])

  const EditableField = ({ label, value, field }) => {
    const inputRef = useRef(null)
    const [inputValue, setInputValue] = useState(value ?? '')

    useEffect(() => {
      if (editMode[field]) setInputValue(value ?? '')
    }, [editMode[field]])

    useEffect(() => {
      if (editMode[field] && inputRef.current) {
        inputRef.current.focus()
        const v = inputRef.current.value
        inputRef.current.setSelectionRange(v.length, v.length)
      }
    }, [editMode[field]])

    return (
      <div
        style={{
          padding: '12px 0',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: 1, marginRight: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>{label}</div>
          {editMode[field] ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => saveField(field, inputValue)}
              style={{
                padding: '6px 8px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1em',
                width: '100%',
                maxWidth: '360px'
              }}
            />
          ) : (
            <div>{value}</div>
          )}
        </div>
        <button
          onClick={() => {
            if (editMode[field]) saveField(field, inputValue)
            else startEdit(field)
          }}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: 'none',
            color: '#2874f0',
            cursor: 'pointer',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}
        >
          {editMode[field] ? 'Save' : 'Edit'}
        </button>
      </div>
    )
  }

  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>My Profile</h2>
      </div>

      {/* Personal Information Section */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ margin: 0 }}>Personal Information</h3>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div className="profile-image-container" style={{ position: 'relative' }}>
            <div
              className="profile-image"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                position: 'relative'
              }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="avatar" style={{ width: '100%', height: '100%', fontSize: '48px' }}>{user.name.split(' ').map(n => n[0]).join('')}</div>
              )}
            </div>
            <div style={{ position: 'absolute', bottom: '6px', right: '6px', display: 'flex', gap: '8px' }}>
              <button
                onClick={triggerFileInput}
                title="Change photo"
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  background: '#60a5fa',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span role="img" aria-label="change photo">📷</span>
              </button>
              {profileImage && (
                <button
                  onClick={removeProfileImage}
                  title="Remove photo"
                  style={{
                    padding: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  ✖
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div className="profile-details" style={{ flex: 1 }}>
            <EditableField label="Full Name" value={user.name} field="name" />
            <EditableField label="Email Address" value={user.email} field="email" />
            <EditableField label="Mobile Number" value={user.phone} field="phone" />
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>Gender</div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="gender" value="Male" checked={user.gender === 'Male'} onChange={(e) => setUser(prev => ({ ...prev, gender: e.target.value }))} />
                  Male
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="gender" value="Female" checked={user.gender === 'Female'} onChange={(e) => setUser(prev => ({ ...prev, gender: e.target.value }))} />
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3  style={{ margin: 0 }}>Professional Information</h3>
        </div>
        <div>
          <EditableField label="Department" value={user.department} field="department" />
          <EditableField label="Role" value={user.role} field="role" />
          <EditableField label="Qualification" value={user.qualification} field="qualification" />
          <EditableField label="Specialization" value={user.specialization} field="specialization" />
          <EditableField label="Joining Date" value={user.joiningDate} field="joiningDate" />
          <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>Experience</div>
            <div>{calculateExperience(user.joiningDate)}</div>
          </div>
        </div>
      </div>

      {/* Leave Balances Section */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Leave Balances</h3>
        <div className="leaves-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {balances.map(b => (
            <div className="leave-balance" key={b.type} style={{ padding: '16px', background: 'var(--background)', borderRadius: '8px' }}>
              <div style={{ color: 'var(--muted)' }}>{b.type}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{b.days} days</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
