import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import ClerkAxiosProvider from './components/ClerkAxiosProvider'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import Drives from './pages/Drives'
import MyApplications from './pages/MyApplications'
import Applications from './pages/Applications'
import Interviews from './pages/Interviews'
import Evaluate from './pages/Evaluate'
import Results from './pages/Results'

export default function App() {
  return (
    <ClerkAxiosProvider>
      <BrowserRouter>
        <Routes>
          {/* Clerk Auth Gateway */}
          <Route path="/login" element={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/dashboard" />
            </div>
          } />
          
          <Route path="/register" element={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <SignUp routing="path" path="/register" signInUrl="/login" forceRedirectUrl="/dashboard" />
            </div>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Protected Application Layer */}
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
    </ClerkAxiosProvider>
  )
}
