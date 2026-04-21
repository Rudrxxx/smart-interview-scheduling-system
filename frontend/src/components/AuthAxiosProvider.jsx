import { useEffect } from 'react'
import api from '../api/axios'

export default function AuthAxiosProvider({ children }) {
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = localStorage.getItem('si_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    return () => api.interceptors.request.eject(interceptor)
  }, [])

  return children
}
