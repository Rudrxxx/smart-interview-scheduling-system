import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const emptyForm = { title: '', description: '', eligibility_criteria: '', deadline: '', is_active: 1 }

export default function Drives() {
  const { user } = useAuth()
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDrive, setEditingDrive] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [appliedIds, setAppliedIds] = useState(new Set())
  const [applyingId, setApplyingId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDrives = async () => { setLoading(true); try { setDrives((await api.get('/api/drives/')).data) } catch {} setLoading(false) }
  const fetchMyApps = async () => { try { setAppliedIds(new Set((await api.get('/api/applications/my')).data.map(a => a.drive_id))) } catch {} }
  useEffect(() => { fetchDrives(); if (user?.role === 'student') fetchMyApps() }, [user])

  const openCreate = () => { setEditingDrive(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (d) => { setEditingDrive(d); setForm({ title: d.title||'', description: d.description||'', eligibility_criteria: d.eligibility_criteria||'', deadline: d.deadline ? d.deadline.split('T')[0] : '', is_active: d.is_active ?? 1 }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingDrive(null); setForm(emptyForm) }
  const handleSubmit = async (e) => { e.preventDefault(); try { if (editingDrive) await api.put(`/api/drives/${editingDrive.id}`, form); else await api.post('/api/drives/', form); closeModal(); fetchDrives() } catch {} }
  const handleDelete = async (id) => { if (!confirm('Delete this drive?')) return; try { await api.delete(`/api/drives/${id}`); fetchDrives() } catch {} }
  const handleApply = async (id) => { setApplyingId(id); try { await api.post('/api/applications/', { drive_id: id }); setAppliedIds(p => new Set([...p, id])); setSuccessMsg('Applied!'); setTimeout(() => setSuccessMsg(''), 3000) } catch {} setApplyingId(null) }
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const inputStyle = { background: '#161412', border: '1px solid #2a2520', color: '#f5f0e8' }
  const labelStyle = { color: '#6b6459' }

  if (loading) return <Layout><div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6b6459' }}>Loading drives...</div></Layout>

  const active = drives.filter(d => d.is_active === 1)

  if (user?.role === 'admin') {
    return (
      <Layout>
        <div className="max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Recruitment Drives</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>{drives.length} Total</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>{active.length} Active</span>
              </div>
            </div>
            <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#d4a843', color: '#0a0a0a' }}>New Drive</button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #2a2520' }}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead><tr style={{ background: '#161412', borderBottom: '1px solid #2a2520' }}>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Title</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Deadline</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium text-right" style={{ color: '#6b6459' }}>Actions</th>
              </tr></thead>
              <tbody>
                {drives.map(d => (
                  <tr key={d.id} className="transition-colors" style={{ borderBottom: '1px solid #2a2520' }}
                    onMouseEnter={e => e.currentTarget.style.background='#161412'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td className="px-6 py-4 font-medium" style={{ color: '#f5f0e8' }}>{d.title}</td>
                    <td className="px-6 py-4"><span className="text-xs font-medium capitalize rounded-full px-3 py-1" style={{ background: d.is_active === 1 ? 'rgba(212,168,67,0.15)' : 'rgba(107,100,89,0.2)', color: d.is_active === 1 ? '#d4a843' : '#6b6459' }}>{d.is_active === 1 ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-6 py-4" style={{ color: '#6b6459' }}>{d.deadline ? new Date(d.deadline).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>Edit</button>
                      <button onClick={() => handleDelete(d.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(220,50,50,0.1)', color: '#dc3232' }}>Delete</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {drives.length === 0 && <div className="px-6 py-12 text-center text-sm" style={{ color: '#6b6459' }}>No drives yet.</div>}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
              <div onClick={e => e.stopPropagation()} className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative" style={{ background: '#161412', border: '1px solid #2a2520' }}>
                <button onClick={closeModal} className="absolute top-4 right-4 text-lg" style={{ color: '#6b6459' }}>✕</button>
                <h2 className="text-xl font-bold font-serif mb-6" style={{ color: '#f5f0e8' }}>{editingDrive ? 'Edit Drive' : 'Create Drive'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={labelStyle}>Title</label><input type="text" required value={form.title} onChange={e => set('title', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} /></div>
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={labelStyle}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={inputStyle} /></div>
                  <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={labelStyle}>Eligibility</label><textarea rows={2} value={form.eligibility_criteria} onChange={e => set('eligibility_criteria', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={inputStyle} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={labelStyle}>Deadline</label><input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} /></div>
                    <div><label className="block text-xs uppercase tracking-widest mb-1.5 font-medium" style={labelStyle}>Status</label><select value={form.is_active} onChange={e => set('is_active', parseInt(e.target.value))} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none appearance-none" style={inputStyle}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ border: '1px solid #2a2520', color: '#6b6459', background: 'transparent' }}>Cancel</button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#d4a843', color: '#0a0a0a' }}>{editingDrive ? 'Save' : 'Create'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  // STUDENT
  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>Browse Drives</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{active.length} active</p>
        </div>
        {successMsg && <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#d4a843' }}>{successMsg}</div>}
        {active.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: '#161412', border: '1px solid #2a2520' }}>
            <p className="text-lg font-serif" style={{ color: '#6b6459' }}>No active drives available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(d => (
              <div key={d.id} className="rounded-2xl overflow-hidden flex flex-col transition-all" style={{ background: '#161412', border: '1px solid #2a2520' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(212,168,67,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor='#2a2520'}>
                <div className="h-0.5" style={{ background: '#d4a843', opacity: 0.3 }}></div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold font-serif mb-2" style={{ color: '#f5f0e8' }}>{d.title}</h3>
                  <p className="text-sm mb-4 line-clamp-2 leading-relaxed flex-1" style={{ color: '#6b6459' }}>{d.description || 'No description.'}</p>
                  <div className="space-y-2 text-xs mb-5" style={{ color: '#6b6459' }}>
                    {d.eligibility_criteria && <p>◈ {d.eligibility_criteria}</p>}
                    {d.deadline && <p>⊙ Deadline: {new Date(d.deadline).toLocaleDateString()}</p>}
                  </div>
                  {appliedIds.has(d.id) ? (
                    <button disabled className="w-full text-sm font-medium px-4 py-2.5 rounded-xl cursor-default" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843', border: '1px solid rgba(212,168,67,0.2)' }}>Applied ✓</button>
                  ) : (
                    <button onClick={() => handleApply(d.id)} disabled={applyingId === d.id} className="w-full text-sm font-medium px-4 py-2.5 rounded-xl disabled:opacity-50" style={{ background: '#d4a843', color: '#0a0a0a' }}>
                      {applyingId === d.id ? 'Applying...' : 'Apply Now →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
