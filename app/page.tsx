'use client';

import { useState } from 'react';
import { getYoutubeVideoId, getYoutubeThumbnailUrl } from './utils/youtube';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { Recipe } from './types/recipe';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const videoId = getYoutubeVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      // Debug logging
      console.log('Response data:', data);
      setDebugInfo(JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract recipe');
      }

      // Check for the correct nested structure
      if (!data.recipe?.entities?.recipe?.name || 
          !Array.isArray(data.recipe?.entities?.recipe?.ingredients) || 
          !Array.isArray(data.recipe?.entities?.recipe?.steps)) {
        console.error('Invalid recipe format:', data);
        throw new Error('Invalid recipe format received. Check console for details.');
      }
      
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const recipeData = recipe?.recipe?.entities?.recipe;

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Video2Recipe</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL (supports regular videos, shorts, and youtu.be links)"
            className="flex-1 p-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 min-w-[120px]"
          >
            {loading ? <LoadingSpinner /> : 'Bake'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          {debugInfo && (
            <details className="mt-2">
              <summary className="cursor-pointer">Debug Information</summary>
              <pre className="mt-2 p-2 bg-red-50 rounded text-sm overflow-auto">
                {debugInfo}
              </pre>
            </details>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <LoadingSpinner />
          </div>
          <p className="text-gray-600 mt-4">
            Extracting recipe from your video...
            <br />
            <span className="text-sm">This may take a minute or two</span>
          </p>
        </div>
      )}

      {recipeData && !loading && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {getYoutubeVideoId(url) && (
            <img
              src={getYoutubeThumbnailUrl(getYoutubeVideoId(url)!)}
              alt={recipeData.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{recipeData.name}</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside">
                {recipeData.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="mb-1">{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside">
                {recipeData.steps.map((step: string, index: number) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
