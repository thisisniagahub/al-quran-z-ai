// Advanced Quran Search System with Root Words and Multiple Search Types
// Comprehensive search functionality for Al-Quran Digital

export interface SearchQuery {
  query: string
  type: 'keyword' | 'root' | 'translation' | 'topic' | 'ayah' | 'surah'
  language: 'arabic' | 'malay' | 'english' | 'indonesian'
  filters?: {
    surah?: number
    juz?: number
    page?: number
    hizb?: number
    rub?: number
  }
}

export interface SearchResult {
  id: string
  surah: number
  ayah: number
  arabicText: string
  translation: {
    malay: string
    english: string
    indonesian: string
  }
  surahName: string
  surahNameEnglish: string
  juz: number
  page: number
  relevanceScore: number
  matchType: 'exact' | 'partial' | 'root' | 'translation'
  highlightedText: string
  context?: {
    previousAyah?: string
    nextAyah?: string
  }
}

export interface RootWord {
  arabic: string
  transliteration: string
  meaning: string
  forms: string[]
  occurrences: number
  relatedWords: string[]
}

// Mock Quran data for demonstration
const MOCK_QURAN_DATA = [
  {
    surah: 1,
    ayah: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    translation: {
      malay: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Penyayang.',
      english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      indonesian: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.'
    },
    surahName: 'Al-Fatihah',
    surahNameEnglish: 'The Opener',
    juz: 1,
    page: 1
  },
  {
    surah: 1,
    ayah: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: {
      malay: 'Segala puji bagi Allah, Tuhan semesta alam.',
      english: 'All praise is due to Allah, Lord of the worlds.',
      indonesian: 'Segala puji bagi Allah, Tuhan semesta alam.'
    },
    surahName: 'Al-Fatihah',
    surahNameEnglish: 'The Opener',
    juz: 1,
    page: 1
  },
  {
    surah: 2,
    ayah: 255,
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: {
      malay: 'Allah! Tiada tuhan melainkan Dia, Yang Hidup, Yang Berdiri Sendiri.',
      english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
      indonesian: 'Allah! Tiada tuhan selain Dia, Yang Hidup, Yang Mengatur.'
    },
    surahName: 'Al-Baqarah',
    surahNameEnglish: 'The Cow',
    juz: 3,
    page: 45
  }
]

// Mock root words data
const MOCK_ROOT_WORDS: Record<string, RootWord> = {
  'حمد': {
    arabic: 'حَمَدَ',
    transliteration: 'hamada',
    meaning: 'memuji, memuji-muji',
    forms: ['حَمْد', 'الْحَمْدُ', 'حَامِد', 'مَحْمُود', 'تَحْمِيد'],
    occurrences: 68,
    relatedWords: ['شكر', 'مدح']
  },
  'رب': {
    arabic: 'رَبَّ',
    transliteration: 'rabb',
    meaning: 'tuan, pemelihara, pendidik',
    forms: ['رَبٌّ', 'رَبِّ', 'أَرْبَاب', 'رَبَّنَا'],
    occurrences: 970,
    relatedWords: ['مالك', 'إله']
  },
  'علم': {
    arabic: 'عَلِمَ',
    transliteration: 'alima',
    meaning: 'tahu, mengetahui',
    forms: ['عِلْم', 'عَالِم', 'عَلِيم', 'يَعْلَم', 'عَلَّام'],
    occurrences: 854,
    relatedWords: ['عرف', 'فهم', 'درى']
  }
}

export class AdvancedQuranSearch {
  /**
   * Main search function that handles all search types
   */
  static async search(query: SearchQuery): Promise<SearchResult[]> {
    const { query: searchQuery, type, language, filters } = query

    switch (type) {
      case 'keyword':
        return this.keywordSearch(searchQuery, language, filters)
      case 'root':
        return this.rootWordSearch(searchQuery, filters)
      case 'translation':
        return this.translationSearch(searchQuery, language, filters)
      case 'topic':
        return this.topicSearch(searchQuery, filters)
      case 'ayah':
        return this.ayahSearch(searchQuery, filters)
      case 'surah':
        return this.surahSearch(searchQuery, filters)
      default:
        return this.keywordSearch(searchQuery, language, filters)
    }
  }

  /**
   * Keyword search in Arabic text and translations
   */
  private static keywordSearch(query: string, language: string, filters?: any): SearchResult[] {
    const results: SearchResult[] = []
    const normalizedQuery = query.toLowerCase().trim()

    for (const verse of MOCK_QURAN_DATA) {
      let matchFound = false
      let relevanceScore = 0
      let highlightedText = ''

      // Search in Arabic text
      if (verse.arabicText.includes(query)) {
        matchFound = true
        relevanceScore += 100
        highlightedText = this.highlightText(verse.arabicText, query)
      }

      // Search in translations
      const translation = verse.translation[language as keyof typeof verse.translation] || ''
      if (translation.toLowerCase().includes(normalizedQuery)) {
        matchFound = true
        relevanceScore += 80
        highlightedText = this.highlightText(translation, query)
      }

      if (matchFound && this.matchesFilters(verse, filters)) {
        results.push({
          id: `${verse.surah}-${verse.ayah}`,
          surah: verse.surah,
          ayah: verse.ayah,
          arabicText: verse.arabicText,
          translation: verse.translation,
          surahName: verse.surahName,
          surahNameEnglish: verse.surahNameEnglish,
          juz: verse.juz,
          page: verse.page,
          relevanceScore,
          matchType: 'exact',
          highlightedText
        })
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Root word search - finds all verses containing words from the same root
   */
  private static rootWordSearch(query: string, filters?: any): SearchResult[] {
    const results: SearchResult[] = []
    
    // Find matching root word
    const rootWord = Object.values(MOCK_ROOT_WORDS).find(
      root => root.arabic.includes(query) || 
               root.transliteration.includes(query.toLowerCase()) ||
               root.meaning.toLowerCase().includes(query.toLowerCase())
    )

    if (!rootWord) return []

    // Search for all forms of the root word
    for (const verse of MOCK_QURAN_DATA) {
      let matchFound = false
      let matchedForm = ''

      for (const form of rootWord.forms) {
        if (verse.arabicText.includes(form)) {
          matchFound = true
          matchedForm = form
          break
        }
      }

      if (matchFound && this.matchesFilters(verse, filters)) {
        results.push({
          id: `${verse.surah}-${verse.ayah}`,
          surah: verse.surah,
          ayah: verse.ayah,
          arabicText: verse.arabicText,
          translation: verse.translation,
          surahName: verse.surahName,
          surahNameEnglish: verse.surahNameEnglish,
          juz: verse.juz,
          page: verse.page,
          relevanceScore: 90,
          matchType: 'root',
          highlightedText: this.highlightText(verse.arabicText, matchedForm),
          context: {
            previousAyah: this.getAyah(verse.surah, verse.ayah - 1),
            nextAyah: this.getAyah(verse.surah, verse.ayah + 1)
          }
        })
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Translation search in specific language
   */
  private static translationSearch(query: string, language: string, filters?: any): SearchResult[] {
    const results: SearchResult[] = []
    const normalizedQuery = query.toLowerCase().trim()

    for (const verse of MOCK_QURAN_DATA) {
      const translation = verse.translation[language as keyof typeof verse.translation] || ''
      
      if (translation.toLowerCase().includes(normalizedQuery) && this.matchesFilters(verse, filters)) {
        results.push({
          id: `${verse.surah}-${verse.ayah}`,
          surah: verse.surah,
          ayah: verse.ayah,
          arabicText: verse.arabicText,
          translation: verse.translation,
          surahName: verse.surahName,
          surahNameEnglish: verse.surahNameEnglish,
          juz: verse.juz,
          page: verse.page,
          relevanceScore: 70,
          matchType: 'translation',
          highlightedText: this.highlightText(translation, query)
        })
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Topic-based search using predefined topics
   */
  private static topicSearch(query: string, filters?: any): SearchResult[] {
    const topicKeywords: Record<string, string[]> = {
      'prayer': ['صلاة', 'solat', 'prayer', 'shalat', 'rukuk', 'sujud'],
      'patience': ['صبر', 'sabr', 'patience', 'kesabaran'],
      'knowledge': ['علم', 'ilmu', 'knowledge', 'عالم', 'ulama'],
      'mercy': ['رحمة', 'rahmah', 'mercy', 'رحم', 'rahim'],
      'guidance': ['هدى', 'huda', 'guidance', 'petunjuk', 'hidayah']
    }

    const results: SearchResult[] = []
    const normalizedQuery = query.toLowerCase()

    // Find matching topic
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (topic.includes(normalizedQuery) || keywords.some(k => k.includes(normalizedQuery))) {
        // Search for verses with these keywords
        for (const keyword of keywords) {
          const keywordResults = this.keywordSearch(keyword, 'arabic', filters)
          results.push(...keywordResults)
        }
        break
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id)
    )

    return uniqueResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Direct ayah search (e.g., "2:255" or "Al-Baqarah 255")
   */
  private static ayahSearch(query: string, filters?: any): SearchResult[] {
    const results: SearchResult[] = []
    
    // Parse different formats: "2:255", "Al-Baqarah 255", "2:255-256"
    const ayahPattern = /(\d+):(\d+)(?:-(\d+))?/
    const match = query.match(ayahPattern)

    if (match) {
      const surah = parseInt(match[1])
      const startAyah = parseInt(match[2])
      const endAyah = match[3] ? parseInt(match[3]) : startAyah

      for (let ayah = startAyah; ayah <= endAyah; ayah++) {
        const verse = this.getAyah(surah, ayah)
        if (verse && this.matchesFilters(verse, filters)) {
          results.push({
            id: `${surah}-${ayah}`,
            surah: verse.surah,
            ayah: verse.ayah,
            arabicText: verse.arabicText,
            translation: verse.translation,
            surahName: verse.surahName,
            surahNameEnglish: verse.surahNameEnglish,
            juz: verse.juz,
            page: verse.page,
            relevanceScore: 100,
            matchType: 'exact',
            highlightedText: verse.arabicText
          })
        }
      }
    }

    return results
  }

  /**
   * Surah search
   */
  private static surahSearch(query: string, filters?: any): SearchResult[] {
    const results: SearchResult[] = []
    const normalizedQuery = query.toLowerCase()

    for (const verse of MOCK_QURAN_DATA) {
      if (
        verse.surahName.toLowerCase().includes(normalizedQuery) ||
        verse.surahNameEnglish.toLowerCase().includes(normalizedQuery) ||
        verse.surah.toString() === query
      ) {
        if (this.matchesFilters(verse, filters)) {
          results.push({
            id: `${verse.surah}-${verse.ayah}`,
            surah: verse.surah,
            ayah: verse.ayah,
            arabicText: verse.arabicText,
            translation: verse.translation,
            surahName: verse.surahName,
            surahNameEnglish: verse.surahNameEnglish,
            juz: verse.juz,
            page: verse.page,
            relevanceScore: 95,
            matchType: 'exact',
            highlightedText: verse.arabicText
          })
        }
      }
    }

    return results.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah)
  }

  /**
   * Get root word information
   */
  static getRootWordInfo(rootWord: string): RootWord | null {
    return MOCK_ROOT_WORDS[rootWord] || null
  }

  /**
   * Get suggestions for autocomplete
   */
  static getSearchSuggestions(query: string, type: string): string[] {
    const suggestions: string[] = []
    const normalizedQuery = query.toLowerCase()

    // Root word suggestions
    if (type === 'root' || type === 'all') {
      Object.values(MOCK_ROOT_WORDS).forEach(root => {
        if (root.transliteration.toLowerCase().startsWith(normalizedQuery)) {
          suggestions.push(root.transliteration)
        }
        if (root.meaning.toLowerCase().includes(normalizedQuery)) {
          suggestions.push(root.meaning)
        }
      })
    }

    // Topic suggestions
    if (type === 'topic' || type === 'all') {
      const topics = ['prayer', 'patience', 'knowledge', 'mercy', 'guidance', 'faith', 'charity']
      topics.forEach(topic => {
        if (topic.startsWith(normalizedQuery)) {
          suggestions.push(topic)
        }
      })
    }

    return suggestions.slice(0, 10)
  }

  /**
   * Helper functions
   */
  private static highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  private static matchesFilters(verse: any, filters?: any): boolean {
    if (!filters) return true

    if (filters.surah && verse.surah !== filters.surah) return false
    if (filters.juz && verse.juz !== filters.juz) return false
    if (filters.page && verse.page !== filters.page) return false

    return true
  }

  private static getAyah(surah: number, ayah: number): any {
    return MOCK_QURAN_DATA.find(
      verse => verse.surah === surah && verse.ayah === ayah
    )
  }

  /**
   * Search statistics and analytics
   */
  static getSearchStats(results: SearchResult[]): {
    totalResults: number
    surahCount: number
    juzDistribution: Record<number, number>
    averageRelevance: number
    matchTypeDistribution: Record<string, number>
  } {
    const surahSet = new Set<number>()
    const juzDistribution: Record<number, number> = {}
    const matchTypeDistribution: Record<string, number> = {}
    let totalRelevance = 0

    results.forEach(result => {
      surahSet.add(result.surah)
      juzDistribution[result.juz] = (juzDistribution[result.juz] || 0) + 1
      matchTypeDistribution[result.matchType] = (matchTypeDistribution[result.matchType] || 0) + 1
      totalRelevance += result.relevanceScore
    })

    return {
      totalResults: results.length,
      surahCount: surahSet.size,
      juzDistribution,
      averageRelevance: results.length > 0 ? totalRelevance / results.length : 0,
      matchTypeDistribution
    }
  }
}