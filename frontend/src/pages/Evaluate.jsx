import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'

export default function Evaluate() {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ score: '', feedback: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/evaluations/', {
        interview_id: parseInt(interviewId),
        score: parseFloat(form.score),
        feedback: form.feedback,
      })
      navigate('/my-interviews')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit evaluation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Submit Evaluation</h1>
          <p className="text-slate-400 text-sm mt-1">Interview #{interviewId}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm text-slate-400 mb-2">Score (0 - 100)</label>
            <input
              type="number" min="0" max="100" step="0.5"
              value={form.score}
              onChange={e => setForm({ ...form, score: e.target.value })}
              required placeholder="e.g. 78.5"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            {form.score && (
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${parseFloat(form.score) >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(form.score, 100)}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Feedback</label>
            <textarea
              value={form.feedback}
              onChange={e => setForm({ ...form, feedback: e.target.value })}
              rows={5} placeholder="Detailed feedback about the candidate..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
