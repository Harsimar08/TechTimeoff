import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticateUser } from '../utils/api-auth'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState('faculty')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { id: 'faculty', name: 'Faculty', icon: '👨‍🏫', color: '#667eea' },
    { id: 'coordinator', name: 'Coordinator', icon: '👔', color: '#f093fb' },
    { id: 'chief_coordinator', name: 'Chief Coordinator', icon: '👨‍💼', color: '#4facfe' },
    { id: 'principal', name: 'Principal', icon: '🎓', color: '#fa709a' }
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const { token, user } = await authenticateUser(email, password, selectedRole)
      
      // Use AuthContext to manage user state (not localStorage)
      await login(user, token)
      
      // Navigate based on role
      switch(user.role) {
        case 'faculty':
          navigate('/faculty/dashboard')
          break
        case 'coordinator':
          navigate('/coordinator/dashboard')
          break
        case 'chief_coordinator':
          navigate('/chief-coordinator/dashboard')
          break
        case 'principal':
          navigate('/principal/dashboard')
          break
        default:
          navigate('/faculty/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    }
  }

  const handleGitHubLogin = () => {
    // Get backend URL from environment
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const backendUrl = API_URL.replace('/api', '')
    window.location.href = `${backendUrl}/api/auth/github`
  }

  const handleGoogleLogin = () => {
    // Get backend URL from environment
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const backendUrl = API_URL.replace('/api', '')
    window.location.href = `${backendUrl}/api/auth/google`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <span style={{ fontSize: '40px', color: 'white' }}>📚</span>
        </div>

        <h1 style={{
          color: 'white',
          fontSize: '36px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>Welcome to TechTimeOff</h1>
        
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '16px',
          margin: '0 0 32px 0'
        }}>Your unified leave management system</p>

        {/* Login Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '24px',
          padding: '40px 32px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>Sign In</h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            margin: '0 0 24px 0'
          }}>Choose your preferred method to continue</p>

          {/* Role Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              marginBottom: '12px',
              fontWeight: '500',
              textAlign: 'left'
            }}>Select Your Role</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '16px 12px',
                    background: selectedRole === role.id 
                      ? `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`
                      : 'rgba(255,255,255,0.1)',
                    border: selectedRole === role.id 
                      ? `2px solid ${role.color}`
                      : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transform: selectedRole === role.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedRole === role.id 
                      ? `0 8px 20px ${role.color}40`
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{role.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{role.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* OAuth Buttons */}
          <button onClick={handleGitHubLogin} style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>📱</span> Continue with GitHub
          </button>

          <button onClick={handleGoogleLogin} style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>🔍</span> Continue with Google
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
            <span style={{ padding: '0 12px' }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px',
                marginBottom: '16px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Remember me
              </label>
              <a href="#" style={{
                color: '#a78bfa',
                fontSize: '14px',
                textDecoration: 'none'
              }}>Forgot password?</a>
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <span>→</span> Sign In
            </button>
          </form>

          <p style={{
            marginTop: '24px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px'
          }}>
            Don't have an account? <a href="/signup" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '600' }}>Sign up</a>
          </p>
        </div>

        <p style={{
          marginTop: '24px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px'
        }}>
          By continuing, you agree to our <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Privacy Policy</a>
        </p>

        {/* Test Credentials Info */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'left'
        }}>
          <p style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Test Credentials:</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '4px 0' }}>Faculty: faculty@jims.edu / faculty123</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '4px 0' }}>Coordinator: coordinator@jims.edu / coord123</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '4px 0' }}>Chief: chief@jims.edu / chief123</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '4px 0' }}>Principal: principal@jims.edu / principal123</p>
        </div>
      </div>
    </div>
  )
}
