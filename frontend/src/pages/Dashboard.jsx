import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import api from '../api/axios'

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${color}`} />
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user.role === 'admin') {
          const [drives, apps, interviews] = await Promise.all([
            api.get('/api/drives/'),
            api.get('/api/applications/'),
            api.get('/api/interviews/'),
          ])
          setStats({
            drives: drives.data.length,
            applications: apps.data.length,
            interviews: interviews.data.length,
          })
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

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-slate-400 mt-1 capitalize">{user?.role} dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <StatCard label="Total Drives" value={stats.drives} color="bg-violet-500" />
              <StatCard label="Applications" value={stats.applications} color="bg-cyan-500" />
              <StatCard label="Interviews" value={stats.interviews} color="bg-amber-500" />
            </>
          )}
          {user?.role === 'student' && (
            <StatCard label="My Applications" value={stats.applications} color="bg-cyan-500" />
          )}
          {user?.role === 'interviewer' && (
            <StatCard label="Assigned Interviews" value={stats.interviews} color="bg-amber-500" />
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {user?.role === 'admin' && (
              <>
                <a href="/drives" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">Manage Drives</a>
                <a href="/applications" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">View Applications</a>
                <a href="/interviews" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">Schedule Interviews</a>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <a href="/drives" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">Browse Drives</a>
                <a href="/my-applications" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">My Applications</a>
              </>
            )}
            {user?.role === 'interviewer' && (
              <a href="/my-interviews" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 text-sm text-slate-300 hover:text-white transition-all text-center">My Interviews</a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
