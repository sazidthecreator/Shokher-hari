# শখের হাঁড়ি — Shokher Hadi Cloud Kitchen

উদ্যোক্তা: **নুসরাত জাহান**

## 🚀 Vercel Deployment (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Test locally
npm run dev

# 3. Deploy to Vercel
npx vercel --prod
```

## ⚡ Or drag-and-drop on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Upload this entire folder (or connect GitHub repo)
4. Vercel auto-detects Vite — just click Deploy ✅

## 📁 Project Structure
```
shokher-hadi/
├── public/
│   ├── images/          ← Your 8 real food photos
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Full app (menu, cart, AI, thali builder)
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## ✨ Features
- ✅ Real food photos from your kitchen
- ✅ Bengali typography (Noto Serif Bengali + Hind Siliguri)
- ✅ Frozen Food section with dedicated banner
- ✅ Interactive Custom Thali Builder
- ✅ AI Heritage stories (Anthropic Claude API)
- ✅ AI Food Recommender
- ✅ WhatsApp order integration
- ✅ Cart drawer with order summary
- ✅ Category showcase with real images
- ✅ Family Platter section
- ✅ Mobile-first responsive design
- ✅ Zero-config Vercel deployment

## 📞 WhatsApp Number
Update `WHATSAPP` constant in `src/App.jsx`:
```js
const WHATSAPP = '8801820057581'; // ← change this
```
