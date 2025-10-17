'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Share2, 
  Download, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Copy,
  ChevronLeft,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Whatsapp,
  Telegram,
  Grid3X3,
  Sparkles,
  Quote
} from 'lucide-react'

interface Verse {
  id: number
  arabic: string
  translation: {
    malay: string
    indonesian: string
    english: string
  }
  transliteration: string
  surah: string
  ayah: number
}

interface Template {
  id: string
  name: string
  preview: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  style: 'modern' | 'classic' | 'minimal' | 'elegant' | 'nature' | 'geometric'
}

const sampleVerse: Verse = {
  id: 255,
  arabic: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ ۖ فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ الْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ',
  translation: {
    malay: 'Setiap yang bernyawa akan merasakan mati. Dan hanya pada hari Kiamat sajalah disempurnakan pahalamu. Barangsiapa dijauhkan dari neraka dan dimasukkan ke dalam surga, maka sungguh, dia telah beruntung. Kehidupan dunia itu tidak lain hanyalah kesenangan yang memperdayakan.',
    indonesian: 'Setiap yang bernyawa akan merasakan mati. Dan hanya pada hari Kiamat sajalah disempurnakan pahalamu. Barangsiapa dijauhkan dari neraka dan dimasukkan ke dalam surga, maka sungguh, dia telah beruntung. Kehidupan dunia itu tidak lain hanyalah kesenangan yang memperdayakan.',
    english: 'Every soul will taste death. And you will only receive your full reward on the Day of Resurrection. Then he whose soul is removed from the Fire and admitted to Paradise will succeed. The life of this world is only the enjoyment of deception.'
  },
  transliteration: 'Kullu nafsin dhaaiqatul-mawti wa-innama tuwaffawna ujuurakum yawmal-qiyamati fa-man zuhziha an-nari wa-udkhilal-jannata faqad faaz wa-mal-hayatud-dunya illa mataa\'ul-ghurur',
  surah: 'Ali Imran',
  ayah: 185
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Moden',
    preview: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    backgroundColor: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    textColor: 'text-white',
    accentColor: 'text-emerald-100',
    fontFamily: 'font-sans',
    style: 'modern'
  },
  {
    id: 'classic',
    name: 'Klasik',
    preview: 'bg-gradient-to-br from-amber-100 to-amber-200',
    backgroundColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
    textColor: 'text-amber-900',
    accentColor: 'text-amber-700',
    fontFamily: 'font-serif',
    style: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: 'bg-white',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'text-gray-600',
    fontFamily: 'font-sans',
    style: 'minimal'
  },
  {
    id: 'elegant',
    name: 'Elegan',
    preview: 'bg-gradient-to-br from-purple-900 to-indigo-900',
    backgroundColor: 'bg-gradient-to-br from-purple-900 to-indigo-900',
    textColor: 'text-white',
    accentColor: 'text-purple-200',
    fontFamily: 'font-serif',
    style: 'elegant'
  },
  {
    id: 'nature',
    name: 'Alam',
    preview: 'bg-gradient-to-br from-green-400 to-blue-500',
    backgroundColor: 'bg-gradient-to-br from-green-400 to-blue-500',
    textColor: 'text-white',
    accentColor: 'text-green-100',
    fontFamily: 'font-sans',
    style: 'nature'
  },
  {
    id: 'geometric',
    name: 'Geometrik',
    preview: 'bg-gradient-to-br from-rose-500 to-pink-600',
    backgroundColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
    textColor: 'text-white',
    accentColor: 'text-rose-100',
    fontFamily: 'font-sans',
    style: 'geometric'
  }
]

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, size: '1080x1080' },
  { name: 'Facebook', icon: Facebook, size: '1200x630' },
  { name: 'Twitter', icon: Twitter, size: '1200x675' },
  { name: 'WhatsApp', icon: Whatsapp, size: '1080x1920' },
  { name: 'Telegram', icon: Telegram, size: '1200x800' }
]

export default function QuoteSharing() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [selectedTranslation, setSelectedTranslation] = useState<'malay' | 'indonesian' | 'english'>('malay')
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState(socialPlatforms[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const generateQuoteImage = async () => {
    setIsGenerating(true)
    
    // Simulate image generation
    setTimeout(() => {
      setGeneratedImage('/api/placeholder/1080/1080')
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  const shareToSocial = (platform: typeof socialPlatforms[0]) => {
    const text = `${sampleVerse.arabic}\n\n${sampleVerse.translation[selectedTranslation]}\n\n${sampleVerse.surah} ${sampleVerse.ayah}:${sampleVerse.ayah}\n\n#AlQuran #IslamicQuotes`
    
    if (platform.name === 'Twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    } else if (platform.name === 'Facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`, '_blank')
    }
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.download = `quran-quote-${sampleVerse.surah}-${sampleVerse.ayah}.png`
    link.href = generatedImage || '/api/placeholder/1080/1080'
    link.click()
  }

  const getTemplateStyles = (template: Template) => {
    const baseStyles = 'p-8 rounded-2xl'
    const textStyles = `${template.textColor} ${template.fontFamily}`
    
    return `${baseStyles} ${template.backgroundColor} ${textStyles}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-emerald-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Kongsi Ayat</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cipta quote yang menarik</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Verse Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Quote className="w-4 h-4 text-emerald-500" />
                  Pilih Ayat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-right mb-3">
                    <p className="text-lg font-arabic leading-relaxed text-gray-900 dark:text-gray-100">
                      {sampleVerse.arabic}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {sampleVerse.translation[selectedTranslation]}
                  </p>
                  {showTransliteration && (
                    <p className="text-xs italic text-gray-600 dark:text-gray-400 mb-2">
                      {sampleVerse.transliteration}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{sampleVerse.surah} : {sampleVerse.ayah}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedTranslation === 'malay' ? 'Melayu' : selectedTranslation === 'indonesian' ? 'Indonesia' : 'English'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Terjemahan</label>
                    <div className="flex gap-2">
                      {(['malay', 'indonesian', 'english'] as const).map((lang) => (
                        <Button
                          key={lang}
                          variant={selectedTranslation === lang ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTranslation(lang)}
                        >
                          {lang === 'malay' ? 'Melayu' : lang === 'indonesian' ? 'Indonesia' : 'English'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Transliteration</label>
                    <Button
                      variant={showTransliteration ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowTransliteration(!showTransliteration)}
                    >
                      {showTransliteration ? 'Tunjuk' : 'Sembunyi'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Mesej Peribadi (Opsional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tambahkan refleksi atau mesej peribadi..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[80px]"
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {customMessage.length}/200 karakter
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-500" />
                  Pilih Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${
                        selectedTemplate.id === template.id
                          ? 'border-emerald-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className={`h-16 rounded ${template.preview} mb-2`} />
                      <p className="text-xs font-medium text-center">{template.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  Prebiu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Preview Canvas */}
                  <div 
                    ref={canvasRef}
                    className={`aspect-square ${getTemplateStyles(selectedTemplate)} relative overflow-hidden`}
                  >
                    {/* Decorative Elements */}
                    {selectedTemplate.style === 'modern' && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    )}
                    {selectedTemplate.style === 'elegant' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                    )}
                    
                    {/* Quote Content */}
                    <div className="relative h-full flex flex-col justify-between p-8">
                      <div className="text-center">
                        <div className="text-3xl font-arabic leading-relaxed mb-4 text-right" style={{ fontFamily: "'Amiri Quran', serif", direction: 'rtl' }}>
                          {sampleVerse.arabic}
                        </div>
                        <div className="text-sm mb-4">
                          {sampleVerse.translation[selectedTranslation]}
                        </div>
                        {showTransliteration && (
                          <div className="text-xs opacity-75 mb-4">
                            {sampleVerse.transliteration}
                          </div>
                        )}
                        {customMessage && (
                          <div className="text-sm italic opacity-90 mt-4 p-3 bg-white/10 rounded-lg">
                            "{customMessage}"
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-xs ${selectedTemplate.accentColor}`}>
                          {sampleVerse.surah} : {sampleVerse.ayah}
                        </div>
                        <div className={`text-xs ${selectedTemplate.accentColor} mt-1`}>
                          Al-Quran Digital
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Platform</label>
                    <div className="grid grid-cols-5 gap-2">
                      {socialPlatforms.map((platform) => (
                        <Button
                          key={platform.name}
                          variant={selectedPlatform.name === platform.name ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPlatform(platform)}
                          className="flex flex-col gap-1 h-auto py-2"
                        >
                          <platform.icon className="w-4 h-4" />
                          <span className="text-xs">{platform.name}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Saiz: {selectedPlatform.size}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button
                    onClick={generateQuoteImage}
                    disabled={isGenerating}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Mencipta Imej...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Cipta Imej Quote
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(
                        `${sampleVerse.arabic}\n\n${sampleVerse.translation[selectedTranslation]}\n\n${sampleVerse.surah} : ${sampleVerse.ayah}`
                      )}
                      className="flex items-center justify-center"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Salin Teks
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={downloadImage}
                      disabled={!generatedImage}
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Muat Turun
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kongsi Terus ke:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {socialPlatforms.slice(0, 3).map((platform) => (
                        <Button
                          key={platform.name}
                          variant="outline"
                          size="sm"
                          onClick={() => shareToSocial(platform)}
                          className="flex items-center justify-center"
                        >
                          <platform.icon className="w-4 h-4 mr-1" />
                          {platform.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Tips Perkongsian
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Pilih template yang sesuai dengan platform</li>
                      <li>• Tambahkan mesej peribadi untuk sentuhan yang lebih intim</li>
                      <li>• Pastikan terjemahan tepat dan mudah difahami</li>
                      <li>• Gunakan hashtag yang relevan untuk reach lebih luas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}