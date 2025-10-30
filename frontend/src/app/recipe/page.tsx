'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  user: { email: string };
  ratings: { stars: number }[];
}

export default function RecipeDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [stars, setStars] = useState(3);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/recipes/${params.id}`);
      const data = await res.json();
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (!user) return;
    setRatingLoading(true);
    try {
      await fetch('http://localhost:3000/recipes/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ recipeId: Number(params.id), stars }),
      });
      fetchRecipe(); // Refresh ratings
    } catch (error) {
      console.error('Error rating recipe:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <main className="container"><p>Loading...</p></main>;
  if (!recipe) return <main className="container"><p>Recipe not found</p></main>;

  const avgRating = recipe.ratings.length > 0 
    ? recipe.ratings.reduce((sum, r) => sum + r.stars, 0) / recipe.ratings.length 
    : 0;

  return (
    <main className="container">
      <article className="card">
        <hgroup>
          <h1>{recipe.title}</h1>
          <p>By {recipe.user.email}</p>
          {avgRating > 0 && (
            <p>⭐ {avgRating.toFixed(1)} ({recipe.ratings.length} ratings)</p>
          )}
        </hgroup>

        <details>
          <summary>Ingredients</summary>
          <pre>{recipe.ingredients}</pre>
        </details>

        <details>
          <summary>Instructions</summary>
          <pre>{recipe.instructions}</pre>
        </details>

        {user && (
          <div className="grid">
            <label htmlFor="stars">Rate this recipe:</label>
            <select
              id="stars"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} stars
                </option>
              ))}
            </select>
            <button
              onClick={handleRate}
              disabled={ratingLoading}
              className="secondary"
            >
              {ratingLoading ? 'Rating...' : 'Rate'}
            </button>
          </div>
        )}
      </article>
    </main>
  );
}