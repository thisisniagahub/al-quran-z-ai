// Achievement System with Badges and Rewards
// Comprehensive gamification system for Quran learning

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'streak' | 'mastery' | 'social' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  requirement: {
    type: 'words_learned' | 'streak_days' | 'perfect_sessions' | 'total_time' | 'ai_questions' | 'quotes_shared'
    value: number
  }
  unlocked: boolean
  unlockedAt?: Date
  progress: number // 0-100
}

export interface UserAchievements {
  userId: string
  achievements: Achievement[]
  totalPoints: number
  level: number
  currentLevelPoints: number
  nextLevelPoints: number
  badges: {
    bronze: number
    silver: number
    gold: number
    platinum: number
  }
}

export interface AchievementNotification {
  id: string
  achievement: Achievement
  timestamp: Date
  viewed: boolean
}

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
  // Learning Achievements
  {
    id: 'first_word',
    name: 'Permulaan',
    description: 'Belajar perkataan Quran pertama anda',
    icon: '🌱',
    category: 'learning',
    rarity: 'common',
    points: 10,
    requirement: { type: 'words_learned', value: 1 }
  },
  {
    id: 'ten_words',
    name: 'Pelajar Permulaan',
    description: 'Belajar 10 perkataan Quran',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    points: 50,
    requirement: { type: 'words_learned', value: 10 }
  },
  {
    id: 'fifty_words',
    name: 'Penuntut Ilmu',
    description: 'Belajar 50 perkataan Quran',
    icon: '🎓',
    category: 'learning',
    rarity: 'rare',
    points: 200,
    requirement: { type: 'words_learned', value: 50 }
  },
  {
    id: 'hundred_words',
    name: 'Hafiz Amatur',
    description: 'Belajar 100 perkataan Quran',
    icon: '🏆',
    category: 'learning',
    rarity: 'epic',
    points: 500,
    requirement: { type: 'words_learned', value: 100 }
  },
  {
    id: 'five_hundred_words',
    name: 'Hafiz Quran',
    description: 'Belajar 500 perkataan Quran',
    icon: '👑',
    category: 'learning',
    rarity: 'legendary',
    points: 2000,
    requirement: { type: 'words_learned', value: 500 }
  },

  // Streak Achievements
  {
    id: 'three_day_streak',
    name: 'Azam Kuat',
    description: '3 hari berturut belajar',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    points: 30,
    requirement: { type: 'streak_days', value: 3 }
  },
  {
    id: 'week_streak',
    name: 'Istiqamah Minggu',
    description: '7 hari berturut belajar',
    icon: '💪',
    category: 'streak',
    rarity: 'rare',
    points: 100,
    requirement: { type: 'streak_days', value: 7 }
  },
  {
    id: 'month_streak',
    name: 'Guru Bulanan',
    description: '30 hari berturut belajar',
    icon: '🌟',
    category: 'streak',
    rarity: 'epic',
    points: 500,
    requirement: { type: 'streak_days', value: 30 }
  },
  {
    id: 'ramadan_streak',
    name: 'Pejuang Ramadan',
    description: '30 hari berturut belajar semasa Ramadan',
    icon: '🌙',
    category: 'special',
    rarity: 'legendary',
    points: 1000,
    requirement: { type: 'streak_days', value: 30 }
  },

  // Mastery Achievements
  {
    id: 'first_perfect',
    name: 'Sempurna Pertama',
    description: 'Sesi pertama dengan 100% ketepatan',
    icon: '⭐',
    category: 'mastery',
    rarity: 'common',
    points: 25,
    requirement: { type: 'perfect_sessions', value: 1 }
  },
  {
    id: 'ten_perfect',
    name: 'Master Sempurna',
    description: '10 sesi dengan 100% ketepatan',
    icon: '🎯',
    category: 'mastery',
    rarity: 'rare',
    points: 150,
    requirement: { type: 'perfect_sessions', value: 10 }
  },
  {
    id: 'speed_demon',
    name: 'Laju Cergas',
    description: 'Jawab 50 soalan dalam masa kurang 30 saat',
    icon: '⚡',
    category: 'mastery',
    rarity: 'epic',
    points: 300,
    requirement: { type: 'perfect_sessions', value: 50 }
  },

  // Time-based Achievements
  {
    id: 'hour_total',
    name: 'Pelajar Setia',
    description: 'Belajar selama 1 jam',
    icon: '⏰',
    category: 'learning',
    rarity: 'common',
    points: 40,
    requirement: { type: 'total_time', value: 60 }
  },
  {
    id: 'ten_hours_total',
    name: 'Penuntut Dedikasi',
    description: 'Belajar selama 10 jam',
    icon: '🕰️',
    category: 'learning',
    rarity: 'rare',
    points: 200,
    requirement: { type: 'total_time', value: 600 }
  },
  {
    id: 'hundred_hours_total',
    name: 'Ulama Digital',
    description: 'Belajar selama 100 jam',
    icon: '📖',
    category: 'learning',
    rarity: 'legendary',
    points: 1000,
    requirement: { type: 'total_time', value: 6000 }
  },

  // AI Tutor Achievements
  {
    id: 'first_ai_question',
    name: 'Kawan AI',
    description: 'Tanya soalan pertama kepada AI Tutor',
    icon: '🤖',
    category: 'learning',
    rarity: 'common',
    points: 20,
    requirement: { type: 'ai_questions', value: 1 }
  },
  {
    id: 'ten_ai_questions',
    name: 'Pelajar AI',
    description: 'Tanya 10 soalan kepada AI Tutor',
    icon: '🧠',
    category: 'learning',
    rarity: 'rare',
    points: 100,
    requirement: { type: 'ai_questions', value: 10 }
  },
  {
    id: 'fifty_ai_questions',
    name: 'Master AI',
    description: 'Tanya 50 soalan kepada AI Tutor',
    icon: '🎓',
    category: 'learning',
    rarity: 'epic',
    points: 300,
    requirement: { type: 'ai_questions', value: 50 }
  },

  // Social Achievements
  {
    id: 'first_quote',
    name: 'Pencerita',
    description: 'Kongsi petikan Quran pertama',
    icon: '📤',
    category: 'social',
    rarity: 'common',
    points: 15,
    requirement: { type: 'quotes_shared', value: 1 }
  },
  {
    id: 'ten_quotes',
    name: 'Dakwah Digital',
    description: 'Kongsi 10 petikan Quran',
    icon: '📱',
    category: 'social',
    rarity: 'rare',
    points: 75,
    requirement: { type: 'quotes_shared', value: 10 }
  },

  // Special Achievements
  {
    id: 'ramadan_warrior',
    name: 'Pejuang Ramadan',
    description: 'Belajar setiap hari semasa Ramadan',
    icon: '🌙',
    category: 'special',
    rarity: 'legendary',
    points: 1500,
    requirement: { type: 'streak_days', value: 30 }
  },
  {
    id: 'early_bird',
    name: 'Burung Pagi',
    description: 'Belajar sebelum pukul 6 pagi',
    icon: '🐦',
    category: 'special',
    rarity: 'rare',
    points: 80,
    requirement: { type: 'total_time', value: 1 }
  },
  {
    id: 'night_owl',
    name: 'Burung Hantu',
    description: 'Belajar selepas pukul 12 malam',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 80,
    requirement: { type: 'total_time', value: 1 }
  }
]

// Level system
export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Pemula', points: 0, badge: '🌱' },
  { level: 2, name: 'Pelajar', points: 100, badge: '📚' },
  { level: 3, name: 'Penuntut', points: 250, badge: '🎓' },
  { level: 4, name: 'Hafiz', points: 500, badge: '🏆' },
  { level: 5, name: 'Ustadz', points: 1000, badge: '👑' },
  { level: 6, name: 'Ulama', points: 2500, badge: '🌟' },
  { level: 7, name: 'Mujtahid', points: 5000, badge: '💎' },
  { level: 8, name: 'Wali', points: 10000, badge: '🕋' },
  { level: 9, name: 'Quran Master', points: 25000, badge: '🕌' },
  { level: 10, name: 'Hafiz Quran', points: 50000, badge: '👳‍♂️' }
]

// Rarity colors and styles
export const RARITY_STYLES = {
  common: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    gradient: 'from-gray-400 to-gray-600'
  },
  rare: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    gradient: 'from-blue-400 to-blue-600'
  },
  epic: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    gradient: 'from-purple-400 to-purple-600'
  },
  legendary: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    gradient: 'from-orange-400 to-orange-600'
  }
}

// Achievement system class
export class AchievementSystem {
  static getUserAchievements(userId: string): UserAchievements {
    // Mock implementation - in real app, this would fetch from database
    const unlockedAchievements: Achievement[] = [
      {
        ...ACHIEVEMENTS[0], // first_word
        unlocked: true,
        progress: 100,
        unlockedAt: new Date()
      }
    ]

    const totalPoints = unlockedAchievements.reduce((sum, ach) => sum + ach.points, 0)
    const level = this.getUserLevel(totalPoints)
    const currentLevelInfo = LEVEL_THRESHOLDS[level - 1]
    const nextLevelInfo = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]

    return {
      userId,
      achievements: unlockedAchievements,
      totalPoints,
      level,
      currentLevelPoints: totalPoints - currentLevelInfo.points,
      nextLevelPoints: nextLevelInfo.points - currentLevelInfo.points,
      badges: {
        bronze: unlockedAchievements.filter(a => a.rarity === 'common').length,
        silver: unlockedAchievements.filter(a => a.rarity === 'rare').length,
        gold: unlockedAchievements.filter(a => a.rarity === 'epic').length,
        platinum: unlockedAchievements.filter(a => a.rarity === 'legendary').length
      }
    }
  }

  static getUserLevel(totalPoints: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalPoints >= LEVEL_THRESHOLDS[i].points) {
        return LEVEL_THRESHOLDS[i].level
      }
    }
    return 1
  }

  static checkAchievements(
    userId: string,
    userStats: {
      wordsLearned: number
      streakDays: number
      perfectSessions: number
      totalTimeMinutes: number
      aiQuestions: number
      quotesShared: number
    }
  ): Achievement[] {
    const newAchievements: Achievement[] = []
    const userAchievements = this.getUserAchievements(userId)
    const unlockedIds = new Set(userAchievements.achievements.map(a => a.id))

    for (const achievementTemplate of ACHIEVEMENTS) {
      if (unlockedIds.has(achievementTemplate.id)) continue

      let progress = 0
      let currentValue = 0

      switch (achievementTemplate.requirement.type) {
        case 'words_learned':
          currentValue = userStats.wordsLearned
          break
        case 'streak_days':
          currentValue = userStats.streakDays
          break
        case 'perfect_sessions':
          currentValue = userStats.perfectSessions
          break
        case 'total_time':
          currentValue = userStats.totalTimeMinutes
          break
        case 'ai_questions':
          currentValue = userStats.aiQuestions
          break
        case 'quotes_shared':
          currentValue = userStats.quotesShared
          break
      }

      progress = Math.min(100, (currentValue / achievementTemplate.requirement.value) * 100)

      if (currentValue >= achievementTemplate.requirement.value) {
        const achievement: Achievement = {
          ...achievementTemplate,
          unlocked: true,
          progress: 100,
          unlockedAt: new Date()
        }
        newAchievements.push(achievement)
      }
    }

    return newAchievements
  }

  static getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return ACHIEVEMENTS.filter(ach => ach.category === category)
  }

  static getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return ACHIEVEMENTS.filter(ach => ach.rarity === rarity)
  }

  static getTotalAchievementsByRarity(): Record<Achievement['rarity'], number> {
    return {
      common: ACHIEVEMENTS.filter(ach => ach.rarity === 'common').length,
      rare: ACHIEVEMENTS.filter(ach => ach.rarity === 'rare').length,
      epic: ACHIEVEMENTS.filter(ach => ach.rarity === 'epic').length,
      legendary: ACHIEVEMENTS.filter(ach => ach.rarity === 'legendary').length
    }
  }

  static getNextAchievements(
    userStats: {
      wordsLearned: number
      streakDays: number
      perfectSessions: number
      totalTimeMinutes: number
      aiQuestions: number
      quotesShared: number
    },
    limit: number = 3
  ): Achievement[] {
    const achievements = ACHIEVEMENTS.map(ach => {
      let currentValue = 0
      switch (ach.requirement.type) {
        case 'words_learned':
          currentValue = userStats.wordsLearned
          break
        case 'streak_days':
          currentValue = userStats.streakDays
          break
        case 'perfect_sessions':
          currentValue = userStats.perfectSessions
          break
        case 'total_time':
          currentValue = userStats.totalTimeMinutes
          break
        case 'ai_questions':
          currentValue = userStats.aiQuestions
          break
        case 'quotes_shared':
          currentValue = userStats.quotesShared
          break
      }

      const progress = Math.min(100, (currentValue / ach.requirement.value) * 100)
      const remaining = Math.max(0, ach.requirement.value - currentValue)

      return {
        ...ach,
        unlocked: false,
        progress,
        remaining
      }
    })
    .filter(ach => ach.progress < 100)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, limit)

    return achievements
  }
}

// Notification system for achievements
export interface AchievementNotificationData {
  achievement: Achievement
  previousLevel: number
  newLevel: number
  totalPoints: number
}

export function createAchievementNotification(data: AchievementNotificationData): AchievementNotification {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    achievement: data.achievement,
    timestamp: new Date(),
    viewed: false
  }
}