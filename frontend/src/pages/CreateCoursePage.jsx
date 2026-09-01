import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../services/courseApi'

export default function CreateCoursePage() {
  const [form, setForm] = useState({ title: '', description: '', category: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.description || !form.category) {
      setError('All fields are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await createCourse(form)
      const courseId = res.data.data.course._id
      navigate(`/courses/${courseId}/edit`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <h1>Create New Course</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="title">Title</label><br />
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="description">Description</label><br />
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="category">Category</label><br />
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={submitting} style={{ padding: '8px 24px', marginRight: 8 }}>
          {submitting ? 'Creating...' : 'Create Course'}
        </button>
        <button type="button" onClick={() => navigate('/courses')} style={{ padding: '8px 16px' }}>
          Cancel
        </button>
      </form>
    </div>
  )
}
