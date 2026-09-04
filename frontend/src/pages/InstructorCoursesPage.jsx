import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

const STATUS_BADGE = {
  DRAFT: { label: 'Draft', className: 'badge badge-warning' },
  PUBLISHED: { label: 'Published', className: 'badge badge-success' },
  ARCHIVED: { label: 'Archived', className: 'badge badge-danger' },
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ status: '', category: '', q: '' })

  useEffect(() => { fetchCourses() }, [])

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
    <div className="container">
      <div className="page-header">
        <h1>My Courses</h1>
        <Link to="/courses/new" className="btn btn-primary">+ New Course</Link>
      </div>

      <form className="filter-bar" onSubmit={handleFilter}>
        <input className="form-input" style={{ flex: '1 1 200px' }} type="text" placeholder="Search courses..." value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        <select className="form-input" style={{ flex: '0 1 150px' }} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <input className="form-input" style={{ flex: '0 1 150px' }} type="text" placeholder="Category" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} />
        <button type="submit" className="btn btn-secondary">Filter</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setFilter({ status: '', category: '', q: '' }); fetchCourses() }}>Clear</button>
      </form>

      {error && <div className="alert-box alert-empty mb-4">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1rem' }}>
          <h3 className="mb-2">No courses found</h3>
          <p className="text-muted mb-4">You haven't created any courses matching this criteria.</p>
          <Link to="/courses/new" className="btn btn-primary">Create your first course</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const badge = STATUS_BADGE[course.status] || {}
                return (
                  <tr key={course._id}>
                    <td><Link to={`/courses/${course._id}`} style={{ fontWeight: 500 }}>{course.title}</Link></td>
                    <td>{course.category}</td>
                    <td><span className={badge.className}>{badge.label}</span></td>
                    <td><Link to={`/courses/${course._id}/edit`} className="btn btn-secondary btn-sm">Manage</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
