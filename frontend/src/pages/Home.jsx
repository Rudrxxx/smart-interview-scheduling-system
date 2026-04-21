import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const features = [
    { num: '01', icon: '◈', title: 'Recruitment Drives', desc: 'Create and manage placement drives with deadlines, eligibility criteria, and round configurations.' },
    { num: '02', icon: '◎', title: 'Smart Scheduling', desc: 'Assign interviewers and auto-schedule interviews based on availability and round structure.' },
    { num: '03', icon: '◉', title: 'Panel Evaluation', desc: 'Structured evaluation forms with 1-10 scoring, feedback, and proceed/hold/reject recommendations.' },
    { num: '04', icon: '⬡', title: 'Results & Analytics', desc: 'Generate final selection lists, export placement reports, and track placement metrics.' },
  ]

  const steps = [
    { num: '01', title: 'Admin creates a drive', desc: 'Set up a recruitment drive with deadlines, eligibility criteria, and interview rounds.' },
    { num: '02', title: 'Students apply', desc: 'Students browse drives and submit applications. Admin reviews and shortlists candidates.' },
    { num: '03', title: 'Interview & evaluate', desc: 'Interviewers conduct sessions, submit evaluations, and admin publishes final results.' },
  ]

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0a0a0a', color: '#f5f0e8' }}>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8" style={{ background: '#0a0a0a' }}>
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#d4a843' }}>
            <span className="font-bold text-sm" style={{ color: '#0a0a0a' }}>SI</span>
          </div>
          <span className="font-serif font-semibold tracking-tight" style={{ color: '#f5f0e8' }}>SmartInterview</span>
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollTo('process')} className="transition-colors cursor-pointer bg-transparent border-none" style={{ color: '#6b6459' }} onMouseEnter={e => e.target.style.color='#f5f0e8'} onMouseLeave={e => e.target.style.color='#6b6459'}>How It Works</button>
            <button onClick={() => scrollTo('features')} className="transition-colors cursor-pointer bg-transparent border-none" style={{ color: '#6b6459' }} onMouseEnter={e => e.target.style.color='#f5f0e8'} onMouseLeave={e => e.target.style.color='#6b6459'}>Features</button>
            <button onClick={() => scrollTo('features')} className="transition-colors cursor-pointer bg-transparent border-none" style={{ color: '#6b6459' }} onMouseEnter={e => e.target.style.color='#f5f0e8'} onMouseLeave={e => e.target.style.color='#6b6459'}>For Students</button>
          </div>
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-medium no-underline transition-all" style={{ background: '#d4a843', color: '#0a0a0a' }}>
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all" style={{ border: '1px solid #d4a843', color: '#d4a843', background: 'transparent' }}>Sign In</Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-medium no-underline" style={{ background: '#d4a843', color: '#0a0a0a' }}>Get Started</Link>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 text-xs font-medium uppercase tracking-widest" style={{ border: '1px solid #2a2520', color: '#d4a843' }}>
          <span>◆</span> THE NEW STANDARD FOR CAMPUS RECRUITMENT
        </div>

        <h1 className="font-serif text-7xl md:text-8xl font-bold leading-none tracking-tight mb-8">
          <span style={{ color: '#f5f0e8' }}>Hire.</span><br />
          <span style={{ color: '#d4a843' }}>Schedule.</span><br />
          <span style={{ color: '#f5f0e8' }}>Evaluate.</span>
        </h1>

        <p className="text-lg max-w-lg leading-relaxed mb-10" style={{ color: '#6b6459' }}>
          The all-in-one platform for university placement cells. Manage drives, schedule interviews, and evaluate candidates seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link to={user ? '/dashboard' : '/register'} className="px-8 py-3.5 rounded-xl font-medium text-base no-underline transition-all" style={{ background: '#d4a843', color: '#0a0a0a' }}>
            Get Started Free →
          </Link>
          <button onClick={() => scrollTo('process')} className="px-8 py-3.5 rounded-xl font-medium text-base transition-all cursor-pointer" style={{ border: '1px solid #d4a843', color: '#d4a843', background: 'transparent' }}>
            See How It Works
          </button>
        </div>

        <div className="flex items-center gap-12 sm:gap-16">
          {[
            { icon: '◈', num: '500+', label: 'Universities' },
            { icon: '◉', num: '10K+', label: 'Students Placed' },
            { icon: '◆', num: '99%', label: 'Satisfaction' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <span className="text-lg block mb-1" style={{ color: '#d4a843' }}>{s.icon}</span>
              <p className="text-2xl font-bold font-serif" style={{ color: '#f5f0e8' }}>{s.num}</p>
              <p className="text-xs mt-1" style={{ color: '#6b6459' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24" style={{ borderTop: '1px solid #2a2520' }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#d4a843' }}>THE PLATFORM</p>
        <h2 className="font-serif text-4xl font-bold mb-12" style={{ color: '#f5f0e8' }}>Everything your placement cell needs.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, idx) => (
            <div key={idx} className="rounded-2xl p-8 transition-all" style={{ background: '#161412', border: idx === 0 ? '1px solid #d4a843' : '1px solid #2a2520' }}>
              <div className="flex items-start justify-between mb-6">
                <span className="text-sm font-medium" style={{ color: 'rgba(212,168,67,0.4)' }}>{f.num}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843' }}>{f.icon}</div>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: '#f5f0e8' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6459' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="max-w-6xl mx-auto px-6 py-24" style={{ borderTop: '1px solid #2a2520' }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#d4a843' }}>THE PROCESS</p>
        <h2 className="font-serif text-4xl font-bold mb-12" style={{ color: '#f5f0e8' }}>Three steps to your next hire.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="rounded-2xl p-8" style={{ background: '#161412', border: '1px solid #2a2520' }}>
              <span className="text-sm font-medium block mb-6" style={{ color: 'rgba(212,168,67,0.4)' }}>{s.num}</span>
              <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: '#f5f0e8' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6459' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="rounded-2xl p-12 md:p-20 text-center" style={{ background: '#161412', border: '1px solid #d4a843' }}>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#f5f0e8' }}>Ready to modernize your placement cell?</h2>
          <p className="text-lg mb-10" style={{ color: '#6b6459' }}>Join hundreds of universities already using SmartInterview.</p>
          <Link to="/register" className="px-8 py-3.5 rounded-xl font-medium text-base no-underline inline-block" style={{ background: '#d4a843', color: '#0a0a0a' }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs" style={{ borderTop: '1px solid #2a2520' }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px]" style={{ background: '#d4a843', color: '#0a0a0a' }}>SI</div>
          <span className="font-serif" style={{ color: '#f5f0e8' }}>SmartInterview</span>
          <span style={{ color: '#6b6459' }}>© 2025. Built for campus recruitment.</span>
        </div>
        <div className="flex gap-6" style={{ color: '#6b6459' }}>
          <a href="#" className="hover:opacity-80 transition-opacity no-underline" style={{ color: '#6b6459' }}>GitHub</a>
          <a href="#" className="hover:opacity-80 transition-opacity no-underline" style={{ color: '#6b6459' }}>Documentation</a>
          <a href="#" className="hover:opacity-80 transition-opacity no-underline" style={{ color: '#6b6459' }}>Support</a>
        </div>
      </footer>
    </div>
  )
}
