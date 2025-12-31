'use client';

import { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { 
  Eye, Save, 
  Layout, MapPin, Users, Scissors, Globe, 
  ArrowUp, ArrowDown, ShoppingBag, Star, Copy, Palette, Sparkles, Moon, Sun, Cloud, Lock,
  ImageIcon
} from 'lucide-react';
import { WebsiteSectionType } from '@/types';

export const WebsiteBuilder = () => {
  const { shopSettings, updateShopSettings, setView, shopProfile, updateShopProfile } = useBarber();
  const { canUseFeature } = useFeatureGate();
  
  const [config, setConfig] = useState(shopSettings.website);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'LAYOUT' | 'THEME' | 'DOMAIN'>('CONTENT');
  const [activeContentSection, setActiveContentSection] = useState<'HERO' | 'ABOUT' | 'GALLERY'>('HERO');

  const hasPremiumWebsite = canUseFeature('WEBSITE_PREMIUM');

  // FEATURE GATE BLOCK
  if (!hasPremiumWebsite) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6 text-center">
        <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
           <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-amber-500" />
           </div>
           <h1 className="text-xl font-bold text-white mb-2">
             Website Premium Bloqueado
           </h1>
           <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
             Website Premium disponível apenas no plano <strong>Studio</strong>.
           </p>
           <button onClick={() => setView('MY_PLAN')} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-xl transition-all">
             Fazer Upgrade Agora
           </button>
           <p className="text-[10px] text-zinc-500 mt-4">
             Seu site básico continua funcionando normalmente no link barber.gold.
           </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
     updateShopSettings({ website: config });
     alert('Site atualizado com sucesso!');
  };

  const handlePreview = () => {
     updateShopSettings({ website: config }); // Save first
     setView('PUBLIC_WEBSITE');
  };

  const copyBookingLink = () => {
     const slug = shopProfile.slug || shopProfile.name.toLowerCase().replace(/\s+/g, '-');
     const domain = shopProfile.customDomain || `barber.gold/${slug}`;
     navigator.clipboard.writeText(`https://${domain}`);
     alert('Link copied to clipboard!');
  };

  const handleSlugChange = (value: string) => {
     // Allow only a-z, 0-9, and hyphens
     const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
     updateShopProfile({ ...shopProfile, slug: clean });
  };

  // Reorder Logic
  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
     const newOrder = [...config.sectionOrder];
     
     const targetIndex = direction === 'UP' ? index - 1 : index + 1;
     
     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
     if (newOrder[index] === 'HERO' || newOrder[targetIndex] === 'HERO') return; // Lock Hero

     const temp = newOrder[targetIndex];
     newOrder[targetIndex] = newOrder[index];
     newOrder[index] = temp;
     
     setConfig({ ...config, sectionOrder: newOrder });
  };

  const toggleSection = (section: WebsiteSectionType) => {
     if (section === 'HERO') return; // Cannot hide hero
     const currentOrder = config.sectionOrder;
     if (currentOrder.includes(section)) {
        setConfig({ ...config, sectionOrder: currentOrder.filter(s => s !== section) });
     } else {
        setConfig({ ...config, sectionOrder: [...currentOrder, section] });
     }
  };

  // --- PRESET COLORS FOR CUSTOM THEME ---
  const PRIMARY_PRESETS = [
    { id: 'JUNGLE', value: '#022c22' }, // Deep Green
    { id: 'VIOLET', value: '#2e1065' }, // Deep Purple
    { id: 'SLATE', value: '#0f172a' },  // Deep Slate
    { id: 'OCEAN', value: '#083344' },  // Deep Cyan
    { id: 'ROSE', value: '#881337' },   // Deep Rose
  ];

  const ACCENT_PRESETS = [
    { id: 'EMERALD', value: '#10b981' }, // Green
    { id: 'PURPLE', value: '#a855f7' },  // Purple
    { id: 'SKY', value: '#0ea5e9' },     // Blue
    { id: 'PINK', value: '#ec4899' },    // Pink
    { id: 'LIME', value: '#84cc16' },    // Lime
  ];

  const RADIUS_OPTIONS = [
     { label: '0', value: '0px' },
     { label: 'SM', value: '4px' },
     { label: 'MD', value: '8px' },
     { label: 'LG', value: '16px' },
     { label: 'XL', value: '24px' }
  ];

  const updateCustomColor = (key: 'primary' | 'secondary' | 'accent' | 'text', value: string) => {
     // Ensure we have a valid base object
     const currentColors = config.customColors || { 
        primary: '#09090b', 
        secondary: '#18181b', 
        accent: '#f59e0b', 
        text: '#ffffff', 
        borderRadius: '1rem' 
     };

     setConfig(prev => ({
        ...prev,
        customColors: {
           ...currentColors,
           [key]: value
        }
     }));
  };

  const updateCustomPreset = (type: 'primary' | 'accent', value: string) => {
     const currentColors = config.customColors || { 
        primary: '#09090b', 
        secondary: '#18181b', 
        accent: '#f59e0b', 
        text: '#ffffff', 
        borderRadius: '1rem' 
     };
     
     const updates: any = { [type]: value };
     
     // Logic to auto-set a matching secondary color for Primary Presets
     if (type === 'primary') {
        const secondaryMap: Record<string, string> = {
           '#022c22': '#064e3b', // Jungle -> lighter jungle
           '#2e1065': '#4c1d95', // Violet -> lighter violet
           '#0f172a': '#1e293b', // Slate -> lighter slate
           '#083344': '#164e63', // Ocean -> lighter ocean
           '#881337': '#9f1239', // Rose -> lighter rose
        };
        if (secondaryMap[value]) {
           updates.secondary = secondaryMap[value];
        }
     }

     setConfig(prev => ({
        ...prev,
        customColors: { ...currentColors, ...updates }
     }));
  };

  const updateRadius = (value: string) => {
     const currentColors = config.customColors || { primary: '#09090b', secondary: '#18181b', accent: '#f59e0b', text: '#ffffff', borderRadius: '1rem' };
     setConfig({
        ...config,
        customColors: { ...currentColors, borderRadius: value }
     });
  };

  const resetToDefault = () => {
     setConfig({
        ...config,
        customColors: { primary: '#0f172a', secondary: '#1e293b', accent: '#38bdf8', text: '#ffffff', borderRadius: '1rem' }
     });
  };

  // Helper to check color active state safely
  const isColorActive = (current: string | undefined, target: string) => {
     if (!current) return false;
     return current.toLowerCase() === target.toLowerCase();
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
       {/* HEADER */}
       <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Globe className="w-8 h-8 text-amber-500" /> Website e Marca
             </h2>
             <p className="text-zinc-400">
                Personalize sua vitrine digital. É isso que seus clientes veem antes de agendar.
             </p>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={handlePreview}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all border border-zinc-700"
             >
                <Eye className="w-4 h-4" /> Visualização ao Vivo
             </button>
             <button 
                onClick={handleSave}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
             >
                <Save className="w-4 h-4" /> Publicar Alterações
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden pb-4">
          
          {/* LEFT: EDITOR CONTROLS */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
             
             {/* Main Tabs */}
             <div className="flex border-b border-zinc-800 overflow-x-auto">
                <button 
                   onClick={() => setActiveTab('CONTENT')} 
                   className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'CONTENT' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                   Content Editor
                </button>
                <button 
                   onClick={() => setActiveTab('LAYOUT')} 
                   className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'LAYOUT' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                   Layout & Sections
                </button>
                <button 
                   onClick={() => setActiveTab('THEME')} 
                   className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 flex items-center justify-center gap-2 ${activeTab === 'THEME' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                   <Palette className="w-3 h-3" /> Temas & Cores
                </button>
                <button 
                   onClick={() => setActiveTab('DOMAIN')} 
                   className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 flex items-center justify-center gap-2 ${activeTab === 'DOMAIN' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                   <Globe className="w-3 h-3" /> Domínio
                </button>
             </div>

             <div className="p-6 overflow-y-auto flex-1">
                
                {/* --- CONTENT EDITOR --- */}
                {activeTab === 'CONTENT' && (
                   <div className="flex gap-6 h-full flex-col md:flex-row">
                      {/* Sidebar for Content Sections */}
                      <div className="w-full md:w-40 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-zinc-800 pb-4 md:pb-0 md:pr-4 overflow-x-auto">
                         <button onClick={() => setActiveContentSection('HERO')} className={`text-left px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${activeContentSection === 'HERO' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800'}`}>Capa / Hero</button>
                         <button onClick={() => setActiveContentSection('ABOUT')} className={`text-left px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${activeContentSection === 'ABOUT' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800'}`}>Sobre Nós</button>
                         <button onClick={() => setActiveContentSection('GALLERY')} className={`text-left px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${activeContentSection === 'GALLERY' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800'}`}>Galeria</button>
                      </div>

                      {/* Form Area */}
                      <div className="flex-1 space-y-6 animate-fade-in max-w-xl">
                         {activeContentSection === 'HERO' && (
                            <>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título Principal</label>
                                  <input type="text" value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-bold text-lg" />
                                </div>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Subtítulo</label>
                                  <textarea rows={3} value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-amber-500 outline-none resize-none" />
                               </div>
                               
                               <ImageUpload 
                                  label="Imagem de Fundo" 
                                  value={config.heroImage} 
                                  onChange={(val) => setConfig({...config, heroImage: val})} 
                               />

                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Opacidade do Filtro ({config.coverOpacity})</label>
                                  <input type="range" min="0" max="0.9" step="0.1" value={config.coverOpacity} onChange={(e) => setConfig({...config, coverOpacity: Number(e.target.value)})} className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                               </div>
                            </>
                         )}

                         {activeContentSection === 'ABOUT' && (
                            <>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título da Seção</label>
                                  <input type="text" value={config.aboutTitle} onChange={(e) => setConfig({...config, aboutTitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" />
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Texto</label>
                                  <textarea rows={6} value={config.aboutText} onChange={(e) => setConfig({...config, aboutText: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-amber-500 outline-none resize-none leading-relaxed" />
                               </div>
                               <ImageUpload 
                                  label="Imagem Destaque" 
                                  value={config.aboutImage} 
                                  onChange={(val) => setConfig({...config, aboutImage: val})} 
                               />
                            </>
                         )}

                         {activeContentSection === 'GALLERY' && (
                            <div className="space-y-6">
                               <p className="text-sm text-zinc-400 mb-4">Adicione imagens e legendas para exibir no seu portfólio.</p>
                               <div className="grid grid-cols-1 gap-6">
                                  {config.gallery.map((item, idx) => (
                                     <div key={item.id} className="relative group bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                        <div className="flex gap-4">
                                           <div className="w-32">
                                              <ImageUpload 
                                                 value={item.url}
                                                 onChange={(val) => {
                                                    const newGallery = [...config.gallery];
                                                    newGallery[idx] = { ...item, url: val };
                                                    setConfig({...config, gallery: newGallery});
                                                 }}
                                                 className="h-full"
                                              />
                                           </div>
                                           <div className="flex-1 space-y-2">
                                              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Legenda / Título</label>
                                              <input 
                                                 type="text" 
                                                 placeholder="Ex: Corte Degradê Navalhado"
                                                 value={item.caption || ''}
                                                 onChange={(e) => {
                                                    const newGallery = [...config.gallery];
                                                    newGallery[idx] = { ...item, caption: e.target.value };
                                                    setConfig({...config, gallery: newGallery});
                                                 }}
                                                 className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none"
                                              />
                                           </div>
                                           <button 
                                              onClick={() => {
                                                 const newGallery = config.gallery.filter((_, i) => i !== idx);
                                                 setConfig({...config, gallery: newGallery});
                                              }}
                                              className="self-start p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                           >
                                              &times;
                                           </button>
                                        </div>
                                     </div>
                                  ))}
                                  
                                  {/* Add New Slot */}
                                  <button 
                                     onClick={() => setConfig({...config, gallery: [...config.gallery, { id: Date.now().toString(), url: '', caption: '' }]})}
                                     className="w-full py-4 border-2 border-dashed border-zinc-800 text-zinc-500 hover:text-amber-500 hover:border-amber-500/50 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-2"
                                  >
                                     <ImageIcon className="w-6 h-6" />
                                     <span>+ Adicionar Foto</span>
                                  </button>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                )}

                {/* --- THEMES TAB --- */}
                {activeTab === 'THEME' && (
                   <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                      <div className="text-center mb-8">
                         <h3 className="text-white font-bold text-lg mb-2">Identidade Visual</h3>
                         <p className="text-zinc-400 text-sm">Escolha um template pronto ou personalize as cores da sua marca.</p>
                      </div>

                      {/* Theme Selector Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         
                         {/* PREMIUM GOLD (DEFAULT) */}
                         <button 
                            onClick={() => setConfig({...config, themeTemplate: 'PREMIUM'})}
                            className={`relative group rounded-2xl overflow-hidden border-2 transition-all text-left ${config.themeTemplate === 'PREMIUM' ? 'border-amber-500 ring-4 ring-amber-500/10 scale-[1.02]' : 'border-zinc-800 hover:border-zinc-600'}`}
                         >
                            <div className="h-24 bg-zinc-900 relative">
                               <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950"></div>
                               <div className="absolute bottom-3 left-3 flex gap-2">
                                  <div className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800"></div>
                                  <div className="w-6 h-6 rounded-full bg-amber-500 border border-amber-600"></div>
                               </div>
                            </div>
                            <div className="p-4 bg-zinc-950">
                               <h4 className="font-bold text-white mb-1">Premium Gold</h4>
                               <p className="text-[10px] text-zinc-500">O padrão de excelência. Escuro, elegante e com toques dourados.</p>
                            </div>
                            {config.themeTemplate === 'PREMIUM' && (
                               <div className="absolute top-2 right-2 bg-amber-500 text-zinc-900 text-[10px] font-bold px-2 py-1 rounded">ATIVO</div>
                            )}
                         </button>

                         {/* PREMIUM CLASSIC BARBER (PIRULITO) */}
                         <button 
                            onClick={() => setConfig({...config, themeTemplate: 'CLASSIC'})}
                            className={`relative group rounded-2xl overflow-hidden border-2 transition-all text-left ${config.themeTemplate === 'CLASSIC' ? 'border-blue-500 ring-4 ring-blue-500/10 scale-[1.02]' : 'border-zinc-800 hover:border-zinc-600'}`}
                         >
                            <div className="h-24 bg-[#0b1120] relative overflow-hidden">
                               {/* Stylized Stripe */}
                               <div className="absolute top-0 right-0 w-20 h-full bg-white skew-x-12 opacity-10"></div>
                               
                               <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                                  <div className="w-6 h-6 rounded-full bg-[#0b1120] border border-white/20"></div>
                                  <div className="w-6 h-6 rounded-full bg-[#ffffff] border border-white/20"></div>
                                  <div className="w-6 h-6 rounded-full bg-[#dc2626] border border-white/20"></div>
                               </div>
                            </div>
                            <div className="p-4 bg-zinc-950">
                               <h4 className="font-bold text-white mb-1">Premium Classic Barber</h4>
                               <p className="text-[10px] text-zinc-500">Royal Navy & Branco. Alto contraste com toque clássico e limpo.</p>
                            </div>
                            {config.themeTemplate === 'CLASSIC' && (
                               <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">ATIVO</div>
                            )}
                         </button>

                         {/* CUSTOM */}
                         <button 
                            onClick={() => setConfig({...config, themeTemplate: 'CUSTOM'})}
                            className={`relative group rounded-2xl overflow-hidden border-2 transition-all text-left ${config.themeTemplate === 'CUSTOM' ? 'border-emerald-500 ring-4 ring-emerald-500/10 scale-[1.02]' : 'border-zinc-800 hover:border-zinc-600'}`}
                         >
                            <div className="h-24 bg-zinc-800 relative flex items-center justify-center">
                               <Palette className="w-8 h-8 text-zinc-600" />
                            </div>
                            <div className="p-4 bg-zinc-950">
                               <h4 className="font-bold text-white mb-1">Personalizado</h4>
                               <p className="text-[10px] text-zinc-500">Defina sua própria paleta de cores para combinar com sua marca.</p>
                            </div>
                            {config.themeTemplate === 'CUSTOM' && (
                               <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">ATIVO</div>
                            )}
                         </button>
                      </div>

                      {/* PREMIUM GOLD EXCLUSIVE: BACKGROUND VARIANT */}
                      {config.themeTemplate === 'PREMIUM' && (
                         <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in-up">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-amber-500" /> Premium Ambience
                            </h4>
                            <p className="text-xs text-zinc-400 mb-4">Escolha a atmosfera exclusiva do seu tema Premium Gold.</p>
                            
                            <div className="grid grid-cols-3 gap-4">
                               <button
                                  onClick={() => setConfig({...config, premiumBackground: 'DARK'})}
                                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${(!config.premiumBackground || config.premiumBackground === 'DARK') ? 'bg-zinc-950 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}
                               >
                                  <Moon className="w-5 h-5 text-zinc-400" />
                                  <span className="text-xs font-bold text-white">Midnight (Default)</span>
                               </button>
                               <button
                                  onClick={() => setConfig({...config, premiumBackground: 'GRAY'})}
                                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${config.premiumBackground === 'GRAY' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'}`}
                               >
                                  <Cloud className="w-5 h-5 text-zinc-400" />
                                  <span className="text-xs font-bold text-white">Titanium (Gray)</span>
                               </button>
                               <button
                                  onClick={() => setConfig({...config, premiumBackground: 'LIGHT'})}
                                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${config.premiumBackground === 'LIGHT' ? 'bg-zinc-50 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-50 border-zinc-300 hover:border-zinc-400'}`}
                               >
                                  <Sun className="w-5 h-5 text-zinc-900" />
                                  <span className="text-xs font-bold text-zinc-900">Platinum (Light)</span>
                               </button>
                            </div>
                         </div>
                      )}

                      {/* Custom Color Pickers */}
                      {config.themeTemplate === 'CUSTOM' && (
                         <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in-up">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                               <Palette className="w-4 h-4 text-emerald-500" /> Paleta de Cores
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cor Principal (Fundo)</label>
                                  <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                                     <input 
                                        type="color" 
                                        value={config.customColors?.primary || '#09090b'}
                                        onChange={(e) => updateCustomColor('primary', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                     />
                                     <span className="text-xs text-zinc-300 font-mono">{config.customColors?.primary || '#09090b'}</span>
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cor Secundária (Cards)</label>
                                  <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                                     <input 
                                        type="color" 
                                        value={config.customColors?.secondary || '#18181b'}
                                        onChange={(e) => updateCustomColor('secondary', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                     />
                                     <span className="text-xs text-zinc-300 font-mono">{config.customColors?.secondary || '#18181b'}</span>
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cor de Destaque (Botões)</label>
                                  <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                                     <input 
                                        type="color" 
                                        value={config.customColors?.accent || '#f59e0b'}
                                        onChange={(e) => updateCustomColor('accent', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                     />
                                     <span className="text-xs text-zinc-300 font-mono">{config.customColors?.accent || '#f59e0b'}</span>
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cor do Texto</label>
                                  <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                                     <input 
                                        type="color" 
                                        value={config.customColors?.text || '#ffffff'}
                                        onChange={(e) => updateCustomColor('text', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                     />
                                     <span className="text-xs text-zinc-300 font-mono">{config.customColors?.text || '#ffffff'}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                )}

                {/* --- LAYOUT EDITOR --- */}
                {activeTab === 'LAYOUT' && (
                   <div className="max-w-xl mx-auto">
                      <p className="text-sm text-zinc-400 mb-6 text-center">
                         Organize a ordem das seções do seu site. Ative ou desative o que deseja exibir.
                      </p>
                      
                      <div className="space-y-3">
                         {config.sectionOrder.map((section, index) => {
                            const isLocked = section === 'HERO';
                            const isVisible = config.sectionOrder.includes(section);
                            
                            // Map Types to Icons & Labels
                            let Icon = Layout;
                            let label: string = section;
                            if (section === 'HERO') { Icon = Star; label = 'Capa (Hero)'; }
                            if (section === 'ABOUT') { Icon = Users; label = 'Sobre Nós'; }
                            if (section === 'SERVICES') { Icon = Scissors; label = 'Serviços'; }
                            if (section === 'PRODUCTS') { Icon = ShoppingBag; label = 'Produtos'; }
                            if (section === 'GALLERY') { Icon = ImageIcon; label = 'Galeria'; }
                            if (section === 'REVIEWS') { Icon = Star; label = 'Avaliações'; }
                            if (section === 'LOCATION') { Icon = MapPin; label = 'Localização'; }

                            return (
                               <div key={section} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isLocked ? 'bg-zinc-950/50 border-zinc-800 opacity-80' : 'bg-zinc-900 border-zinc-700 hover:border-amber-500/50'}`}>
                                  <div className="flex-1 flex items-center gap-3">
                                     <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400"><Icon className="w-5 h-5" /></div>
                                     <span className="font-bold text-white">{label}</span>
                                  </div>
                                  
                                  {!isLocked && (
                                     <div className="flex items-center gap-2">
                                        <button onClick={() => moveSection(index, 'UP')} className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white"><ArrowUp className="w-4 h-4" /></button>
                                        <button onClick={() => moveSection(index, 'DOWN')} className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white"><ArrowDown className="w-4 h-4" /></button>
                                        
                                        <div className="w-px h-6 bg-zinc-800 mx-2"></div>
                                        
                                        <button 
                                           onClick={() => toggleSection(section)}
                                           className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                                        >
                                           Ativo
                                        </button>
                                     </div>
                                  )}
                                  {isLocked && <span className="text-xs text-zinc-600 font-bold px-3">FIXO</span>}
                               </div>
                            );
                         })}
                      </div>
                   </div>
                )}

                {/* --- DOMAIN & PRESENCE --- */}
                {activeTab === 'DOMAIN' && (
                   <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                      <div className="text-center mb-8">
                         <h3 className="text-white font-bold text-lg mb-2">Digital Presence</h3>
                         <p className="text-zinc-400 text-sm">Configure how clients find you online.</p>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Globe className="w-32 h-32" />
                         </div>
                         
                         <div className="relative z-10 space-y-6">
                            {/* Standard URL */}
                            <div>
                               <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">barber.gold URL (Free)</label>
                               <div className="flex items-center">
                                  <span className="bg-zinc-900 border border-r-0 border-zinc-800 text-zinc-500 px-4 py-3 rounded-l-xl text-sm font-mono">
                                     barber.gold/
                                  </span>
                                  <input 
                                     type="text" 
                                     value={shopProfile.slug}
                                     onChange={(e) => handleSlugChange(e.target.value)}
                                     className="flex-1 bg-zinc-900 border border-zinc-800 rounded-r-xl py-3 px-4 text-white focus:border-amber-500 outline-none text-sm font-bold font-mono"
                                     placeholder="your-shop-name"
                                  />
                               </div>
                               <div className="mt-2 flex justify-between items-center">
                                  <p className="text-[10px] text-zinc-600">
                                     Use this link on Instagram Bio or WhatsApp.
                                  </p>
                                  <button onClick={copyBookingLink} className="text-amber-500 text-xs font-bold hover:underline flex items-center gap-1">
                                     <Copy className="w-3 h-3" /> Copy Link
                                  </button>
                               </div>
                            </div>

                            <hr className="border-zinc-800" />

                            {/* Custom Domain */}
                            <div>
                               <div className="flex justify-between items-center mb-2">
                                  <label className="block text-xs font-bold text-white uppercase flex items-center gap-2">
                                     Domínio Personalizado <span className="bg-amber-500 text-zinc-900 text-[9px] px-1.5 rounded font-bold">PRO</span>
                                  </label>
                               </div>
                               <div className="flex items-center gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                  <Globe className="w-5 h-5 text-zinc-500" />
                                  <input 
                                     type="text" 
                                     value={shopProfile.customDomain || ''}
                                     onChange={(e) => updateShopProfile({ ...shopProfile, customDomain: e.target.value })}
                                     placeholder="www.suabarbearia.com.br"
                                     className="bg-transparent w-full text-sm text-white focus:outline-none font-bold"
                                  />
                               </div>
                               <div className="mt-3 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                  <p className="text-[10px] text-blue-300 leading-relaxed">
                                     To connect your domain, add a <b>CNAME</b> record in your DNS provider pointing to <b>sites.barber.gold</b>.
                                  </p>
                               </div>
                               <button className="mt-4 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border border-zinc-700 transition-all">
                                  Verify Connection
                                </button>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>

          {/* RIGHT: LIVE MOCKUP */}
          <div className="hidden lg:flex flex-col space-y-4">
             <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 flex flex-col items-center justify-center relative shadow-2xl">
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-zinc-900 border-8 border-zinc-800 rounded-[2rem] overflow-hidden w-[280px] h-[580px] relative shadow-2xl pointer-events-none select-none ring-4 ring-zinc-900">
                   {/* MOBILE MOCKUP CONTENT */}
                   <div 
                      className="absolute inset-0 bg-zinc-950 overflow-hidden flex flex-col overflow-y-auto scrollbar-hide"
                      style={{ 
                         backgroundColor: config.themeTemplate === 'CUSTOM' ? config.customColors?.primary : 
                                          (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? '#ffffff' : 
                                          (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'GRAY' ? '#27272a' : undefined))
                      }}
                   >
                      {/* Hero (Always Top) */}
                      <div className="relative h-1/2 w-full flex-shrink-0">
                         <img 
                           src={config.heroImage} 
                           alt="Imagem de fundo" 
                           className="w-full h-full object-cover" 
                         />
                         <div className="absolute inset-0 bg-black" style={{opacity: config.coverOpacity}}></div>
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center mt-4">
                            <h1 className="text-white font-bold text-xl leading-tight mb-2 drop-shadow-md">{config.heroTitle}</h1>
                            <p className="text-zinc-200 text-[10px] drop-shadow">{config.heroSubtitle}</p>
                            <div 
                               className="mt-3 px-4 py-1.5 text-[10px] font-bold shadow-lg"
                               style={{ 
                                  backgroundColor: config.themeTemplate === 'CUSTOM' ? config.customColors?.accent : 
                                                   (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? '#f59e0b' : '#f59e0b'), 
                                  color: (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT') ? '#09090b' : '#09090b',
                                  borderRadius: config.themeTemplate === 'CUSTOM' ? config.customColors?.borderRadius : '999px'
                               }}
                            >
                               Agendar
                            </div>
                         </div>
                      </div>
                      
                      {/* Dynamic Sections Mockup */}
                      <div className="p-4 space-y-4" style={{ 
                         backgroundColor: config.themeTemplate === 'CUSTOM' ? config.customColors?.primary : 
                                          (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? '#ffffff' : 
                                          (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'GRAY' ? '#27272a' : undefined))
                      }}>
                         {config.sectionOrder.filter(s => s !== 'HERO').map(section => (
                            <div 
                               key={section} 
                               className="p-3 border border-white/10"
                               style={{ 
                                  backgroundColor: config.themeTemplate === 'CUSTOM' ? config.customColors?.secondary : 
                                                   (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? '#f8fafc' : 
                                                   (config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'GRAY' ? '#3f3f46' : undefined)),
                                  borderRadius: config.themeTemplate === 'CUSTOM' ? config.customColors?.borderRadius : '0.5rem',
                                  boxShadow: config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                  borderColor: config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
                               }}
                            >
                               <p className={`text-[9px] font-bold uppercase mb-1 ${config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? 'text-zinc-800' : 'text-zinc-400'}`}>{section}</p>
                               <div className={`h-4 w-full mb-1 ${config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? 'bg-zinc-200' : 'bg-white/10'}`} style={{ borderRadius: '2px' }}></div>
                               <div className={`h-4 w-2/3 ${config.themeTemplate === 'PREMIUM' && config.premiumBackground === 'LIGHT' ? 'bg-zinc-200' : 'bg-white/10'}`} style={{ borderRadius: '2px' }}></div>
                            </div>
                         ))}
                      </div>
                   </div>
                   
                   {/* Phone Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-xl z-20"></div>
                </div>
                
                <div className="mt-6 text-center">
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Visualização Instantânea</p>
                   <p className="text-[10px] text-zinc-600 max-w-[200px]">Alterações aparecem aqui em tempo real. Clique em &quot;Visualização ao Vivo&quot; para ver a versão completa.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
