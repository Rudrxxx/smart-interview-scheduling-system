import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'

const statusMap = {
  pending: { bar: '#d4a843', badge: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' } },
  accepted: { bar: '#22c55e', badge: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' } },
  rejected: { bar: '#dc3232', badge: { bg: 'rgba(220,50,50,0.15)', color: '#dc3232' } },
  shortlisted: { bar: '#d4a843', badge: { bg: 'rgba(212,168,67,0.3)', color: '#d4a843' } },
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/api/applications/my').then(r => setApplications(r.data)).catch(() => {}).finally(() => setLoading(false)) }, [])

  return (
    <Layout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{applications.length} submitted</p>
        </div>

        {loading ? <div className="text-center py-20 text-sm" style={{ color: '#6b6459' }}>Loading...</div>
        : applications.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: '#161412', border: '1px solid #2a2520' }}>
            <p className="text-lg font-serif mb-2" style={{ color: '#6b6459' }}>You haven't applied to any drives yet.</p>
            <p className="text-sm mb-6" style={{ color: '#6b6459', opacity: 0.6 }}>Explore active recruitment drives.</p>
            <Link to="/drives" className="text-sm font-medium px-6 py-2.5 rounded-xl no-underline inline-block" style={{ background: '#d4a843', color: '#0a0a0a' }}>Browse Drives →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map(a => {
              const st = statusMap[a.status] || statusMap.pending
              return (
                <div key={a.id} className="rounded-2xl overflow-hidden flex" style={{ background: '#161412', border: '1px solid #2a2520' }}>
                  <div className="w-1 shrink-0" style={{ background: st.bar }}></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-bold font-serif leading-snug" style={{ color: '#f5f0e8' }}>{a.drive_title || `Drive #${a.drive_id}`}</h3>
                      <span className="text-[11px] font-medium capitalize rounded-full px-2.5 py-0.5 whitespace-nowrap" style={{ background: st.badge.bg, color: st.badge.color }}>{a.status}</span>
                    </div>
                    <div className="space-y-1.5 text-xs mt-auto pt-3" style={{ borderTop: '1px solid #2a2520', color: '#6b6459' }}>
                      {a.created_at && <p>Applied: {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                      {a.current_round != null && <p>Round: {a.current_round}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
