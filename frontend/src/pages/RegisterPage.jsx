import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await register(form.name, form.email, form.password, form.role); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.detail || 'Failed to create account') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0" style={{ background: '#0a0a0a' }}>
        <Link to="/" className="flex items-center gap-3 no-underline mb-12">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#d4a843' }}>
            <span className="font-bold text-sm" style={{ color: '#0a0a0a' }}>SI</span>
          </div>
          <span className="font-serif font-semibold" style={{ color: '#f5f0e8' }}>SmartInterview</span>
        </Link>
        <div className="w-12 mb-8" style={{ height: '2px', background: '#d4a843' }}></div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: '#f5f0e8' }}>
          Join thousands of<br />students already placed.
        </h1>
        <p className="text-sm leading-relaxed max-w-xs mb-10" style={{ color: '#6b6459' }}>
          Create your free account and start your placement journey today.
        </p>
        <div className="flex gap-8">
          {[{ n: '500+', l: 'Universities' }, { n: '10K+', l: 'Placements' }, { n: '99%', l: 'Satisfaction' }].map((s, i) => (
            <div key={i}>
              <p className="text-lg font-bold font-serif" style={{ color: '#f5f0e8' }}>{s.n}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b6459' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12" style={{ background: '#f5f0e8' }}>
        <div className="max-w-sm w-full mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: '#0a0a0a' }}>Create your account.</h2>
          <p className="text-sm mb-8" style={{ color: '#6b6459' }}>It only takes a minute to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.2)', color: '#dc3232' }}>{error}</div>}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#6b6459' }}>Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #999', color: '#0a0a0a' }} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#6b6459' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #999', color: '#0a0a0a' }} placeholder="you@university.edu" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#6b6459' }}>Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #999', color: '#0a0a0a' }} placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#6b6459' }}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'student', label: 'Student', icon: '◎' }, { value: 'interviewer', label: 'Interviewer', icon: '◷' }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setForm({...form, role: opt.value})}
                    className="rounded-xl p-4 text-sm font-medium transition-all text-center border"
                    style={{
                      background: form.role === opt.value ? '#0a0a0a' : 'transparent',
                      color: form.role === opt.value ? '#f5f0e8' : '#0a0a0a',
                      borderColor: form.role === opt.value ? '#0a0a0a' : '#ccc',
                    }}>
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl px-4 py-3 font-medium text-sm transition-all disabled:opacity-50 mt-2" style={{ background: '#0a0a0a', color: '#f5f0e8' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p className="mt-8 text-sm" style={{ color: '#6b6459' }}>
            Already have an account?{' '}
            <Link to="/login" className="underline font-medium" style={{ color: '#0a0a0a' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
