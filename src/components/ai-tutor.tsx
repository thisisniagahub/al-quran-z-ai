'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  MessageCircle,
  Loader2,
  Mic,
  Volume2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPlaying?: boolean
}

interface AIQuestion {
  question: string
  context?: string
  wordInfo?: {
    arabic: string
    translation: string
    surah: number
    ayah: number
  }
}

const suggestedQuestions = [
  "Apakah maksud perkataan 'Rabb' dalam Al-Fatihah?",
  "Kenapa perkataan 'Ibrahim' disebut 69 kali dalam Quran?",
  "Jelaskan tatabahasa perkataan 'Bismillah'",
  "Apakah perbezaan antara 'Hamd' dan 'Syukur'?",
  "Kenapa surah Al-Ikhlas dianggap sebagai 1/3 Quran?",
  "Jelaskan maksud 'Alhamdulillah' secara mendalam"
]

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: `🕌 *Assalamualaikum! Saya AI Tutor Quran anda.*

Saya di sini untuk membantu anda memahami Al-Quran dengan lebih mendalam. Anda boleh bertanya tentang:

📖 **Perkataan Quran** - Maksud, tatabahasa, penggunaan
🔍 **Konteks Ayat** - Sebab wahyu, latar belakang
📚 **Tafsiran** - Maksud dalaman dan pelajaran
🎯 **Hafazan** - Tips dan teknik menghafal
🌟 **Aplikasi** - Bagaimana mengamalkan ayat

*Pilih soalan contoh di bawah atau taip soalan anda sendiri!*`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageText,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('AI Tutor Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ *Maaf, saya menghadapi masalah teknikal.*

Sila cuba lagi atau pilih soalan contoh di bawah. Jika masalah berterusan, sila hubungi support.

*Soalan cadangan:*
${suggestedQuestions.slice(0, 3).map(q => `• ${q}`).join('\n')}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "Ralat AI Tutor",
        description: "Gagal mendapatkan respons. Sila cuba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  const playTextToSpeech = (text: string, messageId: string) => {
    // Mark message as playing
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying: true } : msg
    ))

    // Cancel previous speech if any
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ms-MY' // Malay
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
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🕌/g, '🕌')
      .replace(/📖/g, '📖')
      .replace(/🔍/g, '🔍')
      .replace(/📚/g, '📚')
      .replace(/🎯/g, '🎯')
      .replace(/🌟/g, '🌟')
      .replace(/❌/g, '❌')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Tutor Quran
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Guru Quran peribadi anda 24/7
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Powered by AI</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Sumber Quran & Hadis</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Bahasa Melayu</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Area */}
        <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-0">
            <ScrollArea 
              className="h-[500px] p-4" 
              ref={scrollAreaRef}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
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
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
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
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          AI sedang berfikir...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                💡 Soalan Pilihan:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start text-sm bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanya apa sahaja tentang Al-Quran..."
                  className="pr-12 bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 focus:border-emerald-500"
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
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
              🎯 Tip: Tanya tentang maksud perkataan, tatabahasa, atau konteks ayat
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}