'use client';

import { useState } from 'react';
import { getYoutubeVideoId, getYoutubeThumbnailUrl } from './utils/youtube';
import { RecipeCard } from './components/RecipeCard';
import type { Recipe } from './types/recipe';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
  const thumbnailUrl = getYoutubeVideoId(url) ? getYoutubeThumbnailUrl(getYoutubeVideoId(url)!) : '';

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      backgroundColor: '#f9f4e6'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 40px auto', 
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '30px', 
          fontFamily: 'Dancing Script, cursive',
          color: '#8b5a2b'
        }}>
          Video2Recipe
        </h1>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '25px' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#8b5a2b'
              }}>
                Enter YouTube URL:
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                backgroundColor: '#8b5a2b',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                alignSelf: 'center'
              }}
            >
              {loading ? 'Converting...' : 'Bake Recipe'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '25px',
            border: '1px solid #f5c6cb',
            textAlign: 'left'
          }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(139, 90, 43, 0.3)',
              borderRadius: '50%',
              borderTopColor: '#8b5a2b',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `
            }} />
            <p style={{ 
              marginTop: '15px',
              color: '#8b5a2b'
            }}>
              Extracting recipe from your video...
              <br />
              <span style={{ fontSize: '14px' }}>This may take a minute or two</span>
            </p>
          </div>
        )}
      </div>

      {recipeData && !loading && (
        <RecipeCard 
          recipeName={recipeData.name}
          ingredients={recipeData.ingredients}
          steps={recipeData.steps}
          imageUrl={thumbnailUrl}
        />
      )}
    </div>
  );
}
