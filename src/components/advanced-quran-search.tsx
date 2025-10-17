'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Globe, 
  Hash, 
  Tag,
  ChevronDown,
  ChevronUp,
  Volume2,
  Bookmark,
  Share2,
  Eye,
  Loader2,
  Sparkles
} from 'lucide-react'
import { AdvancedQuranSearch, SearchQuery, SearchResult } from '@/lib/quran-search'
import { useToast } from '@/hooks/use-toast'

export default function AdvancedQuranSearch() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchQuery['type']>('keyword')
  const [language, setLanguage] = useState<SearchQuery['language']>('malay')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())
  const [searchStats, setSearchStats] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (query.length > 2) {
      const newSuggestions = AdvancedQuranSearch.getSearchSuggestions(query, searchType)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query, searchType])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const searchQuery: SearchQuery = {
        query: query.trim(),
        type: searchType,
        language,
        filters: {}
      }

      const searchResults = await AdvancedQuranSearch.search(searchQuery)
      setResults(searchResults)
      
      const stats = AdvancedQuranSearch.getSearchStats(searchResults)
      setSearchStats(stats)

      if (searchResults.length === 0) {
        toast({
          title: "Tiada Hasil",
          description: "Tiada ayat ditemui untuk carian anda",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Carian Berjaya",
          description: `${searchResults.length} ayat ditemui`,
          className: "bg-emerald-100 text-emerald-800"
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Ralat Carian",
        description: "Gagal melakukan carian. Sila cuba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch()
  }

  const toggleResultExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId)
    } else {
      newExpanded.add(resultId)
    }
    setExpandedResults(newExpanded)
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const getSearchTypeIcon = (type: SearchQuery['type']) => {
    switch (type) {
      case 'keyword': return <Search className="w-4 h-4" />
      case 'root': return <Hash className="w-4 h-4" />
      case 'translation': return <Globe className="w-4 h-4" />
      case 'topic': return <Tag className="w-4 h-4" />
      case 'ayah': return <BookOpen className="w-4 h-4" />
      case 'surah': return <BookOpen className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'bg-green-100 text-green-800'
      case 'root': return 'bg-blue-100 text-blue-800'
      case 'translation': return 'bg-purple-100 text-purple-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quran Search Advanced
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cari ayat, perkataan akar, terjemahan, dan topik
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search Controls */}
        <Card className="mb-6 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="md:col-span-7 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Cari ayat, perkataan, atau topik..."
                    className="pl-10 pr-4 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 focus:border-blue-500"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Type */}
              <div className="md:col-span-2">
                <Select value={searchType} onValueChange={(value: SearchQuery['type']) => setSearchType(value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Keyword
                      </div>
                    </SelectItem>
                    <SelectItem value="root">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Root Word
                      </div>
                    </SelectItem>
                    <SelectItem value="translation">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Translation
                      </div>
                    </SelectItem>
                    <SelectItem value="topic">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Topic
                      </div>
                    </SelectItem>
                    <SelectItem value="ayah">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Ayah
                      </div>
                    </SelectItem>
                    <SelectItem value="surah">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Surah
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="md:col-span-2">
                <Select value={language} onValueChange={(value: SearchQuery['language']) => setLanguage(value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabic">العربية</SelectItem>
                    <SelectItem value="malay">Bahasa Melayu</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="indonesian">Bahasa Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button
                  onClick={handleSearch}
                  disabled={!query.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Search Tips */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Tips:</strong> 
              {searchType === 'keyword' && " Cuba perkataan seperti 'rahman', 'ilmu', atau 'sabr'"}
              {searchType === 'root' && " Masukkan perkataan akar Arab seperti 'حمد' atau 'علم'"}
              {searchType === 'ayah' && " Format: '2:255' atau 'Al-Baqarah 255'"}
              {searchType === 'topic' && " Cuba topik seperti 'prayer', 'patience', atau 'knowledge'"}
              {searchType === 'translation' && " Cari dalam terjemahan pilihan anda"}
              {searchType === 'surah' && " Masukkan nama atau nombor surah"}
            </div>
          </CardContent>
        </Card>

        {/* Search Statistics */}
        {searchStats && results.length > 0 && (
          <Card className="mb-6 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {searchStats.totalResults}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Results
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {searchStats.surahCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Surahs
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(searchStats.averageRelevance)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Relevance
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Object.keys(searchStats.juzDistribution).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Juzs
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {Object.keys(searchStats.matchTypeDistribution).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Match Types
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Search Results ({results.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {results.map((result) => (
                    <Card key={result.id} className="border-blue-100 dark:border-blue-900">
                      <CardContent className="p-4">
                        {/* Result Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {result.surahName} ({result.surah}:{result.ayah})
                            </Badge>
                            <Badge className={`text-xs ${getMatchTypeColor(result.matchType)}`}>
                              {result.matchType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Juz {result.juz}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => playAudio(result.arabicText)}
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleResultExpansion(result.id)}
                            >
                              {expandedResults.has(result.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Arabic Text */}
                        <div className="mb-3">
                          <div 
                            className="text-lg font-arabic text-gray-900 dark:text-white leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                          />
                        </div>

                        {/* Translation */}
                        <div className="mb-3">
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                              {language === 'malay' ? 'Terjemahan:' : 
                               language === 'english' ? 'Translation:' :
                               language === 'indonesian' ? 'Terjemahan:' : 'Translation:'}
                            </span>
                            <div className="mt-1">
                              {result.translation[language]}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedResults.has(result.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            {/* Context */}
                            {result.context && (
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Context:
                                </div>
                                {result.context.previousAyah && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Previous: {result.context.previousAyah}
                                  </div>
                                )}
                                {result.context.nextAyah && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Next: {result.context.nextAyah}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Other Translations */}
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Other Translations:
                              </div>
                              <div className="space-y-2 text-sm">
                                {Object.entries(result.translation)
                                  .filter(([lang]) => lang !== language)
                                  .map(([lang, translation]) => (
                                    <div key={lang} className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">
                                        {lang === 'malay' ? 'Melayu:' :
                                         lang === 'english' ? 'English:' :
                                         lang === 'indonesian' ? 'Indonesia:' : `${lang}:`}
                                      </span> {translation}
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Relevance Score */}
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Relevance: {result.relevanceScore}%
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Page {result.page}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}