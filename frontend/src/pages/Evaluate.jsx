import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const recStyles = {
  proceed: { idle: { border: '1px solid #2a2520', color: '#6b6459', background: '#161412' }, active: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' } },
  hold:    { idle: { border: '1px solid #2a2520', color: '#6b6459', background: '#161412' }, active: { background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#d4a843' } },
  reject:  { idle: { border: '1px solid #2a2520', color: '#6b6459', background: '#161412' }, active: { background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#dc3232' } },
}

export default function Evaluate() {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [interview, setInterview] = useState(null)
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ score: null, feedback: '', recommendation: '' })

  useEffect(() => {
    const load = async () => {
      try {
        setInterview((await api.get(`/api/interviews/${interviewId}`)).data)
        try { const r = await api.get(`/api/evaluations/?interview_id=${interviewId}`); const d = Array.isArray(r.data) ? r.data[0] : r.data; if (d?.id) setExisting(d) } catch {}
      } catch {}
      setLoading(false)
    }
    load()
  }, [interviewId])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!form.score || !form.recommendation) return; setSubmitting(true)
    try { await api.post('/api/evaluations/', { interview_id: parseInt(interviewId), score: form.score, feedback: form.feedback, recommendation: form.recommendation }); setSubmitted(true) } catch {}
    setSubmitting(false)
  }

  if (loading) return <Layout><div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6b6459' }}>Loading...</div></Layout>
  const isReadOnly = !!existing || submitted

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        <button onClick={() => navigate(-1)} className="text-sm bg-transparent border-none cursor-pointer" style={{ color: '#6b6459' }}>← Back</button>

        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Evaluate Interview</h1>
          {interview && <p className="text-sm mt-2" style={{ color: '#6b6459' }}>{interview.candidate_name || `App #${interview.application_id}`} · {interview.drive_title || ''} · Round {interview.round_number ?? 1}</p>}
        </div>

        {interview && (
          <div className="rounded-xl p-4 flex flex-wrap items-center justify-between gap-4" style={{ background: '#161412', border: '1px solid #2a2520' }}>
            <span className="text-sm" style={{ color: '#6b6459' }}>Scheduled: <span style={{ color: '#f5f0e8' }}>{interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString() : 'TBD'}</span></span>
            {interview.meet_link && <a href={interview.meet_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium px-4 py-2 rounded-xl no-underline" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>Join Meet ↗</a>}
          </div>
        )}

        {existing && !submitted && <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', color: '#d4a843' }}>Evaluation already submitted.</div>}
        {submitted && <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>Submitted successfully!</div>}

        <div className="rounded-2xl p-6 sm:p-8" style={{ background: '#161412', border: '1px solid #2a2520' }}>
          {isReadOnly ? (
            <div className="space-y-6">
              <div><p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#6b6459' }}>Score</p><p className="text-3xl font-bold font-serif" style={{ color: '#f5f0e8' }}>{existing?.score ?? form.score}<span style={{ color: '#6b6459' }}> / 10</span></p></div>
              <div><p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#6b6459' }}>Recommendation</p><span className="text-sm font-medium capitalize rounded-full px-3 py-1" style={recStyles[existing?.recommendation ?? form.recommendation]?.active || {}}>{existing?.recommendation ?? form.recommendation}</span></div>
              <div><p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#6b6459' }}>Feedback</p><p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#6b6459' }}>{(existing?.feedback ?? form.feedback) || '—'}</p></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#6b6459' }}>Score</p>
                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <button key={n} type="button" onClick={() => set('score', n)}
                      className="w-full aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all"
                      style={form.score === n ? { background: '#d4a843', color: '#0a0a0a', border: '1px solid #d4a843' } : { background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: '#6b6459' }}>Feedback</p>
                <textarea rows={6} value={form.feedback} onChange={e => set('feedback', e.target.value)} placeholder="Detailed feedback..."
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none leading-relaxed" style={{ background: '#0a0a0a', border: '1px solid #2a2520', color: '#f5f0e8' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#6b6459' }}>Recommendation</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ value: 'proceed', label: 'Proceed ✓' }, { value: 'hold', label: 'Hold ◷' }, { value: 'reject', label: 'Reject ✗' }].map(opt => (
                    <button key={opt.value} type="button" onClick={() => set('recommendation', opt.value)}
                      className="py-3 rounded-xl text-sm font-medium transition-all"
                      style={form.recommendation === opt.value ? recStyles[opt.value].active : recStyles[opt.value].idle}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={submitting || !form.score || !form.recommendation}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40" style={{ background: '#d4a843', color: '#0a0a0a' }}>
                  {submitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}
