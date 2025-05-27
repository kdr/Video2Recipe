import { NextResponse } from 'next/server';
import { CloudGlue } from '@aviaryhq/cloudglue-js';

const recipeSchema = {
  recipe: {
    name: 'string',
    ingredients: ['string'],
    steps: ['string'],
  },
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const client = new CloudGlue({
      apiKey: process.env.CLOUDGLUE_API_KEY || '',
    });

    const extractJob = await client.extract.createExtract(url, {
      schema: recipeSchema,
      prompt: "Extract the recipe details including name, ingredients list, and step by step instructions from this cooking video",
      enable_segment_level_entities: false,
      enable_video_level_entities: true,
    });

    while (
      extractJob.status === "pending" ||
      extractJob.status === "processing"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const updatedJob = await client.extract.getExtract(extractJob.job_id);
      if (updatedJob.status !== extractJob.status) {
        Object.assign(extractJob, updatedJob);
      }
    }

    if (extractJob.status === "completed" && extractJob.data) {
      return NextResponse.json({ recipe: extractJob.data });
    }

    return NextResponse.json(
      { error: 'Recipe extraction failed' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error extracting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to extract recipe' },
      { status: 500 }
    );
  }
} 