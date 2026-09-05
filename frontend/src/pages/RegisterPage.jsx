import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('LEARNER')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('All fields are required.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setSubmitting(true)
    try {
      await register(name, email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card" style={{ borderColor: '#d1d5db' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
        </div>
        <h1 className="text-center mb-2">Create Account</h1>
        <p className="text-center text-muted mb-6" style={{ fontSize: '0.95rem' }}>Join CourseDelivery to start learning.</p>
        {error && <div className="alert-box alert-empty mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input className="form-input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input className="form-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select className="form-input" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="LEARNER">Learner</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%' }}>
            {submitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-muted">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}
