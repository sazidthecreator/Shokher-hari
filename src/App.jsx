import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ShoppingBag, X, Plus, Minus, Search, MessageCircle, UtensilsCrossed,
  CheckCircle2, Sparkles, Loader2, Flame, Leaf, Snowflake, Phone,
  MapPin, ChevronRight, Star, ArrowRight, Info, Heart, Instagram,
  Facebook, Clock, ChefHat, Package, Grid3X3
} from 'lucide-react';

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  mahog:  '#3D1F0A',
  mahogM: '#5C2E0F',
  mahogL: '#7A3D14',
  clay:   '#C4451E',
  clayL:  '#D45B2E',
  gold:   '#C89B3C',
  goldL:  '#E2B85A',
  goldPl: '#F5DFA0',
  cream:  '#FDFAF5',
  parch:  '#F7F1E8',
  sand:   '#E8DECE',
  sandL:  '#F1EAE0',
  mist:   '#8A7060',
  ink:    '#1E0E05',
  white:  '#FFFFFF',
  green:  '#1DB954',
  greenL: '#25D366',
  snow:   '#EAF4FF',
  snowB:  '#C8E0FA',
};

const WHATSAPP = '8801820057581';

// ─── MENU DATA ─────────────────────────────────────────────────────────────────
const MENU = [
  // ── MAINS ──
  {
    id: 'c-roast',
    nameBn: 'শাহী চিকেন রোস্ট',
    nameEn: 'Shahi Chicken Roast',
    descBn: 'বিয়ে বাড়ির স্বাদের চিকেন রোস্ট — বেরেস্তা ছড়ানো, ঘন মশলাদার গ্রেভিতে ডোবানো, অতুলনীয় স্বাদ।',
    price: 180, cat: 'মূল পদ',
    tags: ['জনপ্রিয়'], spice: 'hot', isPopular: true,
    img: '/images/chicken-roast.jpg',
  },
  {
    id: 'polao-chicken',
    nameBn: 'রাজকীয় চিকেন পোলাও প্ল্যাটার',
    nameEn: 'Royal Chicken Polao Platter',
    descBn: 'সুগন্ধি পোলাওর উপর চিকেন রোস্ট, সেদ্ধ ডিম, টিকিয়া ও গ্রেভি। ৪-৫ জনের জন্য পরিপূর্ণ দাওয়াত।',
    price: 1250, cat: 'ফ্যামিলি প্ল্যাটার',
    tags: ['সেরা বিক্রয়', 'প্রি-অর্ডার'], serves: 5, isPopular: true,
    img: '/images/polao-platter-chicken.jpg',
  },
  {
    id: 'polao-beef',
    nameBn: 'রাজকীয় গরুর পোলাও প্ল্যাটার',
    nameEn: 'Royal Beef Polao Platter',
    descBn: 'নরম গরুর মাংস, ছোট ডিম, কাবাব, গাজর ও কাঁচামরিচ দিয়ে সাজানো বিশাল পোলাও। কেন্দ্রে গরুর গ্রেভি।',
    price: 1450, cat: 'ফ্যামিলি প্ল্যাটার',
    tags: ['প্রি-অর্ডার'], serves: 5,
    img: '/images/polao-platter-beef.jpg',
  },

  // ── CUSTOM THALI (special) ──
  {
    id: 'thali-standard',
    nameBn: 'কাস্টম থালি — স্ট্যান্ডার্ড',
    nameEn: 'Custom Thali — Standard',
    descBn: 'ভাত বা পোলাও + যেকোনো ২টি পদ (ভুনা/ভর্তা/সবজি/ডিম)। সম্পূর্ণ আপনার পছন্দমতো।',
    price: 280, cat: 'কাস্টম থালি',
    tags: ['কাস্টমাইজ'],
    img: '/images/thali-platter.jpg',
    isThali: true,
  },
  {
    id: 'thali-premium',
    nameBn: 'কাস্টম থালি — প্রিমিয়াম',
    nameEn: 'Custom Thali — Premium',
    descBn: 'ভাত বা পোলাও + যেকোনো ৩টি পদ + একটি প্রোটিন (মাংস/মাছ)। পরিপূর্ণ বাড়ির খাবার।',
    price: 420, cat: 'কাস্টম থালি',
    tags: ['কাস্টমাইজ', 'জনপ্রিয়'], isPopular: true,
    img: '/images/thali-platter.jpg',
    isThali: true,
  },

  // ── SNACKS ──
  {
    id: 'pitha-spread',
    nameBn: 'পিঠা স্পেশাল প্যাক',
    nameEn: 'Pitha Special Pack',
    descBn: 'পাটিসাপটা, পুয়া পিঠা, সুন্দর পিনহুইল রোল — একসাথে বাংলার ঐতিহ্যবাহী পিঠার উৎসব।',
    price: 350, cat: 'পিঠা ও স্ন্যাকস',
    tags: ['মৌসুমী', 'ঐতিহ্যবাহী'],
    img: '/images/pitha-spread.jpg',
  },

  // ── FROZEN FOOD ──
  {
    id: 'frz-singara',
    nameBn: 'ফ্রোজেন খাম সিঙ্গারা',
    nameEn: 'Frozen Khaam Singara',
    descBn: 'হাতে তৈরি ইউনিক পয়েন্টেড সিঙ্গারা — ভেতরে মজাদার পুর। বাড়িতে ভেজে গরম পরিবেশন করুন। (১০ পিস)',
    price: 150, cat: 'ফ্রোজেন ফুড',
    tags: ['ফ্রোজেন', 'হাতে তৈরি'], isFrozen: true,
    img: '/images/frozen-singara.jpg',
  },
  {
    id: 'frz-dumpling',
    nameBn: 'ফ্রোজেন কিমা ডাম্পলিং',
    nameEn: 'Frozen Keema Dumpling',
    descBn: 'প্লিটেড ডিজাইনে সুন্দরভাবে তৈরি কিমা ডাম্পলিং। ভাপে বা তেলে রান্না করুন। (১২ পিস)',
    price: 200, cat: 'ফ্রোজেন ফুড',
    tags: ['ফ্রোজেন', 'হাতে তৈরি'], isFrozen: true, isPopular: true,
    img: '/images/frozen-dumplings.jpg',
  },
  {
    id: 'frz-cutlet',
    nameBn: 'ফ্রোজেন ক্রাম্বড কাটলেট',
    nameEn: 'Frozen Crumbed Cutlets',
    descBn: 'গোল্ডেন ব্রেডক্রাম্ব কোটেড গোল কাটলেট। শুধু তেলে ভেজে নিন — মুচমুচে হয়ে যাবে। (৮ পিস)',
    price: 180, cat: 'ফ্রোজেন ফুড',
    tags: ['ফ্রোজেন', 'রেডি টু কুক'], isFrozen: true,
    img: '/images/frozen-cutlets.jpg',
  },
];

const CATS = ['সব', 'মূল পদ', 'ফ্যামিলি প্ল্যাটার', 'কাস্টম থালি', 'পিঠা ও স্ন্যাকস', 'ফ্রোজেন ফুড'];

// Category icon map
const CAT_META = {
  'সব':              { icon: Grid3X3,   color: C.mahog,  bg: C.sandL },
  'মূল পদ':          { icon: UtensilsCrossed, color: C.clay, bg: '#FFF0EB' },
  'ফ্যামিলি প্ল্যাটার': { icon: Heart,      color: C.gold,  bg: '#FFF8E8' },
  'কাস্টম থালি':     { icon: ChefHat,   color: '#7C3AED', bg: '#F3EEFF' },
  'পিঠা ও স্ন্যাকস': { icon: Star,       color: '#D97706', bg: '#FFFBEB' },
  'ফ্রোজেন ফুড':     { icon: Snowflake,  color: '#2563EB', bg: '#EFF6FF' },
};

// ─── THALI BUILDER DATA ────────────────────────────────────────────────────────
const THALI_BASE = [
  { id: 'tb-rice',  nameBn: 'সাদা ভাত',  price: 0 },
  { id: 'tb-polao', nameBn: 'পোলাও',     price: 40 },
];
const THALI_ITEMS = [
  { id: 'ti-beef',   nameBn: 'গরুর ভুনা',     price: 80, type: 'protein' },
  { id: 'ti-chk',    nameBn: 'চিকেন কারি',    price: 70, type: 'protein' },
  { id: 'ti-fish',   nameBn: 'মাছের ঝোল',     price: 60, type: 'protein' },
  { id: 'ti-egg',    nameBn: 'ডিম ভুনা',      price: 40, type: 'side' },
  { id: 'ti-vorta',  nameBn: 'আলু ভর্তা',     price: 30, type: 'side' },
  { id: 'ti-sabzi',  nameBn: 'মিক্স সবজি',    price: 35, type: 'side' },
  { id: 'ti-dal',    nameBn: 'মুসুর ডাল',     price: 30, type: 'side' },
  { id: 'ti-stkd',   nameBn: 'শোলের ভর্তা',   price: 35, type: 'side' },
];

// ─── DELIVERY ZONES & PAYMENT ─────────────────────────────────────────────────
const DELIVERY_ZONES = [
  { id: 'mirpur',  label: 'মিরপুর',               fee: 40 },
  { id: 'savar',   label: 'সাভার',                fee: 80 },
  { id: 'dhaka',   label: 'ঢাকার যেকোনো এলাকা',   fee: 60 },
  { id: 'pickup',  label: 'পিকআপ / Pickup',        fee: 0  },
];

const DELIVERY_TIMES = [
  'এখনই (ASAP)',
  'দুপুর ১২–২টা',
  'বিকেল ৪–৬টা',
  'সন্ধ্যা ৭–৯টা',
  'আগামীকাল সকাল',
];

const PAYMENT_NUMBER = '01820057581';

const QUICK_TAGS = ['ঝাল কম 🌶️', 'পেঁয়াজ ছাড়া', 'দ্রুত দরকার ⚡', 'কম তেল 🥗'];

const UPSELL_ITEMS = [
  { id: 'ups-doi',   nameBn: 'মিষ্টি দই',  price: 60, img: '/images/mishti-doi.jpg',  emoji: '🍮' },
  { id: 'ups-borh',  nameBn: 'বোরহানি',    price: 50, img: '/images/borhani.jpg',     emoji: '🥛' },
  { id: 'ups-halwa', nameBn: 'হালুয়া',     price: 80, img: '/images/halwa.jpg',       emoji: '🟡' },
];

// ─── WA MESSAGE BUILDER ────────────────────────────────────────────────────────
const buildWAMessage = (order, cart, subtotal, deliveryFee) => {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const rand = String(Math.floor(Math.random() * 900) + 100);
  const orderId = `SHH-${dateStr}-${timeStr}-${rand}`;
  const total = subtotal + deliveryFee;
  const zoneLabel = DELIVERY_ZONES.find(z => z.id === order.zone)?.label || order.zone;
  const payLabels = { cod: 'COD (ক্যাশ অন ডেলিভারি)', bkash: 'bKash', nagad: 'Nagad' };
  const payLabel = payLabels[order.payment] || order.payment;
  const lines = [
    `🍛 *শখের হাঁড়ি — নতুন অর্ডার*`,
    `🆔 অর্ডার ID: ${orderId}`,
    `━━━━━━━━━━━━━━━`,
    `👤 নাম: ${order.name}`,
    `📱 মোবাইল: ${order.phone}`,
    `📍 এলাকা: ${zoneLabel} | ⏰ সময়: ${order.time}`,
    `━━━━━━━━━━━━━━━`,
    `🛒 অর্ডার তালিকা:`,
    ...cart.map(i => `${i.qty}× ${i.nameBn} — ৳${i.price * i.qty}`),
    `━━━━━━━━━━━━━━━`,
    `🧾 সাবটোটাল: ৳${subtotal}`,
    `🚴 ডেলিভারি: ৳${deliveryFee}`,
    `💰 *মোট: ৳${total}*`,
    `━━━━━━━━━━━━━━━`,
    `💳 পেমেন্ট: ${payLabel}`,
  ];
  if (order.payment === 'bkash' || order.payment === 'nagad') {
    lines.push(`📲 পেমেন্ট নম্বর: ${PAYMENT_NUMBER}`);
  }
  if (order.txid) lines.push(`🔖 TxID: ${order.txid}`);
  if (order.address) lines.push(`🏠 ঠিকানা: ${order.address}`);
  if (order.notes) lines.push(`📝 নির্দেশনা: ${order.notes}`);
  lines.push(`━━━━━━━━━━━━━━━`);
  lines.push(`✨ উদ্যোক্তা: নুসরাত জাহান`);
  return lines.join('\n');
};

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GlobalStyle = () => {
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${C.cream}; color: ${C.ink}; font-family: 'Hind Siliguri', sans-serif; -webkit-font-smoothing: antialiased; }
      ::selection { background: ${C.clay}; color: white; }
      .hs::-webkit-scrollbar { display: none; }
      .hs { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      @keyframes float   { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-6px); } }
      @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
      @keyframes slideRight { from { transform:translateX(100%); } to { transform:translateX(0); } }
      @keyframes cartBounce { 0% { transform:scale(1); } 40% { transform:scale(1.18); } 100% { transform:scale(1); } }
      .fade-up { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
      .scale-in { animation: scaleIn 0.4s cubic-bezier(.22,1,.36,1) both; }
      input, textarea, button { font-family: 'Hind Siliguri', sans-serif; }
      img { display: block; }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
};

// ─── PREMIUM IMAGE ─────────────────────────────────────────────────────────────
const Img = ({ src, alt, style, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', background: C.sand, ...style }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(110deg, ${C.sand} 30%, ${C.sandL} 50%, ${C.sand} 70%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s linear infinite',
        }} />
      )}
      <img
        src={err ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' : src}
        alt={alt}
        className={className}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transition: 'opacity 0.5s ease, transform 0.6s ease',
          opacity: loaded ? 1 : 0,
        }}
        onLoad={() => setLoaded(true)}
        onError={() => { setErr(true); setLoaded(true); }}
      />
    </div>
  );
};

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div style={{
    position: 'fixed', top: 76, left: '50%', transform: 'translateX(-50%)',
    zIndex: 9999, pointerEvents: 'none',
    transition: 'all 0.35s cubic-bezier(.34,1.5,.64,1)',
    opacity: msg ? 1 : 0,
    transform: msg ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-12px)',
  }}>
    <div style={{
      background: C.mahog, color: C.cream,
      padding: '11px 20px', borderRadius: 50,
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 14, fontWeight: 600,
      boxShadow: '0 12px 32px rgba(61,31,10,0.28)',
      border: `1px solid ${C.mahogL}`,
      whiteSpace: 'nowrap',
    }}>
      <CheckCircle2 size={15} color={C.greenL} />
      {msg}
    </div>
  </div>
);

// ─── CATEGORY PILL ─────────────────────────────────────────────────────────────
const CatPill = ({ cat, active, onClick }) => {
  const m = CAT_META[cat] || { icon: Grid3X3, color: C.mahog, bg: C.sandL };
  const Icon = m.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 18px', borderRadius: 50,
        border: `1.5px solid ${active ? m.color : C.sand}`,
        background: active ? m.color : C.white,
        color: active ? C.white : C.mahog,
        fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
        transform: active ? 'scale(1.04)' : 'scale(1)',
        boxShadow: active ? `0 4px 16px ${m.color}38` : 'none',
      }}
    >
      <Icon size={14} />
      {cat}
    </button>
  );
};

// ─── MENU CARD ─────────────────────────────────────────────────────────────────
const Card = ({ item, onAdd, onHeritage, favorites = [], onToggleFav }) => {
  const [hov, setHov] = useState(false);
  const isFrozen = item.isFrozen;
  const isThali = item.isThali;
  const isFav = favorites.includes(item.id);

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, borderRadius: 20, overflow: 'hidden',
        border: `1.5px solid ${hov ? C.clay + '55' : C.sand}`,
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.38s cubic-bezier(.22,1,.36,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov
          ? `0 24px 48px rgba(61,31,10,0.14), 0 6px 16px rgba(196,69,30,0.08)`
          : `0 1px 6px rgba(61,31,10,0.06)`,
      }}
    >
      {/* Image */}
      <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to top, rgba(30,14,5,0.72) 0%, rgba(30,14,5,0.08) 55%, transparent 100%)',
          transition: 'opacity 0.35s',
          opacity: hov ? 0.55 : 0.75,
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          transform: hov ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.65s cubic-bezier(.22,1,.36,1)',
        }}>
          <Img src={item.img} alt={item.nameBn} />
        </div>

        {/* Badges top-left */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {isFrozen && (
            <span style={{
              background: '#2563EB', color: 'white',
              fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Snowflake size={10} /> ফ্রোজেন</span>
          )}
          {isThali && (
            <span style={{
              background: '#7C3AED', color: 'white',
              fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 4,
            }}><ChefHat size={10} /> কাস্টমাইজ</span>
          )}
          {item.isPopular && !isFrozen && !isThali && (
            <span style={{
              background: C.clay, color: 'white',
              fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
            }}>★ জনপ্রিয়</span>
          )}
          {item.tags?.[0] && !isFrozen && !isThali && !item.isPopular && (
            <span style={{
              background: 'rgba(253,250,245,0.88)', color: C.mahog,
              fontSize: 10, fontWeight: 600, padding: '4px 9px', borderRadius: 20,
              backdropFilter: 'blur(6px)',
            }}>{item.tags[0]}</span>
          )}
        </div>

        {/* Heart — top-right */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(item.id); }}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 3,
            background: 'rgba(253,250,245,0.88)', backdropFilter: 'blur(6px)',
            border: 'none', borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.2s',
          }}
        >
          <Heart
            size={16}
            color={isFav ? '#DC2626' : C.mist}
            fill={isFav ? '#DC2626' : 'none'}
          />
        </button>

        {/* Price bottom-right */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12, zIndex: 3,
          background: 'rgba(253,250,245,0.95)', backdropFilter: 'blur(8px)',
          padding: '5px 12px', borderRadius: 30,
          color: C.clay, fontWeight: 700, fontSize: 17,
          fontFamily: "'Noto Serif Bengali', serif",
          boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
        }}>৳{item.price}</div>

        {/* Serves bottom-left */}
        {item.serves && (
          <div style={{
            position: 'absolute', bottom: 12, left: 12, zIndex: 3,
            background: 'rgba(61,31,10,0.82)', backdropFilter: 'blur(6px)',
            padding: '4px 10px', borderRadius: 20,
            color: C.goldL, fontSize: 10, fontWeight: 600,
          }}>👥 {item.serves} জন</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: "'Noto Serif Bengali', serif",
          fontWeight: 700, fontSize: 17, color: hov ? C.clay : C.mahog,
          lineHeight: 1.4, marginBottom: 6, transition: 'color 0.25s',
        }}>{item.nameBn}</h3>

        <p style={{
          color: C.mist, fontSize: 13, lineHeight: 1.75,
          marginBottom: 14, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.descBn}</p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          {item.spice === 'hot' && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#DC2626',
              background: '#FEF2F2', padding: '3px 9px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 3,
            }}><Flame size={11} /> ঝাল</span>
          )}
          {isFrozen && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', background: '#EFF6FF', padding: '3px 9px', borderRadius: 20 }}>
              🧊 রেডি টু কুক
            </span>
          )}
          <button
            onClick={() => onHeritage(item)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, color: C.clay,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 0',
            }}
          ><Sparkles size={12} /> ঐতিহ্য জানুন</button>
        </div>

        <button
          onClick={() => onAdd(item)}
          style={{
            width: '100%', padding: '12px 0',
            borderRadius: 12, border: `2px solid ${C.clay}`,
            background: hov ? C.clay : 'transparent',
            color: hov ? 'white' : C.clay,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            transition: 'all 0.28s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: hov ? `0 6px 18px ${C.clay}35` : 'none',
          }}
        >
          <Plus size={15} style={{ transition: 'transform 0.28s', transform: hov ? 'rotate(90deg)' : 'none' }} />
          {isThali ? 'থালি কাস্টমাইজ করুন' : 'হাঁড়িতে যোগ করুন'}
        </button>
      </div>
    </article>
  );
};

// ─── THALI BUILDER MODAL ──────────────────────────────────────────────────────
const ThaliBuilder = ({ item, onClose, onAdd }) => {
  const [base, setBase] = useState('tb-rice');
  const [selected, setSelected] = useState(new Set());

  const isPremium = item?.id === 'thali-premium';
  const maxItems = isPremium ? 4 : 3; // base + 2 sides, or base + 3 items (1 protein + 2 sides)
  const maxProteins = isPremium ? 1 : 0;

  const toggleItem = (id) => {
    const it = THALI_ITEMS.find(x => x.id === id);
    setSelected(prev => {
      const ns = new Set(prev);
      if (ns.has(id)) { ns.delete(id); return ns; }
      const proteins = [...ns].filter(x => THALI_ITEMS.find(t => t.id === x)?.type === 'protein').length;
      if (it.type === 'protein' && proteins >= maxProteins && maxProteins === 0) return prev;
      if (it.type === 'protein' && proteins >= 1) return prev;
      if (ns.size >= maxItems - (maxProteins > 0 && proteins === 0 ? 0 : 0)) {
        // allow up to maxItems
        if (ns.size >= (isPremium ? 3 : 2)) return prev;
      }
      ns.add(id);
      return ns;
    });
  };

  const basePrice = THALI_BASE.find(b => b.id === base)?.price || 0;
  const extraPrice = [...selected].reduce((s, id) => s + (THALI_ITEMS.find(x => x.id === id)?.price || 0), 0);
  const total = item?.price + basePrice + extraPrice;

  const handleAdd = () => {
    const selItems = [...selected].map(id => THALI_ITEMS.find(x => x.id === id)?.nameBn).join(', ');
    const baseName = THALI_BASE.find(b => b.id === base)?.nameBn;
    const custom = { ...item, nameBn: `${item.nameBn} (${baseName}, ${selItems})`, price: total };
    onAdd(custom); onClose();
  };

  if (!item) return null;

  const sideItems = THALI_ITEMS.filter(x => x.type === 'side');
  const proteinItems = THALI_ITEMS.filter(x => x.type === 'protein');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(30,14,5,0.65)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480,
        background: C.cream, borderRadius: '24px 24px 0 0',
        maxHeight: '88vh', overflowY: 'auto',
        animation: 'fadeUp 0.4s cubic-bezier(.22,1,.36,1)',
        boxShadow: '0 -20px 60px rgba(30,14,5,0.2)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: C.sand }} />
        </div>

        {/* Header image */}
        <div style={{ height: 160, position: 'relative', margin: '12px 20px', borderRadius: 16, overflow: 'hidden' }}>
          <Img src={item.img} alt={item.nameBn} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,14,5,0.7), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 18, fontWeight: 700, color: 'white' }}>{item.nameBn}</h2>
            <p style={{ color: C.goldL, fontSize: 13, marginTop: 2 }}>আপনার পছন্দমতো সাজিয়ে নিন</p>
          </div>
        </div>

        <div style={{ padding: '0 20px 100px' }}>
          {/* Base selection */}
          <h4 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, fontWeight: 700, color: C.mahog, marginBottom: 10 }}>
            ভিত্তি বেছে নিন
          </h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {THALI_BASE.map(b => (
              <button key={b.id} onClick={() => setBase(b.id)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                border: `2px solid ${base === b.id ? C.clay : C.sand}`,
                background: base === b.id ? C.clay + '18' : C.white,
                color: base === b.id ? C.clay : C.mist,
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>
                {b.nameBn} {b.price > 0 && <span style={{ fontSize: 11 }}>(+৳{b.price})</span>}
              </button>
            ))}
          </div>

          {/* Protein (premium only) */}
          {isPremium && (
            <>
              <h4 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, fontWeight: 700, color: C.mahog, marginBottom: 10 }}>
                প্রোটিন বেছে নিন (১টি)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {proteinItems.map(it => {
                  const sel = selected.has(it.id);
                  return (
                    <button key={it.id} onClick={() => toggleItem(it.id)} style={{
                      padding: '10px 12px', borderRadius: 10,
                      border: `2px solid ${sel ? '#7C3AED' : C.sand}`,
                      background: sel ? '#F3EEFF' : C.white,
                      color: sel ? '#7C3AED' : C.mahog,
                      fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span>{it.nameBn}</span>
                      <span style={{ fontSize: 11, color: C.mist }}>+৳{it.price}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Sides */}
          <h4 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, fontWeight: 700, color: C.mahog, marginBottom: 10 }}>
            পদ বেছে নিন ({isPremium ? '২টি' : '২টি'})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {sideItems.map(it => {
              const sel = selected.has(it.id);
              return (
                <button key={it.id} onClick={() => toggleItem(it.id)} style={{
                  padding: '10px 12px', borderRadius: 10,
                  border: `2px solid ${sel ? C.clay : C.sand}`,
                  background: sel ? C.clay + '12' : C.white,
                  color: sel ? C.clay : C.mahog,
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{it.nameBn}</span>
                  <span style={{ fontSize: 11, color: C.mist }}>+৳{it.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: C.white, borderTop: `1px solid ${C.sand}`,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, color: C.mist }}>সর্বমোট</div>
            <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 24, fontWeight: 900, color: C.clay }}>৳{total}</div>
          </div>
          <button
            onClick={handleAdd}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, ${C.clay}, ${C.mahogM})`,
              color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: `0 6px 20px ${C.clay}35`,
            }}
          ><Plus size={16} /> থালি হাঁড়িতে দিন</button>
        </div>
      </div>
    </div>
  );
};

// ─── HERITAGE MODAL ────────────────────────────────────────────────────────────
const HeritageModal = ({ item, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) return;
    setText(''); setLoading(true);
    (async () => {
      try {
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', max_tokens: 1000,
            system: `তুমি শখের হাঁড়ির একজন রন্ধন-ঐতিহ্য বিশেষজ্ঞ। ২-৩টি সংক্ষিপ্ত কাব্যিক বাংলা বাক্যে এই খাবারের সাংস্কৃতিক ঐতিহ্য, স্বাদ ও নস্টালজিয়া বর্ণনা করো। উদ্যোক্তা: নুসরাত জাহান। কোনো মার্কডাউন নয়।`,
            messages: [{ role: 'user', content: `এই খাবারের ঐতিহ্য বলো: ${item.nameBn} — ${item.descBn}` }],
          }),
        });
        const d = await r.json();
        setText(d.content?.[0]?.text || 'বাংলার মাটির স্বাদ, প্রজন্মের ভালোবাসা এই খাবারে মিশে আছে।');
      } catch { setText('ঘরের উঠোনের গন্ধ মাখা, মায়ের হাতের ছোঁয়ায় তৈরি — এই স্বাদ শুধু শখের হাঁড়িতেই পাওয়া যায়।'); }
      finally { setLoading(false); }
    })();
  }, [item]);

  if (!item) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(30,14,5,0.65)', backdropFilter: 'blur(5px)' }} />
      <div className="scale-in" style={{
        position: 'relative', width: '100%', maxWidth: 380,
        background: C.cream, borderRadius: 24,
        overflow: 'hidden', boxShadow: '0 32px 72px rgba(30,14,5,0.28)',
      }}>
        <div style={{ height: 170, position: 'relative' }}>
          <Img src={item.img} alt={item.nameBn} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.cream} 0%, transparent 60%)` }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(253,250,245,0.9)', border: 'none',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: C.mahog,
          }}><X size={17} /></button>
        </div>

        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, background: C.white, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '-24px auto 14px', boxShadow: '0 4px 14px rgba(61,31,10,0.13)',
            border: `3px solid ${C.cream}`,
          }}><Sparkles size={22} color={C.clay} /></div>

          <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 18, fontWeight: 700, color: C.mahog, marginBottom: 4 }}>{item.nameBn}</h3>
          <p style={{ fontSize: 10, color: C.clay, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
            AI Culinary Insight ✦
          </p>

          <div style={{
            background: C.parch, border: `1px solid ${C.sand}`,
            borderRadius: 14, padding: '18px 20px', minHeight: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: C.mist }}>
                <Loader2 size={24} color={C.clay} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: 13, animation: 'pulse 1.5s infinite' }}>ঐতিহ্য খুঁজে বের করা হচ্ছে...</p>
              </div>
            ) : (
              <p style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 14, color: C.mahog, lineHeight: 1.85, fontStyle: 'italic' }}>
                "{text}"
              </p>
            )}
          </div>

          <button onClick={() => { onAdd(item); onClose(); }} style={{
            width: '100%', padding: '13px 0', background: `linear-gradient(135deg, ${C.mahog}, ${C.mahogL})`,
            color: C.cream, border: 'none', borderRadius: 12,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: `0 6px 20px ${C.mahog}35`,
          }}>
            <Plus size={16} /> হাঁড়িতে যোগ করুন (৳{item.price})
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CART DRAWER ───────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, open, onClose, onUpdate, onCheckout, onAddToCart }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('');
  const [zone, setZone] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [txid, setTxid] = useState('');
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = zone ? (DELIVERY_ZONES.find(z => z.id === zone)?.fee ?? 0) : 0;
  const total = subtotal + (zone ? deliveryFee : 0);
  const isPickup = zone === 'pickup';
  const showPayNum = payment === 'bkash' || payment === 'nagad';

  const copyPayNum = () => {
    navigator.clipboard?.writeText(PAYMENT_NUMBER).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const appendTag = (tag) => setNotes(prev => prev ? `${prev} ${tag}` : tag);

  const handleSubmit = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'নাম দিন';
    if (!/^01\d{9}$/.test(phone.trim())) errs.phone = 'সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)';
    if (!payment) errs.payment = 'পেমেন্ট পদ্ধতি বেছে নিন';
    if (!zone) errs.zone = 'ডেলিভারি এলাকা বেছে নিন';
    if (!time) errs.time = 'ডেলিভারি সময় বেছে নিন';
    if (!isPickup && !address.trim()) errs.address = 'ঠিকানা দিন';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onCheckout({
      name: name.trim(), phone: phone.trim(), payment, zone, time,
      address: isPickup ? '' : address.trim(),
      notes: notes.trim(), txid: txid.trim(),
    });
  };

  const inpStyle = (hasErr) => ({
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${hasErr ? '#DC2626' : C.sand}`, borderRadius: 11,
    fontSize: 14, color: C.mahog, background: C.cream, outline: 'none',
    transition: 'border-color 0.2s', fontFamily: "'Hind Siliguri', sans-serif",
  });

  const errText = (key) => errors[key] ? (
    <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{errors[key]}</p>
  ) : null;

  const pillStyle = (active, color) => ({
    padding: '9px 15px', borderRadius: 30,
    border: `1.5px solid ${active ? color : C.sand}`,
    background: active ? color + '18' : C.white,
    color: active ? color : C.mahog,
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
    boxShadow: active ? `0 2px 10px ${color}28` : 'none',
    fontFamily: "'Hind Siliguri', sans-serif",
  });

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 7000,
        background: 'rgba(30,14,5,0.52)', backdropFilter: 'blur(4px)',
        transition: 'opacity 0.3s', opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 7100,
        width: '100%', maxWidth: 430, background: C.cream,
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.42s cubic-bezier(.22,1,.36,1)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        boxShadow: '-16px 0 50px rgba(30,14,5,0.14)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: `1px solid ${C.sand}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(253,250,245,0.9)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ShoppingBag size={21} color={C.clay} />
            <span style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 19, fontWeight: 700, color: C.mahog }}>আপনার হাঁড়ি</span>
            {totalItems > 0 && (
              <span style={{
                background: C.clay, color: 'white', borderRadius: '50%',
                width: 22, height: 22, fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{totalItems}</span>
            )}
          </div>
          <button onClick={onClose} style={{
            background: C.parch, border: 'none', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mahog,
          }}><X size={17} /></button>
        </div>

        {/* Body */}
        <div className="hs" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {cart.length === 0 ? (
            <div style={{ height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.65 }}>
              <div style={{ width: 80, height: 80, background: C.parch, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <UtensilsCrossed size={38} color={C.clay} />
              </div>
              <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 19, color: C.mahog, marginBottom: 6 }}>হাঁড়ি একদম ফাঁকা!</h3>
              <p style={{ color: C.mist, textAlign: 'center', maxWidth: 200, lineHeight: 1.7, fontSize: 14 }}>
                মজাদার খাবার দিয়ে হাঁড়ি পূর্ণ করুন।
              </p>
            </div>
          ) : (
            <div>
              {/* Cart items */}
              {cart.map(item => (
                <div key={item.id + item.nameBn} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: C.white, borderRadius: 14, border: `1px solid ${C.sand}`,
                  padding: '10px 12px', marginBottom: 10,
                }}>
                  <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <Img src={item.img} alt={item.nameBn} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontFamily: "'Noto Serif Bengali', serif",
                      fontSize: 13, fontWeight: 700, color: C.mahog,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      marginBottom: 3,
                    }}>{item.nameBn}</h4>
                    <span style={{ color: C.clay, fontWeight: 700, fontSize: 14 }}>৳{item.price}</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: C.parch, borderRadius: 10, padding: '5px 7px',
                    border: `1px solid ${C.sand}`,
                  }}>
                    <button onClick={() => onUpdate(item.id, item.nameBn, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: C.white, cursor: 'pointer', color: C.mist, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={13} /></button>
                    <span style={{ fontWeight: 700, fontSize: 13, minWidth: 18, textAlign: 'center', color: C.mahog }}>{item.qty}</span>
                    <button onClick={() => onUpdate(item.id, item.nameBn, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: C.clay, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={13} /></button>
                  </div>
                </div>
              ))}

              {/* Upsell strip */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.mahog, marginBottom: 10 }}>সাথে যোগ করুন 🍮</p>
                <div className="hs" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
                  {UPSELL_ITEMS.map(u => (
                    <div key={u.id} style={{
                      flexShrink: 0, background: C.white, borderRadius: 14,
                      border: `1px solid ${C.sand}`, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 10, minWidth: 160,
                    }}>
                      <div style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <Img src={u.img} alt={u.nameBn} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 13, fontWeight: 700, color: C.mahog }}>{u.nameBn}</div>
                        <div style={{ color: C.clay, fontWeight: 700, fontSize: 12 }}>৳{u.price}</div>
                      </div>
                      <button
                        onClick={() => onAddToCart && onAddToCart(u)}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', border: 'none',
                          background: C.clay, color: 'white', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      ><Plus size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div style={{ background: C.parch, borderRadius: 12, padding: '12px 16px', marginBottom: 18, border: `1px solid ${C.sand}` }}>
                {cart.map(i => (
                  <div key={i.id + i.nameBn} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.mist, marginBottom: 4 }}>
                    <span>{i.qty}× {i.nameBn.split('(')[0].trim()}</span>
                    <span>৳{i.price * i.qty}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: C.sand, margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.mahog, marginBottom: 4 }}>
                  <span>সাবটোটাল</span><span>৳{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.mist }}>
                  <span>ডেলিভারি</span>
                  <span>{zone ? (deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`) : '—'}</span>
                </div>
                {zone && (
                  <>
                    <div style={{ height: 1, background: C.sand, margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                      <span style={{ fontFamily: "'Noto Serif Bengali', serif", color: C.clay }}>সর্বমোট</span>
                      <span style={{ fontFamily: "'Noto Serif Bengali', serif", color: C.clay }}>৳{total}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Checkout Form */}
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sand}`, padding: '18px', marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, color: C.mahog, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Info size={15} color={C.clay} /> ডেলিভারি তথ্য
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 6 }}>নাম *</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="আপনার পুরো নাম"
                      style={inpStyle(errors.name)}
                      onFocus={e => e.target.style.borderColor = C.clay}
                      onBlur={e => { e.target.style.borderColor = errors.name ? '#DC2626' : C.sand; }}
                    />
                    {errText('name')}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 6 }}>মোবাইল নম্বর *</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      style={inpStyle(errors.phone)}
                      onFocus={e => e.target.style.borderColor = C.clay}
                      onBlur={e => { e.target.style.borderColor = errors.phone ? '#DC2626' : C.sand; }}
                    />
                    {errText('phone')}
                  </div>

                  {/* Payment */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 8 }}>পেমেন্ট পদ্ধতি *</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[
                        { id: 'cod',   label: 'COD 💵',   color: C.clay    },
                        { id: 'bkash', label: 'bKash 🔵', color: '#E2136E' },
                        { id: 'nagad', label: 'Nagad 🟠', color: '#F7941D' },
                      ].map(m => (
                        <button key={m.id} onClick={() => setPayment(m.id)} style={pillStyle(payment === m.id, m.color)}>{m.label}</button>
                      ))}
                    </div>
                    {errText('payment')}
                    {showPayNum && (
                      <div style={{
                        marginTop: 10, background: C.parch, border: `1px solid ${C.sand}`,
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                      }}>
                        <div>
                          <p style={{ fontSize: 11, color: C.mist, marginBottom: 2 }}>পরিশোধ করুন:</p>
                          <p style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 14, fontWeight: 700, color: C.mahog }}>
                            {PAYMENT_NUMBER} <span style={{ fontWeight: 400, fontSize: 12, color: C.mist }}>(Personal)</span>
                          </p>
                        </div>
                        <button onClick={copyPayNum} style={{
                          padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.sand}`,
                          background: copied ? C.green + '18' : C.white,
                          color: copied ? C.green : C.mahog,
                          fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                          fontFamily: "'Hind Siliguri', sans-serif", flexShrink: 0,
                        }}>{copied ? '✓ কপি' : 'কপি'}</button>
                      </div>
                    )}
                    {showPayNum && (
                      <input
                        value={txid} onChange={e => setTxid(e.target.value)}
                        placeholder="ট্রানজেকশন ID (ঐচ্ছিক)"
                        style={{ ...inpStyle(false), marginTop: 10 }}
                      />
                    )}
                  </div>

                  {/* Zone */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 8 }}>ডেলিভারি এলাকা *</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {DELIVERY_ZONES.map(z => (
                        <button key={z.id} onClick={() => setZone(z.id)} style={pillStyle(zone === z.id, C.clay)}>
                          {z.label}{z.fee === 0 ? ' (ফ্রি)' : ` (৳${z.fee})`}
                        </button>
                      ))}
                    </div>
                    {errText('zone')}
                  </div>

                  {/* Time */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 8 }}>ডেলিভারি সময় *</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {DELIVERY_TIMES.map(t => (
                        <button key={t} onClick={() => setTime(t)} style={pillStyle(time === t, C.clay)}>{t}</button>
                      ))}
                    </div>
                    {errText('time')}
                  </div>

                  {/* Address */}
                  <div style={{ opacity: isPickup ? 0.4 : 1, transition: 'opacity 0.25s' }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 6 }}>
                      ডেলিভারি ঠিকানা {!isPickup && '*'}
                    </label>
                    <textarea
                      value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="বাড়ি নং, রাস্তা, এলাকা..." rows={3} disabled={isPickup}
                      style={{ ...inpStyle(errors.address), resize: 'none' }}
                      onFocus={e => e.target.style.borderColor = C.clay}
                      onBlur={e => { e.target.style.borderColor = errors.address ? '#DC2626' : C.sand; }}
                    />
                    {errText('address')}
                  </div>

                  {/* Notes + Quick tags */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.mahog, display: 'block', marginBottom: 6 }}>বিশেষ নির্দেশনা</label>
                    <input
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="যেমন: ঝাল কম, পেঁয়াজ ছাড়া..."
                      style={inpStyle(false)}
                    />
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 8 }}>
                      {QUICK_TAGS.map(tag => (
                        <button key={tag} onClick={() => appendTag(tag)} style={{
                          padding: '5px 12px', borderRadius: 20,
                          border: `1px solid ${C.sand}`, background: C.parch,
                          color: C.mahog, fontSize: 12, cursor: 'pointer',
                          fontFamily: "'Hind Siliguri', sans-serif", transition: 'background 0.15s',
                        }}>{tag}</button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '16px 22px', background: C.white,
            borderTop: `1px solid ${C.sand}`,
            boxShadow: '0 -8px 24px rgba(30,14,5,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ color: C.mist, fontWeight: 600, fontSize: 13 }}>{zone ? 'সর্বমোট বিল' : 'সাবটোটাল'}</span>
              <span style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 28, fontWeight: 900, color: C.clay }}>৳{zone ? total : subtotal}</span>
            </div>
            <button
              onClick={handleSubmit}
              style={{
                width: '100%', padding: '15px 0',
                background: `linear-gradient(135deg, ${C.greenL}, ${C.green})`,
                color: 'white', border: 'none', borderRadius: 14,
                fontWeight: 700, fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                boxShadow: '0 6px 22px rgba(29,185,84,0.28)',
                transition: 'all 0.25s',
              }}
            >
              <MessageCircle size={19} /> হোয়াটসঅ্যাপে অর্ডার করুন
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: C.mist, marginTop: 8 }}>
              উদ্যোক্তা: নুসরাত জাহান · {WHATSAPP}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// ─── CONFIRM ORDER MODAL ───────────────────────────────────────────────────────
const ConfirmOrderModal = ({ order, cart, onClose, onConfirm }) => {
  const zoneInfo = DELIVERY_ZONES.find(z => z.id === order.zone);
  const deliveryFee = zoneInfo?.fee ?? 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + deliveryFee;
  const zoneLabel = zoneInfo?.label || order.zone;
  const payLabels = { cod: 'COD 💵', bkash: 'bKash 🔵', nagad: 'Nagad 🟠' };
  const payLabel = payLabels[order.payment] || order.payment;

  const infoRows = [
    ['👤 নাম', order.name],
    ['📱 মোবাইল', order.phone],
    ['📍 এলাকা', zoneLabel],
    ['⏰ সময়', order.time],
    ['💳 পেমেন্ট', payLabel],
    order.address ? ['🏠 ঠিকানা', order.address] : null,
  ].filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(30,14,5,0.65)', backdropFilter: 'blur(5px)' }} />
      <div className="scale-in" style={{
        position: 'relative', width: '100%', maxWidth: 420,
        background: C.cream, borderRadius: 24,
        boxShadow: '0 32px 72px rgba(30,14,5,0.28)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 24px 16px', borderBottom: `1px solid ${C.sand}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 19, fontWeight: 700, color: C.mahog }}>
            অর্ডার নিশ্চিত করুন ✦
          </h2>
          <button onClick={onClose} style={{
            background: C.parch, border: 'none', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mahog,
          }}><X size={17} /></button>
        </div>

        <div style={{ padding: '18px 24px 24px' }}>
          {/* Items list */}
          <div style={{ marginBottom: 14 }}>
            {cart.map(i => (
              <div key={i.id + i.nameBn} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.mahog, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{i.qty}× {i.nameBn.split('(')[0].trim()}</span>
                <span style={{ color: C.clay, fontWeight: 700 }}>৳{i.price * i.qty}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div style={{ height: 1, background: C.sand, marginBottom: 10 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.mist, marginBottom: 4 }}>
            <span>সাবটোটাল</span><span>৳{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.mist, marginBottom: 10 }}>
            <span>ডেলিভারি</span><span>{deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
            <span style={{ fontFamily: "'Noto Serif Bengali', serif", color: C.clay }}>মোট</span>
            <span style={{ fontFamily: "'Noto Serif Bengali', serif", color: C.clay }}>৳{total}</span>
          </div>

          {/* Customer info */}
          <div style={{ height: 1, background: C.sand, margin: '14px 0' }} />
          <div style={{
            background: C.parch, border: `1px solid ${C.sand}`,
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20,
          }}>
            {infoRows.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                <span style={{ color: C.mist, flexShrink: 0 }}>{label}:</span>
                <span style={{ color: C.mahog, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={onConfirm}
              style={{
                width: '100%', padding: '15px 0',
                background: `linear-gradient(135deg, ${C.greenL}, ${C.green})`,
                color: 'white', border: 'none', borderRadius: 14,
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                boxShadow: '0 6px 22px rgba(29,185,84,0.28)',
              }}
            >
              <CheckCircle2 size={18} /> ✅ কনফার্ম করুন ও WhatsApp খুলুন
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '13px 0',
                background: 'transparent', color: C.mahog,
                border: `1.5px solid ${C.sand}`, borderRadius: 14,
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >← সম্পাদনা করুন</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AI RECOMMENDER ────────────────────────────────────────────────────────────
const AISection = () => {
  const [prompt, setPrompt] = useState('');
  const [resp, setResp] = useState('');
  const [loading, setLoading] = useState(false);

  const menuCtx = MENU.map(i => `${i.nameBn} (৳${i.price}) — ${i.descBn}`).join('\n');

  const submit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true); setResp('');
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `তুমি শখের হাঁড়ি ক্লাউড কিচেনের বন্ধুত্বপূর্ণ AI অ্যাসিস্ট্যান্ট। উদ্যোক্তা: নুসরাত জাহান।\nমেনু:\n${menuCtx}\n\nনিয়ম: ১. শুধু বাংলায় উত্তর দাও। ২. ২-৩ বাক্য। ৩. মেনু থেকেই সাজেস্ট করো। ৪. উৎসাহী ও আন্তরিক হও। ৫. কোনো মার্কডাউন নয়।`,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const d = await r.json();
      setResp(d.content?.[0]?.text || 'দুঃখিত, এই মুহূর্তে সাজেস্ট করতে পারছি না।');
    } catch { setResp('দুঃখিত, সাময়িক সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।'); }
    finally { setLoading(false); }
  };

  return (
    <section style={{ maxWidth: 760, margin: '0 auto 60px', padding: '0 20px' }}>
      <div style={{
        background: `linear-gradient(135deg, #FFF8F0 0%, #FFF2EA 100%)`,
        borderRadius: 24, padding: '28px 30px',
        border: `1px solid ${C.goldPl}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${C.gold}22, transparent 70%)` }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${C.clay}, ${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={17} color="white" />
            </div>
            <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 19, fontWeight: 700, color: C.mahog }}>
              কী খাবেন বুঝতে পারছেন না?
            </h3>
          </div>
          <p style={{ color: C.mist, fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
            আপনার মুড বা ইচ্ছে লিখুন — Shokher AI আপনাকে পরামর্শ দেবে!
          </p>
          <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={prompt} onChange={e => setPrompt(e.target.value)} required
              placeholder="যেমন: বৃষ্টির দিনে গরম ঝাল কিছু খেতে চাই..."
              style={{
                flex: '1 1 240px', padding: '12px 16px',
                border: `1.5px solid ${C.goldPl}`, borderRadius: 12,
                fontSize: 14, color: C.mahog, background: 'rgba(255,255,255,0.8)',
                outline: 'none',
              }}
            />
            <button type="submit" disabled={loading || !prompt.trim()} style={{
              padding: '12px 22px', borderRadius: 12, border: 'none',
              background: loading ? C.mist : `linear-gradient(135deg, ${C.clay}, ${C.mahogM})`,
              color: 'white', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: loading ? 'none' : `0 5px 18px ${C.clay}30`,
              whiteSpace: 'nowrap',
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> লোড হচ্ছে...</> : <><Sparkles size={15} /> ম্যাজিক দেখুন</>}
            </button>
          </form>
          {resp && (
            <div style={{
              marginTop: 16, padding: '14px 18px',
              background: C.white, borderRadius: 12,
              border: `1px solid ${C.goldPl}`,
              animation: 'fadeUp 0.4s ease',
            }}>
              <p style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 14, color: C.mahog, lineHeight: 1.85 }}>
                <span style={{ fontWeight: 700, color: C.clay }}>Shokher AI ✦ </span>{resp}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── CATEGORY SHOWCASE (with real images) ─────────────────────────────────────
const CAT_SHOWCASE = [
  { cat: 'মূল পদ',          img: '/images/chicken-roast.jpg',       label: 'মূল পদ',          sub: 'চিকেন রোস্ট, পোলাও' },
  { cat: 'ফ্যামিলি প্ল্যাটার', img: '/images/polao-platter-chicken.jpg', label: 'ফ্যামিলি প্ল্যাটার', sub: 'বড় আয়োজন' },
  { cat: 'কাস্টম থালি',     img: '/images/thali-platter.jpg',       label: 'কাস্টম থালি',      sub: 'আপনার পছন্দে' },
  { cat: 'ফ্রোজেন ফুড',     img: '/images/frozen-dumplings.jpg',    label: 'ফ্রোজেন ফুড',      sub: 'রেডি টু কুক' },
  { cat: 'পিঠা ও স্ন্যাকস', img: '/images/pitha-spread.jpg',        label: 'পিঠা ও স্ন্যাকস', sub: 'ঐতিহ্যবাহী' },
];

const CategoryShowcase = ({ onSelect }) => (
  <section style={{ maxWidth: 1200, margin: '0 auto 56px', padding: '0 20px' }}>
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 30, fontWeight: 900, color: C.mahog, marginBottom: 6 }}>
        ক্যাটাগরি
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <div style={{ height: 2, width: 36, background: C.clay, borderRadius: 2 }} />
        <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
        <div style={{ height: 2, width: 36, background: C.clay, borderRadius: 2 }} />
      </div>
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 16,
    }}>
      {CAT_SHOWCASE.map((c, i) => (
        <CatCard key={c.cat} data={c} delay={i * 0.07} onSelect={onSelect} />
      ))}
    </div>
  </section>
);

const CatCard = ({ data, delay, onSelect }) => {
  const [hov, setHov] = useState(false);
  const m = CAT_META[data.cat] || {};
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(data.cat)}
      style={{
        border: `2px solid ${hov ? m.color || C.clay : C.sand}`,
        borderRadius: 18, overflow: 'hidden', cursor: 'pointer', background: 'none',
        transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
        transform: hov ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hov ? `0 16px 36px ${(m.color||C.clay)}25` : '0 1px 5px rgba(61,31,10,0.06)',
        animation: `fadeUp 0.5s ${delay}s cubic-bezier(.22,1,.36,1) both`,
      }}
    >
      <div style={{ height: 120, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `linear-gradient(to top, rgba(30,14,5,0.78), rgba(30,14,5,0.1))`,
          transition: 'opacity 0.3s',
          opacity: hov ? 0.6 : 0.8,
        }} />
        <div style={{ position: 'absolute', inset: 0, transition: 'transform 0.5s ease', transform: hov ? 'scale(1.08)' : 'scale(1)' }}>
          <Img src={data.img} alt={data.label} />
        </div>
      </div>
      <div style={{
        background: hov ? (m.bg || C.parch) : C.white,
        padding: '12px 14px', textAlign: 'center',
        transition: 'background 0.25s',
      }}>
        <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: 15, color: hov ? (m.color || C.clay) : C.mahog, marginBottom: 2 }}>
          {data.label}
        </div>
        <div style={{ fontSize: 11, color: C.mist }}>{data.sub}</div>
      </div>
    </button>
  );
};

// ─── FROZEN FOOD BANNER ────────────────────────────────────────────────────────
const FrozenBanner = ({ onSelect }) => (
  <section style={{ maxWidth: 1200, margin: '0 auto 56px', padding: '0 20px' }}>
    <div
      onClick={() => onSelect('ফ্রোজেন ফুড')}
      style={{
        borderRadius: 22, overflow: 'hidden', position: 'relative', cursor: 'pointer',
        background: `linear-gradient(135deg, #0F2744 0%, #1E3A5F 100%)`,
        display: 'flex', alignItems: 'stretch', minHeight: 180,
      }}
    >
      {/* Left */}
      <div style={{ flex: '0 0 50%', padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Snowflake size={20} color={C.snowB} style={{ animation: 'float 3s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.snowB, letterSpacing: '2px', textTransform: 'uppercase' }}>New Section</span>
        </div>
        <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1.3, marginBottom: 10 }}>
          ফ্রোজেন ফুড
          <br /><span style={{ color: C.snowB, fontSize: 20 }}>রেডি টু কুক</span>
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
          হাতে তৈরি সিঙ্গারা, ডাম্পলিং ও কাটলেট — ফ্রিজে রাখুন, যখন ইচ্ছে রান্না করুন।
        </p>
        <button style={{
          alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 30,
          background: C.snowB, color: '#0F2744', border: 'none',
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          দেখুন <ArrowRight size={14} />
        </button>
      </div>

      {/* Right - 3 frozen items */}
      <div style={{ flex: '0 0 50%', display: 'grid', gridTemplateRows: '1fr 1fr', gap: 0, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, height: '100%' }}>
          {['/images/frozen-singara.jpg', '/images/frozen-dumplings.jpg', '/images/frozen-cutlets.jpg'].slice(0, 3).map((img, i) => (
            <div key={i} style={{ overflow: 'hidden', ...(i === 2 ? { gridColumn: '1/-1', height: 90 } : { height: 90 }) }}>
              <Img src={img} alt="frozen" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCat, setActiveCat] = useState('সব');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [heritageItem, setHeritageItem] = useState(null);
  const [thaliItem, setThaliItem] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shh_favorites') || '[]'); } catch { return []; }
  });
  const menuRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = (cartOpen || heritageItem || thaliItem || confirmOrder) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, heritageItem, thaliItem, confirmOrder]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const key = item.id + item.nameBn;
      const ex = prev.find(c => c.id + c.nameBn === key);
      if (ex) return prev.map(c => c.id + c.nameBn === key ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setToast(`${item.nameBn.split('(')[0].trim()} যোগ হয়েছে!`);
  }, []);

  const handleAdd = useCallback((item) => {
    if (item.isThali) { setThaliItem(item); }
    else { addToCart(item); }
  }, [addToCart]);

  const updateQty = useCallback((id, nameBn, delta) => {
    setCart(prev => prev
      .map(i => i.id + i.nameBn === id + nameBn ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('shh_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const handleCheckout = (orderObj) => {
    setConfirmOrder(orderObj);
  };

  const handleConfirmOrder = () => {
    if (!confirmOrder) return;
    const deliveryFee = DELIVERY_ZONES.find(z => z.id === confirmOrder.zone)?.fee ?? 0;
    const msg = buildWAMessage(confirmOrder, cart, totalPrice, deliveryFee);
    const a = document.createElement('a');
    a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setConfirmOrder(null);
    setCartOpen(false);
  };

  const filtered = useMemo(() => MENU.filter(item => {
    const c = activeCat === 'সব' || item.cat === activeCat;
    const q = search.toLowerCase();
    const s = !q || item.nameBn.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q) || item.descBn.toLowerCase().includes(q);
    return c && s;
  }), [activeCat, search]);

  const scrollToMenu = (cat) => {
    setActiveCat(cat);
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      <GlobalStyle />
      <Toast msg={toast} />

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 5000,
        background: 'rgba(253,250,245,0.88)', backdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${C.sand}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.clay}, ${C.mahogM})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 10px ${C.clay}40`,
              animation: 'float 4s ease-in-out infinite',
            }}>
              <UtensilsCrossed size={19} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 22, fontWeight: 900, color: C.mahog, lineHeight: 1 }}>
                শখের হাঁড়ি
              </div>
              <div style={{ fontSize: 9, color: C.mist, fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase' }}>
                নুসরাত জাহান · Cloud Kitchen
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" style={{
              padding: '7px 14px', borderRadius: 30, background: C.greenL + '18',
              color: C.greenL, fontWeight: 700, fontSize: 12, textDecoration: 'none',
              border: `1.5px solid ${C.greenL}40`,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Phone size={13} /> অর্ডার করুন
            </a>
            <button onClick={() => setCartOpen(true)} style={{
              position: 'relative', background: 'none', border: 'none',
              cursor: 'pointer', padding: 8, color: C.mahog,
            }}>
              <ShoppingBag size={25} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  background: C.clay, color: 'white',
                  width: 19, height: 19, borderRadius: '50%',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${C.cream}`,
                  animation: 'cartBounce 0.4s ease',
                }}>{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero with real polao image */}
          <div style={{ height: 520, position: 'relative' }}>
            <Img src="/images/polao-platter-beef.jpg" alt="শখের হাঁড়ি" />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to right, rgba(30,14,5,0.88) 0%, rgba(30,14,5,0.55) 60%, rgba(30,14,5,0.2) 100%)`,
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              padding: '0 20px',
            }}>
              <div style={{ maxWidth: 560, animation: 'fadeUp 0.8s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ height: 1, width: 40, background: C.gold }} />
                  <span style={{ fontSize: 11, color: C.goldL, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Shokher Hadi Cloud Kitchen
                  </span>
                </div>
                <h1 style={{
                  fontFamily: "'Noto Serif Bengali', serif",
                  fontSize: 'clamp(34px, 5.5vw, 62px)',
                  fontWeight: 900, color: 'white',
                  lineHeight: 1.25, marginBottom: 16, letterSpacing: '-0.5px',
                }}>
                  ভালোবাসায় তৈরি,<br />
                  <span style={{ color: C.goldL }}>পরম যত্নে পরিবেশিত।</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.8, marginBottom: 28, maxWidth: 420 }}>
                  ঘরোয়া পরিবেশে তৈরি স্বাস্থ্যসম্মত খাবার, ফ্রোজেন ফুড ও পিঠা — সরাসরি আপনার দরজায়।
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={() => scrollToMenu('সব')} style={{
                    padding: '14px 28px', borderRadius: 12,
                    background: C.clay, color: 'white', border: 'none',
                    fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: `0 8px 24px ${C.clay}50`,
                  }}><UtensilsCrossed size={17} /> মেনু দেখুন</button>
                  <button onClick={() => scrollToMenu('ফ্রোজেন ফুড')} style={{
                    padding: '14px 24px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.12)', color: 'white',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    fontWeight: 700, fontSize: 15, backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}><Snowflake size={17} /> ফ্রোজেন ফুড</button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            background: C.mahog, padding: '18px 20px',
            display: 'flex', justifyContent: 'center', gap: 60,
            flexWrap: 'wrap',
          }}>
            {[
              { n: '১২০০+', l: 'সন্তুষ্ট গ্রাহক', icon: Heart },
              { n: '৪.৯ ★', l: 'রেটিং', icon: Star },
              { n: '৩০ মিনিট', l: 'দ্রুত ডেলিভারি', icon: Clock },
              { n: '১০০% ঘরোয়া', l: 'স্বাস্থ্যসম্মত', icon: Leaf },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} color={C.goldL} />
                  <div>
                    <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 18, fontWeight: 900, color: C.goldL }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{s.l}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div style={{ maxWidth: 560, margin: '40px auto 0', padding: '0 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color={C.mist} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="খাবার খুঁজুন... সিঙ্গারা, পোলাও, থালি"
              style={{
                width: '100%', padding: '15px 18px 15px 46px',
                border: `2px solid ${C.sand}`, borderRadius: 50,
                fontSize: 15, color: C.mahog, background: C.white, outline: 'none',
                boxShadow: '0 3px 16px rgba(61,31,10,0.06)',
                transition: 'all 0.25s',
              }}
              onFocus={e => { e.target.style.borderColor = C.clay; e.target.style.boxShadow = `0 3px 20px ${C.clay}20`; }}
              onBlur={e => { e.target.style.borderColor = C.sand; e.target.style.boxShadow = '0 3px 16px rgba(61,31,10,0.06)'; }}
            />
          </div>
        </div>

        {/* ── CATEGORY SHOWCASE ── */}
        <div style={{ padding: '48px 0 0' }}>
          <CategoryShowcase onSelect={scrollToMenu} />
        </div>

        {/* ── AI RECOMMENDER ── */}
        <AISection />

        {/* ── FROZEN BANNER ── */}
        <FrozenBanner onSelect={scrollToMenu} />

        {/* ── MENU SECTION ── */}
        <section ref={menuRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 30, fontWeight: 900, color: C.mahog, marginBottom: 6 }}>
              সম্পূর্ণ মেনু
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <div style={{ height: 2, width: 32, background: C.clay, borderRadius: 2 }} />
              <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
              <div style={{ height: 2, width: 32, background: C.clay, borderRadius: 2 }} />
            </div>
          </div>

          {/* Category filter */}
          <div className="hs" style={{ display: 'flex', gap: 9, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
            {CATS.map(cat => (
              <CatPill key={cat} cat={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0', background: C.white, borderRadius: 20, border: `2px dashed ${C.sand}` }}>
              <UtensilsCrossed size={44} color={C.sand} style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 18, color: C.mist }}>কোনো খাবার পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: 24,
            }}>
              {filtered.map((item, i) => (
                <div key={item.id} style={{ animation: `fadeUp 0.5s ${i * 0.06}s cubic-bezier(.22,1,.36,1) both` }}>
                  <Card item={item} onAdd={handleAdd} onHeritage={setHeritageItem} favorites={favorites} onToggleFav={toggleFav} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: C.mahog, color: C.parch, padding: '52px 20px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 36, marginBottom: 36,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${C.clay}, ${C.mahogM})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UtensilsCrossed size={17} color="white" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 20, fontWeight: 900, color: C.goldL }}>শখের হাঁড়ি</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '1px' }}>নুসরাত জাহান</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(253,250,245,0.55)', fontSize: 13, lineHeight: 1.8, maxWidth: 240 }}>
                  ঘরোয়া ভালোবাসায় তৈরি সেরা খাবার। প্রতিটি পদে মায়ের হাতের স্বাদ।
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, color: C.goldL, marginBottom: 12 }}>যোগাযোগ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { Icon: Phone,  t: `+${WHATSAPP}` },
                    { Icon: MapPin, t: 'ঢাকা, বাংলাদেশ' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'rgba(253,250,245,0.6)', fontSize: 13 }}>
                      <r.Icon size={14} color={C.gold} /> {r.t}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: 15, color: C.goldL, marginBottom: 12 }}>সময়সূচী</h4>
                <p style={{ color: 'rgba(253,250,245,0.6)', fontSize: 13, lineHeight: 1.9 }}>
                  প্রতিদিন সকাল ১০টা – রাত ১০টা<br />
                  প্রি-অর্ডার ২৪ ঘণ্টা
                </p>
              </div>
            </div>
            <div style={{
              borderTop: `1px solid ${C.mahogL}`, paddingTop: 22,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
            }}>
              <p style={{ color: 'rgba(253,250,245,0.35)', fontSize: 12 }}>
                © {new Date().getFullYear()} শখের হাঁড়ি · নুসরাত জাহান
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[Instagram, Facebook].map((Icon, i) => (
                  <button key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: C.mahogL, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.goldL }}>
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── FLOATING CART ── */}
      {totalItems > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 4000, maxWidth: 360, width: 'calc(100% - 32px)',
            background: `linear-gradient(135deg, ${C.mahog}, ${C.mahogM})`,
            color: C.cream, border: 'none', borderRadius: 50,
            padding: '13px 22px 13px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: `0 10px 32px ${C.mahog}55`,
            animation: 'fadeUp 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: C.clay, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>
              {totalItems}
            </span>
            অর্ডার দেখুন
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.goldL }}>
            <span style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 900 }}>৳{totalPrice}</span>
            <ArrowRight size={17} />
          </div>
        </button>
      )}

      {/* ── MODALS ── */}
      <CartDrawer
        cart={cart} open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdate={updateQty}
        onCheckout={handleCheckout}
        onAddToCart={addToCart}
      />
      {confirmOrder && (
        <ConfirmOrderModal
          order={confirmOrder}
          cart={cart}
          onClose={() => setConfirmOrder(null)}
          onConfirm={handleConfirmOrder}
        />
      )}
      <HeritageModal
        item={heritageItem}
        onClose={() => setHeritageItem(null)}
        onAdd={addToCart}
      />
      <ThaliBuilder
        item={thaliItem}
        onClose={() => setThaliItem(null)}
        onAdd={addToCart}
      />
    </div>
  );
}
