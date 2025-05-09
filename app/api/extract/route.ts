import { NextResponse } from 'next/server';
import { CloudGlueService } from '@/app/services/cloudglue';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const cloudGlue = new CloudGlueService();
    const recipe = await cloudGlue.extractRecipe(url);
    
    console.log('API Response from CloudGlue:', JSON.stringify(recipe, null, 2));

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error extracting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to extract recipe' },
      { status: 500 }
    );
  }
} 