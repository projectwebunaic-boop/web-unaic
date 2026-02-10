# 🤖 Chatbot UNAIC - Dokumentasi

## 📋 Deskripsi
Chatbot sederhana menggunakan Gemini API yang terintegrasi dengan website UNAIC. Chatbot ini akan membantu pengunjung website dengan informasi terkait universitas.

## 🚀 Fitur
- ✅ Floating button di kanan bawah
- ✅ Panel chat yang dapat dibuka/tutup
- ✅ Bubble chat (kanan untuk user, kiri untuk bot)
- ✅ Loading indicator saat menunggu response
- ✅ Responsive design untuk mobile
- ✅ Integrasi dengan Gemini AI
- ✅ Prompt khusus untuk informasi UNAIC

## 📁 File yang Dibuat

### 1. Environment Configuration
```
unaic-web/.env.local
```
File konfigurasi untuk API key Gemini.

### 2. API Route
```
unaic-web/src/app/api/chat/route.ts
```
Endpoint API untuk komunikasi dengan Gemini AI.

### 3. Chatbot Component
```
unaic-web/src/components/chatbot/Chatbot.tsx
```
Komponen frontend chatbot dengan UI dan logika.

### 4. Layout Integration
```
unaic-web/src/app/layout.tsx
```
Integrasi chatbot ke seluruh halaman website.

## ⚙️ Konfigurasi

### 1. Setup API Key
1. Buka file `.env.local`
2. Ganti `your_api_key_here` dengan API key Gemini Anda
3. Dapatkan API key di: https://makersuite.google.com/app/apikey

### 2. Prompt Configuration
Prompt sudah dikonfigurasi di `src/app/api/chat/route.ts`:
- Mengarahkan AI untuk hanya menjawab pertanyaan terkait UNAIC
- Jika pertanyaan tidak relevan, mengarahkan ke kontak resmi
- Berisi informasi dasar tentang UNAIC

## 🎨 Styling
- Menggunakan TailwindCSS
- Warna sesuai dengan theme UNAIC (blue-600, unaicGold, unaicNavy)
- Responsive untuk desktop dan mobile
- Animasi smooth untuk UX yang lebih baik

## 🔧 Cara Kerja

### Frontend Flow:
1. User klik tombol chat (pojok kanan bawah)
2. Panel chat terbuka dengan pesan selamat datang
3. User mengetik dan mengirim pesan
4. Pesan dikirim ke API `/api/chat`
5. Response dari Gemini ditampilkan dalam bubble chat

### Backend Flow:
1. API menerima POST request dengan message
2. Validasi API key dan input
3. Mengirim prompt khusus ke Gemini AI
4. Mengembalikan response dalam format JSON

## 📱 Responsive Design
- Desktop: Panel chat 384px width
- Mobile: Full width dengan overlay
- Touch-friendly buttons dan input

## 🔒 Keamanan
- API key disimpan di environment variables
- Input validation di backend
- Error handling untuk network issues
- CORS protection

## 🧪 Testing
Untuk testing chatbot:
1. Pastikan API key sudah dikonfigurasi
2. Jalankan development server: `npm run dev`
3. Buka browser dan klik tombol chat
4. Coba kirim pesan terkait UNAIC

## 📞 Kontak
Jika ada pertanyaan atau masalah:
- Email: info@unaic.ac.id
- Website: https://universitasalirsyad.ac.id

## 🔄 Update Log
- ✅ Package @google/generative-ai terinstall
- ✅ Environment file dibuat
- ✅ API route dibuat
- ✅ Komponen chatbot dibuat
- ✅ Integrasi ke layout selesai

## 🎯 Contoh Percakapan
**User:** "Apa saja program studi di UNAIC?"
**Bot:** "UNAIC memiliki beberapa program studi unggulan..."

**User:** "Bagaimana cara mendaftar?"
**Bot:** "Untuk pendaftaran, silakan kunjungi website PMB di https://pmb.universitasalirsyad.ac.id/"

**User:** "Cuaca hari ini?"
**Bot:** "Maaf, saya hanya bisa membantu dengan informasi terkait UNAIC. Silakan hubungi kontak resmi di info@unaic.ac.id"
