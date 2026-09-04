import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

export default function CourseDiscoveryPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses({ ...params })
      const { courses: list, total, page, totalPages } = res.data.data
      setCourses(list)
      setPagination({ total, page, totalPages })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = { sort, order }
    if (q) params.q = q
    if (category) params.category = category
    fetchCourses(params)
  }

  const handlePage = (page) => {
    const params = { sort, order, page }
    if (q) params.q = q
    if (category) params.category = category
    fetchCourses(params)
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Discover Courses</h1>
      </div>

      <form onSubmit={handleSearch} className="filter-bar">
        <input className="form-input" style={{ flex: '1 1 200px' }} type="text" placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="form-input" style={{ flex: '1 1 140px' }} type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <select className="form-input" style={{ flex: '0 1 150px' }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Date Added</option>
          <option value="title">Title</option>
          <option value="category">Category</option>
        </select>
        <select className="form-input" style={{ flex: '0 1 120px' }} value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button type="submit" className="btn btn-secondary">Search</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setQ(''); setCategory(''); setSort('createdAt'); setOrder('desc'); fetchCourses() }}>Clear</button>
      </form>

      {error && <div className="alert-box alert-empty mb-4">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1rem' }}>
          <h3 className="mb-2">No courses found</h3>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">{pagination.total} course{pagination.total !== 1 ? 's' : ''} found</p>
          <div className="metric-grid">
            {courses.map((course) => (
              <div key={course._id} className="card flex flex-col justify-between">
                <div>
                  <h3 className="card-title"><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
                  <p className="card-meta mb-4 line-clamp-3">{course.description}</p>
                </div>
                <div>
                  <span className="badge badge-info">{course.category}</span>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
