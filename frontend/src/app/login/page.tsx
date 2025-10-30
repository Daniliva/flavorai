'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="container">
      <article className="grid">
        <hgroup>
          <h1>Login</h1>
          <p>Welcome back!</p>
        </hgroup>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          {error && <small role="alert" className="error">{error}</small>}
          <button type="submit" className="contrast">Login</button>
        </form>
        <p>
          No account? <Link href="/register">Register</Link>
        </p>
      </article>
    </main>
  );
}