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

  const fetchResults = async (driveId = '') => {
    try {
      const res = await api.get(driveId ? `/api/results/drive/${driveId}` : '/api/results/')
      setResults(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchResults()
    if (user?.role === 'admin') {
      api.get('/api/drives/').then(res => setDrives(res.data))
    }
  }, [user])

  useEffect(() => {
    if (selectedDrive) fetchResults(selectedDrive)
    else fetchResults()
  }, [selectedDrive])

  const handlePublish = async (applicationId) => {
    await api.post(`/api/results/publish/${applicationId}`)
    fetchResults(selectedDrive)
  }

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-white">Evaluation Results</h1>
            <p className="text-slate-400 text-sm mt-1">Review finalized interview scores</p>
          </div>
          
          {user?.role === 'admin' && (
            <select 
              value={selectedDrive} onChange={e => setSelectedDrive(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-slate-500 appearance-none min-w-[200px]"
            >
              <option value="">All Drives</option>
              {drives.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
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
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Feedback</th>
                    {user?.role === 'admin' && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {results.map(res => (
                    <tr key={res.Application.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{res.Application.id}</td>
                      <td className="px-6 py-4 text-white">Student #{res.Application.student_id}</td>
                      <td className="px-6 py-4 font-mono text-white">{res.Evaluation.score}/100</td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{res.Evaluation.feedback}</td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handlePublish(res.Application.id)}
                            disabled={res.Application.status === 'selected'}
                            className="text-xs bg-white text-slate-950 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
                          >
                            {res.Application.status === 'selected' ? 'Published' : 'Publish Result'}
                          </button>
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
