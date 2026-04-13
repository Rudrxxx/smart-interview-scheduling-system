import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/drives', label: 'Drives', icon: '◈' },
  { to: '/applications', label: 'Applications', icon: '◎' },
  { to: '/interviews', label: 'Interviews', icon: '◷' },
  { to: '/results', label: 'Results', icon: '◉' },
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
  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'student' ? studentLinks
    : interviewerLinks

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-slate-900 border-r border-slate-800 flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-violet-500/20 text-violet-300 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">SmartInterview v1.0</p>
      </div>
    </aside>
  )
}
