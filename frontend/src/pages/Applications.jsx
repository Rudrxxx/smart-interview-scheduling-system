import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

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
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-white">All Applications</h1>
          <p className="text-slate-400 text-sm mt-1">{applications.length} applications total</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading applications...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">App ID</th>
                    <th className="px-6 py-4 font-medium">Student UID</th>
                    <th className="px-6 py-4 font-medium">Drive ID</th>
                    <th className="px-6 py-4 font-medium">Applied Date</th>
                    <th className="px-6 py-4 font-medium">Status workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{app.id}</td>
                      <td className="px-6 py-4 text-white">Student {app.student_id}</td>
                      <td className="px-6 py-4 text-slate-300">Drive {app.drive_id}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-500 appearance-none pr-8 cursor-pointer relative"
                        >
                          {['applied', 'scheduled', 'interviewed', 'selected', 'rejected'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {applications.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-500 text-sm">No applications found.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
