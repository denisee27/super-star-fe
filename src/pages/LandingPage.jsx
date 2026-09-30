import { useEffect, useState } from "react";
import {
  INQUIRY_CATEGORY, INQUIRY_STEP,
  useCategoryFlow,
  TopLevelSelector, AffiliateTypeSelector, PlatformSelector, EventSelector,
  McnForm, PasForm, BrandForm, EventForm,
  StepIndicator, SuccessScreen,
} from "../features/inquiry/index.js";
import { getActiveEvents } from "../features/inquiry/services/eventService.js";
import Logo from "../shared/components/Logo.jsx";

export default function LandingPage() {
  const flow = useCategoryFlow();
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    getActiveEvents().then(setActiveEvents);
  }, []);

  function renderContent() {
    if (flow.step === INQUIRY_STEP.TOP_LEVEL) {
      return <TopLevelSelector onSelect={flow.selectTopLevel} activeEvents={activeEvents} />;
    }
    if (flow.step === INQUIRY_STEP.AFFILIATE_TYPE) {
      return <AffiliateTypeSelector onSelect={flow.selectAffiliateType} onBack={flow.goBack} />;
    }
    if (flow.step === INQUIRY_STEP.PLATFORM) {
      return <PlatformSelector onSelect={flow.selectPlatform} onBack={flow.goBack} />;
    }
    if (flow.step === INQUIRY_STEP.EVENT_SELECT) {
      return <EventSelector events={activeEvents} onSelect={flow.selectEvent} onBack={flow.goBack} />;
    }
    if (flow.step === INQUIRY_STEP.FORM) {
      if (flow.selectedCategory === INQUIRY_CATEGORY.MCN_AGENCY) {
        return <McnForm platform={flow.selectedPlatform} onSuccess={flow.onSuccess} onBack={flow.goBack} />;
      }
      if (flow.selectedCategory === INQUIRY_CATEGORY.PASUKAN_AFFILIATE) {
        return <PasForm onSuccess={flow.onSuccess} onBack={flow.goBack} />;
      }
      if (flow.selectedCategory === INQUIRY_CATEGORY.EVENT) {
        return <EventForm event={flow.selectedEvent} onSuccess={flow.onSuccess} onBack={flow.goBack} />;
      }
      return <BrandForm onSuccess={flow.onSuccess} onBack={flow.goBack} />;
    }
    return <SuccessScreen category={flow.selectedCategory} formData={flow.lastFormData} onReset={flow.reset} />;
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      <header className="px-6 py-8 text-center">
        <div className="flex justify-center mb-8">
          <Logo variant="white" height={48} />
        </div>
        <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tight leading-none">
          CONNECT WITH<br />SUPERSTAR
        </h1>
        <p className="font-sans text-white/80 text-base mt-4 max-w-lg mx-auto leading-relaxed">
          Welcome to the Superstar!<br />
          Kamu satu langkah lagi menuju kolaborasi seru bareng ribuan kreator &amp; brand top di TikTok Shop by Tokopedia &amp; Shopee.
        </p>
        <p className="font-sans text-white/60 text-sm mt-2">Pilih jalurmu sekarang 👇</p>
      </header>

      <main className="flex-1 flex justify-center px-4 pb-12">
        <div className="w-full max-w-lg bg-cloud rounded-2xl shadow-2xl p-6 md:p-8">
          <StepIndicator step={flow.step} category={flow.selectedCategory} />
          {renderContent()}
        </div>
      </main>

      <footer className="text-center pb-6">
        <p className="font-sans text-white/40 text-xs uppercase tracking-widest">HELPING YOU BECOME A SUPERSTAR</p>
      </footer>
    </div>
  );
}
