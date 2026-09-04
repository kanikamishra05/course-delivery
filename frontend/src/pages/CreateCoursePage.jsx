import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../services/courseApi'

export default function CreateCoursePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await createCourse({ title, description, category })
      navigate(`/courses/${res.data.data.course._id}/edit`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1>Create New Course</h1>
        <button onClick={() => navigate('/courses')} className="btn btn-secondary">Cancel</button>
      </div>
      
      <div className="card">
        {error && <div className="alert-box alert-empty mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" required type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" required type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
            {saving ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  )
}
