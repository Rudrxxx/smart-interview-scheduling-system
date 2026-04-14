import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useDBUser } from '../components/ClerkAxiosProvider'

export default function Results() {
  const { user } = useDBUser()
  const [results, setResults] = useState([])
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDrive, setSelectedDrive] = useState('')
  const [publishing, setPublishing] = useState(null)

  const fetchResults = async (driveId = '') => {
    setLoading(true)
    try {
      if (!driveId) {
        // No global results endpoint — fetch all drives and aggregate
        const drivesRes = await api.get('/api/drives/')
        const allResults = []
        for (const drive of drivesRes.data) {
          try {
            const res = await api.get(`/api/results/drive/${drive.id}`)
            allResults.push(...res.data.map(r => ({ ...r, drive_title: drive.title })))
          } catch {}
        }
        setResults(allResults)
      } else {
        const driveTitle = drives.find(d => String(d.id) === String(driveId))?.title || `Drive #${driveId}`
        const res = await api.get(`/api/results/drive/${driveId}`)
        setResults(res.data.map(r => ({ ...r, drive_title: driveTitle })))
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/api/drives/').then(res => {
        setDrives(res.data)
      })
    }
  }, [user])

  useEffect(() => {
    if (user) fetchResults(selectedDrive)
  }, [selectedDrive, user])

  const handlePublish = async (applicationId) => {
    setPublishing(applicationId)
    try {
      await api.post(`/api/results/publish/${applicationId}`)
      fetchResults(selectedDrive)
    } catch {}
    setPublishing(null)
  }

  const handlePublishAll = async () => {
    if (!selectedDrive) return
    try {
      await api.post(`/api/results/publish-drive/${selectedDrive}`)
      fetchResults(selectedDrive)
    } catch {}
  }

  const getStatusStyle = (status) => {
    if (status === 'selected') return 'bg-green-900/30 text-green-400 border-green-900/50'
    if (status === 'rejected') return 'bg-red-900/30 text-red-400 border-red-900/50'
    if (status === 'interviewed') return 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50'
    return 'bg-slate-800 text-slate-400 border-slate-700'
  }

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-white">Evaluation Results</h1>
            <p className="text-slate-400 text-sm mt-1">Review and publish interview scores</p>
          </div>

          {user?.role === 'admin' && (
            <div className="flex items-center gap-3">
              {selectedDrive && (
                <button
                  onClick={handlePublishAll}
                  className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-medium px-4 py-2 rounded-xl transition-all"
                >
                  Publish All
                </button>
              )}
              <select
                value={selectedDrive} onChange={e => setSelectedDrive(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-slate-500 min-w-[200px]"
              >
                <option value="">All Drives</option>
                {drives.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading results...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">App ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Drive</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Feedback</th>
                    {user?.role === 'admin' && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {results.map(r => (
                    // Backend returns: { application_id, student_id, status, score, feedback }
                    <tr key={r.application_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{r.application_id}</td>
                      <td className="px-6 py-4 text-white">Student #{r.student_id}</td>
                      <td className="px-6 py-4 text-slate-400">{r.drive_title || '—'}</td>
                      <td className="px-6 py-4 font-mono text-white">
                        {r.score !== null ? `${r.score}/100` : <span className="text-slate-600">Pending</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium border ${getStatusStyle(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {r.feedback || <span className="text-slate-600">—</span>}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                          {r.status === 'interviewed' && (
                            <button
                              onClick={() => handlePublish(r.application_id)}
                              disabled={publishing === r.application_id}
                              className="text-xs bg-white text-slate-950 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors"
                            >
                              {publishing === r.application_id ? 'Publishing...' : 'Publish Result'}
                            </button>
                          )}
                          {r.status === 'selected' && (
                            <span className="text-xs text-green-400 font-medium">✓ Selected</span>
                          )}
                          {r.status === 'rejected' && (
                            <span className="text-xs text-red-400 font-medium">✗ Rejected</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-500 text-sm">No results available yet.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
