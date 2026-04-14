import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function DriveCard({ drive, onApply, onDelete, isAdmin }) {
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = async () => {
    setApplying(true)
    try {
      await onApply(drive.id)
      setApplied(true)
    } catch {}
    setApplying(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-lg">{drive.title}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full ${drive.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
          {drive.is_active ? 'Active' : 'Closed'}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{drive.description || 'No description provided.'}</p>
      {drive.eligibility_criteria && (
        <p className="text-xs text-slate-500 mb-4">
          <span className="text-slate-400 font-medium">Eligibility: </span>{drive.eligibility_criteria}
        </p>
      )}
      {drive.deadline && (
        <p className="text-xs text-slate-500 mb-4">
          Deadline: {new Date(drive.deadline).toLocaleDateString()}
        </p>
      )}
      {!isAdmin && (
        <button
          onClick={handleApply}
          disabled={applying || applied}
          className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
        >
          {applied ? 'Applied ✓' : applying ? 'Applying...' : 'Apply Now'}
        </button>
      )}
      {isAdmin && (
        <button
          onClick={() => onDelete(drive.id)}
          className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium py-2.5 rounded-xl transition-all"
        >
          Delete Drive
        </button>
      )}
    </div>
  )
}

export default function Drives() {
  const { user } = useAuth()
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', eligibility_criteria: '', deadline: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchDrives = async () => {
    try {
      const res = await api.get('/api/drives/')
      setDrives(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchDrives() }, [])

  const handleApply = async (driveId) => {
    try {
      await api.post('/api/applications/', { drive_id: driveId })
      setSuccess('Applied successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      throw err
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/drives/', form)
      setShowCreate(false)
      setForm({ title: '', description: '', eligibility_criteria: '', deadline: '' })
      fetchDrives()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create drive')
    }
  }

  const handleDelete = async (driveId) => {
    if (!confirm('Delete this drive?')) return
    await api.delete(`/api/drives/${driveId}`)
    fetchDrives()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Recruitment Drives</h1>
            <p className="text-slate-400 text-sm mt-1">{drives.length} drives available</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              + New Drive
            </button>
          )}
        </div>

        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl">{success}</div>}

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Create New Drive</h2>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              required placeholder="Drive title (e.g., Google SWE 2025)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description" rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            <input value={form.eligibility_criteria} onChange={e => setForm({ ...form, eligibility_criteria: e.target.value })}
              placeholder="Eligibility criteria (e.g., CGPA > 7.5)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
            <input type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500" />
            <div className="flex gap-3">
              <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">Create Drive</button>
              <button type="button" onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading drives...</div>
        ) : drives.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No drives available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drives.map(drive => (
              <DriveCard key={drive.id} drive={drive} onApply={handleApply} onDelete={handleDelete} isAdmin={user?.role === 'admin'} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
