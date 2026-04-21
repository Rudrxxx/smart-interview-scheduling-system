import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

const statusColors = {
  pending: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
  shortlisted: { bg: 'rgba(212,168,67,0.3)', color: '#d4a843' },
  accepted: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  selected: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  rejected: { bg: 'rgba(220,50,50,0.15)', color: '#dc3232' },
}
const recColors = {
  proceed: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  hold: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
  reject: { bg: 'rgba(220,50,50,0.15)', color: '#dc3232' },
}

function ScoreText({ score }) {
  if (score == null) return <span style={{ color: '#2a2520' }}>—</span>
  let color = '#dc3232'
  if (score >= 7) color = '#d4a843'
  else if (score >= 5) color = '#d4a843'
  return <span className="font-mono font-bold" style={{ color }}>{score}</span>
}

export default function Results() {
  const [results, setResults] = useState([])
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDrive, setSelectedDrive] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const drivesRes = await api.get('/api/drives/')
      setDrives(drivesRes.data)
      let data = []
      try {
        if (selectedDrive) {
          data = (await api.get(`/api/results/drive/${selectedDrive}`)).data
        } else {
          for (const drive of drivesRes.data) {
            try { const r = await api.get(`/api/results/drive/${drive.id}`); data.push(...r.data.map(x => ({ ...x, drive_title: drive.title }))) } catch {}
          }
        }
      } catch {
        try { data = (await api.get('/api/applications/')).data } catch {}
      }
      if (selectedDrive) {
        const t = drivesRes.data.find(d => String(d.id) === String(selectedDrive))?.title || ''
        data = data.map(r => ({ ...r, drive_title: r.drive_title || t }))
      }
      setResults(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [selectedDrive])

  const exportCSV = () => {
    const h = ['Candidate', 'Email', 'Drive', 'Score', 'Recommendation', 'Status']
    const rows = results.map(r => [r.student_name || r.candidate_name || `#${r.student_id || r.application_id}`, r.student_email || r.email || '', r.drive_title || '', r.score ?? '', r.recommendation || r.feedback || '', r.status || ''])
    const csv = [h, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const b = new Blob([csv], { type: 'text/csv' })
    const u = URL.createObjectURL(b)
    const a = document.createElement('a'); a.href = u; a.download = `results_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(u)
  }

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Results</h1>
            <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{results.length} records</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} disabled={results.length === 0} className="px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 flex items-center gap-2" style={{ background: '#d4a843', color: '#0a0a0a' }}>↓ Export CSV</button>
            <div className="relative">
              <select value={selectedDrive} onChange={e => setSelectedDrive(e.target.value)} className="rounded-xl px-4 py-2.5 text-sm focus:outline-none appearance-none min-w-[180px]" style={{ background: '#161412', border: '1px solid #2a2520', color: '#f5f0e8' }}>
                <option value="">All Drives</option>
                {drives.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? <div className="text-center py-20 text-sm" style={{ color: '#6b6459' }}>Loading...</div> : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #2a2520' }}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead><tr style={{ background: '#161412', borderBottom: '1px solid #2a2520' }}>
                {['Candidate', 'Email', 'Drive', 'Score', 'Recommendation', 'Status'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {results.map((r, idx) => {
                  const sc = statusColors[r.status] || statusColors.pending
                  const rc = recColors[r.recommendation]
                  return (
                    <tr key={r.id || r.application_id || idx} style={{ borderBottom: '1px solid #2a2520' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#161412'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-6 py-4 font-medium" style={{ color: '#f5f0e8' }}>{r.student_name || r.candidate_name || `#${r.student_id || r.application_id}`}</td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{r.student_email || r.email || '—'}</td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{r.drive_title || '—'}</td>
                      <td className="px-6 py-4"><ScoreText score={r.score} /></td>
                      <td className="px-6 py-4">{rc ? <span className="text-xs font-medium capitalize rounded-full px-3 py-1" style={{ background: rc.bg, color: rc.color }}>{r.recommendation}</span> : <span style={{ color: '#6b6459' }}>{r.feedback || '—'}</span>}</td>
                      <td className="px-6 py-4"><span className="text-xs font-medium capitalize rounded-full px-3 py-1" style={{ background: sc.bg, color: sc.color }}>{r.status || 'pending'}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {results.length === 0 && <div className="px-6 py-12 text-center text-sm" style={{ color: '#6b6459' }}>{selectedDrive ? 'No results for this drive.' : 'No results yet.'}</div>}
          </div>
        )}
      </div>
    </Layout>
  )
}
