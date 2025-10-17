import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface PrayerTimeRequest {
  location: string
  zone: string
  method: string
  date?: string
}

export async function POST(request: NextRequest) {
  try {
    const { location, zone, method, date }: PrayerTimeRequest = await request.json()

    // Create ZAI instance for web search to get prayer times
    const zai = await ZAI.create()

    // Search for current prayer times from e-Solat Malaysia
    const searchQuery = `e-solat.gov.my prayer times ${location} ${zone} ${date || 'today'}`
    
    const searchResult = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: 5
    })

    // For now, return mock data with proper structure
    // In production, you would parse the actual e-Solat website
    const mockPrayerTimes = {
      location: location,
      zone: zone,
      date: date || new Date().toISOString().split('T')[0],
      source: 'e-Solat Malaysia (JAKIM)',
      coordinates: {
        lat: 3.1390,
        lng: 101.6869
      },
      prayerTimes: [
        {
          name: 'Subuh',
          arabicName: 'الفجر',
          time: '05:42',
          azanTime: '05:42',
          iqamahTime: '05:52',
          isNext: false
        },
        {
          name: 'Syuruk',
          arabicName: 'الشروق',
          time: '07:08',
          isNext: false
        },
        {
          name: 'Zohor',
          arabicName: 'الظهر',
          time: '13:15',
          azanTime: '13:15',
          iqamahTime: '13:25',
          isNext: true
        },
        {
          name: 'Asar',
          arabicName: 'العصر',
          time: '16:48',
          azanTime: '16:48',
          iqamahTime: '16:58',
          isNext: false
        },
        {
          name: 'Maghrib',
          arabicName: 'المغرب',
          time: '19:21',
          azanTime: '19:21',
          iqamahTime: '19:26',
          isNext: false
        },
        {
          name: 'Isyak',
          arabicName: 'العشاء',
          time: '20:36',
          azanTime: '20:36',
          iqamahTime: '20:46',
          isNext: false
        }
      ],
      hijriDate: '29 Safar 1446H',
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockPrayerTimes,
      searchResults: searchResult
    })

  } catch (error) {
    console.error('Error fetching prayer times:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prayer times' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'Kuala Lumpur'
  const zone = searchParams.get('zone') || 'WLY01'
  
  return POST(request)
}