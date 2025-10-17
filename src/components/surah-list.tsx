'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  ChevronLeft, 
  Star, 
  Download, 
  Play,
  Clock,
  MapPin,
  Filter,
  BookOpen,
  Heart,
  Bookmark
} from 'lucide-react'

interface Surah {
  id: number
  name: string
  arabicName: string
  englishName: string
  revelationType: 'Meccan' | 'Medinan'
  totalVerses: number
  description: string
  isBookmarked?: boolean
  isDownloaded?: boolean
  lastRead?: string
  progress?: number
}

const surahs: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    englishName: 'The Opening',
    revelationType: 'Meccan',
    totalVerses: 7,
    description: 'Surah pembukaan Al-Quran yang mengandungi 7 ayat, diturunkan di Mekah.',
    isBookmarked: true,
    isDownloaded: true,
    lastRead: '2 jam lepas',
    progress: 100
  },
  {
    id: 2,
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    englishName: 'The Cow',
    revelationType: 'Medinan',
    totalVerses: 286,
    description: 'Surah terpanjang dalam Al-Quran, mengandungi 286 ayat, diturunkan di Madinah.',
    isBookmarked: true,
    lastRead: '1 hari lepas',
    progress: 45
  },
  {
    id: 3,
    name: 'Ali Imran',
    arabicName: 'آل عمران',
    englishName: 'The Family of Imran',
    revelationType: 'Medinan',
    totalVerses: 200,
    description: 'Surah ketiga dalam Al-Quran, mengandungi 200 ayat, diturunkan di Madinah.',
    progress: 23
  },
  {
    id: 4,
    name: 'An-Nisa',
    arabicName: 'النساء',
    englishName: 'The Women',
    revelationType: 'Medinan',
    totalVerses: 176,
    description: 'Surah keempat dalam Al-Quran, mengandungi 176 ayat, diturunkan di Madinah.',
    isDownloaded: true,
    progress: 10
  },
  {
    id: 5,
    name: 'Al-Maidah',
    arabicName: 'المائدة',
    englishName: 'The Table Spread',
    revelationType: 'Medinan',
    totalVerses: 120,
    description: 'Surah kelima dalam Al-Quran, mengandungi 120 ayat, diturunkan di Madinah.',
    progress: 0
  },
  {
    id: 6,
    name: 'Al-Anam',
    arabicName: 'الأنعام',
    englishName: 'The Cattle',
    revelationType: 'Meccan',
    totalVerses: 165,
    description: 'Surah keenam dalam Al-Quran, mengandungi 165 ayat, diturunkan di Mekah.',
    isBookmarked: true,
    progress: 78
  },
  {
    id: 7,
    name: 'Al-Araf',
    arabicName: 'الأعراف',
    englishName: 'The Heights',
    revelationType: 'Meccan',
    totalVerses: 206,
    description: 'Surah ketujuh dalam Al-Quran, mengandungi 206 ayat, diturunkan di Mekah.',
    progress: 12
  },
  {
    id: 8,
    name: 'Al-Anfal',
    arabicName: 'الأنفال',
    englishName: 'The Spoils of War',
    revelationType: 'Medinan',
    totalVerses: 75,
    description: 'Surah kelapan dalam Al-Quran, mengandungi 75 ayat, diturunkan di Madinah.',
    isDownloaded: true,
    progress: 100
  },
  {
    id: 9,
    name: 'At-Taubah',
    arabicName: 'التوبة',
    englishName: 'The Repentance',
    revelationType: 'Medinan',
    totalVerses: 129,
    description: 'Surah kesembilan dalam Al-Quran, mengandungi 129 ayat, diturunkan di Madinah.',
    progress: 34
  },
  {
    id: 10,
    name: 'Yunus',
    arabicName: 'يونس',
    englishName: 'Jonah',
    revelationType: 'Meccan',
    totalVerses: 109,
    description: 'Surah kesepuluh dalam Al-Quran, mengandungi 109 ayat, diturunkan di Mekah.',
    progress: 56
  },
  {
    id: 11,
    name: 'Hud',
    arabicName: 'هود',
    englishName: 'Hud',
    revelationType: 'Meccan',
    totalVerses: 123,
    description: 'Surah kesebelas dalam Al-Quran, mengandungi 123 ayat, diturunkan di Mekah.',
    progress: 0
  },
  {
    id: 12,
    name: 'Yusuf',
    arabicName: 'يوسف',
    englishName: 'Joseph',
    revelationType: 'Meccan',
    totalVerses: 111,
    description: 'Surah keduabelas dalam Al-Quran, mengandungi 111 ayat, diturunkan di Mekah.',
    isBookmarked: true,
    isDownloaded: true,
    lastRead: '3 hari lepas',
    progress: 89
  },
  {
    id: 13,
    name: 'Ar-Rad',
    arabicName: 'الرعد',
    englishName: 'The Thunder',
    revelationType: 'Medinan',
    totalVerses: 43,
    description: 'Surah ketigabelas dalam Al-Quran, mengandungi 43 ayat, diturunkan di Madinah.',
    progress: 0
  },
  {
    id: 14,
    name: 'Ibrahim',
    arabicName: 'إبراهيم',
    englishName: 'Abraham',
    revelationType: 'Meccan',
    totalVerses: 52,
    description: 'Surah keempatbelas dalam Al-Quran, mengandungi 52 ayat, diturunkan di Mekah.',
    progress: 0
  },
  {
    id: 15,
    name: 'Al-Hijr',
    arabicName: 'الحجر',
    englishName: 'The Stoneland',
    revelationType: 'Meccan',
    totalVerses: 99,
    description: 'Surah kelimabelas dalam Al-Quran, mengandungi 99 ayat, diturunkan di Mekah.',
    progress: 0
  },
  {
    id: 16,
    name: 'An-Nahl',
    arabicName: 'النحل',
    englishName: 'The Bee',
    revelationType: 'Meccan',
    totalVerses: 128,
    description: 'Surah keenambelas dalam Al-Quran, mengandungi 128 ayat, diturunkan di Mekah.',
    progress: 0
  },
  {
    id: 17,
    name: 'Al-Isra',
    arabicName: 'الإسراء',
    englishName: 'The Night Journey',
    revelationType: 'Meccan',
    totalVerses: 111,
    description: 'Surah ketujuhbelas dalam Al-Quran, mengandungi 111 ayat, diturunkan di Mekah.',
    isBookmarked: true,
    progress: 67
  },
  {
    id: 18,
    name: 'Al-Kahf',
    arabicName: 'الكهف',
    englishName: 'The Cave',
    revelationType: 'Meccan',
    totalVerses: 110,
    description: 'Surah kedelapanbelas dalam Al-Quran, mengandungi 110 ayat, diturunkan di Mekah.',
    isDownloaded: true,
    lastRead: '5 hari lepas',
    progress: 100
  },
  {
    id: 19,
    name: 'Maryam',
    arabicName: 'مريم',
    englishName: 'Mary',
    revelationType: 'Meccan',
    totalVerses: 98,
    description: 'Surah kesembilanbelas dalam Al-Quran, mengandungi 98 ayat, diturunkan di Mekah.',
    progress: 0
  },
  {
    id: 20,
    name: 'Taha',
    arabicName: 'طه',
    englishName: 'Ta-Ha',
    revelationType: 'Meccan',
    totalVerses: 135,
    description: 'Surah keduapuluh dalam Al-Quran, mengandungi 135 ayat, diturunkan di Mekah.',
    progress: 0
  }
]

export default function SurahList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'recent'>('number')

  const filteredSurahs = useMemo(() => {
    let filtered = surahs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(surah => 
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.arabicName.includes(searchTerm) ||
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tab
    switch (selectedTab) {
      case 'bookmarked':
        filtered = filtered.filter(surah => surah.isBookmarked)
        break
      case 'downloaded':
        filtered = filtered.filter(surah => surah.isDownloaded)
        break
      case 'recent':
        filtered = filtered.filter(surah => surah.lastRead)
        break
      case 'meccan':
        filtered = filtered.filter(surah => surah.revelationType === 'Meccan')
        break
      case 'medinan':
        filtered = filtered.filter(surah => surah.revelationType === 'Medinan')
        break
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          if (a.lastRead && !b.lastRead) return -1
          if (!a.lastRead && b.lastRead) return 1
          return 0
        default:
          return a.id - b.id
      }
    })

    return filtered
  }, [searchTerm, selectedTab, sortBy])

  const getRevelationTypeColor = (type: 'Meccan' | 'Medinan') => {
    return type === 'Meccan' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }

  const getRevelationTypeLabel = (type: 'Meccan' | 'Medinan') => {
    return type === 'Meccan' ? 'Mekah' : 'Madinah'
  }

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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Senarai Surah</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">114 Surah • {filteredSurahs.length} dipaparkan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari surah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
            <TabsTrigger value="bookmarked" className="text-xs">Penanda</TabsTrigger>
            <TabsTrigger value="downloaded" className="text-xs">Dimuat Turun</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">Baru Dibaca</TabsTrigger>
            <TabsTrigger value="meccan" className="text-xs">Mekah</TabsTrigger>
            <TabsTrigger value="medinan" className="text-xs">Madinah</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'number' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('number')}
            >
              Nombor
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Nama
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Terkini
            </Button>
          </div>
        </div>
      </div>

      {/* Surah List */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <ScrollArea className="h-[calc(100vh-280px)] custom-scrollbar">
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <Card 
                key={surah.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                        {surah.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {surah.name}
                          </h3>
                          <span className="text-lg font-arabic text-emerald-600 dark:text-emerald-400" style={{ fontFamily: "'Amiri Quran', serif" }}>
                            {surah.arabicName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {surah.englishName} • {surah.totalVerses} ayat
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRevelationTypeColor(surah.revelationType)}`}>
                            {getRevelationTypeLabel(surah.revelationType)}
                          </Badge>
                          {surah.lastRead && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {surah.lastRead}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {surah.progress !== undefined && surah.progress > 0 && (
                        <div className="text-right mr-2">
                          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {surah.progress}%
                          </div>
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${surah.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        {surah.isBookmarked && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bookmark className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                          </Button>
                        )}
                        {surah.isDownloaded && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Stats */}
      <div className="fixed bottom-20 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {surahs.filter(s => s.progress === 100).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Selesai</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {surahs.filter(s => s.progress && s.progress > 0 && s.progress < 100).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Dibaca</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {surahs.filter(s => s.isBookmarked).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Penanda</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {surahs.filter(s => s.isDownloaded).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Dimuat Turun</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}