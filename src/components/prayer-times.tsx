'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  MapPin, 
  Calendar,
  Bell,
  BellOff,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wifi,
  Compass
} from 'lucide-react'

interface PrayerTime {
  name: string
  arabicName: string
  time: string
  time24: string
  isNext: boolean
  hasPassed: boolean
  icon: string
  azanTime?: string
  iqamahTime?: string
}

interface Location {
  name: string
  state: string
  zone: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface PrayerMethod {
  id: string
  name: string
  description: string
  source: string
}

const locations: Location[] = [
  { name: 'Kuala Lumpur', state: 'Wilayah Persekutuan', zone: 'WLY01', coordinates: { lat: 3.1390, lng: 101.6869 } },
  { name: 'Johor Bahru', state: 'Johor', zone: 'JHR01', coordinates: { lat: 1.4927, lng: 103.7414 } },
  { name: 'Penang', state: 'Pulau Pinang', zone: 'PNG01', coordinates: { lat: 5.4164, lng: 100.3327 } },
  { name: 'Kota Kinabalu', state: 'Sabah', zone: 'SBH01', coordinates: { lat: 5.9804, lng: 116.0753 } },
  { name: 'Kuching', state: 'Sarawak', zone: 'SWK01', coordinates: { lat: 1.5533, lng: 110.3592 } },
  { name: 'Ipoh', state: 'Perak', zone: 'PRK01', coordinates: { lat: 4.5975, lng: 101.0901 } },
  { name: 'Shah Alam', state: 'Selangor', zone: 'SGR01', coordinates: { lat: 3.0733, lng: 101.5183 } },
  { name: 'Malacca', state: 'Melaka', zone: 'MLK01', coordinates: { lat: 2.2065, lng: 102.2598 } }
]

const prayerMethods: PrayerMethod[] = [
  {
    id: 'jais',
    name: 'JAKIM (e-Solat)',
    description: 'Standard Malaysia oleh Jabatan Kemajuan Islam Malaysia',
    source: 'e-solat.gov.my'
  },
  {
    id: 'jawi',
    name: 'JAWI',
    description: 'Wilayah Persekutuan (Jakim)',
    source: 'jawi.gov.my'
  },
  {
    id: 'mais',
    name: 'MAIS',
    description: 'Selangor (Majlis Agama Islam Selangor)',
    source: 'mais.gov.my'
  },
  {
    id: 'mufti',
    name: 'Mufti Wilayah',
    description: 'Wilayah Persekutuan',
    source: 'muftiwp.gov.my'
  }
]

export default function PrayerTimes() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0])
  const [selectedMethod, setSelectedMethod] = useState<PrayerMethod>(prayerMethods[0])
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState({
    subuh: true,
    zohor: true,
    asar: true,
    maghrib: true,
    isyak: true
  })
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load prayer times
    loadPrayerTimes()
  }, [selectedLocation, selectedMethod])

  useEffect(() => {
    // Auto refresh every 5 minutes
    if (autoRefresh) {
      const refreshTimer = setInterval(() => {
        loadPrayerTimes()
      }, 5 * 60 * 1000)

      return () => clearInterval(refreshTimer)
    }
  }, [autoRefresh, selectedLocation, selectedMethod])

  const loadPrayerTimes = async () => {
    // Simulate API call to e-Solat
    const mockPrayerTimes: PrayerTime[] = [
      {
        name: 'Subuh',
        arabicName: 'الفجر',
        time: '05:42',
        time24: '05:42',
        isNext: false,
        hasPassed: true,
        icon: '🌅',
        azanTime: '05:42',
        iqamahTime: '05:52'
      },
      {
        name: 'Syuruk',
        arabicName: 'الشروق',
        time: '07:08',
        time24: '07:08',
        isNext: false,
        hasPassed: true,
        icon: '🌄'
      },
      {
        name: 'Zohor',
        arabicName: 'الظهر',
        time: '13:15',
        time24: '13:15',
        isNext: true,
        hasPassed: false,
        icon: '☀️',
        azanTime: '13:15',
        iqamahTime: '13:25'
      },
      {
        name: 'Asar',
        arabicName: 'العصر',
        time: '16:48',
        time24: '16:48',
        isNext: false,
        hasPassed: false,
        icon: '🌤️',
        azanTime: '16:48',
        iqamahTime: '16:58'
      },
      {
        name: 'Maghrib',
        arabicName: 'المغرب',
        time: '19:21',
        time24: '19:21',
        isNext: false,
        hasPassed: false,
        icon: '🌇',
        azanTime: '19:21',
        iqamahTime: '19:26'
      },
      {
        name: 'Isyak',
        arabicName: 'العشاء',
        time: '20:36',
        time24: '20:36',
        isNext: false,
        hasPassed: false,
        icon: '🌙',
        azanTime: '20:36',
        iqamahTime: '20:46'
      }
    ]

    setPrayerTimes(mockPrayerTimes)
    setLastUpdated(new Date())
  }

  const getNextPrayer = () => {
    return prayerTimes.find(p => p.isNext)
  }

  const getTimeUntilPrayer = (prayerTime: string) => {
    const now = new Date()
    const [hours, minutes] = prayerTime.split(':').map(Number)
    const prayerDate = new Date()
    prayerDate.setHours(hours, minutes, 0, 0)
    
    if (prayerDate <= now) {
      prayerDate.setDate(prayerDate.getDate() + 1)
    }
    
    const diff = prayerDate.getTime() - now.getTime()
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hoursLeft}j ${minutesLeft}m`
  }

  const toggleNotification = (prayer: string) => {
    setNotifications(prev => ({
      ...prev,
      [prayer]: !prev[prayer as keyof typeof notifications]
    }))
  }

  const formatHijriDate = () => {
    // Mock Hijri date
    return '29 Safar 1446H'
  }

  const getCurrentPrayerProgress = () => {
    const nextPrayer = getNextPrayer()
    if (!nextPrayer) return 0
    
    const now = new Date()
    const [hours, minutes] = nextPrayer.time24.split(':').map(Number)
    const nextPrayerDate = new Date()
    nextPrayerDate.setHours(hours, minutes, 0, 0)
    
    if (nextPrayerDate <= now) {
      nextPrayerDate.setDate(nextPrayerDate.getDate() + 1)
    }
    
    const prevPrayerDate = new Date(nextPrayerDate)
    prevPrayerDate.setHours(prevPrayerDate.getHours() - 6)
    
    const totalDiff = nextPrayerDate.getTime() - prevPrayerDate.getTime()
    const currentDiff = now.getTime() - prevPrayerDate.getTime()
    
    return Math.min(100, Math.max(0, (currentDiff / totalDiff) * 100))
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
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Waktu Solat</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedLocation.name} • {formatHijriDate()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`h-9 w-9 ${autoRefresh ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Location and Method */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLocation.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedLocation.state} • Zon {selectedLocation.zone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
                <Button variant="outline" size="sm">
                  Tukar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedMethod.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedMethod.description}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Prayer */}
        {getNextPrayer() && (
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{getNextPrayer()?.icon}</div>
                <h2 className="text-2xl font-bold mb-1">{getNextPrayer()?.name}</h2>
                <p className="text-lg mb-2 opacity-90">{getNextPrayer()?.arabicName}</p>
                <p className="text-3xl font-bold mb-4">{getNextPrayer()?.time}</p>
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-sm mb-1">Masih ada lagi</p>
                  <p className="text-xl font-semibold">
                    {getTimeUntilPrayer(getNextPrayer()?.time24 || '')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={getCurrentPrayerProgress()} className="h-2 bg-white/20" />
                  <p className="text-xs opacity-75">
                    Dikemaskini: {lastUpdated.toLocaleTimeString('ms-MY')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prayer Times List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Waktu Solat Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prayerTimes.map((prayer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    prayer.isNext
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : prayer.hasPassed
                      ? 'border-gray-200 dark:border-gray-700 opacity-60'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{prayer.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {prayer.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prayer.arabicName}
                      </p>
                      {prayer.azanTime && prayer.iqamahTime && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Azan: {prayer.azanTime}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Iqamah: {prayer.iqamahTime}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {prayer.time}
                    </p>
                    {prayer.isNext && (
                      <Badge className="text-xs bg-emerald-500">
                        Seterusnya
                      </Badge>
                    )}
                    {prayer.hasPassed && (
                      <Badge variant="outline" className="text-xs">
                        Selesai
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-emerald-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Arah Qiblat</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedLocation.coordinates.lat.toFixed(4)}°, {selectedLocation.coordinates.lng.toFixed(4)}°
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-emerald-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Kalendar Hijri</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatHijriDate()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Pemberitahuan Azan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(notifications).map(([prayer, enabled]) => (
                <div key={prayer} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {prayer === 'subuh' ? 'Subuh' : 
                       prayer === 'zohor' ? 'Zohor' :
                       prayer === 'asar' ? 'Asar' :
                       prayer === 'maghrib' ? 'Maghrib' : 'Isyak'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enabled ? 'Dihidupkan' : 'Dimatikan'}
                    </p>
                  </div>
                  <Button
                    variant={enabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleNotification(prayer)}
                  >
                    {enabled ? (
                      <>
                        <Bell className="w-3 h-3 mr-1" />
                        Hidup
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3 h-3 mr-1" />
                        Mati
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Semua Pemberitahuan</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Object.values(notifications).filter(Boolean).length} daripada 5 dihidupkan
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                  {soundEnabled ? 'Bunyi Hidup' : 'Bunyi Mati'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="location" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="location">Lokasi</TabsTrigger>
                <TabsTrigger value="method">Kaedah</TabsTrigger>
                <TabsTrigger value="advanced">Lanjutan</TabsTrigger>
              </TabsList>

              <TabsContent value="location" className="mt-4">
                <ScrollArea className="h-48 custom-scrollbar">
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <div
                        key={location.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedLocation.name === location.name
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {location.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {location.state} • Zon {location.zone}
                            </p>
                          </div>
                          {selectedLocation.name === location.name && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="method" className="mt-4">
                <div className="space-y-3">
                  {prayerMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedMethod.id === method.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {method.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Sumber: {method.source}
                          </p>
                        </div>
                        {selectedMethod.id === method.id && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Auto Refresh</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Kemas kini automatik setiap 5 minit
                      </p>
                    </div>
                    <Button
                      variant={autoRefresh ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                      {autoRefresh ? 'Hidup' : 'Mati'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Adjustment</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tambah tolak masa (+/- minit)
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      +0 minit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Jadual Mingguan</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Papar jadual seminggu
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Lihat
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}