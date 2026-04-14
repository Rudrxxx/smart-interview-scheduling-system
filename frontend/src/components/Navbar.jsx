import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { useDBUser } from './ClerkAxiosProvider'

export default function Navbar() {
  const { user: dbUser } = useDBUser()
  const { user: clerkUser } = useUser()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <span className="text-slate-950 font-bold text-sm">SI</span>
          </div>
          <span className="text-white font-medium tracking-tight">SmartInterview</span>
        </Link>

        {clerkUser && (
          <div className="flex items-center gap-4">
            {dbUser && (
              <span className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-xl font-medium capitalize">
                {dbUser.role}
              </span>
            )}
            <span className="text-slate-400 text-sm">{dbUser?.name || clerkUser.fullName}</span>
            <UserButton afterSignOutUrl="/login" appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8 rounded-xl' } }} />
          </div>
        )}
      </div>
    </nav>
  )
}
