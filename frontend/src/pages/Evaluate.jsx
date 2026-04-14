import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'

export default function Evaluate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ score: 50, feedback: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/api/evaluations/', {
        interview_id: parseInt(id),
        score: parseInt(form.score),
        feedback: form.feedback
      })
      navigate('/interviews')
    } catch (err) {
      setError(err.response?.data?.detail || 'Evaluation failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-medium text-white mb-2">Submit Evaluation</h1>
        <p className="text-slate-400 text-sm mb-8">Interview #{id}</p>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-400 font-medium">Candidate Score</label>
              <span className="text-white font-mono">{form.score}/100</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={form.score} onChange={e => setForm({ ...form, score: e.target.value })}
              className="w-full appearance-none bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Feedback Notes</label>
            <textarea
              required rows={6}
              value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })}
              placeholder="Provide detailed feedback on the candidate's performance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-white hover:bg-slate-100 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Submit Evaluation'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
