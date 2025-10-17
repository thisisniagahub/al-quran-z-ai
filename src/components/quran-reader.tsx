'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Bookmark,
  Share2,
  Volume2,
  Settings,
  ChevronLeft,
  Moon,
  Sun,
  Type,
  Download,
  Heart,
  MessageCircle,
  Copy
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface Verse {
  id: number
  arabic: string
  translation: {
    malay: string
    indonesian: string
    english: string
  }
  transliteration: string
  juz: number
  page: number
  isBookmarked?: boolean
}

interface Surah {
  id: number
  name: string
  arabicName: string
  englishName: string
  revelationType: 'Meccan' | 'Medinan'
  totalVerses: number
  description: string
}

const sampleSurah: Surah = {
  id: 1,
  name: 'Al-Fatihah',
  arabicName: 'الفاتحة',
  englishName: 'The Opening',
  revelationType: 'Meccan',
  totalVerses: 7,
  description: 'Surah pembukaan Al-Quran yang mengandungi 7 ayat, diturunkan di Mekah. Surah ini dipanggil Ummul Quran (ibu Al-Quran) kerana mengandungi inti pati kandungan Al-Quran.'
}

const sampleVerses: Verse[] = [
  {
    id: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    translation: {
      malay: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
      indonesian: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
      english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
    },
    transliteration: 'Bismillāhir-raḥmānir-raḥīm',
    juz: 1,
    page: 1
  },
  {
    id: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: {
      malay: 'Segala puji bagi Allah, Tuhan semesta alam.',
      indonesian: 'Segala puji bagi Allah, Tuhan semesta alam.',
      english: 'All praise is due to Allah, Lord of the worlds.'
    },
    transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn',
    juz: 1,
    page: 1
  },
  {
    id: 3,
    arabic: 'الرَّحْمَنِ الرَّحِيمِ',
    translation: {
      malay: 'Yang Maha Pengasih lagi Maha Penyayang.',
      indonesian: 'Yang Maha Pengasih lagi Maha Penyayang.',
      english: 'The Entirely Merciful, the Especially Merciful.'
    },
    transliteration: 'Ar-raḥmānir-raḥīm',
    juz: 1,
    page: 1
  },
  {
    id: 4,
    arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    translation: {
      malay: 'Yang menguasai hari pembalasan.',
      indonesian: 'Yang menguasai hari pembalasan.',
      english: 'Sovereign of the Day of Recompense.'
    },
    transliteration: 'Māliki yawmid-dīn',
    juz: 1,
    page: 1
  },
  {
    id: 5,
    arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    translation: {
      malay: 'Hanya Engkau yang kami sembah dan hanya kepada Engkau kami memohon pertolongan.',
      indonesian: 'Hanya Engkau yang kami sembah dan hanya kepada Engkau kami memohon pertolongan.',
      english: 'It is You we worship and You we ask for help.'
    },
    transliteration: 'Iyyāka naʿbudu wa-iyyāka nastaʿīn',
    juz: 1,
    page: 1
  },
  {
    id: 6,
    arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    translation: {
      malay: 'Tunjukilah kami jalan yang lurus.',
      indonesian: 'Tunjukilah kami jalan yang lurus.',
      english: 'Guide us to the straight path.'
    },
    transliteration: 'Ihdināṣ-ṣirāṭal-mustaqīm',
    juz: 1,
    page: 1
  },
  {
    id: 7,
    arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    translation: {
      malay: 'Jalan orang-orang yang Engkau beri nikmat, bukan jalan orang-orang yang Engkau murkai dan bukan pula jalan orang-orang yang sesat.',
      indonesian: 'Jalan orang-orang yang Engkau beri nikmat, bukan jalan orang-orang yang Engkau murkai dan bukan pula jalan orang-orang yang sesat.',
      english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.'
    },
    transliteration: 'Ṣirāṭalladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa-laḍ-ḍāllīn',
    juz: 1,
    page: 1
  }
]

export default function QuranReader() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState<'malay' | 'indonesian' | 'english'>('malay')
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([])
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-lg md:text-xl'
      case 'large': return 'text-3xl md:text-4xl'
      default: return 'text-2xl md:text-3xl'
    }
  }

  const getArabicClass = () => {
    const baseClass = 'font-arabic text-right leading-loose mb-3 text-gray-900 dark:text-gray-100'
    const sizeClass = getFontSizeClass()
    return `${baseClass} ${sizeClass}`
  }

  const toggleBookmark = (verseId: number) => {
    setBookmarkedVerses(prev => 
      prev.includes(verseId) 
        ? prev.filter(id => id !== verseId)
        : [...prev, verseId]
    )
  }

  const shareVerse = (verse: Verse) => {
    const text = `${verse.arabic}\n\n${verse.translation[selectedTranslation]}\n\n${sampleSurah.arabicName} ${verse.id}:${verse.id}`
    if (navigator.share) {
      navigator.share({
        title: `${sampleSurah.name} ${verse.id}:${verse.id}`,
        text: text
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const copyVerse = (verse: Verse) => {
    const text = `${verse.arabic}\n\n${verse.translation[selectedTranslation]}\n\n${sampleSurah.arabicName} ${verse.id}:${verse.id}`
    navigator.clipboard.writeText(text)
  }

  const playAudio = () => {
    setIsPlaying(!isPlaying)
  }

  const goToVerse = (verseIndex: number) => {
    setCurrentVerse(verseIndex)
    const verseElement = document.getElementById(`verse-${verseIndex}`)
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-emerald-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{sampleSurah.name}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {sampleSurah.arabicName} • {sampleSurah.totalVerses} ayat • {sampleSurah.revelationType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Surah Info */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <h2 className="text-2xl font-arabic mb-2">{sampleSurah.arabicName}</h2>
              <h3 className="text-lg font-semibold mb-2">{sampleSurah.englishName}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{sampleSurah.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Controls */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedTranslation === 'malay' ? 'Melayu' : selectedTranslation === 'indonesian' ? 'Indonesia' : 'English'}
                </Badge>
                {showTransliteration && (
                  <Badge variant="outline" className="text-xs">
                    Transliteration
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {fontSize === 'small' ? 'Kecil' : fontSize === 'large' ? 'Besar' : 'Sederhana'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTransliteration(!showTransliteration)}
                >
                  <Type className="w-3 h-3 mr-1" />
                  Translit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verses */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <ScrollArea className="h-[calc(100vh-400px)] custom-scrollbar">
          <div className="space-y-4">
            {sampleVerses.map((verse, index) => (
              <Card 
                key={verse.id} 
                id={`verse-${index}`}
                className={`transition-all cursor-pointer ${
                  selectedVerse === index ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md'
                } ${currentVerse === index ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                onClick={() => setSelectedVerse(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {verse.id}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Juz {verse.juz}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Halaman {verse.page}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(verse.id)
                        }}
                      >
                        <Bookmark 
                          className={`w-4 h-4 ${
                            bookmarkedVerses.includes(verse.id) 
                              ? 'fill-emerald-500 text-emerald-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyVerse(verse)
                        }}
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareVerse(verse)
                        }}
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>

                  <div className={getArabicClass()}>
                    {verse.arabic}
                  </div>

                  {showTransliteration && (
                    <div className="verse-transliteration">
                      {verse.transliteration}
                    </div>
                  )}

                  <div className="verse-translation">
                    {verse.translation[selectedTranslation]}
                  </div>

                  {selectedVerse === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="w-3 h-3 mr-1" />
                          Main Audio
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Tafsir
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Heart className="w-3 h-3 mr-1" />
                          Catatan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToVerse(Math.max(0, currentVerse - 1))}
              disabled={currentVerse === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              onClick={playAudio}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToVerse(Math.min(sampleVerses.length - 1, currentVerse + 1))}
              disabled={currentVerse === sampleVerses.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Ayat {currentVerse + 1} / {sampleVerses.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">02:34</span>
              </div>
              <Progress value={(currentVerse + 1) / sampleVerses.length * 100} className="h-2" />
            </div>

            <Button variant="ghost" size="icon">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}