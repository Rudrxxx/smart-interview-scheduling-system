import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("si_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.sub, role: payload.role });
        
        api.get("/api/users/me").then(res => {
          setUser(res.data);
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("si_token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, role) => {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    localStorage.setItem("si_token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("si_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
