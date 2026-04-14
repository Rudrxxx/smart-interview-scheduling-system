import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'

const ROLES = ['student', 'interviewer', 'admin']

const roleStyle = {
  admin: 'bg-purple-900/30 text-purple-400 border-purple-900/50',
  interviewer: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
  student: 'bg-slate-800 text-slate-300 border-slate-700',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchUsers = () => {
    api.get('/api/users/').then(res => {
      setUsers(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      await api.patch(`/api/users/${userId}/role`, { role: newRole })
      fetchUsers()
    } catch {}
    setUpdating(null)
  }

  return (
    <Layout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading users...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{u.id}</td>
                      <td className="px-6 py-4 text-white">{u.name}</td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium border ${roleStyle[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          disabled={updating === u.id}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-500 cursor-pointer disabled:opacity-50"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-500 text-sm">No users found.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
