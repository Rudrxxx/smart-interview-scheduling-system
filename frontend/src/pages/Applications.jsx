import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

const filters = ['all', 'pending', 'shortlisted', 'accepted', 'rejected']

function getInitials(n) { if (!n) return '?'; return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

const statusColors = {
  pending: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
  shortlisted: { bg: 'rgba(212,168,67,0.3)', color: '#d4a843' },
  accepted: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  rejected: { bg: 'rgba(220,50,50,0.15)', color: '#dc3232' },
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const fetch = async () => { setLoading(true); try { setApplications((await api.get('/api/applications/')).data) } catch {} setLoading(false) }
  useEffect(() => { fetch() }, [])
  const updateStatus = async (id, status) => { setUpdatingId(id); try { await api.patch(`/api/applications/${id}/status`, { status }); fetch() } catch {} setUpdatingId(null) }
  const filtered = activeFilter === 'all' ? applications : applications.filter(a => a.status === activeFilter)

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>All Applications</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{applications.length} total</p>
        </div>

        <div className="flex items-center gap-6 flex-wrap" style={{ borderBottom: '1px solid #2a2520' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="text-sm capitalize pb-3 transition-all bg-transparent border-none cursor-pointer"
              style={{ color: activeFilter === f ? '#d4a843' : '#6b6459', borderBottom: activeFilter === f ? '2px solid #d4a843' : '2px solid transparent', marginBottom: '-1px' }}>
              {f}{f !== 'all' && <span className="ml-1 opacity-50">{applications.filter(a => a.status === f).length}</span>}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-20 text-sm" style={{ color: '#6b6459' }}>Loading...</div> : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #2a2520' }}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead><tr style={{ background: '#161412', borderBottom: '1px solid #2a2520' }}>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Candidate</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Drive</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Applied</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium text-right" style={{ color: '#6b6459' }}>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(a => {
                  const nm = a.student_name || `Student #${a.student_id}`
                  const sc = statusColors[a.status] || statusColors.pending
                  return (
                    <tr key={a.id} className="transition-colors" style={{ borderBottom: '1px solid #2a2520' }}
                      onMouseEnter={e => e.currentTarget.style.background='#161412'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td className="px-6 py-4"><div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#d4a843', color: '#0a0a0a' }}>{getInitials(nm)}</div>
                        <div><p className="font-medium" style={{ color: '#f5f0e8' }}>{nm}</p><p className="text-xs" style={{ color: '#6b6459' }}>{a.student_email || '—'}</p></div>
                      </div></td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{a.drive_title || `Drive #${a.drive_id}`}</td>
                      <td className="px-6 py-4"><span className="text-xs font-medium capitalize rounded-full px-3 py-1" style={{ background: sc.bg, color: sc.color }}>{a.status}</span></td>
                      <td className="px-6 py-4 text-xs" style={{ color: '#6b6459' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                      <td className="px-6 py-4 text-right">
                        {(a.status === 'pending' || a.status === 'shortlisted') && (
                          <div className="flex items-center justify-end gap-2">
                            {a.status === 'pending' && <button onClick={() => updateStatus(a.id, 'shortlisted')} disabled={updatingId === a.id} className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-50" style={{ border: '1px solid rgba(212,168,67,0.4)', color: '#d4a843', background: 'transparent' }}>Shortlist</button>}
                            <button onClick={() => updateStatus(a.id, 'rejected')} disabled={updatingId === a.id} className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-50" style={{ border: '1px solid rgba(220,50,50,0.3)', color: '#dc3232', background: 'transparent' }}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm" style={{ color: '#6b6459' }}>No applications.</div>}
          </div>
        )}
      </div>
    </Layout>
  )
}
