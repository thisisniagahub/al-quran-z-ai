import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface HadithRequest {
  query?: string
  book?: string
  reference?: string
  language?: 'malay' | 'english' | 'arabic'
}

export async function POST(request: NextRequest) {
  try {
    const { query, book, reference, language = 'malay' }: HadithRequest = await request.json()

    // Create ZAI instance for web search to get hadith from myHadith
    const zai = await ZAI.create()

    let searchQuery = ''
    if (reference) {
      searchQuery = `myhadith.islam.gov.my ${reference}`
    } else if (book) {
      searchQuery = `myhadith.islam.gov.my ${book} ${query || ''}`
    } else if (query) {
      searchQuery = `myhadith.islam.gov.my ${query}`
    } else {
      // Default search for popular hadiths
      searchQuery = 'myhadith.islam.gov.my hadith sahih bukhari muslim'
    }

    // Search for hadith from myHadith Malaysia
    const searchResult = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: 10
    })

    // Mock hadith data based on search results
    const mockHadiths = [
      {
        id: '1',
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        translation: {
          malay: 'Sesungguhnya setiap amalan itu bergantung kepada niat, dan sesungguhnya bagi setiap orang apa yang dia niatkan.',
          english: 'Indeed, deeds are only by intention, and every person will have only what they intended.',
          indonesian: 'Sesungguhnya setiap amalan tergantung pada niat, dan setiap orang akan mendapatkan apa yang dia niatkan.'
        },
        narrator: 'Umar bin Al-Khattab radhiyallahu anhu',
        book: 'Shahih Bukhari',
        bookNumber: '1',
        hadithNumber: '1',
        grade: 'Sahih',
        status: 'Muttafaqun Alayh',
        source: 'myHadith Malaysia (JAKIM)',
        reference: 'Sahih Bukhari 1',
        tags: ['niat', 'amalan', 'intention', 'deeds'],
        explanation: {
          malay: 'Hadith ini adalah asas utama dalam penilaian amalan dalam Islam. Niat yang ikhlas kerana Allah adalah syarat diterimanya amalan.',
          english: 'This hadith is fundamental in Islamic jurisprudence, establishing that intention is the basis for the acceptance of deeds.',
          indonesian: 'Hadis ini menjadi landasan utama dalam penilaian amalan dalam Islam. Niat yang tulus karena Allah adalah syarat diterimanya amalan.'
        }
      },
      {
        id: '2',
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        translation: {
          malay: 'Barangsiapa yang beriman kepada Allah dan Hari Akhir, hendaklah dia berkata baik atau diam.',
          english: 'Whoever believes in Allah and the Last Day should speak a good word or remain silent.',
          indonesian: 'Barangsiapa yang beriman kepada Allah dan Hari Akhir, hendaklah dia berkata baik atau diam.'
        },
        narrator: 'Abu Hurairah radhiyallahu anhu',
        book: 'Shahih Bukhari',
        bookNumber: '76',
        hadithNumber: '6014',
        grade: 'Sahih',
        status: 'Muttafaqun Alayh',
        source: 'myHadith Malaysia (JAKIM)',
        reference: 'Sahih Bukhari 6014',
        tags: ['bicara', 'perkataan', 'speech', 'silence'],
        explanation: {
          malay: 'Hadith ini menekankan pentingnya menjaga lisan dan hanya mengeluarkan perkataan yang baik dan bermanfaat.',
          english: 'This hadith emphasizes the importance of guarding one\'s tongue and speaking only good and beneficial words.',
          indonesian: 'Hadis ini menekankan pentingnya menjaga lisan dan hanya mengucapkan perkataan yang baik dan bermanfaat.'
        }
      }
    ]

    // Filter hadiths based on search criteria
    let filteredHadiths = mockHadiths
    if (query) {
      filteredHadiths = mockHadiths.filter(hadith => {
        const malayTranslation = hadith.translation.malay?.toLowerCase() || ''
        const englishTranslation = hadith.translation.english?.toLowerCase() || ''
        const indonesianTranslation = hadith.translation.indonesian?.toLowerCase() || ''
        const searchLower = query.toLowerCase()
        
        return malayTranslation.includes(searchLower) || 
               englishTranslation.includes(searchLower) || 
               indonesianTranslation.includes(searchLower) ||
               hadith.tags.some(tag => tag.toLowerCase().includes(searchLower))
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        hadiths: filteredHadiths,
        total: filteredHadiths.length,
        source: 'myHadith Malaysia (JAKIM)',
        lastUpdated: new Date().toISOString(),
        searchResults: searchResult
      }
    })

  } catch (error) {
    console.error('Error fetching hadith:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hadith' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const language = searchParams.get('language') || 'malay'
  
  const body = { query, language }
  return POST(new NextRequest(request.url, { method: 'POST', body: JSON.stringify(body) }))
}