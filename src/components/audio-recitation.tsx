'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Download,
  Heart,
  ChevronLeft,
  Settings,
  Clock,
  Headphones,
  Wifi,
  WifiOff,
  List,
  Grid3X3
} from 'lucide-react'

interface Qari {
  id: string
  name: string
  arabicName: string
  country: string
  style: string
  audioQuality: 'low' | 'medium' | 'high'
  totalSize: string
  isDownloaded: boolean
  isFavorite: boolean
  image: string
}

interface Surah {
  id: number
  name: string
  arabicName: string
  totalVerses: number
  duration: string
  isDownloaded: boolean
}

const qaris: Qari[] = [
  {
    id: '1',
    name: 'Mishari Rashid Alafasy',
    arabicName: 'مشاري بن راشد العفاسي',
    country: 'Kuwait',
    style: 'Moderat',
    audioQuality: 'high',
    totalSize: '2.8 GB',
    isDownloaded: true,
    isFavorite: true,
    image: '/api/placeholder/80/80'
  },
  {
    id: '2',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    country: 'Saudi Arabia',
    style: 'Moderat',
    audioQuality: 'high',
    totalSize: '2.5 GB',
    isDownloaded: true,
    isFavorite: false,
    image: '/api/placeholder/80/80'
  },
  {
    id: '3',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    country: 'Saudi Arabia',
    style: 'Lembut',
    audioQuality: 'medium',
    totalSize: '2.2 GB',
    isDownloaded: false,
    isFavorite: true,
    image: '/api/placeholder/80/80'
  },
  {
    id: '4',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    country: 'Saudi Arabia',
    style: 'Kuat',
    audioQuality: 'high',
    totalSize: '2.6 GB',
    isDownloaded: false,
    isFavorite: false,
    image: '/api/placeholder/80/80'
  },
  {
    id: '5',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    country: 'Saudi Arabia',
    style: 'Moderat',
    audioQuality: 'high',
    totalSize: '2.4 GB',
    isDownloaded: true,
    isFavorite: false,
    image: '/api/placeholder/80/80'
  },
  {
    id: '6',
    name: 'Yasser Al-Dosari',
    arabicName: 'ياسر الدوسري',
    country: 'Saudi Arabia',
    style: 'Lembut',
    audioQuality: 'high',
    totalSize: '2.7 GB',
    isDownloaded: false,
    isFavorite: true,
    image: '/api/placeholder/80/80'
  }
]

const surahs: Surah[] = [
  { id: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', totalVerses: 7, duration: '0:45', isDownloaded: true },
  { id: 2, name: 'Al-Baqarah', arabicName: 'البقرة', totalVerses: 286, duration: '2:15', isDownloaded: true },
  { id: 3, name: 'Ali Imran', arabicName: 'آل عمران', totalVerses: 200, duration: '1:45', isDownloaded: true },
  { id: 4, name: 'An-Nisa', arabicName: 'النساء', totalVerses: 176, duration: '1:30', isDownloaded: false },
  { id: 5, name: 'Al-Maidah', arabicName: 'المائدة', totalVerses: 120, duration: '1:15', isDownloaded: false },
  { id: 6, name: 'Al-Anam', arabicName: 'الأنعام', totalVerses: 165, duration: '1:40', isDownloaded: false },
  { id: 7, name: 'Al-Araf', arabicName: 'الأعراف', totalVerses: 206, duration: '1:55', isDownloaded: false },
  { id: 8, name: 'Al-Anfal', arabicName: 'الأنفال', totalVerses: 75, duration: '0:50', isDownloaded: true },
  { id: 9, name: 'At-Taubah', arabicName: 'التوبة', totalVerses: 129, duration: '1:20', isDownloaded: false },
  { id: 10, name: 'Yunus', arabicName: 'يونس', totalVerses: 109, duration: '1:10', isDownloaded: false }
]

export default function AudioRecitation() {
  const [selectedQari, setSelectedQari] = useState<Qari>(qaris[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(75)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [isMuted, setIsMuted] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [downloadingSurahs, setDownloadingSurahs] = useState<number[]>([])
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Simulate audio playback
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, duration])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const playSurah = (surah: Surah) => {
    setCurrentSurah(surah)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const downloadSurah = async (surahId: number) => {
    setDownloadingSurahs(prev => [...prev, surahId])
    
    // Simulate download
    setTimeout(() => {
      setDownloadingSurahs(prev => prev.filter(id => id !== surahId))
      // Update surah downloaded status
    }, 3000)
  }

  const downloadAllQari = async () => {
    // Simulate downloading all surahs for selected qari
    console.log('Downloading all surahs for', selectedQari.name)
  }

  const toggleFavorite = (qariId: string) => {
    // Toggle favorite status
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Audio Recitation</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedQari.name} • {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Qari Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Pilih Qari</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32 custom-scrollbar">
              <div className="flex gap-3 pb-2">
                {qaris.map((qari) => (
                  <div
                    key={qari.id}
                    className={`flex-shrink-0 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      selectedQari.id === qari.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedQari(qari)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={qari.image}
                          alt={qari.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {qari.isDownloaded && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Download className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{qari.name}</p>
                        <p className="text-xs text-gray-500">{qari.country}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {qari.style}
                          </Badge>
                          {qari.isFavorite && (
                            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Current Player */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedQari.image}
                alt={selectedQari.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{currentSurah.name}</h3>
                <p className="text-sm opacity-90">{currentSurah.arabicName}</p>
                <p className="text-xs opacity-75">{selectedQari.name}</p>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => toggleFavorite(selectedQari.id)}
                className="bg-white/20 hover:bg-white/30"
              >
                <Heart className={`w-4 h-4 ${selectedQari.isFavorite ? 'fill-white' : ''}`} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Progress value={(currentTime / duration) * 100} className="h-2 bg-white/20" />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 hover:bg-white/30"
                onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
              >
                {repeatMode === 'none' && <Repeat className="w-4 h-4" />}
                {repeatMode === 'all' && <Repeat className="w-4 h-4 text-white" />}
                {repeatMode === 'one' && <Repeat1 className="w-4 h-4 text-white" />}
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 hover:bg-white/30"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={togglePlayPause}
                className="bg-white hover:bg-white/90 w-12 h-12"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-emerald-600" /> : <Play className="w-5 h-5 text-emerald-600" />}
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 hover:bg-white/30"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/20 hover:bg-white/30"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Volume and Speed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Volume</span>
                  <span>{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Speed</span>
                  <span>{playbackSpeed}x</span>
                </div>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={(value) => setPlaybackSpeed(value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surah List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Senarai Surah</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                  {viewMode === 'list' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAllQari}>
                  <Download className="w-4 h-4 mr-1" />
                  Muat Turun Semua
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="downloaded">Dimuat Turun</TabsTrigger>
                <TabsTrigger value="favorites">Favorit</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-96 custom-scrollbar">
                  <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                    {surahs.map((surah) => (
                      <div
                        key={surah.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          currentSurah.id === surah.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => playSurah(surah)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {surah.id}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {surah.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {surah.arabicName} • {surah.totalVerses} ayat
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {surah.duration}
                                </Badge>
                                {surah.isDownloaded && (
                                  <Badge variant="outline" className="text-xs text-emerald-600">
                                    <Download className="w-3 h-3 mr-1" />
                                    Dimuat Turun
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentSurah.id === surah.id && isPlaying && (
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <div className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse delay-75" />
                                <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse delay-150" />
                              </div>
                            )}
                            {!surah.isDownloaded && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadSurah(surah.id)
                                }}
                                disabled={downloadingSurahs.includes(surah.id)}
                              >
                                {downloadingSurahs.includes(surah.id) ? (
                                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="downloaded" className="mt-4">
                <ScrollArea className="h-96 custom-scrollbar">
                  <div className="space-y-3">
                    {surahs.filter(s => s.isDownloaded).map((surah) => (
                      <div
                        key={surah.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          currentSurah.id === surah.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => playSurah(surah)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {surah.id}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {surah.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {surah.arabicName} • {surah.totalVerses} ayat
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="favorites" className="mt-4">
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Tiada surah favorit lagi</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Tambahkan surah ke favorit untuk akses cepat
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Download Stats */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Status Muat Turun
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {surahs.filter(s => s.isDownloaded).length} dari {surahs.length} surah dimuat turun
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedQari.totalSize}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Jumlah saiz
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}