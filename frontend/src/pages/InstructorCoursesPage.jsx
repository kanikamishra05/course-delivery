import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

const STATUS_BADGE = {
  DRAFT: { label: 'Draft', color: '#888' },
  PUBLISHED: { label: 'Published', color: '#28a745' },
  ARCHIVED: { label: 'Archived', color: '#dc3545' },
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ status: '', category: '', q: '' })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses(params)
      setCourses(res.data.data.courses)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()
    const params = {}
    if (filter.status) params.status = filter.status
    if (filter.category) params.category = filter.category
    if (filter.q) params.q = filter.q
    fetchCourses(params)
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Courses</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/dashboard" style={{ alignSelf: 'center', color: '#0066cc', fontWeight: 600, textDecoration: 'none' }}>
            View Dashboard
          </Link>
          <Link to="/courses/new">
            <button style={{ padding: '8px 20px' }}>+ New Course</button>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <form onSubmit={handleFilter} style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search..."
          value={filter.q}
          onChange={(e) => setFilter({ ...filter, q: e.target.value })}
          style={{ padding: 6, flex: '1 1 160px' }}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: 6 }}
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          style={{ padding: 6, flex: '1 1 120px' }}
        />
        <button type="submit" style={{ padding: '6px 16px' }}>Filter</button>
        <button type="button" style={{ padding: '6px 16px' }} onClick={() => { setFilter({ status: '', category: '', q: '' }); fetchCourses() }}>
          Clear
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found. <Link to="/courses/new">Create your first course.</Link></p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px' }}>Title</th>
              <th style={{ padding: '8px 4px' }}>Category</th>
              <th style={{ padding: '8px 4px' }}>Status</th>
              <th style={{ padding: '8px 4px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const badge = STATUS_BADGE[course.status] || {}
              return (
                <tr key={course._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <Link to={`/courses/${course._id}`}>{course.title}</Link>
                  </td>
                  <td style={{ padding: '8px 4px' }}>{course.category}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <span style={{ color: badge.color, fontWeight: 600 }}>{badge.label}</span>
                  </td>
                  <td style={{ padding: '8px 4px' }}>
                    <Link to={`/courses/${course._id}/edit`}>Edit</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
