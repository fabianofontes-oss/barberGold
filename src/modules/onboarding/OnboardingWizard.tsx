'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import { 
  Scissors, 
  Sparkles, 
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Flame,
  Zap
} from 'lucide-react';
import { BusinessType, PackageLevel, OnboardingData, BusinessTypeOption, PackageOption } from '@/types/onboarding';
import { BusinessTypeSelection } from './steps/BusinessTypeSelection';
import { PackageSelection } from './steps/PackageSelection';
import { ServiceCustomization } from './steps/ServiceCustomization';
import { OnboardingSuccess } from './steps/OnboardingSuccess';

type OnboardingStep = 'business-type' | 'package' | 'customize' | 'success';

export const OnboardingWizard = () => {
  const router = useRouter();
  const { t } = useI18n();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business-type');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessType: null,
    packageLevel: null,
    selectedServices: [],
    customizedServices: {}
  });

  const handleBusinessTypeSelect = (type: BusinessType | 'skip') => {
    if (type === 'skip') {
      // Pular onboarding - redirecionar para dashboard
      router.push('/app/dashboard');
      return;
    }

    setOnboardingData(prev => ({ ...prev, businessType: type }));
    setCurrentStep('package');
  };

  const handlePackageSelect = (level: PackageLevel) => {
    setOnboardingData(prev => ({ ...prev, packageLevel: level }));
    
    if (level === 'custom') {
      setCurrentStep('customize');
    } else {
      // Para essencial/completo, processar automaticamente
      processOnboarding(level);
    }
  };

  const handleCustomizationComplete = (selectedServices: string[], customizedServices: Record<string, any>) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedServices,
      customizedServices
    }));
    processOnboarding('custom');
  };

  const processOnboarding = async (level: PackageLevel) => {
    // TODO: Chamar API para processar onboarding
    // Por enquanto, apenas mostrar tela de sucesso
    setCurrentStep('success');
  };

  const handleBack = () => {
    if (currentStep === 'package') {
      setCurrentStep('business-type');
    } else if (currentStep === 'customize') {
      setCurrentStep('package');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        {currentStep !== 'success' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'business-type' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep !== 'business-type' ? 'bg-amber-500' : 'bg-zinc-800'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'package' ? 'bg-amber-500 text-zinc-950' : 
                currentStep === 'customize' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep === 'customize' ? 'bg-amber-500' : 'bg-zinc-800'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'customize' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                3
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        {(currentStep === 'package' || currentStep === 'customize') && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        )}

        {/* Step Content */}
        <div className="animate-fade-in">
          {currentStep === 'business-type' && (
            <BusinessTypeSelection onSelect={handleBusinessTypeSelect} />
          )}
          
          {currentStep === 'package' && onboardingData.businessType && (
            <PackageSelection 
              businessType={onboardingData.businessType}
              onSelect={handlePackageSelect}
            />
          )}
          
          {currentStep === 'customize' && onboardingData.businessType && (
            <ServiceCustomization
              businessType={onboardingData.businessType}
              onComplete={handleCustomizationComplete}
            />
          )}
          
          {currentStep === 'success' && (
            <OnboardingSuccess
              stats={{
                totalServices: 10,
                totalCombos: 2,
                totalCategories: 5,
                avgPrice: 52,
                avgDuration: 35
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
