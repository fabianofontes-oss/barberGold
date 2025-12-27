'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Smartphone, Eye, Save, Layout, MapPin, Globe, ExternalLink, Copy, Palette, Lock, ImageIcon, Type, Check } from 'lucide-react';

export const WebsiteEditor = () => {
  const { shopProfile } = useBarber();
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'LAYOUT' | 'THEME' | 'DOMAIN'>('CONTENT');
  const [copied, setCopied] = useState(false);
  
  // Theme State
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState('#09090b');
  const [selectedAccentColor, setSelectedAccentColor] = useState('#f59e0b');
  const [selectedTemplate, setSelectedTemplate] = useState('Classic Dark');
  
  const slug = shopProfile.slug || shopProfile.name.toLowerCase().replace(/\s+/g, '-');
  const siteUrl = `https://barber.app/${slug}`;

  const handleCopy = () => {
     navigator.clipboard.writeText(siteUrl);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
     console.log('Salvando configurações:', {
        primaryColor: selectedPrimaryColor,
        accentColor: selectedAccentColor,
        template: selectedTemplate
     });
     alert(`✅ Site atualizado!\n\nTema: ${selectedTemplate}\nCor Primária: ${selectedPrimaryColor}\nCor Destaque: ${selectedAccentColor}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
               <Globe className="w-8 h-8 text-amber-500" /> Editor de Website
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
               Personalize seu site de agendamento e atraia mais clientes.
            </p>
         </div>
         
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all">
               <Eye className="w-4 h-4" /> Preview
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-xl transition-all">
               <Save className="w-4 h-4" /> Salvar
            </button>
         </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
         <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
               <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Seu Link de Agendamento</label>
               <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                  <Globe className="w-5 h-5 text-zinc-500" />
                  <span className="text-emerald-400 font-mono flex-1 truncate">{siteUrl}</span>
                  <button onClick={handleCopy} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                     {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                  </button>
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all">
                     <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </a>
               </div>
            </div>
         </div>
      </div>

      <div className="flex gap-2 border-b border-zinc-800 overflow-x-auto">
         <button onClick={() => setActiveTab('CONTENT')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CONTENT' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><Type className="w-4 h-4" /> Conteúdo</button>
         <button onClick={() => setActiveTab('LAYOUT')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'LAYOUT' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><Layout className="w-4 h-4" /> Layout</button>
         <button onClick={() => setActiveTab('THEME')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'THEME' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><Palette className="w-4 h-4" /> Tema</button>
         <button onClick={() => setActiveTab('DOMAIN')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DOMAIN' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><Globe className="w-4 h-4" /> Domínio</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            {activeTab === 'CONTENT' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Seção Principal</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Título Principal</label>
                           <input type="text" defaultValue={shopProfile.name} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Subtítulo</label>
                           <input type="text" defaultValue="A melhor barbearia da cidade" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Imagem de Fundo</label>
                           <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer">
                              <ImageIcon className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">Clique para enviar imagem</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Sobre</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Descrição</label>
                           <textarea rows={4} defaultValue="Fundada em 2020, nossa barbearia oferece o melhor em cortes masculinos e tratamentos de barba." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none resize-none" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-500" /> Localização</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Endereço</label>
                           <input type="text" defaultValue={shopProfile.address} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none" />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'THEME' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Cores do Tema</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Cor Primária</label>
                           <div className="flex gap-2">
                              {['#09090b', '#022c22', '#2e1065', '#0f172a', '#083344'].map(color => (
                                 <button 
                                    key={color} 
                                    onClick={() => setSelectedPrimaryColor(color)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all relative ${
                                       selectedPrimaryColor === color ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-zinc-700 hover:border-amber-500'
                                    }`} 
                                    style={{ backgroundColor: color }}
                                 >
                                    {selectedPrimaryColor === color && (
                                       <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                                    )}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Cor de Destaque</label>
                           <div className="flex gap-2">
                              {['#f59e0b', '#10b981', '#a855f7', '#0ea5e9', '#ec4899'].map(color => (
                                 <button 
                                    key={color} 
                                    onClick={() => setSelectedAccentColor(color)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all relative ${
                                       selectedAccentColor === color ? 'border-white ring-2 ring-white/50' : 'border-zinc-700 hover:border-white'
                                    }`} 
                                    style={{ backgroundColor: color }}
                                 >
                                    {selectedAccentColor === color && (
                                       <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                                    )}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Templates Prontos</h3>
                     <div className="grid grid-cols-3 gap-4">
                        {[
                           { name: 'Classic Dark', primary: '#09090b', accent: '#f59e0b' },
                           { name: 'Minimal Light', primary: '#f9fafb', accent: '#10b981' },
                           { name: 'Bold Gold', primary: '#1c1917', accent: '#fbbf24' }
                        ].map((template) => (
                           <button 
                              key={template.name} 
                              onClick={() => {
                                 setSelectedTemplate(template.name);
                                 setSelectedPrimaryColor(template.primary);
                                 setSelectedAccentColor(template.accent);
                              }}
                              className={`p-4 rounded-xl border transition-all text-center ${
                                 selectedTemplate === template.name 
                                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30' 
                                    : 'border-zinc-800 hover:border-zinc-700'
                              }`}
                           >
                              <div className="w-full h-16 rounded-lg mb-2 flex gap-1">
                                 <div className="flex-1 rounded" style={{ backgroundColor: template.primary }}></div>
                                 <div className="w-4 rounded" style={{ backgroundColor: template.accent }}></div>
                              </div>
                              <span className="text-xs font-medium text-zinc-300">{template.name}</span>
                              {selectedTemplate === template.name && (
                                 <div className="mt-2 flex items-center justify-center gap-1 text-amber-500">
                                    <Check className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">ATIVO</span>
                                 </div>
                              )}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'DOMAIN' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Domínio Gratuito</h3>
                     <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center gap-2">
                        <span className="text-zinc-500">barber.app/</span>
                        <input type="text" defaultValue={slug} className="flex-1 bg-transparent text-white font-mono outline-none" />
                     </div>
                     <p className="text-xs text-zinc-500 mt-2">Este é o link gratuito do seu site de agendamento.</p>
                  </div>

                  <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-amber-500 text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg">PREMIUM</div>
                     <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-amber-500" />
                        <h3 className="text-lg font-bold text-white">Domínio Próprio</h3>
                     </div>
                     <p className="text-zinc-400 text-sm mb-4">Conecte seu próprio domínio (ex: www.suabarbearia.com.br) para uma experiência profissional.</p>
                     <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-xl transition-all">
                        Fazer Upgrade para Elite
                     </button>
                  </div>
               </div>
            )}

            {activeTab === 'LAYOUT' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Seções do Site</h3>
                     <p className="text-zinc-400 text-sm mb-4">Arraste para reordenar as seções do seu site.</p>
                     <div className="space-y-2">
                        {['Hero', 'Sobre', 'Serviços', 'Galeria', 'Equipe', 'Localização', 'Contato'].map((section, idx) => (
                           <div key={section} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-500">{idx + 1}</div>
                              <span className="flex-1 text-white font-medium">{section}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" defaultChecked className="sr-only peer" />
                                 <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </div>

         <div className="hidden lg:block">
            <div className="sticky top-6">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-bold text-zinc-500">Preview</span>
                     <Smartphone className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div className="bg-zinc-950 rounded-xl overflow-hidden aspect-[9/16] flex items-center justify-center">
                     <div className="text-center p-6">
                        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-2xl font-bold text-zinc-900">{shopProfile.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">{shopProfile.name}</h3>
                        <p className="text-zinc-500 text-sm mb-4">A melhor barbearia da cidade</p>
                        <button className="w-full bg-amber-500 text-zinc-900 font-bold py-3 rounded-xl">
                           Agendar Agora
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
