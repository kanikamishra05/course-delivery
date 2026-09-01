import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import InstructorCoursesPage from './pages/InstructorCoursesPage'
import CreateCoursePage from './pages/CreateCoursePage'
import EditCoursePage from './pages/EditCoursePage'
import CourseDiscoveryPage from './pages/CourseDiscoveryPage'
import CourseDetailPage from './pages/CourseDetailPage'

// Redirect authenticated users away from login/register
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Home (role-based redirect handled in HomePage) */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Instructor course management */}
      <Route
        path="/courses"
        element={<ProtectedRoute roles={['INSTRUCTOR']}><InstructorCoursesPage /></ProtectedRoute>}
      />
      <Route
        path="/courses/new"
        element={<ProtectedRoute roles={['INSTRUCTOR']}><CreateCoursePage /></ProtectedRoute>}
      />
      <Route
        path="/courses/:id/edit"
        element={<ProtectedRoute roles={['INSTRUCTOR']}><EditCoursePage /></ProtectedRoute>}
      />

      {/* Course detail — public */}
      <Route path="/courses/:id" element={<CourseDetailPage />} />

      {/* Learner course discovery */}
      <Route path="/discover" element={<ProtectedRoute><CourseDiscoveryPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
