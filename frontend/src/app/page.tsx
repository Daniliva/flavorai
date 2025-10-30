'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/recipes?search=${search}`);       
        setRecipes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('API error:', err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" />
      {recipes.length === 0 ? (
        <p>No recipes found</p>
      ) : (
        <article>
          {recipes.map((r: any) => (
            <section key={r.id}>
              <h3>{r.title}</h3>
              <p>By: {r.user?.email}</p>
              <Link href={`http://localhost:3000/recipe/${r.id}`}>View</Link>
            </section>
          ))}
        </article>
      )}
      {user && (
        <>
          <Link href="/add-recipe">Add Recipe</Link>{' '}
          <Link href="/my-recipes">My Recipes</Link>
        </>
      )}
    </main>
  );
}