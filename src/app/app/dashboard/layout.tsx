'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ShoppingCart, 
  Users, 
  Settings, 
  Scissors, 
  DollarSign,
  LogOut,
  Menu,
  X,
  Shield,
  Crown,
  LineChart,
  PackageSearch,
  Banknote,
  UserCircle
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simular dados do usuário (substituir com dados reais do Supabase)
  const currentUser = {
    name: 'Admin',
    email: 'admin@barbergold.com',
    role: 'OWNER', // ou 'SUPER_ADMIN' para mostrar link do superadmin
    avatar: null
  };
  
  const isSuperAdmin = currentUser.email === 'admin@barbergold.com'; // Temporário - verificar por role depois
  
  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/app/agenda', icon: CalendarDays },
    { name: 'PDV', href: '/app/pdv', icon: ShoppingCart },
    { name: 'Clientes', href: '/app/clients', icon: Users },
    { name: 'Financeiro', href: '/app/finance', icon: DollarSign },
    { name: 'Catálogo', href: '/app/catalog', icon: PackageSearch },
    { name: 'Configurações', href: '/app/settings', icon: Settings },
  ];
  
  const premiumFeatures = [
    { name: 'Clube de Assinatura', href: '/app/barber-club', icon: Crown },
    { name: 'Preços Dinâmicos', href: '/app/dynamic-pricing', icon: LineChart },
    { name: 'Indicações', href: '/app/referrals', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col bg-zinc-900 border-r border-zinc-800">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
            <div className="bg-amber-500 p-2 rounded-xl">
              <Scissors className="w-6 h-6 text-zinc-950" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">BarberGOLD</h1>
              <p className="text-xs text-zinc-500">Premium Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {/* Super Admin Link */}
            {isSuperAdmin && (
              <div className="mb-4">
                <Link
                  href="/app/super-admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  <Shield className="w-5 h-5" />
                  <span>Super Admin</span>
                </Link>
              </div>
            )}
            
            {/* Main Navigation */}
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Premium Features */}
            <div className="pt-4 mt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider px-4 mb-2">Premium</p>
              {premiumFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 px-2">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-zinc-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-zinc-500">{currentUser.role}</p>
              </div>
              <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <Scissors className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="font-bold text-xl text-white">BarberGOLD</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:bg-zinc-800 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-900">
          <div className="pt-20 p-4">
            <nav className="space-y-2">
              {isSuperAdmin && (
                <Link
                  href="/app/super-admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                >
                  <Shield className="w-5 h-5" />
                  <span>Super Admin</span>
                </Link>
              )}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-zinc-950 font-semibold' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="pt-16 md:pt-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
