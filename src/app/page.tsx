'use client';

import { useBarber } from '@/context/BarberContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/modules/dashboard/Dashboard';
import { PointOfSale } from '@/modules/pdv/PointOfSale';
import { Clients } from '@/modules/clients/Clients';
import { Agenda } from '@/modules/agenda/Agenda';
import { Finance } from '@/modules/finance/Finance';
import { Settings } from '@/modules/settings/Settings';
import { Catalog } from '@/modules/catalog/Catalog';
import { GrowthCommand } from '@/modules/growth/GrowthCommand';
import { SmartPricing } from '@/modules/smart-pricing/SmartPricing';
import { ClubDashboard } from '@/modules/barber-club/components/ClubDashboard';
import { ReferralDashboard } from '@/modules/referrals/ReferralDashboard';
import { MyPlan } from '@/modules/plan/MyPlan';
import { WebsiteEditor } from '@/modules/website/WebsiteEditor';
import { SuperAdminDashboard } from '@/modules/super-admin/SuperAdminDashboard';
import { SuperAdminPlans } from '@/modules/super-admin/SuperAdminPlans';
import { SuperAdminSupport } from '@/modules/super-admin/SuperAdminSupport';
import { SuperAdminBilling } from '@/modules/super-admin/SuperAdminBilling';
import { SuperAdminSettings } from '@/modules/super-admin/SuperAdminSettings';
import { SuperAdminMarketing } from '@/modules/super-admin/SuperAdminMarketing';
import { SuperAdminMarketplace } from '@/modules/super-admin/SuperAdminMarketplace';
import { SuperAdminPartners } from '@/modules/super-admin/SuperAdminPartners';
import { SuperAdminSystem } from '@/modules/super-admin/SuperAdminSystem';
import { SuperAdminLandingEditor } from '@/modules/super-admin/SuperAdminLandingEditor';
import { SuperOfficeV2 } from '@/modules/office-v2/SuperOfficeV2';
import { OnlineBookingWizard } from '@/modules/online-booking/OnlineBookingWizard';
import { TipsReviewWizard } from '@/modules/tips/TipsReviewWizard';
import { Scissors, ArrowRight } from 'lucide-react';

// Login Screen Component
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900 to-transparent z-0" />
    <div className="relative z-10 flex flex-col items-center max-w-md">
      <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30">
        <Scissors className="w-12 h-12 text-zinc-950" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">BarberFlow</h1>
      <p className="text-zinc-400 mb-2 text-lg">Premium Gold</p>
      <p className="text-zinc-500 mb-8 text-sm">Sistema de Gestão para Barbearias</p>
      <button
        onClick={onLogin}
        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
      >
        Entrar como Admin
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      <p className="text-zinc-600 text-xs mt-8">Next.js 14 + Tailwind CSS + TypeScript</p>
    </div>
  </div>
);

export default function Home() {
  const { login, isAuthenticated, currentView } = useBarber();

  const handleLogin = () => {
    login('admin@barberflow.com', 'admin');
  };

  // Landing / Login
  if (!isAuthenticated || currentView === 'SAAS_LANDING' || currentView === 'AUTH') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Main App with Layout
  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'AGENDA':
        return <Agenda />;
      case 'PDV':
        return <PointOfSale />;
      case 'CLIENTS':
        return <Clients />;
      case 'FINANCE':
        return <Finance />;
      case 'CATALOG':
        return <Catalog />;
      case 'SETTINGS':
        return <Settings />;
      case 'MY_PLAN':
        return <MyPlan />;
      case 'GROWTH':
        return <GrowthCommand />;
      case 'SMART_PRICING':
        return <SmartPricing />;
      case 'BARBER_CLUB':
        return <ClubDashboard />;
      case 'REFERRALS':
        return <ReferralDashboard />;
      case 'WEBSITE_EDITOR':
        return <WebsiteEditor />;
      case 'SUPER_ADMIN_DASHBOARD':
        return <SuperAdminDashboard />;
      case 'SUPER_ADMIN_TENANTS':
        return <SuperAdminDashboard />;
      case 'SUPER_ADMIN_PLANS':
        return <SuperAdminPlans />;
      case 'SUPER_ADMIN_PARTNERS':
        return <SuperAdminPartners />;
      case 'SUPER_ADMIN_MARKETING':
        return <SuperAdminMarketing />;
      case 'SUPER_ADMIN_CMS':
        return <SuperAdminLandingEditor />;
      case 'SUPER_ADMIN_SUPPORT':
        return <SuperAdminSupport />;
      case 'SUPER_ADMIN_BILLING':
        return <SuperAdminBilling />;
      case 'SUPER_ADMIN_MARKETPLACE':
        return <SuperAdminMarketplace />;
      case 'SUPER_ADMIN_SYSTEM':
        return <SuperAdminSystem />;
      case 'SUPER_ADMIN_SETTINGS':
        return <SuperAdminSettings />;
      case 'SUPER_OFFICE_V2':
        return <SuperOfficeV2 />;
      case 'ONLINE_BOOKING':
        return <OnlineBookingWizard />;
      case 'TIPS_REVIEW':
        return <TipsReviewWizard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}
