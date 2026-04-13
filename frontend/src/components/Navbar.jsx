import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleColor = {
    admin: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    student: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    interviewer: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SI</span>
          </div>
          <span className="text-white font-semibold tracking-tight">SmartInterview</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${roleColor[user.role]}`}>
              {user.role}
            </span>
            <span className="text-slate-300 text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
