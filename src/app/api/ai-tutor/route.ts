import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ConversationMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIRequest {
  question: string
  conversationHistory?: ConversationMessage[]
  context?: {
    currentScreen?: string
    currentSurah?: number
    currentAyah?: number
    userType?: 'beginner' | 'intermediate' | 'advanced'
  }
  wordInfo?: {
    arabic: string
    translation: string
    surah: number
    ayah: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { question, conversationHistory = [], context = {} } = body

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Initialize Z-AI SDK
    const zai = await ZAI.create()

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    // Enhanced System Prompt for AI Ustaz/Ustazah Persona
    const systemPrompt = `Anda adalah **Ustaz/Ustazah Digital** yang berpengetahuan tinggi dan berhemah untuk pembaca di Malaysia dan Indonesia.

**🕌 Peranan Anda:**
- Guru Islam peribadi yang sabar, rendah diri, dan penyayang
- Pakar dalam Al-Quran, Hadis, dan ajaran Islam yang mengikut JAKIM/JAIS
- Sentiasa memberikan galakan dan sokongan kepada pembelajar
- Mengikut etika Islam (Adab) dalam semua interaksi

**📚 Keutamaan Jawapan:**
1. **Rujukan Al-Quran** - Sentiasa berikan (Surah:Ayat) apabila merujuk ayat
2. **Hadis Sahih** - Riwayat Bukhari, Muslim, Abu Dawud, Tirmidzi
3. **Panduan JAKIM/JAIS** - Mengikut garis panduan Islam Malaysia
4. **Sumber Ulama** - Ibn Kathir, Tabari, Qurtubi, Al-Nawawi
5. **Adab & Akhlak** - Sentiasa hormat dan berhemah

**🎯 Konteks Semasa:**
${context.currentScreen ? `Skrin: ${context.currentScreen}` : ''}
${context.currentSurah ? `Surah: ${context.currentSurah}` : ''}
${context.currentAyah ? `Ayat: ${context.currentAyah}` : ''}
${context.userType ? `Tahap Pengguna: ${context.userType}` : ''}

**📖 Format Jawapan:**
- Gunakan salam Islam: "Assalamualaikum wa rahmatullahi wa barakatuh"
- Berikan rujukan Quran: (Surah Al-Fatihah:1)
- Gunakan emoji yang sesuai: 🕌, 📖, 🎯, 💡, 🌟, 🤲
- **Bold** untuk ayat Quran dan istilah penting
- Struktur jawapan yang jelas dengan headings
- Akhiri dengan doa atau nasihat positif

**🔍 Topik Ke pakaran:**
- **Tafsir Al-Quran** - Maksud ayat, konteks, sebab wahyu
- **Hadis & Sunnah** - Penjelasan hadis sahih
- **Fiqh & Amalan** - Panduan ibadah harian
- **Akhlak & Adab** - Etika Islam dalam kehidupan
- **Sejarah Islam** - Kisah Nabi dan sahabat
- **Tajwid & Bacaan** - Kaedah bacaan Quran yang betul
- **Doa & Zikir** - Koleksi doa dari Quran & Sunnah

**⚠️ Panduan Penting:**
- **Jangan beri fatwa** - Rujuk kepada ulama bersertifikat untuk isu kompleks
- **Ikuti mazhab Syafi'i** (dominan di Malaysia/Indonesia)
- **Berikan sumber** untuk setiap rujukan
- **Jaga adab** - Jangan gunakan bahasa kasar atau keterlaluan
- **Fokus pada pembelajaran** - Galakkan proses pembelajaran beransur-ansur

**🌟 Persona:**
- Sabar dengan pemula
- Memberi galakan constan
- Mengakui hadapan pengetahuan
- Menunjukkan humility (rendah diri)
- Sentiasa positif dan supportive

${conversationContext ? `\n**📝 Sejarah Perbualan:**\n${conversationContext}` : ''}`

    const contextualPrompt = context.currentScreen ? `
**🎯 Bantuan Kontekstual untuk ${context.currentScreen}:**

${context.currentScreen === 'quran-reader' ? `
Fokus pada:
- Tafsir ayat semasa
- Tajwid dan pronunciation
- Hubungan antara ayat
- Pelajaran dari ayat
` : ''}

${context.currentScreen === 'ai-tutor' ? `
Fokus pada:
- Soalan umum tentang Islam
- Bimbingan pembelajaran Quran
- Nasihat spiritual
- Penjelasan konsep Islam
` : ''}

${context.currentScreen === 'srs-review' ? `
Fokus pada:
- Tips untuk menghafal perkataan
- Kaitan perkataan dengan ayat
- Nasihat motivasi pembelajaran
- Teknik hafazan berkesan
` : ''}

${context.currentScreen === 'achievements' ? `
Fokus pada:
- Galakan untuk terus belajar
- Kaitan pencapaian dengan spiritual
- Nasihat untuk meningkatkan prestasi
- Doa untuk keberkatan ilmu
` : ''}
` : ''

    const userPrompt = `**Soalan Pembelajar:** "${question}"

${contextualPrompt}

**📋 Arahan Jawapan:**
1. **Mulakan dengan salam Islam**
2. **Berikan jawapan yang ilmiah** dengan rujukan Quran/Hadis
3. **Sertakan ayat Quran** dengan (Surah:Ayat) jika berkaitan
4. **Berikan hadis** dengan sumber jika relevan
5. **Terangkan dengan mudah** - elakkan istilah terlalu teknikal
6. **Berikan aplikasi praktikal** dalam kehidupan harian
7. **Akhir dengan doa atau nasihat positif**
8. **Jaga adab dan humility** sepanjang jawapan

**🎯 Format:**
- Pengenalan dengan salam
- Jawapan utama dengan rujukan
- Penjelasan tambahan jika perlu
- Aplikasi praktikal
- Penutup dengan doa/nasihat`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString(),
      sources: ['Al-Quran', 'Hadis Sahih', 'Panduan JAKIM/JAIS', 'Tafsir Ulama'],
      context: context,
      persona: 'Ustaz/Ustazah Digital'
    })

  } catch (error: any) {
    console.error('AI Ustaz/Ustazah API Error:', error)
    
    // Enhanced fallback responses with Islamic context
    const fallbackResponses = {
      'bismillah': `Assalamualaikum wa rahmatullahi wa barakatuh,

**🕌 Bismillāhir Raḥmānir Raḥīm** بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

**Maksud:** "Dengan nama Allah yang Maha Pemurah lagi Maha Penyayang"

**📖 Kedalaman Maksud:**
- **Bismillah** = Dimulakan dengan nama Allah yang paling agung
- **Ar-Rahman** = Maha Pemurah kepada semua makhluk tanpa mengira iman
- **Ar-Rahim** = Maha Penyayang khusus kepada orang beriman

**💡 Kelebihan Membaca Bismillah:**
1. Mendapat berkat dari Allah (Surah Al-Fatihah:1)
2. Dimulakan dengan nama yang paling mulia
3. Mendapat perlindungan Allah
4. Mengikut sunnah Nabi Muhammad ﷺ

**🤲 Doa:** Semoga Allah memberkati pembelajaran Quran anda dan menjadikan kita antara orang-orang yang sentiasa mengingati-Nya. Amin ya Rabbal 'Alamin.

*Sumber: Surah Al-Fatihah 1:1, Hadis Riwayat Bukhari*`,
      
      'alhamdulillah': `Assalamualaikum wa rahmatullahi wa barakatuh,

**🕌 Alḥamdulillāhi Rabbil 'Ālamīn** الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

**Maksud:** "Segala puji bagi Allah, Tuhan semesta alam"

**📖 Perbezaan Hamd & Syukur:**
- **Hamd** = Pujian kerana sifat baik yang sedia ada pada Allah
- **Syukur** = Bersyukur untuk nikmat yang diberikan kepada hamba

**💡 Waktu Mengucapkan Alhamdulillah:**
1. Selepas bersin (Hadis Riwayat Bukhari)
2. Selepas makan dan minum (Surah Al-An'am:114)
3. Apabila menerima nikmat (Surah Ibrahim:7)
4. Dalam doa dan zikir harian

**🤲 Nasihat:** Sentiasa bersyukur meningkatkan nikmat Allah. Firman Allah: "Dan jika kamu menghitung nikmat Allah, nescaya kamu tidak akan dapat menghitungnya." (Surah Ibrahim:34)

*Sumber: Surah Al-Fatihah 1:2, Hadis Riwayat Muslim*`,
      
      'rahman': `Assalamualaikum wa rahmatullahi wa barakatuh,

**🕌 Ar-Rahman** الرَّحْمَنُ

**Maksud:** "Yang Maha Pemurah"

**📖 Kedalaman Maksud:**
- Salah satu nama Allah yang paling agung
- Menunjukkan rahmat Allah yang meliputi semua makhluk
- Nama ini khas untuk Allah sahaja (Surah Al-Isra:110)

**💡 Perbezaan Ar-Rahman & Ar-Rahim:**
- **Ar-Rahman** = Pemurah kepada SEMUA makhluk tanpa syarat
- **Ar-Rahim** = Penyayang khusus kepada orang beriman

**🤲 Renungan:** Rahmat Allah lebih luas dari ilmu pengetahuan manusia. Setiap nafas yang kita ambil adalah rahmat dari Ar-Rahman.

*Sumber: Surah Al-Isra 17:110, Tafsir Ibn Kathir*`
    }

    // Check if question matches any fallback
    const questionLower = question.toLowerCase()
    let fallbackResponse = null
    
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (questionLower.includes(key)) {
        fallbackResponse = response
        break
      }
    }

    if (fallbackResponse) {
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        sources: ['Al-Quran', 'Hadis Sahih', 'Tafsir'],
        persona: 'Ustaz/Ustazah Digital'
      })
    }

    // Generic Islamic fallback
    const genericFallback = `Assalamualaikum wa rahmatullahi wa barakatuh,

Maaf, Ustaz/Ustazah Digital menghadapi masalah teknikal untuk memberikan jawapan yang tepat pada masa ini.

**🤲 Nasihat Sementara:**
- Teruskan usaha pembelajaran Quran anda
- Setiap usaha akan dibalas oleh Allah
- Jangan berputus asa dalam mencari ilmu

**📖 Ayat Motivasi:**
"Dan orang-orang yang berjihad untuk Kami, Kami akan pastikan mereka mendapat petunjuk jalan Kami." (Surah Al-Ankabut:69)

**🕌 Doa:** Ya Allah, permudahkanlah pembelajaran hamba-Mu dan berkatilah ilmu yang dicari. Amin.

Sila cuba soalan lain atau hubungi kami jika masalah berterusan.`

    return NextResponse.json({
      response: genericFallback,
      timestamp: new Date().toISOString(),
      sources: ['Al-Quran'],
      persona: 'Ustaz/Ustazah Digital',
      error: 'Technical issue occurred'
    })
  }
}