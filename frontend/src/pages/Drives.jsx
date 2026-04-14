import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useDBUser } from '../components/ClerkAxiosProvider'

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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white font-medium text-lg leading-tight">{drive.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            drive.is_active 
              ? 'bg-slate-800 border-slate-700 text-slate-300' 
              : 'bg-transparent border-slate-800 text-slate-500'
          }`}>
            {drive.is_active ? 'Active' : 'Closed'}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{drive.description || 'No description provided.'}</p>
        <div className="space-y-2 mb-6">
          {drive.eligibility_criteria && (
            <p className="text-sm text-slate-400">
              <span className="text-slate-500">Criteria: </span>{drive.eligibility_criteria}
            </p>
          )}
          {drive.deadline && (
            <p className="text-sm text-slate-400">
              <span className="text-slate-500">Deadline: </span>{new Date(drive.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div>
        {!isAdmin && (
          <button
            onClick={handleApply}
            disabled={applying || applied || !drive.is_active}
            className="w-full bg-white hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            {applied ? 'Applied' : applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onDelete(drive.id)}
            className="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            Delete Drive
          </button>
        )}
      </div>
    </div>
  )
}

export default function Drives() {
  const { user } = useDBUser()
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
      setSuccess('Applied successfully')
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
    if (!confirm('Are you sure you want to delete this drive?')) return
    await api.delete(`/api/drives/${driveId}`)
    fetchDrives()
  }

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-white">Recruitment Drives</h1>
            <p className="text-slate-400 text-sm mt-1">{drives.length} drives available</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              + New Drive
            </button>
          )}
        </div>

        {success && <div className="bg-slate-800 border-l-2 border-white text-white text-sm px-4 py-3 rounded-r-xl">{success}</div>}

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl">
            <h2 className="text-white font-medium mb-2">Create New Drive</h2>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                required placeholder="Drive title"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description" rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm resize-none" />
              <input value={form.eligibility_criteria} onChange={e => setForm({ ...form, eligibility_criteria: e.target.value })}
                placeholder="Eligibility criteria"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm" />
              <input type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-slate-500 text-sm" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-white hover:bg-slate-100 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">Create Drive</button>
              <button type="button" onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-20 text-slate-500 flex justify-center text-sm">Loading drives...</div>
        ) : drives.length === 0 ? (
          <div className="py-20 text-slate-500 flex justify-center text-sm border border-dashed border-slate-800 rounded-xl">No drives available.</div>
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
