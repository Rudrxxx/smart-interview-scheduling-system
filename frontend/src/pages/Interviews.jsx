import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const emptyForm = { application_id: '', interviewer_id: '', scheduled_date: '', round_number: 1, meet_link: 'https://meet.google.com/yaw-nqqi-iok' }

const statusColors = {
  scheduled: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
  completed: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  cancelled: { bg: 'rgba(220,50,50,0.15)', color: '#dc3232' },
  pending: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
}

export default function Interviews() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [interviewers, setInterviewers] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fetchInterviews = async () => { setLoading(true); try { setInterviews((await api.get(isAdmin ? '/api/interviews/' : '/api/interviews/my')).data) } catch {} setLoading(false) }
  const fetchInterviewers = async () => { try { setInterviewers((await api.get('/api/users/')).data.filter(u => u.role === 'interviewer')) } catch {} }
  useEffect(() => { if (!user) return; fetchInterviews(); if (isAdmin) fetchInterviewers() }, [user])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const openCreate = () => { setForm(emptyForm); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setForm(emptyForm) }
  const handleSubmit = async (e) => { e.preventDefault(); setSubmitting(true); try { await api.post('/api/interviews/', { application_id: parseInt(form.application_id), interviewer_id: parseInt(form.interviewer_id), scheduled_date: new Date(form.scheduled_date).toISOString(), round_number: parseInt(form.round_number), meet_link: form.meet_link || null }); closeModal(); fetchInterviews() } catch {} setSubmitting(false) }
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/api/interviews/${id}`); fetchInterviews() } catch {} }

  const inputStyle = { background: '#161412', border: '1px solid #2a2520', color: '#f5f0e8' }

  if (loading) return <Layout><div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6b6459' }}>Loading...</div></Layout>

  if (isAdmin) {
    return (
      <Layout>
        <div className="max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Interviews</h1>
              <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{interviews.length} scheduled</p>
            </div>
            <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#d4a843', color: '#0a0a0a' }}>Schedule Interview</button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #2a2520' }}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead><tr style={{ background: '#161412', borderBottom: '1px solid #2a2520' }}>
                {['Candidate', 'Drive', 'Round', 'Interviewer', 'When', 'Meet', 'Status', ''].map((h, i) => (
                  <th key={i} className={`px-6 py-4 text-xs uppercase tracking-wider font-medium ${i === 7 ? 'text-right' : ''}`} style={{ color: '#6b6459' }}>{h || 'Actions'}</th>
                ))}
              </tr></thead>
              <tbody>
                {interviews.map(i => {
                  const sc = statusColors[i.status] || statusColors.scheduled
                  return (
                    <tr key={i.id} style={{ borderBottom: '1px solid #2a2520' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#161412'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-6 py-4 font-medium" style={{ color: '#f5f0e8' }}>{i.candidate_name || `App #${i.application_id}`}</td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{i.drive_title || '—'}</td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{i.round_number ?? '—'}</td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{i.interviewer_name || `#${i.interviewer_id}`}</td>
                      <td className="px-6 py-4 text-xs" style={{ color: '#6b6459' }}>{i.scheduled_date ? new Date(i.scheduled_date).toLocaleString() : '—'}</td>
                      <td className="px-6 py-4">{i.meet_link ? <a href={i.meet_link} target="_blank" rel="noopener noreferrer" className="text-xs px-2.5 py-1 rounded-lg no-underline" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>Join ↗</a> : <span style={{ color: '#2a2520' }}>—</span>}</td>
                      <td className="px-6 py-4"><span className="text-xs font-medium capitalize rounded-full px-3 py-1" style={{ background: sc.bg, color: sc.color }}>{i.status || 'scheduled'}</span></td>
                      <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(i.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(220,50,50,0.1)', color: '#dc3232' }}>Delete</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {interviews.length === 0 && <div className="px-6 py-12 text-center text-sm" style={{ color: '#6b6459' }}>No interviews scheduled.</div>}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
              <div onClick={e => e.stopPropagation()} className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative" style={{ background: '#161412', border: '1px solid #2a2520' }}>
                <button onClick={closeModal} className="absolute top-4 right-4 text-lg" style={{ color: '#6b6459' }}>✕</button>
                <h2 className="text-xl font-bold font-serif mb-6" style={{ color: '#f5f0e8' }}>Schedule Interview</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Application ID</label><input type="number" required min={1} value={form.application_id} onChange={e => set('application_id', e.target.value)} placeholder="See student's application ID from Applications page" className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} /></div>
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Interviewer</label><select required value={form.interviewer_id} onChange={e => set('interviewer_id', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none appearance-none" style={inputStyle}><option value="">Select...</option>{interviewers.map(iv => <option key={iv.id} value={iv.id}>{iv.name} ({iv.email})</option>)}</select></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Date & Time</label><input type="datetime-local" required value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ ...inputStyle, colorScheme: 'dark' }} /></div>
                    <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Round Number</label><input type="number" required min={1} max={10} value={form.round_number} onChange={e => set('round_number', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} /></div>
                  </div>
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Meet Link</label><input type="text" value={form.meet_link} onChange={e => set('meet_link', e.target.value)} placeholder="https://meet.google.com/..." className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} /><p className="text-xs mt-1" style={{ color: '#6b6459', opacity: 0.6 }}>You can change or add your own meet link</p></div>
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ border: '1px solid #2a2520', color: '#6b6459', background: 'transparent' }}>Cancel</button>
                    <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50" style={{ background: '#d4a843', color: '#0a0a0a' }}>{submitting ? 'Scheduling...' : 'Schedule'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  // INTERVIEWER
  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>My Interviews</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{interviews.length} assigned</p>
        </div>
        {interviews.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: '#161412', border: '1px solid #2a2520' }}>
            <p style={{ color: '#6b6459' }}>No interviews assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map(i => {
              const sc = statusColors[i.status] || statusColors.scheduled
              return (
                <div key={i.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#161412', border: '1px solid #2a2520' }}>
                  <div className="h-0.5" style={{ background: '#d4a843' }}></div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-bold font-serif leading-snug" style={{ color: '#f5f0e8' }}>{i.candidate_name || `App #${i.application_id}`}</h3>
                      <span className="text-[11px] font-medium capitalize rounded-full px-2.5 py-0.5 whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>{i.status || 'scheduled'}</span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#6b6459' }}>{i.drive_title || '—'}</p>
                    <p className="text-xs mb-4" style={{ color: '#6b6459', opacity: 0.6 }}>Round {i.round_number ?? 1}</p>
                    <div className="text-xs mb-5 mt-auto pt-3" style={{ borderTop: '1px solid #2a2520', color: '#6b6459' }}>
                      <p>When: {i.scheduled_date ? new Date(i.scheduled_date).toLocaleString() : 'TBD'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {i.meet_link && <a href={i.meet_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl no-underline" style={{ border: '1px solid #2a2520', color: '#6b6459', background: 'transparent' }}>Join Meet</a>}
                      <Link to={`/evaluate/${i.id}`} className="flex-1 text-center text-sm font-medium px-4 py-2.5 rounded-xl no-underline" style={{ background: '#d4a843', color: '#0a0a0a' }}>Evaluate</Link>
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
