import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useDBUser } from '../components/ClerkAxiosProvider'

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-medium text-white">{value ?? '—'}</p>
    </div>
  )
}

function ActionCard({ href, label, secondary }) {
  return (
    <a 
      href={href} 
      className={`border rounded-xl p-4 text-sm font-medium transition-all text-center ${
        secondary 
          ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800' 
          : 'bg-white border-white text-slate-950 hover:bg-slate-100'
      }`}
    >
      {label}
    </a>
  )
}

export default function Dashboard() {
  const { user } = useDBUser()
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
      <div className="max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-medium text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here's an overview of your {user?.role} dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <StatCard label="Total Drives" value={stats.drives} />
              <StatCard label="Applications" value={stats.applications} />
              <StatCard label="Interviews" value={stats.interviews} />
            </>
          )}
          {user?.role === 'student' && (
            <StatCard label="My Applications" value={stats.applications} />
          )}
          {user?.role === 'interviewer' && (
            <StatCard label="Assigned Interviews" value={stats.interviews} />
          )}
        </div>

        <div className="pt-4">
          <h2 className="text-sm font-medium text-slate-400 mb-4 px-1">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user?.role === 'admin' && (
              <>
                <ActionCard href="/drives" label="Manage Drives" />
                <ActionCard href="/applications" label="View Applications" secondary />
                <ActionCard href="/interviews" label="Schedule Interviews" secondary />
              </>
            )}
            {user?.role === 'student' && (
              <>
                <ActionCard href="/drives" label="Browse Drives" />
                <ActionCard href="/my-applications" label="My Applications" secondary />
              </>
            )}
            {user?.role === 'interviewer' && (
              <ActionCard href="/my-interviews" label="My Interviews" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
