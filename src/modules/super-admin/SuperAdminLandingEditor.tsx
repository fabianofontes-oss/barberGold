'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Globe, Save, Monitor, Search, DollarSign, Type, MessageSquare, Check, X } from 'lucide-react';

export const SuperAdminLandingEditor = () => {
   const { landingPageConfig, updateLandingPageConfig } = useBarber();
   const [config, setConfig] = useState(landingPageConfig);
   const [activeTab, setActiveTab] = useState<'HERO' | 'SEO' | 'CONTENT'>('HERO');
   const [isSaving, setIsSaving] = useState(false);

   const handleSave = () => {
      setIsSaving(true);
      updateLandingPageConfig(config);
      setTimeout(() => setIsSaving(false), 1000);
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-indigo-500" /> Landing Page CMS
               </h2>
               <p className="text-zinc-400 text-sm">Controle o conteÃºdo pÃºblico do site BarberFlow (MÃ¡quina de Vendas).</p>
            </div>
            <button 
               onClick={handleSave}
               className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
               <Save className="w-5 h-5" /> {isSaving ? 'Salvando...' : 'Salvar AlteraÃ§Ãµes'}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
               <button 
                  onClick={() => setActiveTab('HERO')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'HERO' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
               >
                  <Monitor className="w-4 h-4" /> Hero / Capa
               </button>
               <button 
                  onClick={() => setActiveTab('CONTENT')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'CONTENT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
               >
                  <DollarSign className="w-4 h-4" /> Planos & ConteÃºdo
               </button>
               <button 
                  onClick={() => setActiveTab('SEO')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'SEO' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
               >
                  <Search className="w-4 h-4" /> SEO & Meta
               </button>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-3 space-y-6">
               
               {activeTab === 'HERO' && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 animate-fade-in">
                     <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5 text-zinc-500" /> Textos Principais
                     </h3>
                     
                     {/* Announcement Bar */}
                     <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                           <label className="text-xs font-bold text-zinc-500 uppercase">Barra de AnÃºncio (Topo)</label>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={config.announcementBar.enabled} onChange={e => setConfig({...config, announcementBar: {...config.announcementBar, enabled: e.target.checked}})} className="sr-only peer" />
                              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                           </label>
                        </div>
                        <input 
                           type="text" 
                           value={config.announcementBar.text}
                           onChange={e => setConfig({...config, announcementBar: {...config.announcementBar, text: e.target.value}})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none mb-2"
                           placeholder="Ex: Oferta de LanÃ§amento..."
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Headline Principal (H1)</label>
                        <input 
                           type="text" 
                           value={config.heroHeadline}
                           onChange={e => setConfig({...config, heroHeadline: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-lg font-bold focus:border-indigo-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">SubtÃ­tulo (H2)</label>
                        <textarea 
                           rows={3}
                           value={config.heroSubheadline}
                           onChange={e => setConfig({...config, heroSubheadline: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-indigo-500 outline-none resize-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Texto do BotÃ£o (CTA)</label>
                        <input 
                           type="text" 
                           value={config.heroCtaText}
                           onChange={e => setConfig({...config, heroCtaText: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold focus:border-indigo-500 outline-none"
                        />
                     </div>
                  </div>
               )}

               {activeTab === 'CONTENT' && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 animate-fade-in">
                     <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-zinc-500" /> ConfiguraÃ§Ã£o de SeÃ§Ãµes
                     </h3>

                     {/* Pricing Toggle */}
                     <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div>
                           <h4 className="text-white font-bold">Tabela de PreÃ§os</h4>
                           <p className="text-xs text-zinc-500">Exibir planos (Basic, Pro) na home page.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" checked={config.showPricing} onChange={e => setConfig({...config, showPricing: e.target.checked})} className="sr-only peer" />
                           <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                     </div>

                     {/* Testimonials Toggle */}
                     <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div>
                           <h4 className="text-white font-bold">Prova Social</h4>
                           <p className="text-xs text-zinc-500">Exibir seÃ§Ã£o de depoimentos de clientes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" checked={config.showTestimonials} onChange={e => setConfig({...config, showTestimonials: e.target.checked})} className="sr-only peer" />
                           <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                     </div>

                     {/* Featured Plan Selector */}
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Plano em Destaque (Best Value)</label>
                        <select 
                           value={config.featuredPlanId}
                           onChange={e => setConfig({...config, featuredPlanId: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                        >
                           <option value="BASIC">Basic Plan</option>
                           <option value="PRO">Pro Gold (Recomendado)</option>
                           <option value="ENTERPRISE">Enterprise</option>
                        </select>
                     </div>
                  </div>
               )}

               {activeTab === 'SEO' && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 animate-fade-in">
                     <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-zinc-500" /> OtimizaÃ§Ã£o para Buscas (SEO)
                     </h3>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Meta Title</label>
                        <input 
                           type="text" 
                           value={config.seoTitle}
                           onChange={e => setConfig({...config, seoTitle: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none"
                           placeholder="BarberFlow | O melhor sistema..."
                        />
                        <p className="text-[10px] text-zinc-600 mt-1">Aparece na aba do navegador e no Google.</p>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Meta Description</label>
                        <textarea 
                           rows={4}
                           value={config.seoDescription}
                           onChange={e => setConfig({...config, seoDescription: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-indigo-500 outline-none resize-none"
                           placeholder="Resumo curto sobre o software..."
                        />
                        <p className="text-[10px] text-zinc-600 mt-1">Recomendado: 150-160 caracteres.</p>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Keywords (Separadas por vÃ­rgula)</label>
                        <input 
                           type="text" 
                           value={config.seoKeywords}
                           onChange={e => setConfig({...config, seoKeywords: e.target.value})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none"
                           placeholder="barbearia, sistema, gestÃ£o..."
                        />
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};
