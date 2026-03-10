import React,{useState,useMemo,useEffect,useRef,useCallback,createContext,useContext}from'react';
import{ShoppingBag,X,Plus,Minus,Search,MessageCircle,UtensilsCrossed,CheckCircle2,Sparkles,Loader2,Snowflake,Phone,MapPin,Heart,Instagram,Facebook,Clock,ChefHat,Grid3X3,Star,Flame,Leaf,ArrowRight,Info,Truck,Calendar,ChevronDown,Sun,Moon,Pizza,Bookmark,BookmarkCheck,Eye,Gift,Zap,Award,Coffee,Sunset}from'lucide-react';

// ─── TOKENS ───────────────────────────────────────────────────────────────
const C={
  mahog:'#3D1F0A',mahogM:'#5C2E0F',mahogL:'#7A3D14',
  clay:'#C4451E',clayL:'#D45B2E',
  gold:'#C89B3C',goldL:'#E2B85A',goldPl:'#F5DFA0',
  cream:'#FDFAF5',parch:'#F7F1E8',sand:'#E8DECE',sandL:'#F2EDE5',
  mist:'#8A7060',ink:'#1E0E05',
  green:'#1AAA4B',greenL:'#25D366',
  blue:'#2563EB',blueL:'#EFF6FF',
  purple:'#7C3AED',purpleL:'#F3EEFF',
  snow:'#0F2744',snowL:'#C8E0FA',
  rose:'#E11D48',roseL:'#FFF1F3',
  amber:'#D97706',amberL:'#FFFBEB',
};
const FREE_DELIVERY=800;
const WHATSAPP='8801820057581';

// ─── FULL MENU (23 items, 8 categories) ───────────────────────────────────
const MENU=[
  // মূল পদ
  {id:'chicken-roast',nameBn:'শাহী চিকেন রোস্ট',nameEn:'Shahi Chicken Roast',descBn:'বেরেস্তা ছড়ানো, ঘন মশলাদার গ্রেভিতে — বিয়ে বাড়ির অনন্য স্বাদ।',price:180,cat:'মূল পদ',spice:'hot',isPopular:true,img:'/images/chicken-roast.jpg'},
  {id:'chicken-curry',nameBn:'ঘরোয়া চিকেন কারি',nameEn:'Home Style Chicken Curry',descBn:'টমেটো-পেঁয়াজ বেইজে রান্না নরম চিকেন — পরিবারের প্রিয় রেসিপি। (৪ পিস)',price:220,cat:'মূল পদ',spice:'medium',img:'/images/chicken-curry.jpg'},
  {id:'beef-shashlik',nameBn:'গরুর শাশলিক স্কিউয়ার',nameEn:'Beef Shashlik Skewers',descBn:'মশলায় মেরিনেট করা নরম গরুর টুকরো, পেঁয়াজ, গাজর ও ক্যাপসিকাম দিয়ে গ্রিল। (৪ পিস)',price:220,cat:'মূল পদ',spice:'medium',isNew:true,img:'/images/beef-shashlik.jpg'},

  // ফ্যামিলি প্ল্যাটার
  {id:'polao-platter-chicken',nameBn:'রাজকীয় চিকেন পোলাও প্ল্যাটার',nameEn:'Royal Chicken Polao Platter',descBn:'সুগন্ধি পোলাওর উপর চিকেন রোস্ট, সেদ্ধ ডিম, টিকিয়া ও গ্রেভি। ৪–৫ জনের জন্য।',price:1250,cat:'ফ্যামিলি প্ল্যাটার',isPopular:true,serves:5,img:'/images/polao-platter-chicken.jpg'},
  {id:'polao-platter-beef',nameBn:'রাজকীয় গরুর পোলাও প্ল্যাটার',nameEn:'Royal Beef Polao Platter',descBn:'নরম গরুর মাংস, কাবাব, সেদ্ধ ডিম, গাজর গার্নিশ সহ পোলাও। ৪–৫ জনের জন্য।',price:1450,cat:'ফ্যামিলি প্ল্যাটার',serves:5,img:'/images/polao-platter-beef2.jpg'},

  // কাস্টম থালি
  {id:'thali-standard',nameBn:'কাস্টম থালি — স্ট্যান্ডার্ড',nameEn:'Custom Thali Standard',descBn:'ভাত/পোলাও + যেকোনো ২টি পদ। সম্পূর্ণ আপনার পছন্দমতো।',price:280,cat:'কাস্টম থালি',isThali:true,img:'/images/thali-platter.jpg'},
  {id:'thali-premium',nameBn:'কাস্টম থালি — প্রিমিয়াম',nameEn:'Custom Thali Premium',descBn:'ভাত/পোলাও + ১টি প্রোটিন + ২টি পদ। পরিপূর্ণ বাড়ির খাবার।',price:420,cat:'কাস্টম থালি',isPopular:true,isThali:true,img:'/images/thali-platter.jpg'},

  // পিঠা ও মিষ্টি
  {id:'pitha-platter',nameBn:'মিশ্র পিঠা প্ল্যাটার',nameEn:'Mixed Pitha Platter',descBn:'রোজ পিঠা, পাটিসাপটা, ত্রিভুজ পিঠা, পুলি — বাংলার ঐতিহ্য এক থালায়।',price:380,cat:'পিঠা ও মিষ্টি',img:'/images/pitha-platter.jpg'},
  {id:'rose-pitha',nameBn:'রোজ পিঠা',nameEn:'Rose Pitha',descBn:'গোলাপ ফুলের আদলে তৈরি লেয়ারড পিঠা — গুয়া দিয়ে মোড়া, মিষ্টি নারিকেল পুর। (৬ পিস)',price:280,cat:'পিঠা ও মিষ্টি',isNew:true,isPopular:true,img:'/images/rose-pitha.jpg'},
  {id:'patishapta',nameBn:'পাটিসাপটা রোল',nameEn:'Patishapta Roll',descBn:'লেসের মতো সূক্ষ্ম কারুকাজে রঙিন পাটিসাপটা — খেজুর গুড় ও নারিকেল পুর। (৮ পিস)',price:200,cat:'পিঠা ও মিষ্টি',img:'/images/patishapta-rolls.jpg'},
  {id:'pitha-collection',nameBn:'পিঠা কালেকশন বক্স',nameEn:'Pitha Collection Box',descBn:'চিতই, মুঠি পিঠা, পাটিসাপটা, পিনহুইল রোল — একসাথে বিভিন্ন পিঠার স্বাদ।',price:350,cat:'পিঠা ও মিষ্টি',img:'/images/pitha-collection.jpg'},
  {id:'halwa-spread',nameBn:'প্রিমিয়াম হালুয়া প্ল্যাটার',nameEn:'Premium Halwa Platter',descBn:'সুজি হালুয়া, গাজরের হালুয়া ও বেসনের হালুয়া — কাজু, কিসমিস ও পিস্তা দিয়ে সজ্জিত।',price:450,cat:'পিঠা ও মিষ্টি',img:'/images/halwa-spread.jpg'},
  {id:'zarda',nameBn:'জর্দা / মিষ্টি পোলাও',nameEn:'Zarda Sweet Rice',descBn:'জাফরানি সুগন্ধি মিষ্টি পোলাও — গুলাব জামুন, কাজু ও কিসমিস দিয়ে সাজানো।',price:180,cat:'পিঠা ও মিষ্টি',img:'/images/zarda-rice.jpg'},
  {id:'sandesh',nameBn:'ছানার সন্দেশ',nameEn:'Chhana Sandesh',descBn:'ছাঁচে তৈরি ছানার সন্দেশ — পিস্তা ও জাফরানি সুগন্ধে ভরপুর। (১২ পিস)',price:200,cat:'পিঠা ও মিষ্টি',isNew:true,img:'/images/sandesh.jpg'},
  {id:'ladoo',nameBn:'মতিচুর লাড্ডু',nameEn:'Motichur Laddu',descBn:'ঘিয়ে ভাজা বেসনের মতিচুর — একটু হলুদ রঙের মধুর মিষ্টি। (২০ পিস)',price:180,cat:'পিঠা ও মিষ্টি',img:'/images/ladoo.jpg'},
  {id:'doi',nameBn:'মাটির হাঁড়ির দই',nameEn:'Clay Pot Yogurt',descBn:'মাটির পাত্রে সেট করা গাঢ় মিষ্টি দই — সম্পূর্ণ ঘরোয়া প্রস্তুত। (জার বা হাঁড়ি)',price:150,cat:'পিঠা ও মিষ্টি',img:'/images/doi-yogurt.jpg'},

  // স্ন্যাকস
  {id:'spring-rolls',nameBn:'ক্রিস্পি স্প্রিং রোল',nameEn:'Crispy Spring Rolls',descBn:'গোল্ডেন ক্রাম্ব-কোটেড বড় স্প্রিং রোল — ভেতরে মশলাদার পুর। (৫ পিস)',price:120,cat:'স্ন্যাকস',spice:'medium',img:'/images/spring-rolls.jpg'},
  {id:'pizza',nameBn:'ঘরে তৈরি পিৎজা',nameEn:'Homemade Pizza',descBn:'নরম ক্রাস্টে চিকেন, ক্যাপসিকাম, অলিভ ও গলানো চিজ — সম্পূর্ণ হাতে তৈরি।',price:350,cat:'স্ন্যাকস',isNew:true,img:'/images/homemade-pizza.jpg'},

  // ফ্রোজেন ফুড
  {id:'frz-singara',nameBn:'ফ্রোজেন খাম সিঙ্গারা',nameEn:'Frozen Khaam Singara',descBn:'হাতে তৈরি পয়েন্টেড সিঙ্গারা। বাড়িতে ভেজে পরিবেশন। (১০ পিস)',price:150,cat:'ফ্রোজেন ফুড',isFrozen:true,img:'/images/frozen-singara.jpg'},
  {id:'frz-dumpling',nameBn:'ফ্রোজেন কিমা ডাম্পলিং',nameEn:'Frozen Keema Dumpling',descBn:'প্লিটেড ডিজাইনে হাতে তৈরি। ভাপে বা তেলে রান্না। (১২ পিস)',price:200,cat:'ফ্রোজেন ফুড',isFrozen:true,isPopular:true,img:'/images/frozen-dumplings.jpg'},
  {id:'frz-cutlet',nameBn:'ফ্রোজেন ক্রাম্বড কাটলেট',nameEn:'Frozen Crumbed Cutlets',descBn:'গোল্ডেন ব্রেডক্রাম্ব কোটেড। শুধু তেলে ভেজে নিন। (৮ পিস)',price:180,cat:'ফ্রোজেন ফুড',isFrozen:true,img:'/images/frozen-cutlets.jpg'},
  {id:'frz-pack',nameBn:'ফ্রোজেন মিক্স প্যাক',nameEn:'Frozen Mix Pack',descBn:'সিঙ্গারা + স্প্রিং রোল + কাটলেট — বিভিন্ন ধরনের ফ্রোজেন আইটেম একসাথে।',price:350,cat:'ফ্রোজেন ফুড',isFrozen:true,isPopular:true,img:'/images/frozen-pack.jpg'},
];

const CATS=['সব','মূল পদ','ফ্যামিলি প্ল্যাটার','কাস্টম থালি','পিঠা ও মিষ্টি','স্ন্যাকস','ফ্রোজেন ফুড'];
const CAT_META={
  'সব':{Icon:Grid3X3,color:C.mahog,bg:C.sandL},
  'মূল পদ':{Icon:UtensilsCrossed,color:C.clay,bg:'#FFF0EB'},
  'ফ্যামিলি প্ল্যাটার':{Icon:Heart,color:C.gold,bg:'#FFF8E8'},
  'কাস্টম থালি':{Icon:ChefHat,color:C.purple,bg:C.purpleL},
  'পিঠা ও মিষ্টি':{Icon:Star,color:C.amber,bg:C.amberL},
  'স্ন্যাকস':{Icon:Pizza,color:C.rose,bg:C.roseL},
  'ফ্রোজেন ফুড':{Icon:Snowflake,color:C.blue,bg:C.blueL},
};
const CAT_SHOWCASE=[
  {cat:'মূল পদ',img:'/images/chicken-curry.jpg',sub:'রোস্ট · কারি · শাশলিক'},
  {cat:'ফ্যামিলি প্ল্যাটার',img:'/images/polao-platter-beef2.jpg',sub:'পোলাও প্ল্যাটার · ৪–৫ জন'},
  {cat:'কাস্টম থালি',img:'/images/thali-platter.jpg',sub:'আপনার পছন্দে সাজান'},
  {cat:'পিঠা ও মিষ্টি',img:'/images/rose-pitha.jpg',sub:'পিঠা · হালুয়া · দই · মিষ্টি'},
  {cat:'স্ন্যাকস',img:'/images/homemade-pizza.jpg',sub:'পিৎজা · স্প্রিং রোল'},
  {cat:'ফ্রোজেন ফুড',img:'/images/frozen-pack.jpg',sub:'রেডি টু কুক'},
];

// Combo deals
const COMBOS=[
  {id:'combo-1',nameBn:'পারিবারিক কম্বো',descBn:'চিকেন পোলাও প্ল্যাটার + মিক্স পিঠা প্ল্যাটার + দই',price:1680,origPrice:1780,items:['polao-platter-chicken','pitha-platter','doi'],img:'/images/polao-platter-chicken.jpg'},
  {id:'combo-2',nameBn:'মিষ্টি উৎসব কম্বো',descBn:'হালুয়া প্ল্যাটার + রোজ পিঠা + লাড্ডু + সন্দেশ',price:980,origPrice:1110,items:['halwa-spread','rose-pitha','ladoo','sandesh'],img:'/images/rose-pitha.jpg'},
  {id:'combo-3',nameBn:'ফ্রোজেন ফ্যামিলি প্যাক',descBn:'মিক্স প্যাক + ডাম্পলিং + কাটলেট + সিঙ্গারা',price:580,origPrice:680,items:['frz-pack','frz-dumpling','frz-cutlet','frz-singara'],img:'/images/frozen-pack.jpg'},
];

const THALI_BASE=[{id:'tb-rice',nameBn:'সাদা ভাত',add:0},{id:'tb-polao',nameBn:'পোলাও',add:40}];
const THALI_SIDES=[
  {id:'ts-beef',nameBn:'গরুর ভুনা',add:80,type:'protein'},
  {id:'ts-chk',nameBn:'চিকেন কারি',add:70,type:'protein'},
  {id:'ts-fish',nameBn:'মাছের ঝোল',add:60,type:'protein'},
  {id:'ts-egg',nameBn:'ডিম ভুনা',add:40,type:'side'},
  {id:'ts-vorta',nameBn:'আলু ভর্তা',add:30,type:'side'},
  {id:'ts-sabzi',nameBn:'মিক্স সবজি',add:35,type:'side'},
  {id:'ts-dal',nameBn:'মুসুর ডাল',add:30,type:'side'},
  {id:'ts-begun',nameBn:'বেগুন ভর্তা',add:35,type:'side'},
];
const SLOTS=['যত দ্রুত সম্ভব','আজ দুপুরে (১২–২টা)','আজ বিকেলে (৪–৬টা)','আজ সন্ধ্যায় (৭–৯টা)','আগামীকাল সকালে','আগামীকাল দুপুরে','কাস্টম সময়ে (চ্যাটে জানাবো)'];

// ─── CART CONTEXT ──────────────────────────────────────────────────────────
const CartCtx=createContext(null);
function CartProvider({children}){
  const[cart,setCart]=useState(()=>{try{const s=localStorage.getItem('sh_cart_v4');return s?JSON.parse(s):[]}catch{return[]}});
  const[wishlist,setWishlist]=useState(()=>{try{const s=localStorage.getItem('sh_wish_v1');return s?JSON.parse(s):[]}catch{return[]}});
  useEffect(()=>{try{localStorage.setItem('sh_cart_v4',JSON.stringify(cart))}catch{}},[cart]);
  useEffect(()=>{try{localStorage.setItem('sh_wish_v1',JSON.stringify(wishlist))}catch{}},[wishlist]);
  const add=useCallback((item)=>setCart(prev=>{const k=item.id+'||'+(item.nameBn||'');const ex=prev.find(c=>c._k===k);if(ex)return prev.map(c=>c._k===k?{...c,qty:c.qty+1}:c);return[...prev,{...item,qty:1,_k:k}]}),[]);
  const upd=useCallback((k,d)=>setCart(prev=>prev.map(i=>i._k===k?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0)),[]);
  const clr=useCallback(()=>setCart([]),[]);
  const toggleWish=useCallback((id)=>setWishlist(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]),[]);
  const totalQty=cart.reduce((s,i)=>s+i.qty,0);
  const totalPrice=cart.reduce((s,i)=>s+i.price*i.qty,0);
  return <CartCtx.Provider value={{cart,add,upd,clr,wishlist,toggleWish,totalQty,totalPrice}}>{children}</CartCtx.Provider>;
}
const useCart=()=>useContext(CartCtx);

// ─── TIME GREETING ─────────────────────────────────────────────────────────
function useGreeting(){
  const h=new Date().getHours();
  if(h<5)  return{text:'শুভ রাত্রি',Icon:Moon,  sub:'রাতের অর্ডার নিচ্ছি'};
  if(h<12) return{text:'শুভ সকাল', Icon:Coffee, sub:'সকালের নাস্তা অর্ডার করুন'};
  if(h<16) return{text:'শুভ দুপুর', Icon:Sun,   sub:'দুপুরের খাবার রেডি!'};
  if(h<19) return{text:'শুভ বিকেল', Icon:Sunset,sub:'বিকেলের নাস্তার সময়!'};
  return   {text:'শুভ সন্ধ্যা',Icon:Moon, sub:'সন্ধ্যার খাবার অর্ডার করুন'};
}

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────
function GStyle(){
  useEffect(()=>{
    const s=document.createElement('style');
    s.textContent=`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{background:${C.cream};color:${C.ink};font-family:'Hind Siliguri',sans-serif;-webkit-font-smoothing:antialiased}
      ::selection{background:${C.clay};color:#fff}
      .hs::-webkit-scrollbar{display:none}.hs{-ms-overflow-style:none;scrollbar-width:none}
      input,textarea,button,select{font-family:'Hind Siliguri',sans-serif}img{display:block}
      @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
      @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
      @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes heartPop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
    `;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);return null;
}

// ─── SHARED MICRO COMPONENTS ───────────────────────────────────────────────
function Img({src,alt}){
  const[loaded,setLoaded]=useState(false);
  const[err,setErr]=useState(false);
  return(
    <div style={{position:'relative',overflow:'hidden',width:'100%',height:'100%',background:C.sand}}>
      {!loaded&&<div style={{position:'absolute',inset:0,background:`linear-gradient(110deg,${C.sand} 30%,${C.sandL} 50%,${C.sand} 70%)`,backgroundSize:'200% 100%',animation:'shimmer 1.4s linear infinite'}}/>}
      <img src={err?'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80':src} alt={alt} style={{width:'100%',height:'100%',objectFit:'cover',transition:'opacity .5s',opacity:loaded?1:0}} onLoad={()=>setLoaded(true)} onError={()=>{setErr(true);setLoaded(true)}}/>
    </div>
  );
}
function Toast({msg}){
  return(
    <div style={{position:'fixed',top:72,left:'50%',transform:msg?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(-16px)',zIndex:9999,pointerEvents:'none',opacity:msg?1:0,transition:'all .35s cubic-bezier(.34,1.5,.64,1)'}}>
      <div style={{background:C.mahog,color:C.cream,padding:'11px 20px',borderRadius:50,display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:600,boxShadow:'0 12px 32px rgba(61,31,10,.28)',whiteSpace:'nowrap'}}>
        <CheckCircle2 size={15} color={C.greenL}/>{msg}
      </div>
    </div>
  );
}
function Badge({color,icon,children}){
  return <span style={{background:color,color:'#fff',fontSize:10,fontWeight:700,padding:'4px 9px',borderRadius:20,display:'flex',alignItems:'center',gap:3}}>{icon}{children}</span>;
}
function STag({color,bg,icon,children}){
  return <span style={{fontSize:11,fontWeight:600,color,background:bg,padding:'3px 9px',borderRadius:20,display:'flex',alignItems:'center',gap:3}}>{icon} {children}</span>;
}
function Divider(){
  return(
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:6}}>
      <div style={{height:2,width:32,background:C.clay,borderRadius:2}}/><span style={{color:C.gold,fontSize:16}}>✦</span><div style={{height:2,width:32,background:C.clay,borderRadius:2}}/>
    </div>
  );
}
function CatPill({cat,active,onClick}){
  const m=CAT_META[cat]||{Icon:Grid3X3,color:C.mahog,bg:C.sandL};
  return(
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 17px',borderRadius:50,border:`1.5px solid ${active?m.color:C.sand}`,background:active?m.color:C.cream,color:active?'#fff':C.mahog,fontWeight:700,fontSize:13,cursor:'pointer',whiteSpace:'nowrap',transition:'all .25s cubic-bezier(.22,1,.36,1)',transform:active?'scale(1.04)':'scale(1)',boxShadow:active?`0 4px 14px ${m.color}38`:'none'}}>
      <m.Icon size={13}/>{cat}
    </button>
  );
}

// ─── FREE DELIVERY BAR ─────────────────────────────────────────────────────
function FreeBar({total}){
  const pct=Math.min(100,(total/FREE_DELIVERY)*100);
  const done=total>=FREE_DELIVERY;
  return(
    <div style={{background:done?'#F0FDF4':C.parch,border:`1.5px solid ${done?'#86EFAC':C.sand}`,borderRadius:14,padding:'12px 16px',marginBottom:16,transition:'all .4s ease'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:7}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}><Truck size={14} color={done?C.green:C.clay}/><span style={{fontSize:12,fontWeight:700,color:done?C.green:C.mahog}}>{done?'🎉 ফ্রি ডেলিভারি পেয়েছেন!':`আর ৳${FREE_DELIVERY-total} যোগ করলেই ফ্রি ডেলিভারি!`}</span></div>
        <span style={{fontSize:11,color:C.mist,fontFamily:"'Noto Serif Bengali',serif"}}>৳{total}/৳{FREE_DELIVERY}</span>
      </div>
      <div style={{height:7,background:C.sand,borderRadius:10,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:10,background:done?`linear-gradient(90deg,${C.green},#4ADE80)`:`linear-gradient(90deg,${C.clay},${C.gold})`,width:`${pct}%`,transition:'width .6s cubic-bezier(.22,1,.36,1)'}}/>
      </div>
    </div>
  );
}

// ─── MENU CARD ─────────────────────────────────────────────────────────────
function MenuCard({item,onHeritage,onAdd}){
  const{wishlist,toggleWish}=useCart();
  const[hov,setHov]=useState(false);
  const wished=wishlist.includes(item.id);
  return(
    <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:'#fff',borderRadius:20,overflow:'hidden',border:`1.5px solid ${hov?C.clay+'55':C.sand}`,display:'flex',flexDirection:'column',transition:'all .38s cubic-bezier(.22,1,.36,1)',transform:hov?'translateY(-6px)':'translateY(0)',boxShadow:hov?`0 24px 48px rgba(61,31,10,.13)`:`0 1px 6px rgba(61,31,10,.05)`}}>
      <div style={{height:210,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,zIndex:2,background:'linear-gradient(to top,rgba(30,14,5,.72) 0%,rgba(30,14,5,.06) 55%,transparent 100%)',opacity:hov?.55:.78,transition:'opacity .35s'}}/>
        <div style={{position:'absolute',inset:0,zIndex:1,transform:hov?'scale(1.07)':'scale(1)',transition:'transform .65s cubic-bezier(.22,1,.36,1)'}}><Img src={item.img} alt={item.nameBn}/></div>
        {/* Badges */}
        <div style={{position:'absolute',top:11,left:11,zIndex:3,display:'flex',flexDirection:'column',gap:5}}>
          {item.isFrozen&&<Badge color={C.blue} icon={<Snowflake size={10}/>}>ফ্রোজেন</Badge>}
          {item.isThali&&<Badge color={C.purple} icon={<ChefHat size={10}/>}>কাস্টমাইজ</Badge>}
          {item.isNew&&<Badge color={C.gold}>✦ নতুন</Badge>}
          {item.isPopular&&!item.isFrozen&&!item.isThali&&!item.isNew&&<Badge color={C.clay}>★ জনপ্রিয়</Badge>}
        </div>
        {/* Wishlist */}
        <button onClick={e=>{e.stopPropagation();toggleWish(item.id);}} style={{position:'absolute',top:10,right:10,zIndex:3,background:'rgba(253,250,245,.9)',border:'none',borderRadius:'50%',width:33,height:33,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'transform .2s',animation:wished?'heartPop .3s ease':'none'}}>
          <Heart size={16} color={wished?C.rose:C.mist} fill={wished?C.rose:'none'}/>
        </button>
        {/* Price */}
        <div style={{position:'absolute',bottom:11,right:11,zIndex:3,background:'rgba(253,250,245,.95)',backdropFilter:'blur(8px)',padding:'5px 12px',borderRadius:30,color:C.clay,fontWeight:700,fontSize:17,fontFamily:"'Noto Serif Bengali',serif"}}>৳{item.price}</div>
        {item.serves&&<div style={{position:'absolute',bottom:11,left:11,zIndex:3,background:'rgba(61,31,10,.82)',padding:'4px 10px',borderRadius:20,color:C.goldL,fontSize:10,fontWeight:600}}>👥 {item.serves} জন</div>}
      </div>
      <div style={{padding:'15px 17px 17px',flex:1,display:'flex',flexDirection:'column'}}>
        <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontWeight:700,fontSize:16,color:hov?C.clay:C.mahog,lineHeight:1.4,marginBottom:4,transition:'color .25s'}}>{item.nameBn}</h3>
        <p style={{color:C.mist,fontSize:13,lineHeight:1.75,marginBottom:10,flex:1,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.descBn}</p>
        <div style={{display:'flex',alignItems:'center',marginBottom:10}}>
          {item.spice==='hot'&&<STag color='#DC2626' bg='#FEF2F2' icon='🌶️'>ঝাল</STag>}
          {item.spice==='medium'&&<STag color={C.amber} bg={C.amberL} icon='🌶'>মিডিয়াম</STag>}
          {item.isFrozen&&<STag color={C.blue} bg={C.blueL} icon='🧊'>রেডি টু কুক</STag>}
          <button onClick={()=>onHeritage(item)} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:11,fontWeight:600,color:C.clay,display:'flex',alignItems:'center',gap:4}}><Sparkles size={12}/> ঐতিহ্য</button>
        </div>
        <button onClick={()=>onAdd(item)} style={{width:'100%',padding:'12px 0',borderRadius:12,border:`2px solid ${C.clay}`,background:hov?C.clay:'transparent',color:hov?'#fff':C.clay,fontWeight:700,fontSize:14,cursor:'pointer',transition:'all .28s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:hov?`0 6px 18px ${C.clay}35`:'none'}}>
          <Plus size={15} style={{transition:'transform .28s',transform:hov?'rotate(90deg)':'none'}}/>{item.isThali?'থালি কাস্টমাইজ করুন':'হাঁড়িতে যোগ করুন'}
        </button>
      </div>
    </article>
  );
}

// ─── COMBO CARD ────────────────────────────────────────────────────────────
function ComboCard({combo,onAdd}){
  const[hov,setHov]=useState(false);
  const save=combo.origPrice-combo.price;
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:'#fff',borderRadius:18,overflow:'hidden',border:`1.5px solid ${hov?C.gold+'88':C.sand}`,transition:'all .3s cubic-bezier(.22,1,.36,1)',transform:hov?'translateY(-5px)':'none',boxShadow:hov?`0 18px 40px ${C.gold}22`:'none'}}>
      <div style={{height:140,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,transform:hov?'scale(1.06)':'scale(1)',transition:'transform .5s ease'}}><Img src={combo.img} alt={combo.nameBn}/></div>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(30,14,5,.7),transparent)'}}/>
        <div style={{position:'absolute',top:10,left:10,background:`linear-gradient(135deg,${C.gold},${C.clay})`,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:4}}><Gift size={11}/> ৳{save} সাশ্রয়</div>
      </div>
      <div style={{padding:'13px 15px 15px'}}>
        <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:15,fontWeight:700,color:C.mahog,marginBottom:4}}>{combo.nameBn}</h4>
        <p style={{fontSize:12,color:C.mist,lineHeight:1.7,marginBottom:11}}>{combo.descBn}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div><span style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:20,fontWeight:900,color:C.clay}}>৳{combo.price}</span><span style={{fontSize:12,color:C.mist,textDecoration:'line-through',marginLeft:7}}>৳{combo.origPrice}</span></div>
          <span style={{fontSize:10,fontWeight:700,color:C.green,background:'#F0FDF4',padding:'3px 9px',borderRadius:20}}>{Math.round(save/combo.origPrice*100)}% ছাড়</span>
        </div>
        <button onClick={()=>onAdd(combo)} style={{width:'100%',padding:'10px 0',borderRadius:11,border:'none',background:hov?`linear-gradient(135deg,${C.gold},${C.clay})`:`linear-gradient(135deg,${C.clay},${C.mahogM})`,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'background .3s',boxShadow:`0 4px 14px ${C.clay}30`}}>
          <Zap size={14}/> কম্বো নিন
        </button>
      </div>
    </div>
  );
}

// ─── CATEGORY SHOWCASE ─────────────────────────────────────────────────────
function CatCard({data,delay,onSelect}){
  const[hov,setHov]=useState(false);
  const m=CAT_META[data.cat]||{};
  return(
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>onSelect(data.cat)} style={{border:`2px solid ${hov?(m.color||C.clay):C.sand}`,borderRadius:18,overflow:'hidden',cursor:'pointer',background:'none',transition:'all .3s cubic-bezier(.22,1,.36,1)',transform:hov?'translateY(-5px) scale(1.02)':'none',boxShadow:hov?`0 16px 36px ${(m.color||C.clay)}25`:'none',animation:`fadeUp .5s ${delay}s cubic-bezier(.22,1,.36,1) both`}}>
      <div style={{height:105,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(to top,rgba(30,14,5,.75),rgba(30,14,5,.08))',opacity:hov?.55:.78,transition:'opacity .3s'}}/>
        <div style={{position:'absolute',inset:0,transform:hov?'scale(1.08)':'scale(1)',transition:'transform .5s ease'}}><Img src={data.img} alt={data.cat}/></div>
      </div>
      <div style={{background:hov?(m.bg||C.parch):'#fff',padding:'10px 12px',textAlign:'center',transition:'background .25s'}}>
        <div style={{fontFamily:"'Noto Serif Bengali',serif",fontWeight:700,fontSize:13,color:hov?(m.color||C.clay):C.mahog,marginBottom:2}}>{data.cat}</div>
        <div style={{fontSize:10,color:C.mist}}>{data.sub}</div>
      </div>
    </button>
  );
}

// ─── FROZEN BANNER ─────────────────────────────────────────────────────────
function FrozenBanner({onSelect}){
  return(
    <section style={{maxWidth:1200,margin:'0 auto 52px',padding:'0 20px'}}>
      <div onClick={()=>onSelect('ফ্রোজেন ফুড')} style={{borderRadius:22,overflow:'hidden',cursor:'pointer',display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:190}}>
        <div style={{background:`linear-gradient(135deg,${C.snow} 0%,#1A3C6A 100%)`,padding:'26px 28px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}><Snowflake size={16} color={C.snowL} style={{animation:'float 3s ease-in-out infinite'}}/><span style={{fontSize:10,fontWeight:700,color:C.snowL,letterSpacing:'2px',textTransform:'uppercase'}}>New Section</span></div>
          <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:'clamp(17px,3vw,24px)',fontWeight:900,color:'#fff',lineHeight:1.3,marginBottom:8}}>ফ্রোজেন ফুড<br/><span style={{color:C.snowL,fontSize:'.8em'}}>রেডি টু কুক</span></h3>
          <p style={{color:'rgba(255,255,255,.6)',fontSize:13,lineHeight:1.7,marginBottom:14}}>হাতে তৈরি সিঙ্গারা, ডাম্পলিং ও কাটলেট।</p>
          <span style={{alignSelf:'flex-start',padding:'8px 16px',borderRadius:30,background:C.snowL,color:C.snow,fontWeight:700,fontSize:13,display:'flex',alignItems:'center',gap:5}}>দেখুন <ArrowRight size={13}/></span>
        </div>
        <div style={{display:'grid',gridTemplateRows:'1fr 1fr'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
            <div style={{overflow:'hidden'}}><Img src="/images/frozen-singara.jpg" alt="singara"/></div>
            <div style={{overflow:'hidden'}}><Img src="/images/frozen-dumplings.jpg" alt="dumpling"/></div>
          </div>
          <div style={{overflow:'hidden'}}><Img src="/images/frozen-pack.jpg" alt="pack"/></div>
        </div>
      </div>
    </section>
  );
}

// ─── THALI BUILDER ─────────────────────────────────────────────────────────
function ThaliBuilder({item,onClose}){
  const{add}=useCart();
  const[base,setBase]=useState('tb-rice');
  const[sel,setSel]=useState(new Set());
  const isPrem=item?.id==='thali-premium';
  const toggle=id=>{
    const it=THALI_SIDES.find(x=>x.id===id);
    setSel(prev=>{
      const ns=new Set(prev);
      if(ns.has(id)){ns.delete(id);return ns;}
      const pC=[...ns].filter(k=>THALI_SIDES.find(x=>x.id===k)?.type==='protein').length;
      const sC=[...ns].filter(k=>THALI_SIDES.find(x=>x.id===k)?.type==='side').length;
      if(it.type==='protein'){if(!isPrem||pC>=1)return prev;}
      else if(sC>=2)return prev;
      ns.add(id);return ns;
    });
  };
  const addP=[...sel].reduce((s,id)=>s+(THALI_SIDES.find(x=>x.id===id)?.add||0),0);
  const baseA=THALI_BASE.find(b=>b.id===base)?.add||0;
  const total=(item?.price||0)+baseA+addP;
  const selN=[...sel].map(id=>THALI_SIDES.find(x=>x.id===id)?.nameBn).join(', ');
  const baseN=THALI_BASE.find(b=>b.id===base)?.nameBn||'';
  if(!item)return null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:9600,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(30,14,5,.65)',backdropFilter:'blur(4px)'}}/>
      <div className="hs" style={{position:'relative',width:'100%',maxWidth:480,background:C.cream,borderRadius:'24px 24px 0 0',maxHeight:'90vh',overflowY:'auto',animation:'slideUp .4s cubic-bezier(.22,1,.36,1)',boxShadow:'0 -20px 60px rgba(30,14,5,.2)'}}>
        <div style={{display:'flex',justifyContent:'center',padding:'14px 0 0'}}><div style={{width:40,height:4,borderRadius:4,background:C.sand}}/></div>
        <div style={{height:140,margin:'12px 20px',borderRadius:16,overflow:'hidden',position:'relative'}}>
          <Img src={item.img} alt={item.nameBn}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(30,14,5,.7),transparent)'}}/>
          <div style={{position:'absolute',bottom:12,left:14}}><h2 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:17,fontWeight:700,color:'#fff'}}>{item.nameBn}</h2></div>
        </div>
        <div style={{padding:'0 20px 110px'}}>
          {[{label:'ভিত্তি বেছে নিন',items:THALI_BASE,isBase:true},
            ...(isPrem?[{label:'প্রোটিন বেছে নিন (১টি)',items:THALI_SIDES.filter(x=>x.type==='protein'),isBase:false,col:C.purple}]:[]),
            {label:'পদ বেছে নিন (২টি)',items:THALI_SIDES.filter(x=>x.type==='side'),isBase:false,col:C.clay}
          ].map((sec,si)=>(
            <div key={si}>
              <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,fontWeight:700,color:C.mahog,marginBottom:10,marginTop:si>0?16:0}}>{sec.label}</h4>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:4}}>
                {sec.items.map(it=>{
                  const active=sec.isBase?(base===it.id):sel.has(it.id);
                  const col=sec.col||C.clay;
                  return(
                    <button key={it.id} onClick={()=>sec.isBase?setBase(it.id):toggle(it.id)} style={{padding:'10px 12px',borderRadius:10,cursor:'pointer',border:`2px solid ${active?col:C.sand}`,background:active?col+'14':'#fff',color:active?col:C.mahog,fontWeight:600,fontSize:13,display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .2s'}}>
                      <span>{it.nameBn}</span>{it.add>0&&<span style={{fontSize:11,color:C.mist}}>+৳{it.add}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{position:'sticky',bottom:0,background:'#fff',borderTop:`1px solid ${C.sand}`,padding:'14px 20px',display:'flex',alignItems:'center',gap:12}}>
          <div><div style={{fontSize:10,color:C.mist}}>সর্বমোট</div><div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:24,fontWeight:900,color:C.clay}}>৳{total}</div></div>
          <button onClick={()=>{add({...item,nameBn:`${item.nameBn} (${baseN}${selN?', '+selN:''})`,price:total});onClose();}} style={{flex:1,padding:'14px 0',borderRadius:12,border:'none',background:`linear-gradient(135deg,${C.clay},${C.mahogM})`,color:'#fff',fontWeight:700,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:`0 6px 20px ${C.clay}35`}}>
            <Plus size={16}/> থালি হাঁড়িতে দিন
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HERITAGE MODAL ────────────────────────────────────────────────────────
function HeritageModal({item,onClose}){
  const{add}=useCart();
  const[text,setText]=useState('');
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    if(!item)return;setText('');setLoading(true);
    (async()=>{
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:`তুমি শখের হাঁড়ির রন্ধন-ঐতিহ্য বিশেষজ্ঞ (উদ্যোক্তা: নুসরাত জাহান)। ২-৩টি কাব্যিক বাংলা বাক্যে এই খাবারের ঐতিহ্য ও স্বাদ বর্ণনা করো। কোনো মার্কডাউন নয়।`,messages:[{role:'user',content:`ঐতিহ্য বলো: ${item.nameBn} — ${item.descBn}`}]})});
        const d=await r.json();setText(d.content?.[0]?.text||'বাংলার মাটির স্বাদ, প্রজন্মের ভালোবাসা।');
      }catch{setText('ঘরের উঠোনের গন্ধ মাখা, মায়ের হাতের ছোঁয়ায় তৈরি — এই স্বাদ শখের হাঁড়িতেই পাওয়া যায়।');}
      finally{setLoading(false);}
    })();
  },[item]);
  if(!item)return null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:9500,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 16px'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(30,14,5,.65)',backdropFilter:'blur(5px)'}}/>
      <div style={{position:'relative',width:'100%',maxWidth:370,background:C.cream,borderRadius:24,overflow:'hidden',boxShadow:'0 32px 72px rgba(30,14,5,.28)',animation:'scaleIn .4s cubic-bezier(.22,1,.36,1)'}}>
        <div style={{height:155,position:'relative'}}><Img src={item.img} alt={item.nameBn}/>
          <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,${C.cream} 0%,transparent 60%)`}}/>
          <button onClick={onClose} style={{position:'absolute',top:11,right:11,background:'rgba(253,250,245,.9)',border:'none',borderRadius:'50%',width:33,height:33,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.mahog}}><X size={17}/></button>
        </div>
        <div style={{padding:'0 22px 22px',textAlign:'center'}}>
          <div style={{width:44,height:44,background:'#fff',borderRadius:'50%',margin:'-22px auto 12px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(61,31,10,.13)',border:`3px solid ${C.cream}`}}><Sparkles size={20} color={C.clay}/></div>
          <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:17,fontWeight:700,color:C.mahog,marginBottom:3}}>{item.nameBn}</h3>
          <p style={{fontSize:10,color:C.clay,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:13}}>AI Culinary Insight ✦</p>
          <div style={{background:C.parch,border:`1px solid ${C.sand}`,borderRadius:14,padding:'14px 16px',minHeight:90,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
            {loading?<div style={{textAlign:'center'}}><Loader2 size={20} color={C.clay} style={{animation:'spin 1s linear infinite',margin:'0 auto 6px',display:'block'}}/><p style={{fontSize:12,color:C.mist,animation:'pulse 1.5s infinite'}}>ঐতিহ্য খুঁজছি...</p></div>:<p style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,color:C.mahog,lineHeight:1.85,fontStyle:'italic'}}>"{text}"</p>}
          </div>
          <button onClick={()=>{add(item);onClose();}} style={{width:'100%',padding:'13px 0',background:`linear-gradient(135deg,${C.mahog},${C.mahogL})`,color:C.cream,border:'none',borderRadius:12,fontWeight:700,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
            <Plus size={16}/> হাঁড়িতে যোগ করুন (৳{item.price})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER REVIEW MODAL ────────────────────────────────────────────────────
function OrderReview({cart,totalPrice,onClose,onConfirm}){
  if(!cart.length)return null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:9400,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 16px'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(30,14,5,.6)',backdropFilter:'blur(4px)'}}/>
      <div className="hs" style={{position:'relative',width:'100%',maxWidth:400,background:C.cream,borderRadius:22,padding:'24px',maxHeight:'80vh',overflowY:'auto',animation:'scaleIn .35s cubic-bezier(.22,1,.36,1)',boxShadow:'0 28px 64px rgba(30,14,5,.24)'}}>
        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:C.parch,border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.mahog}}><X size={16}/></button>
        <div style={{textAlign:'center',marginBottom:18}}>
          <div style={{width:48,height:48,background:`linear-gradient(135deg,${C.clay},${C.gold})`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}><Award size={22} color="#fff"/></div>
          <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:18,fontWeight:700,color:C.mahog}}>অর্ডার রিভিউ</h3>
          <p style={{fontSize:12,color:C.mist,marginTop:3}}>অর্ডার দেওয়ার আগে একবার দেখে নিন</p>
        </div>
        {cart.map(i=>(
          <div key={i._k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:`1px solid ${C.sand}`}}>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div style={{width:44,height:44,borderRadius:9,overflow:'hidden',flexShrink:0}}><Img src={i.img} alt={i.nameBn}/></div>
              <div><div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:13,fontWeight:700,color:C.mahog}}>{i.nameBn.split('(')[0].trim()}</div><div style={{fontSize:11,color:C.mist}}>৳{i.price} × {i.qty}</div></div>
            </div>
            <div style={{fontFamily:"'Noto Serif Bengali',serif",fontWeight:700,color:C.clay}}>৳{i.price*i.qty}</div>
          </div>
        ))}
        <div style={{display:'flex',justifyContent:'space-between',padding:'13px 0 0',fontWeight:700,fontSize:15,color:C.mahog}}>
          <span>সর্বমোট</span><span style={{fontFamily:"'Noto Serif Bengali',serif",color:C.clay,fontSize:20}}>৳{totalPrice}</span>
        </div>
        {totalPrice>=FREE_DELIVERY&&<div style={{fontSize:12,color:C.green,fontWeight:600,display:'flex',alignItems:'center',gap:4,marginTop:5}}><Truck size={13}/> ফ্রি ডেলিভারি প্রযোজ্য!</div>}
        <button onClick={onConfirm} style={{width:'100%',padding:'14px 0',marginTop:18,background:`linear-gradient(135deg,${C.greenL},${C.green})`,color:'#fff',border:'none',borderRadius:12,fontWeight:700,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 6px 20px rgba(29,185,84,.28)'}}>
          <MessageCircle size={18}/> হোয়াটসঅ্যাপে নিশ্চিত করুন
        </button>
      </div>
    </div>
  );
}

// ─── CART DRAWER ───────────────────────────────────────────────────────────
function CartDrawer({open,onClose}){
  const{cart,upd,clr,totalPrice}=useCart();
  const[name,setName]=useState('');
  const[addr,setAddr]=useState('');
  const[note,setNote]=useState('');
  const[slot,setSlot]=useState(SLOTS[0]);
  const[chk,setChk]=useState(false);
  const[review,setReview]=useState(false);
  const tQty=cart.reduce((s,i)=>s+i.qty,0);
  const doCheckout=()=>{
    if(!name.trim()){alert('অনুগ্রহ করে আপনার নাম লিখুন।');return;}
    setChk(true);
    let m=`*🍛 Shokher Hadi Order*\n*উদ্যোক্তা: নুসরাত জাহান*\n\n*নাম:* ${name.trim()}\n`;
    if(addr.trim())m+=`*ঠিকানা:* ${addr.trim()}\n`;
    m+=`*ডেলিভারি:* ${slot}\n───────────────\n`;
    cart.forEach(i=>{m+=`${i.qty}× ${i.nameBn} — ৳${i.price*i.qty}\n`;});
    m+=`───────────────\n*সর্বমোট: ৳${totalPrice}*`;
    if(totalPrice>=FREE_DELIVERY)m+=`\n✅ ফ্রি ডেলিভারি!`;
    if(note.trim())m+=`\n*নির্দেশনা:* ${note.trim()}`;
    const a=document.createElement('a');a.href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`;a.target='_blank';a.rel='noopener noreferrer';document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(()=>setChk(false),1200);setReview(false);
  };
  const Inp=({v,set,ph,rows})=>{
    const b={width:'100%',padding:'12px 14px',border:`1.5px solid ${C.sand}`,borderRadius:11,fontSize:14,color:C.mahog,background:C.cream,outline:'none',transition:'border-color .2s'};
    const ev={onFocus:e=>e.target.style.borderColor=C.clay,onBlur:e=>e.target.style.borderColor=C.sand};
    return rows?<textarea value={v} onChange={e=>set(e.target.value)} placeholder={ph} rows={rows} style={{...b,resize:'none'}} {...ev}/>:<input value={v} onChange={e=>set(e.target.value)} placeholder={ph} style={b} {...ev}/>;
  };
  return(
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:7000,background:'rgba(30,14,5,.52)',backdropFilter:'blur(4px)',transition:'opacity .3s',opacity:open?1:0,pointerEvents:open?'auto':'none'}}/>
      <div style={{position:'fixed',top:0,right:0,bottom:0,zIndex:7100,width:'100%',maxWidth:430,background:C.cream,display:'flex',flexDirection:'column',transition:'transform .42s cubic-bezier(.22,1,.36,1)',transform:open?'translateX(0)':'translateX(100%)',boxShadow:'-16px 0 50px rgba(30,14,5,.14)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.sand}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(253,250,245,.9)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><ShoppingBag size={20} color={C.clay}/><span style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:18,fontWeight:700,color:C.mahog}}>আপনার হাঁড়ি</span>{tQty>0&&<span style={{background:C.clay,color:'#fff',borderRadius:'50%',width:21,height:21,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{tQty}</span>}</div>
          <div style={{display:'flex',gap:8}}>
            {cart.length>0&&<button onClick={clr} style={{fontSize:11,color:C.mist,background:C.parch,border:'none',borderRadius:8,padding:'5px 10px',cursor:'pointer',fontWeight:600}}>সব মুছুন</button>}
            <button onClick={onClose} style={{background:C.parch,border:'none',borderRadius:'50%',width:33,height:33,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.mahog}}><X size={17}/></button>
          </div>
        </div>
        <div className="hs" style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>
          {cart.length===0?(
            <div style={{height:'80%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:.65}}>
              <div style={{width:78,height:78,background:C.parch,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}><UtensilsCrossed size={36} color={C.clay}/></div>
              <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:19,color:C.mahog,marginBottom:6}}>হাঁড়ি একদম ফাঁকা!</h3>
              <p style={{color:C.mist,textAlign:'center',maxWidth:200,lineHeight:1.7,fontSize:14}}>মজাদার খাবার দিয়ে হাঁড়ি পূর্ণ করুন।</p>
            </div>
          ):(
            <>
              <FreeBar total={totalPrice}/>
              {cart.map(item=>(
                <div key={item._k} style={{display:'flex',alignItems:'center',gap:11,background:'#fff',borderRadius:14,border:`1px solid ${C.sand}`,padding:'10px 11px',marginBottom:9}}>
                  <div style={{width:58,height:58,borderRadius:10,overflow:'hidden',flexShrink:0}}><Img src={item.img} alt={item.nameBn}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:12,fontWeight:700,color:C.mahog,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',marginBottom:2}}>{item.nameBn}</h4>
                    <span style={{color:C.clay,fontWeight:700,fontSize:13}}>৳{item.price}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:5,background:C.parch,borderRadius:10,padding:'5px 6px',border:`1px solid ${C.sand}`}}>
                    <button onClick={()=>upd(item._k,-1)} style={{width:24,height:24,borderRadius:6,border:'none',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.mist}}><Minus size={11}/></button>
                    <span style={{fontWeight:700,fontSize:13,minWidth:16,textAlign:'center',color:C.mahog}}>{item.qty}</span>
                    <button onClick={()=>upd(item._k,1)} style={{width:24,height:24,borderRadius:6,border:'none',background:C.clay,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><Plus size={11}/></button>
                  </div>
                </div>
              ))}
              <div style={{background:C.parch,borderRadius:12,padding:'11px 14px',marginBottom:14,border:`1px solid ${C.sand}`}}>
                {cart.map(i=><div key={i._k} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:C.mist,marginBottom:3}}><span>{i.qty}× {i.nameBn.split('(')[0].trim()}</span><span>৳{i.price*i.qty}</span></div>)}
                <div style={{height:1,background:C.sand,margin:'7px 0'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:14,color:C.mahog}}><span>সর্বমোট</span><span style={{fontFamily:"'Noto Serif Bengali',serif",color:C.clay}}>৳{totalPrice}</span></div>
                {totalPrice>=FREE_DELIVERY&&<div style={{fontSize:11,color:C.green,fontWeight:600,marginTop:4,display:'flex',alignItems:'center',gap:4}}><Truck size={12}/> ফ্রি ডেলিভারি!</div>}
              </div>
              <div style={{background:'#fff',borderRadius:16,border:`1px solid ${C.sand}`,padding:'15px'}}>
                <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:15,color:C.mahog,marginBottom:12,display:'flex',alignItems:'center',gap:7}}><Info size={14} color={C.clay}/> ডেলিভারি তথ্য</h3>
                <div style={{display:'flex',flexDirection:'column',gap:9}}>
                  <Inp v={name} set={setName} ph="আপনার নাম *"/>
                  <Inp v={addr} set={setAddr} ph="ডেলিভারি ঠিকানা (পিকআপ হলে খালি রাখুন)" rows={3}/>
                  <div style={{position:'relative'}}>
                    <Calendar size={13} color={C.mist} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                    <ChevronDown size={12} color={C.mist} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                    <select value={slot} onChange={e=>setSlot(e.target.value)} style={{width:'100%',padding:'12px 36px 12px 34px',border:`1.5px solid ${C.sand}`,borderRadius:11,fontSize:14,color:C.mahog,background:C.cream,outline:'none',appearance:'none',cursor:'pointer'}}>
                      {SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Inp v={note} set={setNote} ph="বিশেষ নির্দেশনা (যেমন: ঝাল কম)"/>
                </div>
              </div>
            </>
          )}
        </div>
        {cart.length>0&&(
          <div style={{padding:'14px 20px',background:'#fff',borderTop:`1px solid ${C.sand}`,boxShadow:'0 -8px 24px rgba(30,14,5,.06)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:11}}>
              <span style={{color:C.mist,fontWeight:600,fontSize:13}}>সর্বমোট বিল</span>
              <span style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:26,fontWeight:900,color:C.clay}}>৳{totalPrice}</span>
            </div>
            <button onClick={()=>setReview(true)} style={{width:'100%',padding:'14px 0',background:`linear-gradient(135deg,${C.greenL},${C.green})`,color:'#fff',border:'none',borderRadius:14,fontWeight:700,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9,boxShadow:'0 6px 22px rgba(29,185,84,.28)'}}>
              <Eye size={17}/> রিভিউ করে অর্ডার দিন
            </button>
            <p style={{textAlign:'center',fontSize:10,color:C.mist,marginTop:7}}>উদ্যোক্তা: নুসরাত জাহান · {WHATSAPP}</p>
          </div>
        )}
      </div>
      {review&&<OrderReview cart={cart} totalPrice={totalPrice} onClose={()=>setReview(false)} onConfirm={()=>{if(!name.trim()){setReview(false);alert('অনুগ্রহ করে আপনার নাম লিখুন।');return;}doCheckout();}}/>}
    </>
  );
}

// ─── AI RECOMMENDER ────────────────────────────────────────────────────────
function AISection(){
  const[prompt,setPrompt]=useState('');
  const[resp,setResp]=useState('');
  const[loading,setLoading]=useState(false);
  const menuCtx=MENU.map(i=>`${i.nameBn} (৳${i.price}) — ${i.descBn}`).join('\n');
  const submit=async e=>{
    e.preventDefault();if(!prompt.trim())return;
    setLoading(true);setResp('');
    try{
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:`তুমি শখের হাঁড়ির AI (নুসরাত জাহান)।\nমেনু:\n${menuCtx}\nনিয়ম: শুধু বাংলায়, ২-৩ বাক্য, মেনু থেকে সাজেস্ট, উৎসাহী, কোনো মার্কডাউন নয়।`,messages:[{role:'user',content:prompt}]})});
      const d=await r.json();setResp(d.content?.[0]?.text||'দুঃখিত, এই মুহূর্তে পারছি না।');
    }catch{setResp('সাময়িক সমস্যা। একটু পরে চেষ্টা করুন।');}
    finally{setLoading(false);}
  };
  return(
    <section style={{maxWidth:760,margin:'0 auto 52px',padding:'0 20px'}}>
      <div style={{background:'linear-gradient(135deg,#FFF8F0,#FFF2EA)',borderRadius:24,padding:'26px 28px',border:`1px solid ${C.goldPl}`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:`radial-gradient(circle,${C.gold}22,transparent 70%)`}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${C.clay},${C.gold})`,display:'flex',alignItems:'center',justifyContent:'center'}}><Sparkles size={15} color="#fff"/></div>
            <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:18,fontWeight:700,color:C.mahog}}>কী খাবেন বুঝতে পারছেন না?</h3>
          </div>
          <p style={{color:C.mist,fontSize:14,lineHeight:1.7,marginBottom:16}}>আপনার মুড লিখুন — Shokher AI পরামর্শ দেবে!</p>
          <form onSubmit={submit} style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <input value={prompt} onChange={e=>setPrompt(e.target.value)} required placeholder="যেমন: বৃষ্টির দিনে গরম ঝাল কিছু চাই..." style={{flex:'1 1 220px',padding:'12px 16px',border:`1.5px solid ${C.goldPl}`,borderRadius:12,fontSize:14,color:C.mahog,background:'rgba(255,255,255,.8)',outline:'none'}}/>
            <button type="submit" disabled={loading||!prompt.trim()} style={{padding:'12px 20px',borderRadius:12,border:'none',background:loading?C.mist:`linear-gradient(135deg,${C.clay},${C.mahogM})`,color:'#fff',fontWeight:700,fontSize:14,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap',boxShadow:loading?'none':`0 5px 16px ${C.clay}28`}}>
              {loading?<><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> লোড হচ্ছে...</>:<><Sparkles size={13}/> ম্যাজিক</>}
            </button>
          </form>
          {resp&&<div style={{marginTop:14,padding:'13px 16px',background:'#fff',borderRadius:12,border:`1px solid ${C.goldPl}`,animation:'fadeUp .4s ease'}}><p style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,color:C.mahog,lineHeight:1.85}}><span style={{fontWeight:700,color:C.clay}}>Shokher AI ✦ </span>{resp}</p></div>}
        </div>
      </div>
    </section>
  );
}

// ─── WISHLIST MINI STRIP ───────────────────────────────────────────────────
function WishlistStrip({wishlist,onSelect}){
  const items=MENU.filter(i=>wishlist.includes(i.id));
  if(!items.length)return null;
  return(
    <section style={{maxWidth:1200,margin:'0 auto 44px',padding:'0 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
        <Heart size={16} color={C.rose} fill={C.rose}/>
        <h3 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:17,fontWeight:700,color:C.mahog}}>আপনার পছন্দের তালিকা</h3>
        <span style={{background:C.roseL,color:C.rose,fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:20}}>{items.length}টি</span>
      </div>
      <div className="hs" style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:4}}>
        {items.map(item=>(
          <button key={item.id} onClick={()=>onSelect(item.cat)} style={{flexShrink:0,width:130,borderRadius:14,overflow:'hidden',border:`1.5px solid ${C.sand}`,background:'#fff',cursor:'pointer',transition:'transform .25s',textAlign:'left'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            <div style={{height:80,overflow:'hidden'}}><Img src={item.img} alt={item.nameBn}/></div>
            <div style={{padding:'8px 10px'}}>
              <div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:12,fontWeight:700,color:C.mahog,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',lineHeight:1.4,marginBottom:3}}>{item.nameBn}</div>
              <div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:13,fontWeight:700,color:C.clay}}>৳{item.price}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
function AppInner(){
  const{totalQty,totalPrice,add,wishlist}=useCart();
  const[activeCat,setActiveCat]=useState('সব');
  const[search,setSearch]=useState('');
  const[cartOpen,setCartOpen]=useState(false);
  const[heritageItem,setHeritageItem]=useState(null);
  const[thaliItem,setThaliItem]=useState(null);
  const[toast,setToast]=useState('');
  const menuRef=useRef(null);
  const greeting=useGreeting();
  useEffect(()=>{document.body.style.overflow=(cartOpen||heritageItem||thaliItem)?'hidden':'';return()=>{document.body.style.overflow='';};},[cartOpen,heritageItem,thaliItem]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t);},[toast]);
  const addWithToast=useCallback((item)=>{add(item);setToast(`${item.nameBn.split('(')[0].trim()} যোগ হয়েছে!`);},[add]);
  const handleAdd=item=>{if(item.isThali)setThaliItem(item);else addWithToast(item);};
  const handleComboAdd=combo=>{addWithToast({...combo,img:combo.img,id:combo.id,_k:combo.id});};
  const scrollToMenu=cat=>{setActiveCat(cat);setTimeout(()=>menuRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),50);};
  const filtered=useMemo(()=>MENU.filter(item=>{
    const c=activeCat==='সব'||item.cat===activeCat;
    const q=search.toLowerCase();
    const s=!q||item.nameBn.toLowerCase().includes(q)||item.nameEn.toLowerCase().includes(q)||item.descBn.toLowerCase().includes(q)||(item.tags||[]).some(t=>t.toLowerCase().includes(q));
    return c&&s;
  }),[activeCat,search]);

  return(
    <div style={{minHeight:'100vh',background:C.cream}}>
      <GStyle/>
      <Toast msg={toast}/>
      {/* ── HEADER ── */}
      <header style={{position:'sticky',top:0,zIndex:5000,background:'rgba(253,250,245,.9)',backdropFilter:'blur(18px)',borderBottom:`1px solid ${C.sand}`}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',height:62,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:11}}>
            <div style={{width:38,height:38,borderRadius:'50%',background:`linear-gradient(135deg,${C.clay},${C.mahogM})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 3px 10px ${C.clay}40`,animation:'float 4s ease-in-out infinite'}}><UtensilsCrossed size={17} color="#fff"/></div>
            <div><div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:21,fontWeight:900,color:C.mahog,lineHeight:1}}>শখের হাঁড়ি</div><div style={{fontSize:9,color:C.mist,fontWeight:600,letterSpacing:'1.8px',textTransform:'uppercase'}}>নুসরাত জাহান · Cloud Kitchen</div></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={()=>scrollToMenu('সব')} style={{padding:'7px 13px',borderRadius:30,background:C.parch,color:C.mahog,fontWeight:600,fontSize:12,border:`1px solid ${C.sand}`,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><Search size={12}/> মেনু</button>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" style={{padding:'7px 13px',borderRadius:30,background:C.greenL+'18',color:C.greenL,fontWeight:700,fontSize:12,textDecoration:'none',border:`1.5px solid ${C.greenL}40`,display:'flex',alignItems:'center',gap:5}}><Phone size={12}/> অর্ডার</a>
            <button onClick={()=>setCartOpen(true)} style={{position:'relative',background:'none',border:'none',cursor:'pointer',padding:8,color:C.mahog}}>
              <ShoppingBag size={24}/>{totalQty>0&&<span style={{position:'absolute',top:2,right:2,background:C.clay,color:'#fff',width:18,height:18,borderRadius:'50%',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${C.cream}`,animation:'pop .4s ease'}}>{totalQty}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section>
          <div style={{height:520,position:'relative'}}>
            <Img src="/images/polao-platter-chicken.jpg" alt="শখের হাঁড়ি"/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(30,14,5,.88) 0%,rgba(30,14,5,.5) 65%,rgba(30,14,5,.12) 100%)'}}/>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 max(20px, 3vw)'}}>
              <div style={{maxWidth:540,animation:'fadeUp .8s ease both'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,background:'rgba(255,255,255,.1)',backdropFilter:'blur(8px)',padding:'7px 14px',borderRadius:30,width:'fit-content',border:'1px solid rgba(255,255,255,.15)'}}>
                  <greeting.Icon size={14} color={C.goldL}/><span style={{color:C.goldL,fontSize:13,fontWeight:700}}>{greeting.text} · {greeting.sub}</span>
                </div>
                <h1 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:'clamp(28px,5.5vw,56px)',fontWeight:900,color:'#fff',lineHeight:1.25,marginBottom:13,letterSpacing:'-0.5px'}}>ভালোবাসায় তৈরি,<br/><span style={{color:C.goldL}}>পরম যত্নে পরিবেশিত।</span></h1>
                <p style={{color:'rgba(255,255,255,.7)',fontSize:15,lineHeight:1.8,marginBottom:24,maxWidth:400}}>ঘরোয়া পরিবেশে তৈরি স্বাস্থ্যসম্মত খাবার, পিঠা-মিষ্টি ও ফ্রোজেন ফুড।</p>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button onClick={()=>scrollToMenu('সব')} style={{padding:'12px 24px',borderRadius:12,background:C.clay,color:'#fff',border:'none',fontWeight:700,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:`0 8px 24px ${C.clay}50'`}}><UtensilsCrossed size={15}/> মেনু দেখুন</button>
                  <button onClick={()=>scrollToMenu('পিঠা ও মিষ্টি')} style={{padding:'12px 20px',borderRadius:12,cursor:'pointer',background:'rgba(255,255,255,.12)',color:'#fff',border:'1.5px solid rgba(255,255,255,.3)',fontWeight:700,fontSize:15,backdropFilter:'blur(8px)',display:'flex',alignItems:'center',gap:7}}><Star size={15}/> পিঠা ও মিষ্টি</button>
                </div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div style={{background:C.mahog,padding:'15px 20px',display:'flex',justifyContent:'center',gap:'clamp(20px,5vw,54px)',flexWrap:'wrap'}}>
            {[{Icon:Heart,n:'১৫০০+',l:'সন্তুষ্ট গ্রাহক'},{Icon:Star,n:'৪.৯ ★',l:'রেটিং'},{Icon:Clock,n:'৩০ মিনিট',l:'ডেলিভারি'},{Icon:Leaf,n:'১০০%',l:'ঘরোয়া'}].map(s=>(
              <div key={s.n} style={{display:'flex',alignItems:'center',gap:9}}><s.Icon size={15} color={C.goldL}/><div><div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:15,fontWeight:900,color:C.goldL}}>{s.n}</div><div style={{fontSize:10,color:'rgba(255,255,255,.5)'}}>{s.l}</div></div></div>
            ))}
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div style={{maxWidth:520,margin:'36px auto 0',padding:'0 20px'}}>
          <div style={{position:'relative'}}>
            <Search size={16} color={C.mist} style={{position:'absolute',left:15,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="খাবার খুঁজুন... পিৎজা, দই, রোজ পিঠা, পোলাও" style={{width:'100%',padding:'14px 18px 14px 43px',border:`2px solid ${C.sand}`,borderRadius:50,fontSize:14,color:C.mahog,background:'#fff',outline:'none',boxShadow:'0 3px 14px rgba(61,31,10,.06)',transition:'all .25s'}} onFocus={e=>{e.target.style.borderColor=C.clay;}} onBlur={e=>{e.target.style.borderColor=C.sand;}}/>
            {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.mist,display:'flex',alignItems:'center'}}><X size={15}/></button>}
          </div>
        </div>

        {/* ── CATEGORY SHOWCASE ── */}
        <section style={{maxWidth:1200,margin:'40px auto 48px',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:22}}><h2 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:26,fontWeight:900,color:C.mahog,marginBottom:4}}>ক্যাটাগরি</h2><Divider/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:12}}>
            {CAT_SHOWCASE.map((c,i)=><CatCard key={c.cat} data={c} delay={i*.07} onSelect={scrollToMenu}/>)}
          </div>
        </section>

        {/* ── WISHLIST STRIP ── */}
        <WishlistStrip wishlist={wishlist} onSelect={scrollToMenu}/>

        {/* ── COMBO DEALS ── */}
        <section style={{maxWidth:1200,margin:'0 auto 52px',padding:'0 20px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <div><h2 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:23,fontWeight:900,color:C.mahog,marginBottom:3}}>কম্বো ডিল 🎁</h2><p style={{fontSize:13,color:C.mist}}>একসাথে নিলে বেশি সাশ্রয়!</p></div>
            <span style={{background:`linear-gradient(135deg,${C.clay},${C.gold})`,color:'#fff',fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:20,display:'flex',alignItems:'center',gap:4}}><Zap size={11}/> হট ডিল</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:18}}>
            {COMBOS.map(combo=><ComboCard key={combo.id} combo={combo} onAdd={handleComboAdd}/>)}
          </div>
        </section>

        {/* ── AI RECOMMENDER ── */}
        <AISection/>

        {/* ── FROZEN BANNER ── */}
        <FrozenBanner onSelect={scrollToMenu}/>

        {/* ── FULL MENU ── */}
        <section ref={menuRef} style={{maxWidth:1200,margin:'0 auto',padding:'0 20px 100px'}}>
          <div style={{textAlign:'center',marginBottom:24}}><h2 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:26,fontWeight:900,color:C.mahog,marginBottom:4}}>সম্পূর্ণ মেনু</h2><Divider/></div>
          <div className="hs" style={{display:'flex',gap:8,marginBottom:24,overflowX:'auto',paddingBottom:4}}>
            {CATS.map(cat=><CatPill key={cat} cat={cat} active={activeCat===cat} onClick={()=>setActiveCat(cat)}/>)}
          </div>
          {/* Count */}
          <div style={{fontSize:12,color:C.mist,marginBottom:16,display:'flex',alignItems:'center',gap:6}}>
            <UtensilsCrossed size={13} color={C.clay}/> {filtered.length}টি আইটেম পাওয়া গেছে
            {activeCat!=='সব'&&<span style={{background:CAT_META[activeCat]?.color||C.clay,color:'#fff',fontSize:10,fontWeight:700,padding:'2px 9px',borderRadius:20}}>{activeCat}</span>}
          </div>
          {filtered.length===0?(
            <div style={{textAlign:'center',padding:'70px 0',background:'#fff',borderRadius:20,border:`2px dashed ${C.sand}`}}><UtensilsCrossed size={40} color={C.sand} style={{margin:'0 auto 10px',display:'block'}}/><p style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:17,color:C.mist}}>কোনো খাবার পাওয়া যায়নি।</p><button onClick={()=>{setSearch('');setActiveCat('সব');}} style={{marginTop:14,padding:'10px 20px',borderRadius:30,background:C.clay,color:'#fff',border:'none',cursor:'pointer',fontWeight:600,fontSize:13}}>সব দেখুন</button></div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
              {filtered.map((item,i)=>(
                <div key={item.id} style={{animation:`fadeUp .5s ${i*.05}s cubic-bezier(.22,1,.36,1) both`}}>
                  <MenuCard item={item} onHeritage={setHeritageItem} onAdd={handleAdd}/>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{background:C.mahog,color:C.parch,padding:'46px 20px 26px'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:30,marginBottom:30}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{width:35,height:35,borderRadius:'50%',background:`linear-gradient(135deg,${C.clay},${C.mahogM})`,display:'flex',alignItems:'center',justifyContent:'center'}}><UtensilsCrossed size={15} color="#fff"/></div>
                  <div><div style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:19,fontWeight:900,color:C.goldL}}>শখের হাঁড়ি</div><div style={{fontSize:9,color:'rgba(255,255,255,.4)',letterSpacing:'1px'}}>নুসরাত জাহান</div></div>
                </div>
                <p style={{color:'rgba(253,250,245,.5)',fontSize:13,lineHeight:1.8,maxWidth:220}}>ঘরোয়া ভালোবাসায় তৈরি সেরা খাবার।</p>
              </div>
              <div>
                <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,color:C.goldL,marginBottom:10}}>যোগাযোগ</h4>
                {[{I:Phone,t:`+${WHATSAPP}`},{I:MapPin,t:'ঢাকা, বাংলাদেশ'}].map((r,i)=><div key={i} style={{display:'flex',gap:7,alignItems:'center',color:'rgba(253,250,245,.55)',fontSize:13,marginBottom:6}}><r.I size={12} color={C.gold}/> {r.t}</div>)}
              </div>
              <div>
                <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,color:C.goldL,marginBottom:10}}>সময়সূচী</h4>
                <p style={{color:'rgba(253,250,245,.55)',fontSize:13,lineHeight:1.9}}>প্রতিদিন সকাল ১০টা – রাত ১০টা<br/>প্রি-অর্ডার ২৪ ঘণ্টা</p>
              </div>
              <div>
                <h4 style={{fontFamily:"'Noto Serif Bengali',serif",fontSize:14,color:C.goldL,marginBottom:10}}>মেনু ক্যাটাগরি</h4>
                {CATS.slice(1).map(c=><div key={c} style={{fontSize:13,color:'rgba(253,250,245,.5)',marginBottom:4,cursor:'pointer'}} onClick={()=>scrollToMenu(c)}>→ {c}</div>)}
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.mahogL}`,paddingTop:18,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
              <p style={{color:'rgba(253,250,245,.3)',fontSize:11}}>© {new Date().getFullYear()} শখের হাঁড়ি · নুসরাত জাহান · সর্বস্বত্ব সংরক্ষিত</p>
              <div style={{display:'flex',gap:9}}>{[Instagram,Facebook].map((Icon,i)=><button key={i} style={{width:32,height:32,borderRadius:'50%',background:C.mahogL,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.goldL}}><Icon size={13}/></button>)}</div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── FLOATING CART ── */}
      {totalQty>0&&!cartOpen&&(
        <button onClick={()=>setCartOpen(true)} style={{position:'fixed',bottom:22,left:'50%',transform:'translateX(-50%)',zIndex:4000,maxWidth:340,width:'calc(100% - 32px)',background:`linear-gradient(135deg,${C.mahog},${C.mahogM})`,color:C.cream,border:'none',borderRadius:50,padding:'13px 22px 13px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',fontWeight:700,fontSize:15,cursor:'pointer',boxShadow:`0 10px 32px ${C.mahog}55`,animation:'fadeUp .4s ease'}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}><span style={{background:C.clay,width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900}}>{totalQty}</span>অর্ডার দেখুন</div>
          <div style={{display:'flex',alignItems:'center',gap:5,color:C.goldL}}><span style={{fontFamily:"'Noto Serif Bengali',serif",fontWeight:900}}>৳{totalPrice}</span><ArrowRight size={15}/></div>
        </button>
      )}

      {/* ── MODALS ── */}
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/>
      <HeritageModal item={heritageItem} onClose={()=>setHeritageItem(null)}/>
      <ThaliBuilder item={thaliItem} onClose={()=>setThaliItem(null)}/>
    </div>
  );
}

export default function App(){
  return <CartProvider><AppInner/></CartProvider>;
}
