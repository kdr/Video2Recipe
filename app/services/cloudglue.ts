import { CloudGlue } from '@aviaryhq/cloudglue-js';

const recipeSchema = {
  recipe: {
    name: 'string',
    ingredients: ['string'],
    steps: ['string'],
  },
};

export class CloudGlueService {
  private client: CloudGlue;

  constructor() {
    this.client = new CloudGlue({
      apiKey: process.env.CLOUDGLUE_API_KEY,
    });
  }

  async extractRecipe(url: string) {
    try {
      const extractJob = await this.client.extract.createExtract(url, {
        schema: recipeSchema,
        prompt: "Extract the recipe details including name, ingredients list, and step by step instructions from this cooking video",
      });

      while (
        extractJob.status === "pending" ||
        extractJob.status === "processing"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const updatedJob = await this.client.extract.getExtract(extractJob.job_id);
        if (updatedJob.status !== extractJob.status) {
          Object.assign(extractJob, updatedJob);
        }
      }

      if (extractJob.status === "completed" && extractJob.data) {
        return extractJob.data;
      }

      throw new Error('Recipe extraction failed');
    } catch (error) {
      console.error('Error extracting recipe:', error);
      throw error;
    }
  }
} 