'use client';


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBarber } from '@/context/BarberContext';
import { useI18n } from '@/hooks/useI18n';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ShoppingCart, 
  Users, 
  Settings, 
  Scissors, 
  DollarSign, 
  ChevronUp, 
  UserCircle, 
  PackageSearch, 
  Globe, 
  Shield, 
  LogOut, 
  Activity, 
  Layers, 
  Server, 
  LifeBuoy, 
  Receipt, 
  Megaphone, 
  Puzzle, 
  TrendingUp, 
  LineChart, 
  Zap, 
  Crown, 
  Handshake, 
  Menu, 
  X,
  Banknote // Changed from Trophy to Banknote
} from 'lucide-react';
import { ViewState } from '@/types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const router = useRouter();
  const { currentUser, logout, shopProfile, shopSettings } = useBarber();
  const { canUseFeature } = useFeatureGate();
  const { t } = useI18n();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Validação de segurança
  if (!currentUser) {
    return null;
  }

  const NavItem = ({ href, icon: Icon, label, disabled = false, className = '' }: { href: string; icon: any; label: string; disabled?: boolean; className?: string }) => (
    <button
      onClick={() => {
        if (!disabled) {
          router.push(href);
          onCloseMobile();
        }
      }}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
      } ${className}`}
    >
      <Icon className={`w-5 h-5 ${disabled ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-100'}`} />
      <span>{label}</span>
    </button>
  );

  const isOwner = currentUser.role === 'OWNER';
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  
  // Feature Checks
  const hasPremiumWebsite = canUseFeature('WEBSITE_PREMIUM');
  
  // Owner Referral Link Construction
  const ownerCode = shopSettings.referralConfig?.ownerReferralCode || 'CODE';
  const ownerLink = `https://barberflow.app/r/${ownerCode}`;

  return (
    <>
    <aside
      id="mobile-sidebar"
      className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:block
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 overflow-y-auto h-[calc(100%-190px)]">
        <div className="flex items-center gap-3 mb-8">
          {isSuperAdmin ? (
             <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                   <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h1 className="font-bold text-xl text-white leading-none">{t('sidebar.centralOffice')}</h1>
                   <p className="text-xs text-indigo-400 mt-1 font-bold">{t('sidebar.godMode')}</p>
                </div>
             </div>
          ) : shopProfile.logo ? (
             <img src={shopProfile.logo} alt={shopProfile.name} className="h-10 w-auto object-contain max-w-full" />
          ) : (
             <>
               <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
                 <Scissors className="w-6 h-6 text-zinc-950" />
               </div>
               <div>
                 <h1 className="font-bold text-xl text-white leading-none truncate max-w-[150px]">{shopProfile.name}</h1>
                 <p className="text-xs text-zinc-500 mt-1">{t('app.premiumMgmt')}</p>
               </div>
             </>
          )}
        </div>

        <nav className="space-y-2">
          {/* SUPER ADMIN MENU (GOD MODE) */}
          {isSuperAdmin ? (
             <>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">{t('sidebar.commandCenter')}</p>
               <NavItem href="/app/super-admin" icon={Activity} label={t('sidebar.liveMonitor')} />
               <NavItem href="/app/super-admin" icon={Users} label={t('sidebar.barbershops')} />
               <NavItem href="/app/super-admin" icon={Layers} label={t('sidebar.plansAndFeatures')} />
               
               {/* Office God V2 Button */}
               <div className="mx-4 my-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                       router.push('/app/super-admin');
                       onCloseMobile();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold bg-violet-900/20 text-violet-300 border border-violet-500/30 hover:bg-violet-900/40 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4" />
                       <span>{t('sidebar.godOfficeV2')}</span>
                    </div>
                    <span className="text-[9px] bg-violet-500 text-white px-1.5 py-0.5 rounded uppercase font-bold">{t('sidebar.beta')}</span>
                  </button>
               </div>

               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">{t('sidebar.operations')}</p>
               <NavItem href="/app/super-admin" icon={Handshake} label={t('sidebar.partnerProgram')} />
               <NavItem href="/app/super-admin" icon={Megaphone} label={t('sidebar.marketingCenter')} />
               <NavItem href="/app/super-admin" icon={Globe} label={t('sidebar.publicSiteCMS')} />
               <NavItem href="/app/super-admin" icon={LifeBuoy} label={t('sidebar.support')} />
               <NavItem href="/app/super-admin" icon={Receipt} label={t('sidebar.globalBilling')} />
               
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">{t('sidebar.ecosystem')}</p>
               <NavItem href="/app/super-admin" icon={Puzzle} label={t('sidebar.appStore')} />
               
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">{t('sidebar.infrastructure')}</p>
               <NavItem href="/app/super-admin" icon={Server} label={t('sidebar.systemOps')} />
               
               <div className="my-2 border-t border-zinc-800 opacity-50"></div>
               <NavItem href="/app/super-admin" icon={Settings} label={t('sidebar.globalSettings')} />
             </>
          ) : (
             /* STANDARD BARBERSHOP MENU */
             <>
               <NavItem href="/app/dashboard" icon={LayoutDashboard} label={t('navigation.panel')} />
               <NavItem href="/app/agenda" icon={CalendarDays} label={t('navigation.calendar')} />
               <NavItem href="/app/pdv" icon={ShoppingCart} label={t('navigation.pointOfSale')} />
               <NavItem href="/app/clients" icon={Users} label={t('navigation.clients')} /> 
               
               {(isOwner) && (
                  <NavItem href="/app/catalog" icon={PackageSearch} label={t('navigation.catalog')} />
               )}

               <NavItem href="/app/finance" icon={DollarSign} label={isOwner ? t('navigation.finance') : t('navigation.myEarnings')} />
               
               {isOwner && (
                  <>
                     <NavItem href="/app/barber-club" icon={Crown} label={t('navigation.barberClub')} className="text-purple-500 font-bold" />
                     <NavItem href="/app/smart-pricing" icon={LineChart} label={t('navigation.dynamicPricing')} className="text-emerald-500 font-bold" />
                  </>
               )}

               <div className="pt-4 mt-4 border-t border-zinc-800">
                 {/* MY_PLAN moved to footer */}
                 <NavItem href="/app/settings" icon={Settings} label={isOwner ? t('navigation.settings') : t('navigation.myProfile')} />
                 
                 {isOwner && (
                    <NavItem href="/app/website" icon={Globe} label={t('navigation.websiteAndBrand')} />
                 )}
               </div>
             </>
          )}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full bg-zinc-900 border-t border-zinc-800">
        
        {/* PLAN PROMO BLOCK - OCULTO (Sistema gratuito) */}
        {/* {isOwner && !isSuperAdmin && (
           <button
              onClick={() => {
                 setView('MY_PLAN');
                 onCloseMobile();
              }}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 flex items-center justify-between group transition-colors relative overflow-hidden border-b border-black/10"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-800/50 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                 <div className="bg-white/20 p-2 rounded-full text-white">
                    <Crown className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-xs leading-none mb-0.5">Assinatura</p>
                    <p className="text-[10px] text-violet-100 font-medium">Planos e Recursos</p>
                 </div>
              </div>
           </button>
        )} */}

        {/* REFERRAL PROMO BLOCK (OWNER ONLY - FULL WIDTH GREEN) */}
        {isOwner && !isSuperAdmin && (
           <button
              onClick={() => {
                 router.push('/app/referrals');
                 onCloseMobile();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 flex items-center justify-between group transition-colors relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/50 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                 <div className="bg-white/20 p-2 rounded-full text-white">
                    <Banknote className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-xs leading-none mb-0.5">{t('navigation.referrals')}</p>
                    <p className="text-[10px] text-emerald-100 font-medium">{t('navigation.earnMoney')}</p>
                 </div>
              </div>
           </button>
        )}

        <div className="p-4">
          <button 
             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
             className="w-full flex items-center justify-between hover:bg-zinc-800 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-zinc-700 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-zinc-500" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-white">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-zinc-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
               <div className="max-h-48 overflow-y-auto">
                  {/* LOGOUT OPTION */}
                  <button
                     onClick={logout}
                     className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 hover:text-red-500 text-left transition-colors text-zinc-400"
                  >
                     <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                        <LogOut className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">{t('sidebar.logout')}</p>
                        <p className="text-[10px] opacity-70">{t('sidebar.logout')}</p>
                     </div>
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
