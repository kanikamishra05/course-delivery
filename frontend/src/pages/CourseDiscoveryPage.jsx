import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseApi'

import { getCategoryStyle } from '../utils/courseIcons'

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
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 60px)', padding: '2rem 0', margin: '-2rem 0' }}>
      <div className="container" style={{ margin: '0 auto' }}>
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1>Discover Courses</h1>
        </div>

        <form onSubmit={handleSearch} className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input className="form-input" style={{ width: '100%', paddingLeft: '36px' }} type="text" placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div style={{ position: 'relative', flex: '1 1 140px', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <input className="form-input" style={{ width: '100%', paddingLeft: '36px' }} type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div style={{ position: 'relative', flex: '0 1 150px', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <select className="form-input" style={{ width: '100%', paddingLeft: '36px' }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div style={{ position: 'relative', flex: '0 1 120px', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '10px', color: '#64748b' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {order === 'asc'
                ? <><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></>
                : <><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></>
              }
            </svg>
            <select className="form-input" style={{ width: '100%', paddingLeft: '36px' }} value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e40af', borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Search
          </button>
          <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => { setQ(''); setCategory(''); setSort('createdAt'); setOrder('desc'); fetchCourses() }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Clear
          </button>
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
            <p className="text-muted mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              {pagination.total} course{pagination.total !== 1 ? 's' : ''} found
            </p>
            <div className="metric-grid">
              {courses.map((course) => {
                const styleConfig = getCategoryStyle(course.category || course.title)
                return (
                  <Link 
                    key={course._id} 
                    to={`/courses/${course._id}`}
                    className="card flex flex-col justify-between"
                    style={{
                      borderColor: styleConfig.border,
                      backgroundColor: '#ffffff',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      padding: '1.5rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = styleConfig.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.borderColor = styleConfig.border;
                    }}
                  >
                    <div style={{ color: styleConfig.color, position: 'absolute', top: 0, right: 0, pointerEvents: 'none' }}>
                      {styleConfig.bgSvg}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: styleConfig.bg, color: styleConfig.color }}>
                          {styleConfig.icon}
                        </div>
                      </div>
                      <h3 className="card-title"><span style={{ color: styleConfig.color, textDecoration: 'none' }}>{course.title}</span></h3>
                      <p className="card-meta mb-4 line-clamp-3" style={{ position: 'relative', zIndex: 1 }}>{course.description}</p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <span className="badge" style={{ backgroundColor: styleConfig.bg, color: styleConfig.color, border: `1px solid ${styleConfig.border}` }}>{course.category}</span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: pagination.page === 1 ? 0.5 : 1, cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-secondary'}`}
                    aria-current={p === pagination.page ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: pagination.page === pagination.totalPages ? 0.5 : 1, cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
                  aria-label="Next page"
                >
                  Next
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
