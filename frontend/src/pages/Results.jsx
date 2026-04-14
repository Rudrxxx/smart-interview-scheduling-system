import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

export default function Results() {
  const [drives, setDrives] = useState([])
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/api/drives/').then(res => setDrives(res.data))
  }, [])

  const loadResults = async (driveId) => {
    setLoading(true)
    setSelectedDrive(driveId)
    try {
      const res = await api.get(`/api/results/drive/${driveId}`)
      setResults(res.data)
    } catch {}
    setLoading(false)
  }

  const publishAll = async () => {
    if (!selectedDrive) return
    setPublishing(true)
    try {
      const res = await api.post(`/api/results/publish-drive/${selectedDrive}`)
      setMessage(`Published ${res.data.length} results!`)
      loadResults(selectedDrive)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error publishing')
    }
    setPublishing(false)
  }

  const statusColors = {
    selected: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    interviewed: 'bg-violet-500/20 text-violet-400',
    applied: 'bg-blue-500/20 text-blue-400',
    scheduled: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Results</h1>
            <p className="text-slate-400 text-sm mt-1">Publish and view drive results</p>
          </div>
          {selectedDrive && (
            <button onClick={publishAll} disabled={publishing}
              className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              {publishing ? 'Publishing...' : '🚀 Publish All Results'}
            </button>
          )}
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl">{message}</div>
        )}

        <div className="flex gap-3 flex-wrap">
          {drives.map(drive => (
            <button key={drive.id}
              onClick={() => loadResults(drive.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                selectedDrive === drive.id
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}>
              {drive.title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading results...</div>
        ) : results.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-xs px-6 py-4">App ID</th>
                  <th className="text-left text-slate-400 text-xs px-6 py-4">Student ID</th>
                  <th className="text-left text-slate-400 text-xs px-6 py-4">Score</th>
                  <th className="text-left text-slate-400 text-xs px-6 py-4">Status</th>
                  <th className="text-left text-slate-400 text-xs px-6 py-4">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.application_id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-6 py-4 text-slate-400 text-sm">#{r.application_id}</td>
                    <td className="px-6 py-4 text-white text-sm">#{r.student_id}</td>
                    <td className="px-6 py-4 text-white text-sm font-mono">{r.score ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColors[r.status] || 'bg-slate-700 text-slate-400'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{r.feedback || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedDrive ? (
          <div className="text-center py-20 text-slate-500">No results for this drive yet.</div>
        ) : null}
      </div>
    </Layout>
  )
}
