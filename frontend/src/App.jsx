import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthAxiosProvider from './components/AuthAxiosProvider'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import Drives from './pages/Drives'
import MyApplications from './pages/MyApplications'
import Applications from './pages/Applications'
import Interviews from './pages/Interviews'
import Evaluate from './pages/Evaluate'
import Results from './pages/Results'
import Users from './pages/Users'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <AuthAxiosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Home />} />

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

          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthAxiosProvider>
  )
}
