import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

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
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-white">My Applications</h1>
          <p className="text-slate-400 text-sm mt-1">Track your recruitment process</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <p className="text-sm">No applications yet.</p>
            <a href="/drives" className="text-white hover:underline text-sm mt-2 inline-block">Browse open drives</a>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white font-medium">Application #{app.id}</p>
                    <p className="text-slate-500 text-sm">Drive #{app.drive_id} — Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium border ${
                    app.status === 'applied' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                    app.status === 'scheduled' ? 'bg-blue-900/30 text-blue-400 border-blue-900/50' :
                    app.status === 'interviewed' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50' :
                    app.status === 'selected' ? 'bg-green-900/30 text-green-400 border-green-900/50' :
                    app.status === 'rejected' ? 'bg-red-900/30 text-red-400 border-red-900/50' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {app.status === 'interviewed' ? 'in progress' : app.status}
                  </span>
                </div>

                {app.status !== 'rejected' && (
                  <div className="flex items-center gap-2 mt-4">
                    {statusSteps.map((step, i) => {
                      const currentIndex = statusSteps.indexOf(app.status)
                      const isDone = i <= currentIndex
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center gap-2">
                          <div className={`h-1 w-full rounded-full ${isDone ? 'bg-white' : 'bg-slate-800'}`} />
                          <span className={`text-[11px] capitalize font-medium tracking-wide ${isDone ? 'text-white' : 'text-slate-500'}`}>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
