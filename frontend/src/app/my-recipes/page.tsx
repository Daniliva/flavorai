'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]); 

  useEffect(() => {
    if (!user) return;
    axios
      .get('http://localhost:3000/recipes/my', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((r) => {
        console.log('My recipes:', r.data); 
        setRecipes(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        console.error('Error:', err.response?.data || err.message);
        setRecipes([]);
      });
  }, [user]);

  if (!user) return <p>Войдите в аккаунт</p>;

  return (
    <main className="container">
      <h1>Мои рецепты</h1>
      <div className="grid">
        {recipes.length === 0 ? (
          <p>Нет рецептов</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="card">
              <h3>{recipe.title}</h3>
              <p>{recipe.ingredients}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}