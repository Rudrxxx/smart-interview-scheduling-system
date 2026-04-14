import { useAuth } from "@clerk/clerk-react"
import { useEffect, createContext, useContext, useState } from "react"
import api from "../api/axios"

// We export a context from here to sync our Database User object (which has the "role" enum)
// since Clerk doesn't natively map our internal admin/student roles by default.
const DBUserContext = createContext({ user: null, loading: true })

export function useDBUser() {
  return useContext(DBUserContext)
}

export default function ClerkAxiosProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Intercept all API calls with Clerk Token
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    return () => api.interceptors.request.eject(interceptor)
  }, [getToken])

  // 2. Fetch the newly dynamically-created DB User which resolves our role mappings
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      api.get("/api/users/me").then(res => {
        setDbUser(res.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    } else if (isLoaded && !isSignedIn) {
      setDbUser(null)
      setLoading(false)
    }
  }, [isLoaded, isSignedIn])

  return (
    <DBUserContext.Provider value={{ user: dbUser, loading }}>
      {children}
    </DBUserContext.Provider>
  )
}
