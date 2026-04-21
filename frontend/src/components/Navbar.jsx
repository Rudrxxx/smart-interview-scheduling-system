import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 w-full h-16 flex items-center justify-between px-6 z-50" style={{ background: '#0a0a0a', borderBottom: '1px solid #2a2520' }}>
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#d4a843' }}>
          <span className="font-bold text-sm" style={{ color: '#0a0a0a' }}>SI</span>
        </div>
        <span className="font-serif font-semibold tracking-tight" style={{ color: '#f5f0e8' }}>SmartInterview</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden sm:inline-block rounded-lg px-3 py-1 text-xs font-medium uppercase tracking-widest" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>
              {user.role}
            </span>
            <span className="text-sm font-medium hidden sm:block" style={{ color: '#f5f0e8' }}>{user.name}</span>
            <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ border: '1px solid #d4a843', color: '#d4a843', background: 'transparent' }}>
              Sign Out
            </button>
          </>
        ) : (
          <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: '#161412' }}></div>
        )}
      </div>
    </nav>
  )
}
