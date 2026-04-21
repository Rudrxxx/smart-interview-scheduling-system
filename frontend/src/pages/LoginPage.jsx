import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(email, password); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.detail || 'Invalid email or password') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL — decorative */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0" style={{ background: '#0a0a0a' }}>
        <Link to="/" className="flex items-center gap-3 no-underline mb-12">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#d4a843' }}>
            <span className="font-bold text-sm" style={{ color: '#0a0a0a' }}>SI</span>
          </div>
          <span className="font-serif font-semibold" style={{ color: '#f5f0e8' }}>SmartInterview</span>
        </Link>

        <div className="w-12 mb-8" style={{ height: '2px', background: '#d4a843' }}></div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: '#f5f0e8' }}>
          Your next great<br />hire starts here.
        </h1>
        <p className="text-sm leading-relaxed max-w-xs mb-10" style={{ color: '#6b6459' }}>
          Trusted by placement cells across the country to modernize campus recruitment.
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

      {/* RIGHT PANEL — form */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12" style={{ background: '#f5f0e8' }}>
        <div className="max-w-sm w-full mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: '#0a0a0a' }}>Welcome back.</h2>
          <p className="text-sm mb-8" style={{ color: '#6b6459' }}>Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.2)', color: '#dc3232' }}>{error}</div>}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#6b6459' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
                className="w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #999', color: '#0a0a0a' }} placeholder="you@university.edu" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#6b6459' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"
                className="w-full bg-transparent text-sm py-2.5 focus:outline-none" style={{ borderBottom: '1px solid #999', color: '#0a0a0a' }} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl px-4 py-3 font-medium text-sm transition-all disabled:opacity-50 mt-4" style={{ background: '#0a0a0a', color: '#f5f0e8' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="mt-8 text-sm" style={{ color: '#6b6459' }}>
            Don't have an account?{' '}
            <Link to="/register" className="underline font-medium" style={{ color: '#0a0a0a' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
