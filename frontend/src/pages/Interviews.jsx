import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useDBUser } from '../components/ClerkAxiosProvider'

export default function Interviews() {
  const { user } = useDBUser()
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
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white">
              {user?.role === 'admin' ? 'Manage Interviews' : 'My Interviews'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{interviews.length} scheduled</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)}
              className="bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-xl text-sm font-medium transition-all">
              + Schedule Interview
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSchedule} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl">
            <h2 className="text-white font-medium mb-2">Schedule New Interview</h2>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={form.application_id} onChange={e => setForm({ ...form, application_id: e.target.value })} required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500 text-sm">
                <option value="">Select Application</option>
                {applications.map(a => <option key={a.id} value={a.id}>App #{a.id} — Student #{a.student_id}</option>)}
              </select>
              <select value={form.interviewer_id} onChange={e => setForm({ ...form, interviewer_id: e.target.value })} required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500 text-sm">
                <option value="">Select Interviewer</option>
                {interviewers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <input type="datetime-local" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500 text-sm" />
              <input value={form.time_slot} onChange={e => setForm({ ...form, time_slot: e.target.value })} required
                placeholder="Time slot (e.g., 10:00 AM - 10:30 AM)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm" />
            </div>
            <input value={form.meet_link} onChange={e => setForm({ ...form, meet_link: e.target.value })}
              placeholder="Meeting link (optional)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm" />
            
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-white hover:bg-slate-100 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">Schedule</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">No interviews scheduled.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map(inv => (
              <div key={inv.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">Interview #{inv.id}</h3>
                      <p className="text-slate-500 text-sm">App #{inv.application_id}</p>
                    </div>
                    <span className="text-[11px] border border-blue-900/50 bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Scheduled</span>
                  </div>
                  <div className="space-y-1 mb-6 text-sm text-slate-400">
                    <p>Date: <span className="text-white ml-2">{new Date(inv.scheduled_date).toLocaleDateString()}</span></p>
                    <p>Time: <span className="text-white ml-2">{inv.time_slot}</span></p>
                    {inv.meet_link && (
                      <p className="pt-2">
                        <a href={inv.meet_link} target="_blank" rel="noreferrer" className="text-white hover:underline">Join Meeting ↗</a>
                      </p>
                    )}
                  </div>
                </div>
                {user?.role === 'interviewer' && (
                  <a href={`/evaluate/${inv.id}`}
                    className="w-full block bg-white hover:bg-slate-100 text-slate-950 text-center text-sm font-medium py-2.5 rounded-xl transition-all">
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
