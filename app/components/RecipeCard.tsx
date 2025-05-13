import { getYoutubeVideoId, getYoutubeThumbnailUrl } from '../utils/youtube';

interface RecipeCardProps {
  recipeName: string;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
}

export function RecipeCard({ recipeName, ingredients, steps, imageUrl }: RecipeCardProps) {
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Banner Image */}
      <div style={{ position: 'relative', width: '100%', height: '320px' }}>
        <img 
          src={imageUrl} 
          alt={recipeName}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block' 
          }}
        />
      </div>
      
      {/* Recipe Title */}
      <h1 style={{ 
        fontSize: '2.5rem',
        padding: '24px',
        margin: '0',
        textAlign: 'center',
        fontFamily: 'Dancing Script, cursive',
        borderBottom: '1px solid #eee'
      }}>
        {recipeName}
      </h1>
      
      {/* Content Container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {/* Ingredients Section */}
        <div style={{ 
          backgroundColor: '#8b5a2b', 
          color: 'white',
          padding: '25px',
          flex: '1',
          minWidth: '300px'
        }}>
          <h2 style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontSize: '2rem',
            marginTop: '0',
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Ingredients
          </h2>
          
          <ul style={{ 
            listStyleType: 'none', 
            padding: '0', 
            margin: '0' 
          }}>
            {ingredients.map((ingredient, index) => (
              <li key={index} style={{ 
                padding: '8px 0',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <span style={{ 
                  display: 'inline-block', 
                  marginRight: '10px',
                  color: '#e8dcbf'
                }}>•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Directions Section */}
        <div style={{ 
          backgroundColor: '#f6efde',
          padding: '25px',
          flex: '1.5',
          minWidth: '300px'
        }}>
          <h2 style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontSize: '2rem',
            marginTop: '0',
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block'
          }}>
            Directions
          </h2>
          
          <ol style={{ 
            paddingLeft: '25px', 
            margin: '0' 
          }}>
            {steps.map((step, index) => (
              <li key={index} style={{ 
                marginBottom: '15px', 
                lineHeight: '1.6' 
              }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
} 