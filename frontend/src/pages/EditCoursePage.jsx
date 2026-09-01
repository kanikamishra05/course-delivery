import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getCourse,
  updateCourse,
  publishCourse,
  archiveCourse,
  restoreCourse,
  addLesson,
  updateLesson,
  deleteLesson,
} from '../services/courseApi'

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Course form state
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '' })
  const [courseMsg, setCourseMsg] = useState('')
  const [courseErr, setCourseErr] = useState('')
  const [savingCourse, setSavingCourse] = useState(false)

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' })
  const [lessonMsg, setLessonMsg] = useState('')
  const [lessonErr, setLessonErr] = useState('')
  const [addingLesson, setAddingLesson] = useState(false)

  // Inline lesson editing
  const [editingLesson, setEditingLesson] = useState(null)
  const [editLessonForm, setEditLessonForm] = useState({})

  // State transitions
  const [transitionErr, setTransitionErr] = useState('')
  const [transitionMsg, setTransitionMsg] = useState('')

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourse(id)
      const c = res.data.data.course
      setCourse(c)
      setCourseForm({ title: c.title, description: c.description, category: c.category })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    setCourseErr('')
    setCourseMsg('')
    setSavingCourse(true)
    try {
      const res = await updateCourse(id, courseForm)
      setCourse((prev) => ({ ...prev, ...res.data.data.course }))
      setCourseMsg('Course updated successfully.')
    } catch (err) {
      setCourseErr(err.response?.data?.message || 'Failed to update course')
    } finally {
      setSavingCourse(false)
    }
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    setLessonErr('')
    setLessonMsg('')
    if (!lessonForm.title) { setLessonErr('Lesson title is required.'); return }
    setAddingLesson(true)
    try {
      const res = await addLesson(id, lessonForm)
      const newLesson = res.data.data.lesson
      setCourse((prev) => ({ ...prev, lessons: [...(prev.lessons || []), newLesson] }))
      setLessonForm({ title: '', content: '' })
      setLessonMsg('Lesson added.')
    } catch (err) {
      setLessonErr(err.response?.data?.message || 'Failed to add lesson')
    } finally {
      setAddingLesson(false)
    }
  }

  const handleUpdateLesson = async (lessonId) => {
    try {
      const res = await updateLesson(lessonId, editLessonForm)
      const updated = res.data.data.lesson
      setCourse((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => l._id === lessonId ? updated : l),
      }))
      setEditingLesson(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lesson')
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return
    try {
      await deleteLesson(lessonId)
      setCourse((prev) => ({ ...prev, lessons: prev.lessons.filter((l) => l._id !== lessonId) }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lesson')
    }
  }

  const handleTransition = async (action) => {
    setTransitionErr('')
    setTransitionMsg('')
    try {
      let res
      if (action === 'publish') res = await publishCourse(id)
      else if (action === 'archive') res = await archiveCourse(id)
      else if (action === 'restore') res = await restoreCourse(id)
      setCourse((prev) => ({ ...prev, status: res.data.data.course.status }))
      setTransitionMsg(`Course ${action}d successfully.`)
    } catch (err) {
      setTransitionErr(err.response?.data?.message || `Failed to ${action} course`)
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>
  if (!course) return null

  const { status } = course
  const lessons = course.lessons || []

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Edit Course</h1>
        <button onClick={() => navigate('/courses')} style={{ padding: '6px 16px' }}>← Back</button>
      </div>

      {/* Status + transitions */}
      <div style={{ marginBottom: 24, padding: 16, background: '#f8f8f8', borderRadius: 6 }}>
        <strong>Status: </strong>
        <span style={{ marginLeft: 8, fontWeight: 700 }}>{status}</span>
        <span style={{ marginLeft: 24 }}>
          {status === 'DRAFT' && (
            <button onClick={() => handleTransition('publish')} style={{ marginRight: 8, padding: '4px 14px' }}>
              Publish
            </button>
          )}
          {status === 'PUBLISHED' && (
            <button onClick={() => handleTransition('archive')} style={{ marginRight: 8, padding: '4px 14px' }}>
              Archive
            </button>
          )}
          {status === 'ARCHIVED' && (
            <button onClick={() => handleTransition('restore')} style={{ marginRight: 8, padding: '4px 14px' }}>
              Restore to Draft
            </button>
          )}
        </span>
        {transitionErr && <p style={{ color: 'red', margin: '8px 0 0' }}>{transitionErr}</p>}
        {transitionMsg && <p style={{ color: 'green', margin: '8px 0 0' }}>{transitionMsg}</p>}
      </div>

      {/* Course details form */}
      <h2>Course Details</h2>
      {courseErr && <p style={{ color: 'red' }}>{courseErr}</p>}
      {courseMsg && <p style={{ color: 'green' }}>{courseMsg}</p>}
      <form onSubmit={handleUpdateCourse} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label><br />
          <input
            type="text"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label><br />
          <textarea
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Category</label><br />
          <input
            type="text"
            value={courseForm.category}
            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={savingCourse} style={{ padding: '8px 20px' }}>
          {savingCourse ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Lessons */}
      <h2>Lessons ({lessons.length})</h2>
      {lessons.length === 0 && <p style={{ color: '#888' }}>No lessons yet. Add one below.</p>}
      {lessons.map((lesson, idx) => (
        <div key={lesson._id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6, marginBottom: 8 }}>
          {editingLesson === lesson._id ? (
            <>
              <input
                type="text"
                value={editLessonForm.title}
                onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })}
                style={{ width: '100%', padding: 6, marginBottom: 6 }}
              />
              <textarea
                value={editLessonForm.content}
                onChange={(e) => setEditLessonForm({ ...editLessonForm, content: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: 6, marginBottom: 6 }}
              />
              <button onClick={() => handleUpdateLesson(lesson._id)} style={{ marginRight: 8, padding: '4px 12px' }}>Save</button>
              <button onClick={() => setEditingLesson(null)} style={{ padding: '4px 12px' }}>Cancel</button>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong>{idx + 1}. {lesson.title}</strong>
                {lesson.content && <p style={{ margin: '4px 0 0', color: '#555', fontSize: 14 }}>{lesson.content}</p>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setEditingLesson(lesson._id); setEditLessonForm({ title: lesson.title, content: lesson.content, position: lesson.position }) }}
                  style={{ padding: '4px 12px' }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteLesson(lesson._id)} style={{ padding: '4px 12px', color: 'red' }}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add lesson form */}
      <h3 style={{ marginTop: 24 }}>Add Lesson</h3>
      {lessonErr && <p style={{ color: 'red' }}>{lessonErr}</p>}
      {lessonMsg && <p style={{ color: 'green' }}>{lessonMsg}</p>}
      <form onSubmit={handleAddLesson}>
        <div style={{ marginBottom: 10 }}>
          <label>Lesson Title</label><br />
          <input
            type="text"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Content (optional)</label><br />
          <textarea
            value={lessonForm.content}
            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={addingLesson} style={{ padding: '8px 20px' }}>
          {addingLesson ? 'Adding...' : 'Add Lesson'}
        </button>
      </form>
    </div>
  )
}
