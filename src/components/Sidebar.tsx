'use client';


import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { OwnerReferralModal } from '@/modules/settings/modals/OwnerReferralModal';
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
  const { currentView, setView, currentUser, staff, switchUser, shopProfile, logout, shopSettings } = useBarber();
  const { canUseFeature } = useFeatureGate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label, disabled = false, className = '' }: { view: ViewState; icon: any; label: string; disabled?: boolean; className?: string }) => (
    <button
      onClick={() => {
        if (!disabled) {
          setView(view);
          onCloseMobile();
        }
      }}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-amber-500 text-zinc-990 font-semibold shadow-lg shadow-amber-500/20' 
          : disabled ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
      } ${className}`}
    >
      <Icon className={`w-5 h-5 ${currentView === view ? 'text-zinc-950' : disabled ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-100'}`} />
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
                   <h1 className="font-bold text-xl text-white leading-none">HQ Office</h1>
                   <p className="text-xs text-indigo-400 mt-1 font-bold">God Mode</p>
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
                 <p className="text-xs text-zinc-500 mt-1">Premium Mgmt.</p>
               </div>
             </>
          )}
        </div>

        <nav className="space-y-2">
          {/* SUPER ADMIN MENU (GOD MODE) */}
          {isSuperAdmin ? (
             <>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">Command Center</p>
               <NavItem view="SUPER_ADMIN_DASHBOARD" icon={Activity} label="Live Monitor" className={currentView === 'SUPER_ADMIN_DASHBOARD' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_TENANTS" icon={Users} label="Barbershops" className={currentView === 'SUPER_ADMIN_TENANTS' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_PLANS" icon={Layers} label="Plans & Features" className={currentView === 'SUPER_ADMIN_PLANS' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               
               {/* Office God V2 Button */}
               <div className="mx-4 my-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                       setView('SUPER_OFFICE_V2');
                       onCloseMobile();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold bg-violet-900/20 text-violet-300 border border-violet-500/30 hover:bg-violet-900/40 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4" />
                       <span>Office God V2</span>
                    </div>
                    <span className="text-[9px] bg-violet-500 text-white px-1.5 py-0.5 rounded uppercase font-bold">Beta</span>
                  </button>
               </div>

               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">Operations</p>
               <NavItem view="SUPER_ADMIN_PARTNERS" icon={Handshake} label="Partner Program" className={currentView === 'SUPER_ADMIN_PARTNERS' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_MARKETING" icon={Megaphone} label="Marketing HQ" className={currentView === 'SUPER_ADMIN_MARKETING' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_CMS" icon={Globe} label="Public Site CMS" className={currentView === 'SUPER_ADMIN_CMS' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_SUPPORT" icon={LifeBuoy} label="Helpdesk" className={currentView === 'SUPER_ADMIN_SUPPORT' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               <NavItem view="SUPER_ADMIN_BILLING" icon={Receipt} label="Global Billing" className={currentView === 'SUPER_ADMIN_BILLING' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">Ecosystem</p>
               <NavItem view="SUPER_ADMIN_MARKETPLACE" icon={Puzzle} label="App Store / Add-ons" className={currentView === 'SUPER_ADMIN_MARKETPLACE' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : ''} />
               
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2 mt-4">Infrastructure</p>
               <NavItem view="SUPER_ADMIN_SYSTEM" icon={Server} label="System Ops" className={currentView === 'SUPER_ADMIN_SYSTEM' ? 'bg-red-900/50 text-red-100 border border-red-500/30' : 'text-red-400 hover:text-red-300'} />
               
               <div className="my-2 border-t border-zinc-800 opacity-50"></div>
               <NavItem view="SUPER_ADMIN_SETTINGS" icon={Settings} label="Global Settings" />
             </>
          ) : (
             /* STANDARD BARBERSHOP MENU */
             <>
               <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
               <NavItem view="AGENDA" icon={CalendarDays} label="Agenda" />
               <NavItem view="PDV" icon={ShoppingCart} label="Point of Sale" />
               <NavItem view="CLIENTS" icon={Users} label="Clients" /> 
               
               {(isOwner) && (
                  <NavItem view="CATALOG" icon={PackageSearch} label="Catalog" />
               )}

               <NavItem view="FINANCE" icon={DollarSign} label={isOwner ? "Finance" : "My Earnings"} />
               
               {isOwner && (
                  <>
                     <NavItem view="BARBER_CLUB" icon={Crown} label="Barber Club™" className="text-purple-500 font-bold" />
                     <NavItem view="SMART_PRICING" icon={LineChart} label="Dynamic Pricing" className="text-emerald-500 font-bold" />
                  </>
               )}

               <div className="pt-4 mt-4 border-t border-zinc-800">
                 {/* MY_PLAN moved to footer */}
                 <NavItem view="SETTINGS" icon={Settings} label={isOwner ? "Settings" : "My Profile"} />
                 
                 {isOwner && hasPremiumWebsite && (
                    <NavItem view="WEBSITE_EDITOR" icon={Globe} label="Website & Brand" />
                 )}
               </div>
             </>
          )}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full bg-zinc-900 border-t border-zinc-800">
        
        {/* PLAN PROMO BLOCK (OWNER ONLY - PURPLE/VIOLET) */}
        {isOwner && !isSuperAdmin && (
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
        )}

        {/* REFERRAL PROMO BLOCK (OWNER ONLY - FULL WIDTH GREEN) */}
        {isOwner && !isSuperAdmin && (
           <button
              onClick={() => {
                 setView('REFERRALS');
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
                    <p className="font-bold text-xs leading-none mb-0.5">Indicações</p>
                    <p className="text-[10px] text-emerald-100 font-medium">Ganhe Dinheiro</p>
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
          
          {/* User Switcher Dropdown */}
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
                        <p className="text-sm font-bold">Sair</p>
                        <p className="text-[10px] opacity-70">Logout</p>
                     </div>
                  </button>

                  <div className="p-2 bg-zinc-900 border-y border-zinc-800 text-[9px] text-zinc-500 font-bold uppercase tracking-wider text-center mt-1">
                     Demo Quick Switch
                  </div>

                  {staff.map(s => (
                     <button
                        key={s.id}
                        onClick={() => {
                           switchUser(s.id);
                           setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-zinc-900 text-left transition-colors ${s.id === currentUser.id ? 'bg-zinc-900 border-l-2 border-amber-500' : ''}`}
                     >
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                           {s.name.charAt(0)}
                        </div>
                        <div>
                           <p className={`text-sm font-medium ${s.id === currentUser.id ? 'text-white' : 'text-zinc-400'}`}>{s.name}</p>
                           <p className="text-[10px] text-zinc-600">{s.role.replace('_', ' ')}</p>
                        </div>
                     </button>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </aside>

    <OwnerReferralModal 
       isOpen={isReferralModalOpen} 
       onClose={() => setIsReferralModalOpen(false)} 
       ownerReferralLink={ownerLink} 
    />
    </>
  );
};
