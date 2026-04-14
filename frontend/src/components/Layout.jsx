import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-16 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
