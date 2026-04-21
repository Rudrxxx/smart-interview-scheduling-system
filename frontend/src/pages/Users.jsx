import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

function getInitials(n) { if (!n) return '?'; return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

const roleBadge = {
  admin: { bg: 'rgba(212,168,67,0.2)', color: '#d4a843' },
  student: { bg: 'rgba(212,168,67,0.1)', color: '#d4a843' },
  interviewer: { bg: 'rgba(212,168,67,0.15)', color: '#d4a843' },
}

const ROLES = ['student', 'interviewer', 'admin']

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editRole, setEditRole] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => { setLoading(true); try { setUsers((await api.get('/api/users/')).data) } catch {} setLoading(false) }
  useEffect(() => { fetchUsers() }, [])

  const startEdit = (u) => { setEditingId(u.id); setEditRole(u.role) }
  const cancelEdit = () => { setEditingId(null); setEditRole('') }
  const saveRole = async (id) => { setUpdatingId(id); try { await api.patch(`/api/users/${id}/role`, { role: editRole }); setEditingId(null); fetchUsers() } catch {} setUpdatingId(null) }

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
  })

  return (
    <Layout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif" style={{ color: '#f5f0e8' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6459' }}>{users.length} registered</p>
        </div>

        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="max-w-sm w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #2a2520', color: '#f5f0e8' }} />

        {loading ? <div className="text-center py-20 text-sm" style={{ color: '#6b6459' }}>Loading...</div> : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #2a2520' }}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead><tr style={{ background: '#161412', borderBottom: '1px solid #2a2520' }}>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>User</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Email</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium" style={{ color: '#6b6459' }}>Role</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-medium text-right" style={{ color: '#6b6459' }}>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(u => {
                  const rb = roleBadge[u.role] || roleBadge.student
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #2a2520' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#161412'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-6 py-4"><div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#d4a843', color: '#0a0a0a' }}>{getInitials(u.name)}</div>
                        <span className="font-medium" style={{ color: '#f5f0e8' }}>{u.name}</span>
                      </div></td>
                      <td className="px-6 py-4" style={{ color: '#6b6459' }}>{u.email}</td>
                      <td className="px-6 py-4">
                        {editingId === u.id ? (
                          <select value={editRole} onChange={e => setEditRole(e.target.value)} className="text-xs rounded-lg px-3 py-1.5 focus:outline-none appearance-none" style={{ background: '#161412', border: '1px solid #2a2520', color: '#f5f0e8' }}>
                            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                          </select>
                        ) : (
                          <button onClick={() => startEdit(u)} className="text-xs font-medium capitalize rounded-full px-3 py-1 cursor-pointer border-none" style={{ background: rb.bg, color: rb.color }}>{u.role}</button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === u.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => saveRole(u.id)} disabled={updatingId === u.id || editRole === u.role} className="text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-40" style={{ background: '#d4a843', color: '#0a0a0a' }}>{updatingId === u.id ? '...' : 'Update'}</button>
                            <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#161412', border: '1px solid #2a2520', color: '#6b6459' }}>Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(u)} className="text-xs bg-transparent border-none cursor-pointer" style={{ color: '#6b6459' }}>Change role</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm" style={{ color: '#6b6459' }}>{search ? 'No matches.' : 'No users.'}</div>}
          </div>
        )}
      </div>
    </Layout>
  )
}
