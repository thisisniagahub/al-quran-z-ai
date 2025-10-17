# Al-Quran Digital App

Aplikasi Al-Quran mobile-first yang lengkap untuk pasaran Malaysia dan Indonesia dengan semua ciri-ciri advanced yang membantu pengguna sentiasa menggunakan aplikasi ini.

## 🌟 Ciri-Ciri Utama

### 📖 Quran Reader
- **Tulisan Arab Uthmani** yang betul dengan font yang sesuai
- **Multiple translations** (Melayu, Indonesia, English)
- **Transliteration** untuk pembelajaran
- **Audio recitation** dengan pelbagai qari terkenal
- **Bookmark & notes** untuk setiap ayat
- **Tajweed color coding** (opsional)
- **Adjustable font size** dan tema

### 🎙️ Audio Recitation
- **6+ Qari terkenal** (Mishari Rashid Alafasy, Abdul Rahman Al-Sudais, dll)
- **Download manager** untuk offline listening
- **Playback controls** (speed, repeat, volume)
- **Per-verse audio** dan continuous recitation
- **Audio quality settings** (low/medium/high)

### 📱 Quote Sharing (Advanced)
- **Shareable quote generator** dengan designer templates
- **6 template styles** (Modern, Classic, Minimal, Elegant, Nature, Geometric)
- **Multiple platform sizes** (Instagram, Facebook, Twitter, WhatsApp, Telegram)
- **Custom message** addition
- **AI-powered image generation** menggunakan Z-AI SDK
- **Proper attribution** dan compliance

### 🕌 Prayer Times
- **e-Solat integration** untuk Malaysia (JAKIM)
- **Multiple locations** di Malaysia & Indonesia
- **Calculation methods** yang berbeza
- **Azan & Iqamah times**
- **Qibla compass** dan coordinates
- **Hijri calendar** integration
- **Push notifications** untuk setiap waktu solat

### 📚 Hadith Integration
- **myHadith integration** (JAKIM Malaysia)
- **Authentic hadiths** dengan grades (Sahih, Hasan, Daif)
- **Multiple translations** (Melayu, Indonesia, English)
- **Search functionality** by topic, narrator, or reference
- **Takhrij** dan source references

### 🎯 Pembelajaran & Memorization
- **Memorization mode** dengan spaced repetition
- **Progress tracking** dan statistics
- **Daily reading goals**
- **Streaks** dan achievements
- **Tajwid lessons** dan tutorials

## 🛠️ Teknologi

### Frontend
- **Next.js 15** dengan App Router
- **TypeScript 5** untuk type safety
- **Tailwind CSS 4** untuk styling
- **shadcn/ui** components
- **Framer Motion** untuk animations
- **Next-themes** untuk dark mode

### Backend & API
- **Next.js API Routes** untuk backend
- **Z-AI Web Dev SDK** untuk AI features
- **Web search integration** untuk real-time data
- **Socket.io** untuk real-time features

### Compliance & Standards
- **JAKIM compliance** untuk prayer times
- **myHadith integration** untuk authentic hadiths
- **e-Solat Malaysia** sebagai sumber rasmi
- **Content moderation** dan filtering
- **JAIS guidelines** compliance

## 📱 Mobile-First Design

Aplikasi ini direka dengan mobile-first approach:
- **Responsive design** untuk semua screen sizes
- **Touch-friendly** interface
- **Optimized performance** untuk mobile
- **PWA ready** untuk installation
- **Offline support** untuk critical features

## 🌏 Localization

### Bahasa Support
- **Bahasa Melayu** (Malaysia)
- **Bahasa Indonesia** (Indonesia)
- **English** (International)

### Local Features
- **Prayer time zones** Malaysia & Indonesia
- **Local Islamic calendar** dates
- **Cultural sensitivity** dalam design
- **Local content preferences**

## 🔧 Installation & Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd al-quran-digital-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📄 API Documentation

### Quote Generation API
```
POST /api/generate-quote
{
  "verses": [...],
  "template": {...},
  "translations": [...],
  "platform": "instagram"
}
```

### Prayer Times API
```
POST /api/prayer-times
{
  "location": "Kuala Lumpur",
  "zone": "WLY01",
  "method": "jais"
}
```

### Hadith API
```
POST /api/hadith
{
  "query": "niat",
  "language": "malay",
  "book": "bukhari"
}
```

## 🔒 Compliance & Security

### Content Compliance
- **JAKIM approved** content sources
- **myHadith verified** hadiths
- **e-Solat official** prayer times
- **Automated content moderation**
- **Cultural sensitivity** checks

### Data Privacy
- **Minimal data collection**
- **Anonymous usage analytics**
- **Local data storage** options
- **GDPR compliant** data handling

## 🚀 Performance Features

- **Lazy loading** untuk components
- **Optimized images** dan assets
- **Service worker** untuk offline
- **Cached API responses**
- **Progressive loading**

## 📊 Analytics & Tracking

- **Usage statistics** (anonymous)
- **Reading progress** tracking
- **Popular verses** analytics
- **User engagement** metrics
- **Performance monitoring**

## 🎨 UI/UX Features

- **Dark/Light mode** themes
- **Customizable font sizes**
- **Colorblind friendly** design
- **Screen reader** accessible
- **Keyboard navigation** support

## 🔮 Future Enhancements

- **AI-powered tafsir** explanations
- **Community features** dan study groups
- **Live streaming** untuk kuliah
- **Donation integration** dengan masjid
- **Advanced memorization** algorithms

## 📞 Support & Contact

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]
- **Community**: [Discord/Telegram]
- **Email**: support@alquran-digital.app

## 📜 License

This project follows Islamic guidelines and complies with:
- JAKIM Malaysia regulations
- JAIS guidelines
- myHadith terms of use
- e-Solat usage policies

---

**Developed with ❤️ for the Muslim Ummah in Malaysia & Indonesia**