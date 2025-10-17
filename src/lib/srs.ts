// Spaced Repetition System (SRS) - SM-2 Algorithm Implementation
// Based on SuperMemo SM-2 algorithm for optimal learning intervals

export interface SRSItem {
  id: string
  wordId: string
  userId?: string
  easeFactor: number // E-Factor, default 2.5
  interval: number // Days until next review
  repetitions: number // Number of successful repetitions
  nextReviewDate: Date
  lastReviewDate?: Date
  reviewQuality?: number // Quality of last review (0-5)
  isDue: boolean
  priority: 'new' | 'learning' | 'review' | 'relearning'
}

export interface ReviewResult {
  itemId: string
  quality: number // 0-5 scale
  responseTime: number // milliseconds
  wasCorrect: boolean
}

export class SRSSystem {
  // Default SM-2 parameters
  private static readonly DEFAULT_EASE_FACTOR = 2.5
  private static readonly MINIMUM_EASE_FACTOR = 1.3
  private static readonly EASE_FACTOR_MODIFIER = 0.1
  
  /**
   * Calculate next review parameters based on SM-2 algorithm
   * Quality scale: 0=terrible, 1=bad, 2=poor, 3=good, 4=perfect, 5=excellent
   */
  static calculateNextReview(item: SRSItem, quality: number): Partial<SRSItem> {
    let { easeFactor, interval, repetitions } = item
    
    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    // Ensure ease factor doesn't go below minimum
    easeFactor = Math.max(this.MINIMUM_EASE_FACTOR, easeFactor)
    
    // Update repetitions and interval based on quality
    if (quality >= 3) {
      // Correct response
      repetitions += 1
      
      if (repetitions === 1) {
        interval = 1 // First review: 1 day
      } else if (repetitions === 2) {
        interval = 6 // Second review: 6 days
      } else {
        interval = Math.round(interval * easeFactor) // Subsequent reviews: interval * ease factor
      }
    } else {
      // Incorrect response - reset repetitions
      repetitions = 0
      interval = 1 // Review again tomorrow
    }
    
    // Calculate next review date
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + interval)
    
    // Determine priority
    let priority: SRSItem['priority']
    if (repetitions === 0) {
      priority = quality >= 3 ? 'learning' : 'relearning'
    } else if (repetitions <= 3) {
      priority = 'learning'
    } else {
      priority = 'review'
    }
    
    return {
      easeFactor,
      interval,
      repetitions,
      nextReviewDate,
      lastReviewDate: new Date(),
      reviewQuality: quality,
      isDue: false,
      priority
    }
  }
  
  /**
   * Check if an item is due for review
   */
  static isItemDue(item: SRSItem): boolean {
    const now = new Date()
    return item.nextReviewDate <= now
  }
  
  /**
   * Get items that are due for review
   */
  static getDueItems(items: SRSItem[]): SRSItem[] {
    return items
      .filter(item => this.isItemDue(item))
      .sort((a, b) => {
        // Sort by priority and then by next review date
        const priorityOrder = { 'relearning': 0, 'learning': 1, 'review': 2, 'new': 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        
        if (priorityDiff !== 0) return priorityDiff
        
        // If same priority, sort by next review date
        return a.nextReviewDate.getTime() - b.nextReviewDate.getTime()
      })
  }
  
  /**
   * Create a new SRS item
   */
  static createNewItem(wordId: string, userId?: string): SRSItem {
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + 1) // Review tomorrow
    
    return {
      id: `srs-${wordId}-${Date.now()}`,
      wordId,
      userId,
      easeFactor: this.DEFAULT_EASE_FACTOR,
      interval: 1,
      repetitions: 0,
      nextReviewDate,
      isDue: false,
      priority: 'new'
    }
  }
  
  /**
   * Get study statistics
   */
  static getStudyStats(items: SRSItem[]): {
    totalItems: number
    dueItems: number
    learnedItems: number
    newItems: number
    averageRetention: number
    streakDays: number
  } {
    const totalItems = items.length
    const dueItems = this.getDueItems(items).length
    const learnedItems = items.filter(item => item.repetitions >= 3).length
    const newItems = items.filter(item => item.repetitions === 0).length
    
    // Calculate average retention (items with quality >= 3)
    const reviewedItems = items.filter(item => item.reviewQuality !== undefined)
    const averageRetention = reviewedItems.length > 0 
      ? reviewedItems.filter(item => item.reviewQuality! >= 3).length / reviewedItems.length * 100
      : 0
    
    // Calculate streak days (consecutive days with reviews)
    const streakDays = this.calculateStreakDays(items)
    
    return {
      totalItems,
      dueItems,
      learnedItems,
      newItems,
      averageRetention,
      streakDays
    }
  }
  
  /**
   * Calculate consecutive study streak
   */
  private static calculateStreakDays(items: SRSItem[]): number {
    const today = new Date()
    const reviewDates = items
      .filter(item => item.lastReviewDate)
      .map(item => item.lastReviewDate!.toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index) // Unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    if (reviewDates.length === 0) return 0
    
    let streak = 0
    let currentDate = new Date(today)
    
    for (const dateStr of reviewDates) {
      const reviewDate = new Date(dateStr)
      const daysDiff = Math.floor((currentDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
        currentDate = new Date(reviewDate)
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }
  
  /**
   * Get optimal study session size based on due items
   */
  static getOptimalSessionSize(dueItems: number): number {
    if (dueItems <= 10) return dueItems
    if (dueItems <= 20) return Math.min(dueItems, 15)
    if (dueItems <= 50) return Math.min(dueItems, 25)
    return Math.min(dueItems, 30)
  }
  
  /**
   * Predict when items will be due in the future
   */
  static getFutureDueItems(items: SRSItem[], daysAhead: number): { date: Date; count: number }[] {
    const futureCounts: { [key: string]: number } = {}
    
    items.forEach(item => {
      const daysUntilDue = Math.ceil((item.nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilDue >= 0 && daysUntilDue <= daysAhead) {
        const dateKey = item.nextReviewDate.toDateString()
        futureCounts[dateKey] = (futureCounts[dateKey] || 0) + 1
      }
    })
    
    return Object.entries(futureCounts)
      .map(([dateStr, count]) => ({
        date: new Date(dateStr),
        count
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }
}

// Quality rating descriptions
export const QUALITY_DESCRIPTIONS = {
  0: { 
    label: 'Teruk', 
    description: 'Lupa sepenuhnya, perlu belajar semula',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  1: { 
    label: 'Lemah', 
    description: 'Ingat sedikit sahaja',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  2: { 
    label: 'Payaht', 
    description: 'Ingat tetapi sukar',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  3: { 
    label: 'Baik', 
    description: 'Ingat dengan usaha',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  4: { 
    label: 'Sempurna', 
    description: 'Ingat dengan mudah',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  5: { 
    label: 'Cemerlang', 
    description: 'Ingat serta-merta',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  }
}

// Study session recommendations
export const STUDY_RECOMMENDATIONS = {
  NEW_USER: {
    dailyGoal: 10,
    sessionDuration: 15, // minutes
    maxNewItems: 5
  },
  CASUAL: {
    dailyGoal: 20,
    sessionDuration: 20,
    maxNewItems: 10
  },
  SERIOUS: {
    dailyGoal: 50,
    sessionDuration: 30,
    maxNewItems: 20
  },
  INTENSIVE: {
    dailyGoal: 100,
    sessionDuration: 45,
    maxNewItems: 30
  }
}