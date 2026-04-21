import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function StatCard({ label, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#161412', border: '1px solid #2a2520' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>{icon}</div>
      </div>
      <p className="text-3xl font-bold font-serif" style={{ color: '#f5f0e8' }}>{value ?? '—'}</p>
      <p className="text-sm font-medium mt-1" style={{ color: '#6b6459' }}>{label}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: '#6b6459', opacity: 0.6 }}>{subtitle}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { user, loading: userLoading } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (!user) return
    const loadStats = async () => {
      try {
        if (user.role === 'admin') {
          const [drives, apps, interviews, users] = await Promise.all([
            api.get('/api/drives/'), api.get('/api/applications/'), api.get('/api/interviews/'),
            api.get('/api/users/').catch(() => ({ data: [] })),
          ])
          setStats({ drives: drives.data.length, applications: apps.data.length, interviews: interviews.data.length, users: users.data.length })
        } else if (user.role === 'student') {
          const apps = await api.get('/api/applications/my')
          setStats({ applications: apps.data.length })
        } else if (user.role === 'interviewer') {
          const interviews = await api.get('/api/interviews/my')
          setStats({ interviews: interviews.data.length })
        }
      } catch {}
    }
    loadStats()
  }, [user])

  if (userLoading) return <Layout><div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6b6459' }}>Loading dashboard...</div></Layout>

  return (
    <Layout>
      <div className="max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Welcome back, {user?.name}</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b6459' }}>Here's your <span className="capitalize">{user?.role}</span> overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.role === 'admin' && (<>
            <StatCard label="Total Drives" value={stats.drives} icon="◈" subtitle="Active this month" />
            <StatCard label="Applications" value={stats.applications} icon="◎" subtitle="Across all drives" />
            <StatCard label="Interviews" value={stats.interviews} icon="◷" subtitle="Scheduled" />
            <StatCard label="Users" value={stats.users} icon="◐" subtitle="Registered" />
          </>)}
          {user?.role === 'student' && (<>
            <StatCard label="My Applications" value={stats.applications} icon="◎" subtitle="Submitted" />
            <StatCard label="Interviews" value="—" icon="◷" subtitle="Awaiting schedule" />
          </>)}
          {user?.role === 'interviewer' && (<>
            <StatCard label="Interviews" value={stats.interviews} icon="◷" subtitle="Assigned" />
            <StatCard label="Evaluations" value="—" icon="◉" subtitle="Pending" />
          </>)}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#d4a843' }}>QUICK ACTIONS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user?.role === 'admin' && (<>
              <a href="/drives" className="rounded-xl p-4 text-sm font-medium text-center no-underline transition-all" style={{ background: '#d4a843', color: '#0a0a0a' }}>Manage Drives</a>
              <a href="/applications" className="rounded-xl p-4 text-sm font-medium text-center no-underline transition-all" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>Applications</a>
              <a href="/interviews" className="rounded-xl p-4 text-sm font-medium text-center no-underline transition-all" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>Interviews</a>
              <a href="/users" className="rounded-xl p-4 text-sm font-medium text-center no-underline transition-all" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>Users</a>
            </>)}
            {user?.role === 'student' && (<>
              <a href="/drives" className="rounded-xl p-4 text-sm font-medium text-center no-underline" style={{ background: '#d4a843', color: '#0a0a0a' }}>Browse Drives</a>
              <a href="/my-applications" className="rounded-xl p-4 text-sm font-medium text-center no-underline" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>My Applications</a>
            </>)}
            {user?.role === 'interviewer' && (
              <a href="/my-interviews" className="rounded-xl p-4 text-sm font-medium text-center no-underline" style={{ background: '#d4a843', color: '#0a0a0a' }}>My Interviews</a>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#d4a843' }}>RECENT ACTIVITY</p>
          <div className="rounded-2xl" style={{ background: '#161412', border: '1px solid #2a2520' }}>
            {[
              { text: 'System initialized', time: 'Just now', active: true },
              { text: `Welcome, ${user?.name}`, time: '1 min ago', active: true },
              { text: 'Dashboard loaded', time: '2 min ago', active: false },
              { text: 'All services running', time: '5 min ago', active: true },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: idx < 3 ? '1px solid #2a2520' : 'none' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.active ? '#d4a843' : '#2a2520' }}></div>
                <p className="text-sm flex-1" style={{ color: '#6b6459' }}>{item.text}</p>
                <span className="text-xs whitespace-nowrap" style={{ color: '#6b6459', opacity: 0.5 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
