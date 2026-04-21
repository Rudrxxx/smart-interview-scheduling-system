import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/drives', label: 'Drives', icon: '◈' },
  { to: '/applications', label: 'Applications', icon: '◎' },
  { to: '/interviews', label: 'Interviews', icon: '◷' },
  { to: '/results', label: 'Results', icon: '◉' },
  { to: '/users', label: 'Users', icon: '◐' },
]
const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/drives', label: 'Browse Drives', icon: '◈' },
  { to: '/my-applications', label: 'My Applications', icon: '◎' },
]
const interviewerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/my-interviews', label: 'My Interviews', icon: '◷' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'admin' ? adminLinks : user?.role === 'student' ? studentLinks : interviewerLinks

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 flex flex-col" style={{ background: '#0a0a0a', borderRight: '1px solid #2a2520' }}>
      <nav className="flex-1 py-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-sm transition-all border-l-2 ${
                isActive ? 'border-amber-500 font-medium' : 'border-transparent'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#d4a843' : '#6b6459',
              background: isActive ? 'rgba(212,168,67,0.05)' : 'transparent',
            })}
          >
            <span className="text-base opacity-70">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4" style={{ borderTop: '1px solid #2a2520' }}>
        <p className="text-xs px-4" style={{ color: '#6b6459' }}>SmartInterview v1.0</p>
      </div>
    </aside>
  )
}
