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

  useEffect(() => {
    fetchCourses()
  }, [])

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
    const params = {}
    if (q) params.q = q
    if (category) params.category = category
    params.sort = sort
    params.order = order
    fetchCourses(params)
  }

  const handlePage = (page) => {
    const params = {}
    if (q) params.q = q
    if (category) params.category = category
    params.sort = sort
    params.order = order
    params.page = page
    fetchCourses(params)
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <h1>Browse Courses</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, flex: '1 1 200px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 8, flex: '1 1 140px' }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: 8 }}>
          <option value="createdAt">Date Added</option>
          <option value="title">Title</option>
          <option value="category">Category</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)} style={{ padding: 8 }}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button type="submit" style={{ padding: '8px 20px' }}>Search</button>
        <button type="button" style={{ padding: '8px 16px' }} onClick={() => { setQ(''); setCategory(''); setSort('createdAt'); setOrder('desc'); fetchCourses() }}>
          Clear
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <>
          <p style={{ color: '#666' }}>{pagination.total} course{pagination.total !== 1 ? 's' : ''} found</p>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {courses.map((course) => (
              <div key={course._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <h3 style={{ margin: '0 0 8px' }}>
                  <Link to={`/courses/${course._id}`}>{course.title}</Link>
                </h3>
                <p style={{ color: '#555', fontSize: 14, margin: '0 0 8px' }}>{course.description}</p>
                <span style={{ fontSize: 13, background: '#e9e9e9', padding: '2px 8px', borderRadius: 4 }}>
                  {course.category}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  style={{ padding: '4px 12px', fontWeight: p === pagination.page ? 700 : 400 }}
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
