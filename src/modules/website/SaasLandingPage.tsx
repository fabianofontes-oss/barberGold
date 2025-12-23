import {
    LandingHeader,
    HeroSection,
    SocialProofSection,
    ProblemSection,
    FeaturesSection,
    MobileExperienceSection,
    PricingSection,
    TestimonialsSection,
    FAQSection,
    FinalCTASection,
    LandingFooter
} from './components/landing';

export default function SaasLandingPage() {
    return (
        <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-[#f79f08] selection:text-white overflow-x-hidden">
            <LandingHeader />
            <HeroSection />
            <SocialProofSection />
            <ProblemSection />
            <FeaturesSection />
            <MobileExperienceSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <FinalCTASection />
            <LandingFooter />
        </div>
    );
}
