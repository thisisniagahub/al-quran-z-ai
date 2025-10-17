'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Play,
  Pause,
  SkipForward,
  Volume2
} from 'lucide-react'
import { SRSSystem, QUALITY_DESCRIPTIONS, STUDY_RECOMMENDATIONS } from '@/lib/srs'
import { useToast } from '@/hooks/use-toast'

// Mock data for demonstration
const mockSRSItems = [
  {
    id: '1',
    wordId: 'bismillah',
    userId: 'user1',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date(),
    isDue: true,
    priority: 'new' as const,
    word: {
      arabic: 'بِسْمِ',
      transliteration: 'Bismi',
      translation: 'Dengan nama',
      meaning: 'Dengan menyebut nama',
      example: 'Bismillahir Rahmanir Rahim'
    }
  },
  {
    id: '2',
    wordId: 'alhamdulillah',
    userId: 'user1',
    easeFactor: 2.8,
    interval: 3,
    repetitions: 2,
    nextReviewDate: new Date(),
    isDue: true,
    priority: 'learning' as const,
    word: {
      arabic: 'الْحَمْدُ',
      transliteration: 'Alhamdu',
      translation: 'Segala puji',
      meaning: 'Pujian yang sempurna',
      example: 'Alhamdulillahi Rabbil Alamin'
    }
  },
  {
    id: '3',
    wordId: 'rahman',
    userId: 'user1',
    easeFactor: 3.2,
    interval: 7,
    repetitions: 4,
    nextReviewDate: new Date(),
    isDue: true,
    priority: 'review' as const,
    word: {
      arabic: 'الرَّحْمَنُ',
      transliteration: 'Ar-Rahman',
      translation: 'Maha Pemurah',
      meaning: 'Yang memberi rahmat kepada semua makhluk',
      example: 'Bismillahir Rahmanir Rahim'
    }
  }
]

interface StudySession {
  startTime: Date
  itemsStudied: number
  correctAnswers: number
  averageResponseTime: number
  currentStreak: number
  bestStreak: number
}

export default function SRSReview() {
  const [currentItems, setCurrentItems] = useState(mockSRSItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [studySession, setStudySession] = useState<StudySession>({
    startTime: new Date(),
    itemsStudied: 0,
    correctAnswers: 0,
    averageResponseTime: 0,
    currentStreak: 0,
    bestStreak: 0
  })
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [responseStartTime, setResponseStartTime] = useState<number>(Date.now())
  const { toast } = useToast()

  const currentItem = currentItems[currentIndex]
  const stats = SRSSystem.getStudyStats(currentItems)
  const progress = ((currentIndex) / currentItems.length) * 100

  useEffect(() => {
    // Check for due items
    const dueItems = SRSSystem.getDueItems(currentItems)
    if (dueItems.length > 0 && !isSessionActive) {
      setCurrentItems(dueItems)
    }
  }, [currentItems, isSessionActive])

  const startSession = () => {
    setIsSessionActive(true)
    setSessionStartTime(new Date())
    setResponseStartTime(Date.now())
    setShowAnswer(false)
  }

  const pauseSession = () => {
    setIsSessionActive(false)
  }

  const handleQualityRating = (quality: number) => {
    if (!currentItem) return

    const responseTime = Date.now() - responseStartTime
    const wasCorrect = quality >= 3

    // Update SRS item
    const updatedItem = {
      ...currentItem,
      ...SRSSystem.calculateNextReview(currentItem, quality)
    }

    const updatedItems = [...currentItems]
    updatedItems[currentIndex] = updatedItem
    setCurrentItems(updatedItems)

    // Update session stats
    setStudySession(prev => ({
      ...prev,
      itemsStudied: prev.itemsStudied + 1,
      correctAnswers: prev.correctAnswers + (wasCorrect ? 1 : 0),
      averageResponseTime: (prev.averageResponseTime * prev.itemsStudied + responseTime) / (prev.itemsStudied + 1),
      currentStreak: wasCorrect ? prev.currentStreak + 1 : 0,
      bestStreak: Math.max(prev.bestStreak, wasCorrect ? prev.currentStreak + 1 : prev.bestStreak)
    }))

    // Show feedback
    const qualityDesc = QUALITY_DESCRIPTIONS[quality as keyof typeof QUALITY_DESCRIPTIONS]
    toast({
      title: `${qualityDesc.label}!`,
      description: qualityDesc.description,
      className: qualityDesc.bgColor
    })

    // Move to next item or end session
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
      setResponseStartTime(Date.now())
    } else {
      endSession()
    }
  }

  const endSession = () => {
    setIsSessionActive(false)
    
    const sessionDuration = sessionStartTime 
      ? Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60)
      : 0

    toast({
      title: "Sesi Tamat! 🎉",
      description: `Anda telah mengkaji ${studySession.itemsStudied} perkataan dalam ${sessionDuration} minit`,
      className: "bg-emerald-100 text-emerald-800"
    })
  }

  const skipItem = () => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
      setResponseStartTime(Date.now())
    }
  }

  const playAudio = () => {
    if (!currentItem?.word) return
    
    const utterance = new SpeechSynthesisUtterance(currentItem.word.arabic)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-6 border-purple-200 dark:border-purple-800">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sistem Ulangan Berjarak (SRS)
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kuasai Quran dengan saintifik pembelajaran
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.dueItems}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Perlu Ulangan
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.learnedItems}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Telah Dikuasai
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(stats.averageRetention)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Kadar Ingatan
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.streakDays}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hari Berturut
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Recommendations */}
          <Card className="mb-6 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Cadangan Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(STUDY_RECOMMENDATIONS).map(([level, config]) => (
                  <Card key={level} className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                        {level === 'NEW_USER' ? 'Pemula' : 
                         level === 'CASUAL' ? 'Biasa' :
                         level === 'SERIOUS' ? 'Serius' : 'Intensif'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>🎯 {config.dailyGoal} perkataan/hari</div>
                        <div>⏱️ {config.sessionDuration} minit/sesi</div>
                        <div>📚 {config.maxNewItems} perkataan baru</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Session Button */}
          <div className="text-center">
            <Button
              onClick={startSession}
              disabled={stats.dueItems === 0}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {stats.dueItems === 0 ? 'Tiada Perkataan Perlu Ulangan' : `Mula Sesi (${stats.dueItems} perkataan)`}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Session Header */}
        <Card className="mb-6 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sesi Ulangan SRS
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Item {currentIndex + 1} dari {currentItems.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipItem}
                  className="border-purple-200 dark:border-purple-700"
                >
                  <SkipForward className="w-4 h-4 mr-1" />
                  Skip
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pauseSession}
                  className="border-purple-200 dark:border-purple-700"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Study Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold">{studySession.correctAnswers}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Betul</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">{studySession.currentStreak}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
                <span className="font-bold">{Math.round(studySession.averageResponseTime / 1000)}s</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Time</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                <Award className="w-4 h-4" />
                <span className="font-bold">{Math.round((studySession.correctAnswers / Math.max(studySession.itemsStudied, 1)) * 100)}%</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Item */}
        {currentItem && (
          <Card className="mb-6 border-purple-200 dark:border-purple-800">
            <CardContent className="p-8">
              <div className="text-center">
                {/* Priority Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentItem.priority === 'new' ? 'bg-blue-100 text-blue-800' :
                    currentItem.priority === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                    currentItem.priority === 'review' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentItem.priority === 'new' ? 'Baru' :
                     currentItem.priority === 'learning' ? 'Belajar' :
                     currentItem.priority === 'review' ? 'Ulangan' : 'Belajar Semula'}
                  </span>
                </div>

                {/* Arabic Word */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentItem.word.arabic}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playAudio}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Dengar
                  </Button>
                </div>

                {/* Transliteration */}
                <div className="mb-4">
                  <div className="text-lg text-gray-700 dark:text-gray-300">
                    {currentItem.word.transliteration}
                  </div>
                </div>

                {/* Show Answer Button */}
                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8"
                  >
                    Tunjuk Jawapan
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Translation */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        {currentItem.word.translation}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {currentItem.word.meaning}
                      </div>
                    </div>

                    {/* Example */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Contoh:
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">
                        {currentItem.word.example}
                      </div>
                    </div>

                    {/* Quality Rating */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sej mana anda ingat perkataan ini?
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {Object.entries(QUALITY_DESCRIPTIONS).map(([quality, desc]) => (
                          <Button
                            key={quality}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQualityRating(parseInt(quality))}
                            className={`h-auto p-3 flex flex-col gap-1 ${desc.bgColor} ${desc.color} border-0`}
                          >
                            <span className="font-bold">{quality}</span>
                            <span className="text-xs">{desc.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}