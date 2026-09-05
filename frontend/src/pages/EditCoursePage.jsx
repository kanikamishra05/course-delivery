import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourse, updateCourse, addLesson, updateLesson, deleteLesson, publishCourse, archiveCourse, restoreCourse } from '../services/courseApi'

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '' })
  const [courseErr, setCourseErr] = useState('')
  const [courseMsg, setCourseMsg] = useState('')
  const [savingCourse, setSavingCourse] = useState(false)

  const [lessonForm, setLessonForm] = useState({ title: '', content: '' })
  const [lessonErr, setLessonErr] = useState('')
  const [lessonMsg, setLessonMsg] = useState('')
  const [addingLesson, setAddingLesson] = useState(false)

  const [editingLesson, setEditingLesson] = useState(null)
  const [editLessonForm, setEditLessonForm] = useState({ title: '', content: '', position: 0 })

  const [transitionErr, setTransitionErr] = useState('')
  const [transitionMsg, setTransitionMsg] = useState('')

  useEffect(() => { loadCourse() }, [id])

  const loadCourse = async () => {
    try {
      const res = await getCourse(id)
      const data = res.data.data.course
      setCourse(data)
      setCourseForm({ title: data.title, description: data.description, category: data.category })
    } catch (err) {
      setCourseErr('Course not found')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    setCourseErr(''); setCourseMsg(''); setSavingCourse(true)
    try {
      await updateCourse(id, courseForm)
      setCourseMsg('Course updated successfully!')
      await loadCourse()
    } catch (err) {
      setCourseErr(err.response?.data?.message || 'Failed to update')
    } finally {
      setSavingCourse(false)
    }
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    setLessonErr(''); setLessonMsg(''); setAddingLesson(true)
    try {
      await addLesson(id, lessonForm)
      setLessonMsg('Lesson added!')
      setLessonForm({ title: '', content: '' })
      await loadCourse()
    } catch (err) {
      setLessonErr(err.response?.data?.message || 'Failed to add lesson')
    } finally {
      setAddingLesson(false)
    }
  }

  const handleUpdateLesson = async (lessonId) => {
    try {
      await updateLesson(lessonId, editLessonForm)
      setEditingLesson(null)
      await loadCourse()
    } catch (err) {
      alert('Failed to update lesson')
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return
    try {
      await deleteLesson(lessonId)
      await loadCourse()
    } catch (err) {
      alert('Failed to delete lesson')
    }
  }

  const handleTransition = async (action) => {
    setTransitionErr(''); setTransitionMsg('')
    try {
      if (action === 'publish') await publishCourse(id)
      if (action === 'archive') await archiveCourse(id)
      if (action === 'restore') await restoreCourse(id)
      setTransitionMsg(`Course ${action}ed successfully!`)
      await loadCourse()
    } catch (err) {
      setTransitionErr(err.response?.data?.message || `Failed to ${action} course`)
    }
  }

  if (loading) return <div className="container">Loading...</div>
  if (!course) return <div className="container text-danger">Course not found</div>

  const { status } = course
  const lessons = course.lessons || []

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1>Edit Course</h1>
        <button onClick={() => navigate('/courses')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.375rem 0.75rem', borderRadius: '6px', color: '#334155', backgroundColor: 'transparent' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <strong>Status: </strong>
            <span className={`badge ${status === 'PUBLISHED' ? 'badge-success' : status === 'ARCHIVED' ? 'badge-danger' : 'badge-warning'}`} style={{ marginLeft: 8 }}>
              {status}
            </span>
          </div>
          <div className="flex gap-2">
            {status === 'DRAFT' && <button onClick={() => handleTransition('publish')} className="btn btn-primary">Publish</button>}
            {status === 'PUBLISHED' && <button onClick={() => handleTransition('archive')} className="btn btn-danger">Archive</button>}
            {status === 'ARCHIVED' && <button onClick={() => handleTransition('restore')} className="btn btn-secondary">Restore to Draft</button>}
          </div>
        </div>
        {transitionErr && <p className="text-danger mt-4 mb-0">{transitionErr}</p>}
        {transitionMsg && <p className="text-success mt-4 mb-0">{transitionMsg}</p>}
      </div>

      <div className="card mb-6">
        <h2 className="mb-4">Course Details</h2>
        {courseErr && <p className="text-danger">{courseErr}</p>}
        {courseMsg && <p className="text-success">{courseMsg}</p>}
        <form onSubmit={handleUpdateCourse}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" type="text" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" type="text" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} />
          </div>
          <button type="submit" disabled={savingCourse} className="btn btn-primary">
            {savingCourse ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card mb-6">
        <h2 className="mb-4">Lessons ({lessons.length})</h2>
        {lessons.length === 0 && <p className="text-muted">No lessons yet. Add one below.</p>}
        
        <div className="activity-feed mb-6">
          {lessons.map((lesson, idx) => (
            <div key={lesson._id} className="activity-item" style={{ borderLeftColor: 'var(--border)' }}>
              {editingLesson === lesson._id ? (
                <>
                  <input className="form-input mb-2" type="text" value={editLessonForm.title} onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })} />
                  <textarea className="form-input mb-2" value={editLessonForm.content} onChange={(e) => setEditLessonForm({ ...editLessonForm, content: e.target.value })} rows={2} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleUpdateLesson(lesson._id)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Save
                    </button>
                    <button onClick={() => setEditingLesson(null)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px', color: '#64748b' }}>
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <div>
                      <strong>{idx + 1}. {lesson.title}</strong>
                      {lesson.content && <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.875rem' }}>{lesson.content}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button onClick={() => { setEditingLesson(lesson._id); setEditLessonForm({ title: lesson.title, content: lesson.content, position: lesson.position }) }} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteLesson(lesson._id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 className="mb-4">Add Lesson</h3>
          {lessonErr && <p className="text-danger">{lessonErr}</p>}
          {lessonMsg && <p className="text-success">{lessonMsg}</p>}
          <form onSubmit={handleAddLesson}>
            <div className="form-group">
              <label className="form-label">Lesson Title</label>
              <input className="form-input" required type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Content (optional)</label>
              <textarea className="form-input" value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} rows={2} />
            </div>
            <button type="submit" disabled={addingLesson} className="btn btn-secondary">
              {addingLesson ? 'Adding...' : 'Add Lesson'}
            </button>
          </form>
        </div>
      </div>

      <div className="metric-grid mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Bulk Enroll Learners
          </h3>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const emailsStr = e.target.elements.emails.value
            if (!emailsStr) return
            const emails = emailsStr.split(/[\n,]+/).map(e => e.trim()).filter(e => e)
            try {
              const { bulkEnroll } = await import('../services/courseApi')
              const res = await bulkEnroll(id, emails)
              const results = res.data.data.results
              let msg = 'Bulk enrollment results:\n'
              results.forEach(r => msg += `${r.email}: ${r.status}\n`)
              alert(msg)
              e.target.reset()
            } catch (err) {
              alert(err.response?.data?.message || 'Failed to bulk enroll')
            }
          }}>
            <div className="form-group mb-2">
              <textarea name="emails" className="form-input" placeholder="Enter emails (comma or newline separated)" required rows={3} />
            </div>
            <button type="submit" className="btn btn-secondary">Bulk Enroll</button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-4">Export Progress</h3>
          <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>Download a CSV report of learner progress for this course.</p>
          <button type="button" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={async () => {
            try {
              const { exportCourseCsv } = await import('../services/courseApi')
              await exportCourseCsv(id)
            } catch (err) {
              alert('Failed to export CSV')
            }
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}
