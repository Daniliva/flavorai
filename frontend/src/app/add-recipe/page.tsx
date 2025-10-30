'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <p>Please login</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const title = form.title;
    const ingredients = form.ingredients.value;
    const instructions = form.instructions.value;

    try {
      await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, ingredients, instructions }),
      });
      router.push('/');
    } catch (err: unknown) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Add Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" required />

        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={3}
          placeholder="e.g. 2 eggs, 100g flour, salt"
          required
        />

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          rows={5}
          placeholder="Step by step instructions..."
          required
        />

        {error && <small role="alert" className="error">{error}</small>}
        <button type="submit" disabled={loading} className="contrast">
          {loading ? 'Adding...' : 'Add Recipe'}
        </button>
      </form>
    </main>
  );
}