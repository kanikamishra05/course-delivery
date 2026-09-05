import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

const STATUS_BADGE = {
  DRAFT: { label: 'Draft', className: 'badge badge-warning' },
  PUBLISHED: { label: 'Published', className: 'badge badge-success' },
  ARCHIVED: { label: 'Archived', className: 'badge badge-danger' },
}

const getCategoryIcon = (categoryTitle) => {
  const t = (categoryTitle || '').toLowerCase()
  if (t.includes('network')) {
    return <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>
  } else if (t.includes('database')) {
    return <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
  } else if (t.includes('data structure') || t.includes('algorithm')) {
    return <svg width="18" height="18" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
  } else if (t.includes('javascript') || t.includes('js')) {
    return <svg width="18" height="18" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  } else if (t.includes('full stack') || t.includes('web')) {
    return <svg width="18" height="18" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  }
  return <svg width="18" height="18" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
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

      <form className="filter-bar" onSubmit={handleFilter} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input className="form-input" style={{ width: '100%', paddingLeft: '36px' }} type="text" placeholder="Search courses..." value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        </div>
        <div style={{ position: 'relative', flex: '0 1 150px', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="10" y1="18" x2="14" y2="18"></line></svg>
          <select className="form-input" style={{ width: '100%', paddingLeft: '36px' }} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div style={{ position: 'relative', flex: '0 1 150px', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <input className="form-input" style={{ width: '100%', paddingLeft: '36px' }} type="text" placeholder="Category" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filter
        </button>
        <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => { setFilter({ status: '', category: '', q: '' }); fetchCourses() }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          Clear
        </button>
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
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getCategoryIcon(course.category || course.title)}
                        <Link to={`/courses/${course._id}`} style={{ fontWeight: 500 }}>{course.title}</Link>
                      </div>
                    </td>
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
