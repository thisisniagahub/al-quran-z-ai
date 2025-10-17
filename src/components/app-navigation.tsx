'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, 
  List, 
  Share2, 
  Headphones,
  Clock,
  ChevronLeft,
  Home as HomeIcon,
  User,
  Settings,
  Menu,
  X,
  Bot,
  Brain,
  Trophy,
  Search
} from 'lucide-react'

// Import components
import QuranReader from '@/components/quran-reader'
import SurahList from '@/components/surah-list'
import QuoteSharing from '@/components/quote-sharing'
import AudioRecitation from '@/components/audio-recitation'
import PrayerTimes from '@/components/prayer-times'
import AITutor from '@/components/ai-tutor'
import SRSReview from '@/components/srs-review'
import AchievementSystem from '@/components/achievement-system'
import FloatingAIAssistant from '@/components/floating-ai-assistant'
import AdvancedQuranSearch from '@/components/advanced-quran-search'
import Home from '@/app/page'

type Screen = 'home' | 'surah-list' | 'quran-reader' | 'quote-sharing' | 'audio-recitation' | 'prayer-times' | 'ai-tutor' | 'srs-review' | 'achievements' | 'search'

interface NavigationItem {
  id: Screen
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Utama', icon: HomeIcon, component: Home },
  { id: 'search', label: 'Carian', icon: Search, component: AdvancedQuranSearch },
  { id: 'surah-list', label: 'Surah', icon: List, component: SurahList },
  { id: 'quran-reader', label: 'Bacaan', icon: BookOpen, component: QuranReader },
  { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, component: AITutor },
  { id: 'srs-review', label: 'SRS Ulangan', icon: Brain, component: SRSReview },
  { id: 'achievements', label: 'Pencapaian', icon: Trophy, component: AchievementSystem },
  { id: 'quote-sharing', label: 'Kongsi', icon: Share2, component: QuoteSharing },
  { id: 'audio-recitation', label: 'Audio', icon: Headphones, component: AudioRecitation },
  { id: 'prayer-times', label: 'Solat', icon: Clock, component: PrayerTimes }
]

export default function AppNavigation() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const CurrentComponent = navigationItems.find(item => item.id === currentScreen)?.component || Home

  const renderNavigation = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Al-Quran Digital</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Malaysia & Indonesia</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentScreen === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 h-12 ${
                currentScreen === item.id 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => {
                setCurrentScreen(item.id)
                setIsMobileMenuOpen(false)
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="w-4 h-4" />
            <span>Tetapan</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Al-Quran Digital</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {navigationItems.find(item => item.id === currentScreen)?.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            {renderNavigation()}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0">
          {renderNavigation()}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative">
          <CurrentComponent />
          <FloatingAIAssistant 
            currentScreen={currentScreen}
            currentSurah={1} // Could be dynamic based on current context
            currentAyah={1}  // Could be dynamic based on current context
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="pt-16 relative">
          <CurrentComponent />
          <FloatingAIAssistant 
            currentScreen={currentScreen}
            currentSurah={1} // Could be dynamic based on current context
            currentAyah={1}  // Could be dynamic based on current context
          />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-5 gap-1 p-2">
            {navigationItems.slice(0, 5).map((item) => (
              <Button
                key={item.id}
                variant={currentScreen === item.id ? 'default' : 'ghost'}
                className={`flex-col gap-1 h-14 rounded-lg ${
                  currentScreen === item.id 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setCurrentScreen(item.id)}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}