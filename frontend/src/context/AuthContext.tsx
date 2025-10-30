'use client';
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post('http://localhost:3000/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    router.push('/');
  };

  const register = async (email: string, password: string) => {
    const { data } = await axios.post('http://localhost:3000/auth/register', { email, password });
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);