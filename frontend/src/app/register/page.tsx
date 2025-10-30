'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    try {
      await register(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="container">
      <article className="grid">
        <hgroup>
          <h1>Register</h1>
          <p>Create new account</p>
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
          <button type="submit" className="contrast">Register</button>
        </form>
        <p>
          Have account? <Link href="/login">Login</Link>
        </p>
      </article>
    </main>
  );
}