export interface Recipe {
  recipe: {
    url: string;
    entities: {
      recipe: {
        name: string;
        ingredients: string[];
        steps: string[];
      };
    };
    segment_entities: any[];
  };
} 