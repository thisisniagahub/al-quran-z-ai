'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Volume2,
  Loader2,
  Sparkles
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FloatingMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPlaying?: boolean
}

interface FloatingAIAssistantProps {
  currentScreen?: string
  currentSurah?: number
  currentAyah?: number
  className?: string
}

export default function FloatingAIAssistant({ 
  currentScreen = 'unknown', 
  currentSurah,
  currentAyah,
  className = ""
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<FloatingMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: FloatingMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Assalamualaikum wa rahmatullahi wa barakatuh! 🕌

Saya Ustaz/Ustazah Digital anda. Saya di sini untuk membantu:

${currentScreen === 'quran-reader' ? `📖 **Sedang membaca Quran** - Boleh tanya tentang:
• Tafsir ayat semasa
• Tajwid dan pronunciation  
• Pelajaran dari ayat
• Hubungan ayat dengan kehidupan` : ''}

${currentScreen === 'srs-review' ? `🧠 **Sedang mengulang kaji** - Boleh tanya tentang:
• Tips hafazan perkataan
• Teknik mengingat
• Nasihat motivasi
• Kaitan dengan Quran` : ''}

${currentScreen === 'achievements' ? `🏆 **Sedang lihat pencapaian** - Boleh tanya tentang:
• Nasihat untuk terus belajar
• Doa keberkatan ilmu
• Kaitan ibadah dengan pembelajaran
• Motivasi spiritual` : ''}

🤲 Apa yang boleh saya bantu hari ini?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, currentScreen])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: FloatingMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageText,
          conversationHistory: messages.slice(-3),
          context: {
            currentScreen,
            currentSurah,
            currentAyah,
            userType: 'intermediate' // Could be determined from user progress
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const assistantMessage: FloatingMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Floating AI Error:', error)
      
      const errorMessage: FloatingMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Maaf, saya menghadapi masalah teknikal. 

🤲 Sila cuba:
• Semak sambungan internet
• Cuba soalan yang lebih mudah
• Hubungi support jika masalah berterusan

Doa semoga ilmu anda diberkati! 🕌`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "Masalah Teknikal",
        description: "Gagal menghubungi AI Ustaz/Ustazah",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  const playTextToSpeech = (text: string, messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying: true } : msg
    ))

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ms-MY'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ))
    }

    window.speechSynthesis.speak(utterance)
  }

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🕌/g, '🕌')
      .replace(/📖/g, '📖')
      .replace(/🧠/g, '🧠')
      .replace(/🏆/g, '🏆')
      .replace(/🤲/g, '🤲')
      .replace(/💡/g, '💡')
      .replace(/🌟/g, '🌟')
      .replace(/\n/g, '<br />')
  }

  // If closed, show floating button
  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white dark:border-gray-800"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
        
        {/* Pulse animation for new messages */}
        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-96 shadow-2xl border-2 border-emerald-200 dark:border-emerald-700 ${
        isMinimized ? 'h-14' : 'h-[600px]'
      } transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Ustaz/Ustazah Digital</div>
              <div className="text-xs opacity-90">🟢 Online</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <ScrollArea className="h-[480px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-emerald-500 text-white ml-auto'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(message.content) 
                        }}
                      />
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('ms-MY', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {message.type === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                            onClick={() => playTextToSpeech(message.content, message.id)}
                            disabled={message.isPlaying}
                          >
                            {message.isPlaying ? (
                              <Volume2 className="w-3 h-3 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Ustaz/Ustazah sedang menaip...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanya apa sahaja tentang Islam..."
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Ustaz/Ustazah Digital • Mengikut JAKIM/JAIS
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}