import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { verses, template, translations, customMessage, platform } = await request.json()

    // Create ZAI instance for image generation
    const zai = await ZAI.create()

    // Construct the prompt for Quran quote image
    const prompt = `Create a beautiful Islamic calligraphy image featuring this Quran verse: "${verses[0]?.arabic || ''}". 
    Style: ${template.style || 'elegant and modern'}
    Background: ${template.backgroundColor || 'soft gradient'}
    Include the translation: "${verses[0]?.translation?.malay || ''}"
    Design should be suitable for social media sharing on ${platform || 'Instagram'}
    Make it visually appealing with Islamic artistic elements, clean typography, and respectful presentation.
    Size: 1080x1080 pixels for optimal social media display.`

    // Generate the image
    const response = await zai.images.generations.create({
      prompt: prompt,
      size: "1024x1024"
    })

    const imageBase64 = response.data[0]?.base64

    if (!imageBase64) {
      throw new Error('Failed to generate image')
    }

    // Return the generated image
    return NextResponse.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`,
      metadata: {
        template: template.id,
        verses: verses.map(v => ({ surah: v.surah, ayah: v.ayah })),
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error generating quote image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}