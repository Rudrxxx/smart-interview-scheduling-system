import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Drives from './pages/Drives'
import MyApplications from './pages/MyApplications'
import Applications from './pages/Applications'
import Interviews from './pages/Interviews'
import Evaluate from './pages/Evaluate'
import Results from './pages/Results'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/drives" element={
            <ProtectedRoute><Drives /></ProtectedRoute>
          } />

          <Route path="/my-applications" element={
            <ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>
          } />

          <Route path="/applications" element={
            <ProtectedRoute roles={['admin']}><Applications /></ProtectedRoute>
          } />

          <Route path="/interviews" element={
            <ProtectedRoute roles={['admin']}><Interviews /></ProtectedRoute>
          } />

          <Route path="/my-interviews" element={
            <ProtectedRoute roles={['interviewer']}><Interviews /></ProtectedRoute>
          } />

          <Route path="/evaluate/:interviewId" element={
            <ProtectedRoute roles={['interviewer']}><Evaluate /></ProtectedRoute>
          } />

          <Route path="/results" element={
            <ProtectedRoute roles={['admin']}><Results /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
