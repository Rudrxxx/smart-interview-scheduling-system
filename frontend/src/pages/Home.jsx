import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function Home() {
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-slate-800">
      <nav className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
              <span className="text-slate-950 font-bold text-sm">SI</span>
            </div>
            <span className="text-white font-medium tracking-tight">SmartInterview</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            {isSignedIn ? (
              <Link to="/dashboard" className="text-white hover:text-slate-300 transition-colors">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-white hover:bg-slate-200 text-slate-950 px-4 py-2 rounded-xl transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-slate-300 text-sm font-medium mb-8">
          The new standard for campus recruitment
        </div>
        
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
          Streamline your <br className="hidden md:block" />
          <span className="text-slate-400">interview process.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage drives, schedule interviews, and evaluate candidates seamlessly. Designed for modern university placement cells and hiring teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={isSignedIn ? "/dashboard" : "/register"} className="w-full sm:w-auto bg-white hover:bg-slate-200 text-slate-950 px-8 py-3.5 rounded-xl font-medium transition-all text-base">
            {isSignedIn ? "Open Dashboard" : "Get Started Free"}
          </Link>
          <a href="#features" className="w-full sm:w-auto border border-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl font-medium transition-all text-base">
            Learn More
          </a>
        </div>

        <div className="mt-32 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-2 md:p-4 backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 aspect-[16/9] flex items-center justify-center">
              <span className="text-slate-600 font-medium">Dashboard Preview</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
