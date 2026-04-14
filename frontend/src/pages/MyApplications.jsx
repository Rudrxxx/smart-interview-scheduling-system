import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

const statusColors = {
  applied: 'bg-blue-500/20 text-blue-400',
  scheduled: 'bg-amber-500/20 text-amber-400',
  interviewed: 'bg-violet-500/20 text-violet-400',
  selected: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

const statusSteps = ['applied', 'scheduled', 'interviewed', 'selected']

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/applications/my').then(res => {
      setApplications(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400 text-sm mt-1">{applications.length} total applications</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No applications yet.</p>
            <a href="/drives" className="text-violet-400 text-sm hover:underline mt-2 inline-block">Browse drives →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">Application #{app.id}</p>
                    <p className="text-slate-500 text-sm">Drive #{app.drive_id} • Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${statusColors[app.status] || 'bg-slate-700 text-slate-400'}`}>
                    {app.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  {statusSteps.map((step, i) => {
                    const currentIndex = statusSteps.indexOf(app.status)
                    const isDone = i <= currentIndex
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`h-1.5 w-full rounded-full ${isDone ? 'bg-violet-500' : 'bg-slate-700'}`} />
                        <span className={`text-xs capitalize ${isDone ? 'text-violet-400' : 'text-slate-600'}`}>{step}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
