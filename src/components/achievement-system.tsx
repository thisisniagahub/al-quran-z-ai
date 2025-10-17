'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  TrendingUp,
  Crown,
  Gem,
  Flame,
  BookOpen,
  Brain,
  Share2,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  Lock,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react'
import { 
  AchievementSystem, 
  Achievement, 
  UserAchievements, 
  RARITY_STYLES, 
  LEVEL_THRESHOLDS,
  ACHIEVEMENTS,
  createAchievementNotification
} from '@/lib/achievements'
import { useToast } from '@/hooks/use-toast'

// Mock user stats for demonstration
const mockUserStats = {
  wordsLearned: 15,
  streakDays: 5,
  perfectSessions: 3,
  totalTimeMinutes: 120,
  aiQuestions: 8,
  quotesShared: 2
}

export default function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState<UserAchievements | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNotifications, setShowNotifications] = useState(false)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load user achievements
    const achievements = AchievementSystem.getUserAchievements('user1')
    setUserAchievements(achievements)

    // Check for new achievements
    const newAchs = AchievementSystem.checkAchievements('user1', mockUserStats)
    if (newAchs.length > 0) {
      setNewAchievements(newAchs)
      setShowNotifications(true)
      
      // Show toast for each new achievement
      newAchs.forEach((achievement, index) => {
        setTimeout(() => {
          toast({
            title: `🎉 Pencapaian Baru!`,
            description: `${achievement.name} - ${achievement.description}`,
            className: `${RARITY_STYLES[achievement.rarity].bgColor} ${RARITY_STYLES[achievement.rarity].color}`
          })
        }, index * 1000)
      })
    }
  }, [])

  const getFilteredAchievements = () => {
    if (!userAchievements) return []
    
    if (selectedCategory === 'all') {
      return ACHIEVEMENTS.map(ach => {
        const userAch = userAchievements.achievements.find(ua => ua.id === ach.id)
        return userAch || { ...ach, unlocked: false, progress: 0 }
      })
    }
    
    return ACHIEVEMENTS
      .filter(ach => selectedCategory === 'all' || ach.category === selectedCategory)
      .map(ach => {
        const userAch = userAchievements.achievements.find(ua => ua.id === ach.id)
        return userAch || { ...ach, unlocked: false, progress: 0 }
      })
  }

  const getNextAchievements = () => {
    return AchievementSystem.getNextAchievements(mockUserStats, 3)
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-4 h-4" />
      case 'streak': return <Flame className="w-4 h-4" />
      case 'mastery': return <Target className="w-4 h-4" />
      case 'social': return <Share2 className="w-4 h-4" />
      case 'special': return <Star className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return 'Pembelajaran'
      case 'streak': return 'Streak'
      case 'mastery': return 'Penguasaan'
      case 'social': return 'Sosial'
      case 'special': return 'Istimewa'
      default: return 'Semua'
    }
  }

  if (!userAchievements) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuatkan pencapaian...</p>
        </div>
      </div>
    )
  }

  const currentLevelInfo = LEVEL_THRESHOLDS[userAchievements.level - 1]
  const nextLevelInfo = LEVEL_THRESHOLDS[userAchievements.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const levelProgress = (userAchievements.currentLevelPoints / userAchievements.nextLevelPoints) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-orange-200 dark:border-orange-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Sistem Pencapaian
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unlock badges dan naik level!
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Level & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Level Card */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{currentLevelInfo.badge}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {currentLevelInfo.name}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Level {userAchievements.level}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{userAchievements.currentLevelPoints} XP</span>
                    <span>{userAchievements.nextLevelPoints} XP</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {userAchievements.nextLevelPoints - userAchievements.currentLevelPoints} XP ke level seterusnya
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Points */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userAchievements.totalPoints}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Jumlah Mata
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Dari semua pencapaian
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Collection */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{userAchievements.badges.bronze}</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{userAchievements.badges.silver}</span>
                  </div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{userAchievements.badges.gold}</span>
                  </div>
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{userAchievements.badges.platinum}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Koleksi Badge
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userAchievements.achievements.length} dari {ACHIEVEMENTS.length} badge
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Achievements */}
        <Card className="mb-6 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Pencapaian Seterusnya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getNextAchievements().map((achievement, index) => (
                <Card key={achievement.id} className="border-orange-100 dark:border-orange-900">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round(achievement.progress)}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Tabs */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="learning">Pembelajaran</TabsTrigger>
                <TabsTrigger value="streak">Streak</TabsTrigger>
                <TabsTrigger value="mastery">Penguasaan</TabsTrigger>
                <TabsTrigger value="social">Sosial</TabsTrigger>
                <TabsTrigger value="special">Istimewa</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-4">
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {getFilteredAchievements().map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={`${
                          achievement.unlocked 
                            ? `${RARITY_STYLES[achievement.rarity].bgColor} ${RARITY_STYLES[achievement.rarity].borderColor}` 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        } border-2`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-semibold text-sm ${
                                  achievement.unlocked 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {achievement.name}
                                </h4>
                                {achievement.unlocked ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <p className={`text-xs mb-2 ${
                                achievement.unlocked 
                                  ? 'text-gray-700 dark:text-gray-300' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {achievement.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${RARITY_STYLES[achievement.rarity].color} ${RARITY_STYLES[achievement.rarity].bgColor}`}
                                >
                                  {achievement.rarity === 'common' ? 'Biasa' :
                                   achievement.rarity === 'rare' ? 'Jarang' :
                                   achievement.rarity === 'epic' ? 'Epik' : 'Legenda'}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs font-medium">
                                    {achievement.points}
                                  </span>
                                </div>
                              </div>

                              {!achievement.unlocked && achievement.progress > 0 && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{Math.round(achievement.progress)}%</span>
                                  </div>
                                  <Progress value={achievement.progress} className="h-1" />
                                </div>
                              )}

                              {achievement.unlocked && achievement.unlockedAt && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  Dicapai pada {achievement.unlockedAt.toLocaleDateString('ms-MY')}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}