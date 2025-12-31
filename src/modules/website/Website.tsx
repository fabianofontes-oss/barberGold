'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { 
  Scissors, MapPin, Phone, Instagram, Clock, 
  CalendarCheck, Star, ArrowRight, User, ShoppingBag, 
  MessageSquare, Facebook, Mail, ArrowUp, Menu, X, LayoutDashboard
} from 'lucide-react';
import { ThemeColors } from '@/types';

// --- PREMIUM CLASSIC PALETTE (PIRULITO STRICT) ---
const CLASSIC_PALETTE = {
   GRAY: '#f3f4f6',  // Zinc 100
   RED: '#b91c1c',   // Red 700
   WHITE: '#ffffff', // White
   BLUE: '#172554',  // Blue 950 (Navy Background)
   BUTTON_BLUE: '#1e3a8a' // Blue 900 (Bright Navy for Buttons)
};

export const Website = () => {
  const { shopProfile, shopSettings, services, staff, products, setView } = useBarber();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [serviceCatFilter, setServiceCatFilter] = useState('ALL');
  const [productCatFilter, setProductCatFilter] = useState('ALL');
  const config = shopSettings.website;

  const handleBookNow = () => {
     setView('ONLINE_BOOKING');
     setIsMobileMenuOpen(false);
  };

  const handleScrollTo = (e: React.MouseEvent<any>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- THEME ENGINE ---
  const isClassic = config.themeTemplate === 'CLASSIC';
  const isLightMode = !isClassic && config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT';

  const getThemeColors = (): ThemeColors => {
     if (config.themeTemplate === 'CUSTOM' && config.customColors) {
        return { ...config.customColors, borderRadius: config.customColors?.borderRadius || '1rem' };
     }
     
     if (isClassic) {
        return {
           primary: CLASSIC_PALETTE.BLUE, 
           secondary: CLASSIC_PALETTE.WHITE,
           accent: CLASSIC_PALETTE.RED,
           text: CLASSIC_PALETTE.WHITE,
           borderRadius: '4px' // Sharp/Classic look
        };
     }

     // Default: Premium Gold (With new Background Variants)
     const variant = config.premiumBackground || 'DARK';
     
     // 1. LIGHT MODE (Platinum) - REFINED LUXURY
     if (variant === 'LIGHT') {
        return {
           primary: '#ffffff', // Pure White BG
           secondary: '#f4f4f5', // Zinc 100 (Light Gray for Cards)
           accent: '#f59e0b', // Amber 500 (Gold)
           text: '#18181b', // Zinc 900 (Black Text)
           borderRadius: '1rem'
        };
     }

     // 2. GRAY MODE (Titanium)
     if (variant === 'GRAY') {
        return {
           primary: '#27272a', // Zinc 800
           secondary: '#3f3f46', // Zinc 700
           accent: '#f59e0b', // Amber 500
           text: '#ffffff',
           borderRadius: '1rem'
        };
     }

     // 3. DARK MODE (Midnight - Original)
     return {
        primary: '#09090b', // Zinc 950
        secondary: '#18181b', // Zinc 900
        accent: '#f59e0b', // Amber 500
        text: '#ffffff',
        borderRadius: '1rem'
     };
  };

  const theme = getThemeColors();
  const radius = theme.borderRadius || '1rem';

  const buttonStyle = {
     backgroundColor: isLightMode ? '#f59e0b' : theme.accent, // Gold button in Light Mode for contrast
     color: '#09090b', // Black text on Gold button
     borderRadius: radius,
     boxShadow: isLightMode ? '0 4px 6px -1px rgba(245, 158, 11, 0.3)' : 'none', // Gold glow in light mode
     fontWeight: 'bold',
     textTransform: 'uppercase' as const,
     letterSpacing: '0.05em'
  };

  // --- STRICT STYLE CALCULATOR ---
  const getSectionTheme = (index: number) => {
      if (!isClassic) {
         // --- PREMIUM GOLD LOGIC ---
         
         if (isLightMode) {
            const lightCycle = index % 3;
            
            if (lightCycle === 0) {
               return {
                  bg: '#ffffff',
                  text: '#18181b',
                  cardBg: '#18181b', // Default fallback
                  cardText: '#ffffff',
                  btnBg: '#f59e0b',
                  btnText: '#000000',
                  borderColor: 'transparent',
                  shadow: 'none'
               };
            } else if (lightCycle === 1) {
               return {
                  bg: '#f4f4f5', // Zinc 100
                  text: '#18181b',
                  cardBg: '#18181b',
                  cardText: '#ffffff',
                  btnBg: '#f59e0b', 
                  btnText: '#000000',
                  borderColor: 'transparent',
                  shadow: 'none'
               };
            } else {
               // Dark section for contrast
               return {
                  bg: '#18181b', // Zinc 900
                  text: '#ffffff',
                  cardBg: '#27272a', 
                  cardText: '#ffffff',
                  btnBg: '#f59e0b', 
                  btnText: '#000000',
                  borderColor: 'rgba(255,255,255,0.1)',
                  shadow: 'none'
               };
            }
         }

         // Standard Dark/Gray Logic
         return {
            bg: index % 2 === 0 ? theme.primary : theme.secondary,
            text: theme.text,
            cardBg: index % 2 === 0 ? theme.secondary : theme.primary,
            cardText: theme.text,
            btnBg: theme.accent,
            btnText: '#000',
            borderColor: 'rgba(255,255,255,0.1)',
            shadow: 'none'
         };
      }

      // Classic Pirulito Cycle: 0:Gray -> 1:Red -> 2:White -> 3:Blue
      const cycle = index % 4;

      switch (cycle) {
         case 0: return { bg: CLASSIC_PALETTE.GRAY, text: CLASSIC_PALETTE.BLUE, cardBg: CLASSIC_PALETTE.WHITE, cardText: CLASSIC_PALETTE.BLUE, btnBg: CLASSIC_PALETTE.BUTTON_BLUE, btnText: CLASSIC_PALETTE.WHITE, borderColor: 'rgba(0,0,0,0.1)', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
         case 1: return { bg: CLASSIC_PALETTE.RED, text: CLASSIC_PALETTE.WHITE, cardBg: CLASSIC_PALETTE.BLUE, cardText: CLASSIC_PALETTE.WHITE, btnBg: CLASSIC_PALETTE.WHITE, btnText: CLASSIC_PALETTE.RED, borderColor: 'rgba(255,255,255,0.2)', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' };
         case 2: return { bg: CLASSIC_PALETTE.WHITE, text: CLASSIC_PALETTE.BLUE, cardBg: CLASSIC_PALETTE.GRAY, cardText: CLASSIC_PALETTE.BLUE, btnBg: CLASSIC_PALETTE.RED, btnText: CLASSIC_PALETTE.WHITE, borderColor: 'rgba(0,0,0,0.1)', shadow: 'none' };
         case 3: return { bg: CLASSIC_PALETTE.BLUE, text: CLASSIC_PALETTE.WHITE, cardBg: CLASSIC_PALETTE.WHITE, cardText: CLASSIC_PALETTE.BLUE, btnBg: CLASSIC_PALETTE.WHITE, btnText: CLASSIC_PALETTE.BLUE, borderColor: 'rgba(255,255,255,0.1)', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
         default: return { bg: '#fff', text: '#000', cardBg: '#eee', cardText: '#000', btnBg: '#000', btnText: '#fff' };
      }
  };

  // --- SECTION COMPONENT ---
  const SectionWrapper: React.FC<{ id: string; styles: any; children: React.ReactNode }> = ({ 
     id, 
     styles, 
     children 
  }) => {
     return (
        <section 
           id={id} 
           className="relative py-20 md:py-24 scroll-mt-20 transition-colors duration-500"
           style={{ 
              backgroundColor: styles.bg,
              color: styles.text,
           }}
        >
           <div className="max-w-7xl mx-auto px-6 relative">
              {children}
           </div>
        </section>
     );
  };

  const CategoryFilter = ({ items, current, onChange, textColor }: { items: any[], current: string, onChange: (c: string) => void, textColor: string }) => {
     const availableCats = Array.from(new Set(items.map((i: any) => i.category || 'Geral')));
     if (availableCats.length <= 1) return null;

     return (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide justify-center">
           <button 
              onClick={() => onChange('ALL')}
              className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all border-b-2`}
              style={{
                 borderRadius: isClassic ? '4px' : radius,
                 backgroundColor: 'transparent',
                 color: current === 'ALL' ? (isClassic ? textColor : (isLightMode ? '#f59e0b' : theme.accent)) : textColor,
                 borderColor: current === 'ALL' ? (isClassic ? textColor : (isLightMode ? '#f59e0b' : theme.accent)) : 'transparent',
                 opacity: current === 'ALL' ? 1 : 0.6
              }}
           >
              Todos
           </button>
           {availableCats.map((cat: any) => (
              <button 
                 key={cat}
                 onClick={() => onChange(cat)}
                 className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all border-b-2`}
                 style={{
                    borderRadius: isClassic ? '4px' : radius,
                    backgroundColor: 'transparent',
                    color: current === cat ? (isClassic ? textColor : (isLightMode ? '#f59e0b' : theme.accent)) : textColor,
                    borderColor: current === cat ? (isClassic ? textColor : (isLightMode ? '#f59e0b' : theme.accent)) : 'transparent',
                    opacity: current === cat ? 1 : 0.6
                 }}
              >
                 {cat}
              </button>
           ))}
        </div>
     );
  };

  // --- SECTIONS OMITTED FOR BREVITY AS THEY ARE MOSTLY CONTENT RENDERING (Kept Identical logic, wrapped in SectionWrapper) ---
  const ServiceSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     const filteredServices = services.filter(s => serviceCatFilter === 'ALL' || (s.category || 'Geral') === serviceCatFilter);
     const styles = getSectionTheme(visualIndex);
     const cardBg = isLightMode ? '#18181b' : styles.cardBg;
     const cardText = isLightMode ? '#ffffff' : styles.cardText;
     const btnBg = isLightMode ? '#f59e0b' : styles.btnBg;
     const btnText = isLightMode ? '#000000' : styles.btnText;

     return (
        <SectionWrapper id="services" styles={styles}>
           <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">Nossos Serviços</h2>
              <p className="opacity-80 max-w-xl mx-auto font-medium">Técnicas clássicas e modernas para garantir o seu melhor visual.</p>
           </div>
           <CategoryFilter items={services} current={serviceCatFilter} onChange={setServiceCatFilter} textColor={styles.text} />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                 <div key={service.id} className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border" 
                    style={{ borderRadius: radius, backgroundColor: cardBg, color: cardText, borderColor: styles.borderColor || 'transparent', boxShadow: styles.shadow }}>
                    <div className="flex justify-between items-start mb-4"><div className="p-3 transition-colors bg-current opacity-10 rounded-lg"><Scissors className="w-6 h-6" /></div><span className="font-bold text-xl">${service.price}</span></div>
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isLightMode ? 'text-white group-hover:text-amber-500' : 'group-hover:text-amber-500'}`}>{service.name}</h3>
                    <div className="flex items-center gap-2 opacity-70 text-sm mb-4"><Clock className="w-4 h-4" /><span>{service.durationMinutes} minutos</span></div>
                    <button onClick={handleBookNow} className="w-full font-bold transition-all text-sm hover:scale-105 active:scale-95 shadow-md py-3 uppercase tracking-wide" style={{ backgroundColor: btnBg, color: btnText, borderRadius: isClassic ? '4px' : radius }}>Agendar</button>
                 </div>
              ))}
           </div>
        </SectionWrapper>
     );
  };

  const TeamSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     const styles = getSectionTheme(visualIndex);
     return (
        <SectionWrapper id="team" styles={styles}>
           <div className="text-center mb-12"><h3 className="text-3xl font-bold mb-2">Equipe</h3><p className="opacity-80">Conheça nossos especialistas.</p></div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{staff.map(member => (<div key={member.id} className="text-center group"><div className={`relative mb-4 overflow-hidden shadow-lg border-4 aspect-[3/4] ${isLightMode ? 'group-hover:border-amber-500 transition-colors' : ''}`} style={{ borderRadius: radius, borderColor: styles.borderColor || 'transparent', backgroundColor: styles.cardBg }}>{member.avatar ? (<img src={member.avatar} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" />) : (<div className="w-full h-full flex items-center justify-center opacity-20" style={{color: styles.cardText}}><User className="w-12 h-12" /></div>)}</div><h3 className="text-lg font-bold">{member.name.split(' ')[0]}</h3><p className={`opacity-60 text-sm uppercase tracking-wider font-bold ${isLightMode ? 'text-amber-600' : ''}`}>Barber</p></div>))}</div>
        </SectionWrapper>
     );
  };

  const ProductSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     const filteredProducts = products.filter(p => productCatFilter === 'ALL' || (p.category || 'Geral') === productCatFilter);
     const styles = getSectionTheme(visualIndex);
     const cardBg = isLightMode ? '#18181b' : styles.cardBg;
     const cardText = isLightMode ? '#ffffff' : styles.cardText;
     const btnBg = isLightMode ? '#f59e0b' : styles.btnBg;
     const btnText = isLightMode ? '#000000' : styles.btnText;
     if (products.length === 0) return null;
     return (
        <SectionWrapper id="products" styles={styles}>
           <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos Premium</h2><p className="opacity-80 max-w-xl mx-auto font-medium">Leve o cuidado profissional para casa.</p></div>
           <CategoryFilter items={products} current={productCatFilter} onChange={setProductCatFilter} textColor={styles.text} />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{filteredProducts.map(product => (<div key={product.id} className="overflow-hidden group border" style={{ borderRadius: radius, backgroundColor: cardBg, borderColor: styles.borderColor || 'transparent', boxShadow: styles.shadow }}><div className="aspect-square relative overflow-hidden bg-white">{product.image ? (<img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />) : (<div className="w-full h-full flex items-center justify-center opacity-50"><ShoppingBag className="w-8 h-8 text-zinc-400" /></div>)}<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={handleBookNow} className="text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg px-4 py-2 uppercase" style={{ backgroundColor: btnBg, color: btnText, borderRadius: isClassic ? '4px' : radius }}>Comprar</button></div></div><div className="p-4 text-center"><h4 className="font-bold mb-1 truncate group-hover:text-amber-500 transition-colors" style={{color: cardText}}>{product.name}</h4><span className="font-bold opacity-80" style={{color: cardText}}>${product.price}</span></div></div>))}</div>
        </SectionWrapper>
     );
  };

  const GallerySection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     if (!config.gallery || config.gallery.length === 0) return null;
     const styles = getSectionTheme(visualIndex);
     return (
        <SectionWrapper id="gallery" styles={styles}>
           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Trabalho</h2><p className="opacity-80 font-medium">Um pouco do nosso dia a dia e resultados.</p></div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">{config.gallery.map((item, idx) => (<div key={idx} className="relative group overflow-hidden aspect-square bg-gray-100 shadow-md border-4" style={{ borderRadius: radius, borderColor: styles.cardBg }}><img src={item.url} alt={item.caption || `Foto ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">{item.caption && (<p className="text-white font-bold text-sm md:text-base translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.caption}</p>)}<span className="text-xs flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100 text-amber-500"><Instagram className="w-3 h-3" /> @{shopProfile.instagram?.replace('@','')}</span></div></div>))}</div>
        </SectionWrapper>
     );
  };

  const ReviewsSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     if (!config.externalReviews || config.externalReviews.length === 0) return null;
     const styles = getSectionTheme(visualIndex);
     return (
        <SectionWrapper id="reviews" styles={styles}>
           <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem sobre nós</h2><div className="flex justify-center gap-1 mb-4 text-amber-500"><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /></div></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{config.externalReviews.map(review => (<div key={review.id} className="p-6 relative border backdrop-blur-md" style={{ borderRadius: radius, borderColor: styles.borderColor || 'rgba(255,255,255,0.1)', backgroundColor: styles.cardBg, color: styles.cardText, boxShadow: styles.shadow }}><div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center border shadow-xl bg-white">{review.source === 'GOOGLE' && <span className="font-bold text-blue-600 text-sm">G</span>}{review.source === 'FACEBOOK' && <Facebook className="w-4 h-4 text-blue-600" />}{review.source === 'SYSTEM' && <Scissors className="w-4 h-4 text-zinc-900" />}</div><div className="flex gap-1 mb-3 text-xs text-amber-500">{Array.from({length: review.rating}).map((_, i) => <Star key={i} className="fill-current w-3 h-3" />)}</div><p className="text-sm italic mb-4 opacity-80">&quot;{review.text}&quot;</p><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs opacity-50 bg-current`}><span className="text-white mix-blend-difference">{review.name.charAt(0)}</span></div><div><p className="text-xs font-bold">{review.name}</p><p className="text-[10px] opacity-50">{review.date}</p></div></div></div>))}</div>
        </SectionWrapper>
     );
  };

  const LocationSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     const styles = getSectionTheme(visualIndex);
     return (
        <SectionWrapper id="location" styles={styles}>
           <div className="grid md:grid-cols-2 gap-12"><div><h2 className="text-3xl font-bold mb-6">Visite-nos</h2><div className="space-y-6"><div className="flex items-start gap-4"><div className="p-3 bg-current opacity-10 rounded-lg"><MapPin className="w-6 h-6" /></div><div><h4 className="font-bold mb-1">Endereço</h4><p className="opacity-70">{shopProfile.address}</p></div></div><div className="flex items-start gap-4"><div className="p-3 bg-current opacity-10 rounded-lg"><Phone className="w-6 h-6" /></div><div><h4 className="font-bold mb-1">Contato</h4><p className="opacity-70">{shopProfile.phone}</p><p className="opacity-70">{shopProfile.whatsapp}</p></div></div><div className="flex items-start gap-4"><div className="p-3 bg-current opacity-10 rounded-lg"><Clock className="w-6 h-6" /></div><div><h4 className="font-bold mb-1">Horários</h4><div className="opacity-70 text-sm space-y-1">{shopProfile.operatingHours?.filter(d => d.isActive).map(d => (<p key={d.dayIndex} className="flex justify-between w-40"><span>{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.dayIndex]}:</span><span>{d.startTime} - {d.endTime}</span></p>))}</div></div></div></div></div><div className="h-full min-h-[300px] flex items-center justify-center relative overflow-hidden group shadow-lg border" style={{borderRadius: radius, backgroundColor: '#e2e8f0', borderColor: styles.borderColor}}><div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Logo.png')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"></div><button className="bg-white text-zinc-900 font-bold px-6 py-3 shadow-xl z-10 flex items-center gap-2 hover:bg-zinc-200 transition-colors" style={{borderRadius: radius}}><MapPin className="w-5 h-5 text-red-500" /> Abrir no Maps</button></div></div>
        </SectionWrapper>
     );
  };

  const AboutSection: React.FC<{ visualIndex: number }> = ({ visualIndex }) => {
     const styles = getSectionTheme(visualIndex);
     return (
        <SectionWrapper id="about" styles={styles}>
           <div className="grid md:grid-cols-2 gap-12 items-center"><div className="relative group"><div className="absolute -inset-4 blur-xl transition-all duration-500 opacity-20 group-hover:opacity-40" style={{borderRadius: radius, backgroundColor: isClassic ? CLASSIC_PALETTE.BLUE : theme.accent}}></div><img src={config.aboutImage} className="relative w-full shadow-2xl border-4" style={{ borderRadius: radius, borderColor: styles.cardBg }} alt="About Us" /></div><div className="space-y-6"><h2 className="text-3xl md:text-4xl font-bold">{config.aboutTitle}</h2><div className="w-20 h-1 rounded-full bg-current opacity-30"></div><p className="leading-relaxed text-lg opacity-80">{config.aboutText}</p><div className="grid grid-cols-2 gap-6 pt-4"><div><span className="block text-3xl font-bold mb-1">5k+</span><span className="text-sm opacity-50">Clientes Atendidos</span></div><div><span className="block text-3xl font-bold mb-1">4.9</span><span className="text-sm opacity-50">Avaliação Média</span></div></div></div></div>
        </SectionWrapper>
     );
  };

  const sectionsToRender = config.sectionOrder.filter(s => s !== 'HERO');
  const renderList: string[] = [];
  sectionsToRender.forEach(section => { renderList.push(section); if (section === 'SERVICES' && config.showTeam) { renderList.push('TEAM'); } });

  const Footer = ({ visualIndex }: { visualIndex: number }) => {
     const styles = getSectionTheme(visualIndex);
     return (
        <footer className="py-12 border-t" style={{ backgroundColor: styles.bg, color: styles.text, borderColor: styles.borderColor || 'rgba(255,255,255,0.1)' }}>
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                 <div className="col-span-1 md:col-span-2"><div className="flex items-center gap-2 mb-4">{shopProfile.logo ? (<img src={shopProfile.logo} alt={shopProfile.name} className="h-8 w-auto grayscale opacity-80" />) : (<span className="font-bold text-xl">{shopProfile.name}</span>)}</div><p className="text-sm max-w-xs mb-6 opacity-70">A melhor experiência em barbearia clássica e moderna. Agende seu horário e sinta a diferença.</p><div className="flex gap-4 opacity-70"><a href={shopProfile.instagram} target="_blank" rel="noreferrer" className="hover:opacity-100 transition-colors"><Instagram className="w-5 h-5" /></a><a href={`https://wa.me/${shopProfile.whatsapp}`} target="_blank" rel="noreferrer" className="hover:opacity-100 transition-colors"><MessageSquare className="w-5 h-5" /></a><a href="mailto:contato@barbergold.com" className="hover:opacity-100 transition-colors"><Mail className="w-5 h-5" /></a></div></div>
                 <div><h4 className="font-bold mb-4">Links Rápidos</h4><ul className="space-y-2 text-sm opacity-60"><li><a href="#hero" onClick={(e)=>handleScrollTo(e, 'hero')} className="hover:opacity-100 transition-colors">Início</a></li><li><a href="#services" onClick={(e)=>handleScrollTo(e, 'services')} className="hover:opacity-100 transition-colors">Serviços</a></li><li><a href="#products" onClick={(e)=>handleScrollTo(e, 'products')} className="hover:opacity-100 transition-colors">Produtos</a></li><li><a href="#location" onClick={(e)=>handleScrollTo(e, 'location')} className="hover:opacity-100 transition-colors">Localização</a></li></ul></div>
                 <div><h4 className="font-bold mb-4">Contato</h4><ul className="space-y-2 text-sm opacity-60"><li className="flex items-center gap-2"><Phone className="w-3 h-3" /> {shopProfile.phone}</li><li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-1" /> {shopProfile.address}</li></ul></div>
              </div>
              <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50" style={{borderColor: styles.borderColor || 'rgba(255,255,255,0.1)'}}>
                 <p>&copy; {new Date().getFullYear()} {shopProfile.name}. Todos os direitos reservados.</p>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">Powered by <span className="font-bold">BarberFlow</span></div>
                    <button 
                       onClick={() => setView('AUTH')}
                       className="text-white hover:underline flex items-center gap-1 font-bold"
                    >
                       <LayoutDashboard className="w-3 h-3" /> Sou Proprietário
                    </button>
                 </div>
                 <button onClick={scrollToTop} className="md:hidden flex items-center gap-1 font-bold border px-3 py-1 rounded-full" style={{borderColor: styles.text}}>Topo <ArrowUp className="w-3 h-3" /></button>
              </div>
           </div>
        </footer>
     );
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden animate-fade-in ${isClassic ? 'bg-zinc-50' : ''}`} style={{backgroundColor: isClassic ? undefined : theme.primary}}>
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all" 
         style={{ 
            backgroundColor: isClassic ? 'rgba(23, 37, 84, 0.95)' : (isLightMode ? 'rgba(24, 24, 27, 0.95)' : `${theme.primary}CC`),
            borderColor: 'rgba(255,255,255,0.05)'
         }}>
         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a 
               href="#hero" 
               onClick={(e) => handleScrollTo(e, 'hero')}
               className="flex items-center gap-2 cursor-pointer group relative z-50"
            >
               {shopProfile.logo ? (
                  <img src={shopProfile.logo} alt={shopProfile.name} className="h-8 w-auto object-contain" />
               ) : (
                  <>
                     <div className="p-1.5 transition-transform group-hover:scale-110" style={{ borderRadius: radius, backgroundColor: isClassic ? CLASSIC_PALETTE.RED : theme.accent, color: isLightMode ? '#000' : '#fff' }}>
                        <Scissors className="w-5 h-5" />
                     </div>
                     <span className="font-bold text-xl tracking-tight transition-colors group-hover:opacity-80" style={{color: isLightMode ? '#fff' : theme.text}}>{shopProfile.name}</span>
                  </>
               )}
            </a>
            
            {/* DESKTOP LINKS */}
            <div className="hidden md:flex gap-8 text-sm font-medium opacity-80" style={{color: isLightMode ? '#fff' : theme.text}}>
               {config.sectionOrder.filter(s => s !== 'HERO').map(section => (
                  <a 
                     key={section} 
                     href={`#${section.toLowerCase()}`}
                     onClick={(e) => handleScrollTo(e, section.toLowerCase())}
                     className="hover:opacity-100 hover:text-amber-500 transition-all capitalize cursor-pointer"
                  >
                     {section === 'SERVICES' ? 'Serviços' : section === 'PRODUCTS' ? 'Produtos' : section === 'ABOUT' ? 'Sobre' : section === 'GALLERY' ? 'Fotos' : section === 'REVIEWS' ? 'Avaliações' : 'Localização'}
                  </a>
               ))}
            </div>

            {/* DESKTOP CTA */}
            <button 
               onClick={handleBookNow}
               className="hidden md:block font-bold px-6 py-2 text-sm transition-all shadow-lg hover:scale-105"
               style={isClassic ? { backgroundColor: CLASSIC_PALETTE.RED, color: 'white', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' } : buttonStyle}
            >
               Agendar Agora
            </button>

            {/* MOBILE HAMBURGER */}
            <button 
               className="md:hidden relative z-50 p-2"
               style={{ color: isLightMode ? '#fff' : theme.text }}
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
         </div>

         {/* MOBILE MENU OVERLAY */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 p-6 md:hidden animate-fade-in">
               {config.sectionOrder.filter(s => s !== 'HERO').map(section => (
                  <a 
                     key={section} 
                     href={`#${section.toLowerCase()}`}
                     onClick={(e) => handleScrollTo(e, section.toLowerCase())}
                     className="text-2xl font-bold text-zinc-400 hover:text-white capitalize transition-colors"
                  >
                     {section === 'SERVICES' ? 'Serviços' : section === 'PRODUCTS' ? 'Produtos' : section === 'ABOUT' ? 'Sobre Nós' : section === 'GALLERY' ? 'Galeria' : section === 'REVIEWS' ? 'Avaliações' : 'Localização'}
                  </a>
               ))}
               <hr className="w-20 border-zinc-800" />
               <button 
                  onClick={handleBookNow}
                  className="w-full max-w-xs font-bold py-4 text-lg shadow-2xl uppercase tracking-wide"
                  style={isClassic ? { backgroundColor: CLASSIC_PALETTE.RED, color: 'white', borderRadius: '4px' } : buttonStyle}
               >
                  Agendar Agora
               </button>
            </div>
         )}
      </nav>

      {/* HERO SECTION (Always First) - Special Styling */}
      <section id="hero" className="relative h-screen flex items-center justify-center text-center px-4 pt-20 overflow-hidden" 
         style={{ 
            marginBottom: '0'
         }}
      >
         <div className="absolute inset-0 z-0">
            <img 
               src={config.heroImage} 
               className="w-full h-full object-cover"
               alt="Barbershop Hero"
            />
            <div className="absolute inset-0 bg-black" style={{ opacity: config.coverOpacity }}></div>
            {/* GRADIENT FADE: Adapts to Light Mode (Fades to White) or Dark Mode (Fades to Black/Primary) */}
            <div 
               className="absolute inset-0"
               style={{ 
                  background: isLightMode 
                     ? 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0) 60%, #ffffff 100%)' 
                     : `linear-gradient(to bottom, transparent 50%, ${theme.primary} 100%)` 
               }}
            ></div>
         </div>

         <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border text-xs font-bold uppercase tracking-widest backdrop-blur-sm animate-fade-in-up" 
               style={{ borderRadius: radius, backgroundColor: isClassic ? 'rgba(255,0,0,0.2)' : `${theme.accent}20`, borderColor: isClassic ? CLASSIC_PALETTE.RED : `${theme.accent}40`, color: isClassic ? '#fff' : theme.accent }}>
               <Star className="w-3 h-3 fill-current" /> Premium Experience
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-fade-in-up text-white" style={{animationDelay: '100ms', textShadow: isClassic ? '4px 4px 0px #000' : '0 4px 10px rgba(0,0,0,0.5)'}}>
               {config.heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up opacity-90 text-zinc-100" style={{animationDelay: '200ms', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
               {config.heroSubtitle}
            </p>
            <div className="pt-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
               <button 
                  onClick={handleBookNow}
                  className="font-bold text-lg px-8 py-4 shadow-2xl transition-all hover:scale-105 flex items-center gap-2 mx-auto active:scale-95"
                  style={isClassic ? { backgroundColor: CLASSIC_PALETTE.RED, color: 'white', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '5px 5px 0px rgba(0,0,0,0.5)' } : buttonStyle}
               >
                  Agendar Horário <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </section>

      {/* DYNAMIC SECTIONS with Index for Pirulito Cycle */}
      {renderList.map((sectionName, idx) => {
         // Cycle starts at 0.
         const visualIndex = idx; 
         
         switch(sectionName) {
            case 'ABOUT': return <AboutSection key="about" visualIndex={visualIndex} />;
            case 'SERVICES': return <ServiceSection key="services" visualIndex={visualIndex} />;
            case 'TEAM': return <TeamSection key="team" visualIndex={visualIndex} />;
            case 'PRODUCTS': return <ProductSection key="products" visualIndex={visualIndex} />;
            case 'GALLERY': return <GallerySection key="gallery" visualIndex={visualIndex} />;
            case 'REVIEWS': return <ReviewsSection key="reviews" visualIndex={visualIndex} />;
            case 'LOCATION': return <LocationSection key="location" visualIndex={visualIndex} />;
            default: return null;
         }
      })}

      <Footer visualIndex={renderList.length} />

      {/* MOBILE FLOATING CTA */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden z-40">
         <button 
            onClick={handleBookNow}
            className="w-full font-bold py-4 shadow-2xl flex items-center justify-center gap-2 animate-bounce-slight active:scale-95 transition-transform"
            style={isClassic ? { backgroundColor: CLASSIC_PALETTE.BLUE, color: 'white', borderRadius: '4px', border: '2px solid white' } : buttonStyle}
         >
            <CalendarCheck className="w-5 h-5" /> Agendar Horário
         </button>
      </div>
    </div>
  );
};
