"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const router = useRouter();
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me", {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
  
     try {
       await fetch("http://localhost:4000/auth/logout", {
         method: "POST",
         credentials: "include", // عشان Cookie تتحذف
       });

       setUser(null); // لو عندك Context لتحديث الحالة
       router.push("/login"); // redirect بعد logout
     } catch (err) {
       console.error("Logout failed", err);
     }
  

  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
