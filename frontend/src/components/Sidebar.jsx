import { NavLink } from 'react-router-dom'
import { useDBUser } from './ClerkAxiosProvider'

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
  const { user } = useDBUser()
  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'student' ? studentLinks
    : interviewerLinks

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all border border-transparent ${
                isActive
                  ? 'bg-slate-900 border-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`
            }
          >
            <span className="text-base text-slate-500">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 px-4">SmartInterview v1.0</p>
      </div>
    </aside>
  )
}
