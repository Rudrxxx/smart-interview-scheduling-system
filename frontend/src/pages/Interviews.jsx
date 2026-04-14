import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Interviews() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [interviewers, setInterviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ application_id: '', interviewer_id: '', scheduled_date: '', time_slot: '', meet_link: '' })
  const [error, setError] = useState('')

  const fetchAll = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/api/interviews/' : '/api/interviews/my'
      const res = await api.get(endpoint)
      setInterviews(res.data)
      if (user.role === 'admin') {
        const [apps, ivrs] = await Promise.all([
          api.get('/api/applications/'),
          api.get('/api/interviews/interviewers')
        ])
        setApplications(apps.data.filter(a => a.status === 'applied'))
        setInterviewers(ivrs.data)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleSchedule = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/interviews/', {
        ...form,
        application_id: parseInt(form.application_id),
        interviewer_id: parseInt(form.interviewer_id),
        scheduled_date: new Date(form.scheduled_date).toISOString(),
      })
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to schedule interview')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.role === 'admin' ? 'Manage Interviews' : 'My Interviews'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{interviews.length} scheduled</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              + Schedule Interview
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSchedule} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Schedule Interview</h2>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <select value={form.application_id} onChange={e => setForm({ ...form, application_id: e.target.value })} required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500">
              <option value="">Select Application</option>
              {applications.map(a => <option key={a.id} value={a.id}>App #{a.id} — Student #{a.student_id} (Drive #{a.drive_id})</option>)}
            </select>
            <select value={form.interviewer_id} onChange={e => setForm({ ...form, interviewer_id: e.target.value })} required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500">
              <option value="">Select Interviewer</option>
              {interviewers.map(i => <option key={i.id} value={i.id}>{i.name} ({i.email})</option>)}
            </select>
            <input type="datetime-local" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500" />
            <input value={form.time_slot} onChange={e => setForm({ ...form, time_slot: e.target.value })} required
              placeholder="Time slot (e.g., 10:00 AM - 10:30 AM)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            <input value={form.meet_link} onChange={e => setForm({ ...form, meet_link: e.target.value })}
              placeholder="Google Meet / Zoom link (optional)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            <div className="flex gap-3">
              <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">Schedule</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No interviews scheduled.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map(interview => (
              <div key={interview.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-medium">Interview #{interview.id}</p>
                    <p className="text-slate-500 text-sm">Application #{interview.application_id}</p>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">Scheduled</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">📅 {new Date(interview.scheduled_date).toLocaleDateString()}</p>
                  <p className="text-slate-400">🕐 {interview.time_slot}</p>
                  {interview.meet_link && (
                    <a href={interview.meet_link} target="_blank" rel="noreferrer"
                      className="text-violet-400 hover:underline text-xs inline-block">🔗 Join Meeting</a>
                  )}
                </div>
                {user?.role === 'interviewer' && (
                  <a href={`/evaluate/${interview.id}`}
                    className="mt-4 block w-full bg-violet-600 hover:bg-violet-500 text-white text-center text-sm font-medium py-2.5 rounded-xl transition-all">
                    Submit Evaluation
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
