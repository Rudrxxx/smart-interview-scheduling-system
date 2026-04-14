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

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApps = () => {
    api.get('/api/applications/').then(res => {
      setApplications(res.data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchApps() }, [])

  const updateStatus = async (appId, status) => {
    await api.patch(`/api/applications/${appId}/status`, { status })
    fetchApps()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Applications</h1>
          <p className="text-slate-400 text-sm mt-1">{applications.length} total</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">ID</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Student</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Drive</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Status</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Applied</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-sm">#{app.id}</td>
                    <td className="px-6 py-4 text-white text-sm">Student #{app.student_id}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">Drive #{app.drive_id}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColors[app.status] || 'bg-slate-700 text-slate-400'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5"
                      >
                        {['applied', 'scheduled', 'interviewed', 'selected', 'rejected'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
