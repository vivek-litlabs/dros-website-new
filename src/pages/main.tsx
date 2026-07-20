import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App.tsx';
import BookMeeting from './BookMeeting.tsx';
import EventsPage from './EventsPage.tsx';
import EventsListingPage from './EventsListingPage.tsx';
import ArmTechDallasEvent from './ArmTechDallasEvent.tsx';
import RMAILasVegasEvent from './RMAILasVegasEvent.tsx';
import ACAOrlandoEvent from './ACAOrlandoEvent.tsx';
import VideosPage from './VideosPage.tsx';
import BlogsPage from './BlogsPage.tsx';
import BlogPost from './BlogPost.tsx';
import BlogPostDigitalFirst from './BlogPostDigitalFirst.tsx';
import BlogPostRPC from './BlogPostRPC.tsx';
import ContactUs from './ContactUs.tsx';
import RedirectToApiDocs from './RedirectToApiDocs.tsx';
import RedirectToReleaseNotes from './RedirectToReleaseNotes.tsx';
import PricingPage from './PricingPage.tsx';
import BlogPostAICompliance from './BlogPostAICompliance.tsx';
import BlogPostLegacyIntegrations from './BlogPostLegacyIntegrations.tsx';
import BlogPostDNCVoiceAgents from './BlogPostDNCVoiceAgents.tsx';
import BlogPostRegFCallLimits from './BlogPostRegFCallLimits.tsx';
import AboutUs from './AboutUs.tsx';
import NewsroomPage from './NewsroomPage.tsx';
import FirstPartyCollectionsPage from './FirstPartyCollectionsPage.tsx';
import CustomerStoriesPage from './CustomerStoriesPage.tsx';
import GreystoneStory from './GreystoneStory.tsx';
import ThirdPartyCollectionsPage from './ThirdPartyCollectionsPage.tsx';
import DebtBuyerCollectionsPage from './DebtBuyerCollectionsPage.tsx';
import BlogPostAIVoiceAgents from './BlogPostAIVoiceAgents.tsx';
import BlogPostAIAgentsDeployment from './BlogPostAIAgentsDeployment.tsx';
import CollectionsAIWorkshop from './CollectionsAIWorkshop.tsx';
import WebinarsPage from './WebinarsPage.tsx';
import VoiceAgentsPage from './features/context-aware-voice-ai-agents-for-debt-collection.tsx';
import PaymentReminders from './PaymentReminders.tsx';
import BlogPostOmnichannel from './BlogPostOmnichannel.tsx';
import BlogPostHumanInTheLoop from './BlogPostHumanInTheLoop.tsx';
import BlogPostAICollectionsOperatingLayer from './BlogPostAICollectionsOperatingLayer.tsx';
import SmoothScroll from '../components/SmoothScroll.tsx';
import type Lenis from 'lenis';
import './index.css';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SmoothScroll>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="/events/armtech-rmai-2026" element={<EventsPage />} />
        <Route path="/events" element={<EventsListingPage />} />
        <Route path="/events/2026/armtech-dallas" element={<ArmTechDallasEvent />} />
        <Route path="/events/2026/rmai-las-vegas" element={<RMAILasVegasEvent />} />
        <Route path="/events/2026/aca-orlando" element={<ACAOrlandoEvent />} />
        <Route path="/resources/videos" element={<VideosPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/right-party-contact-rpc-learnings-from-the-field" element={<BlogPostRPC />} />
        <Route path="/blogs/digital-first-collections-small-agencies-2026" element={<BlogPostDigitalFirst />} />
        <Route path="/blogs/why-context-not-more-tools-is-the-future-of-debt-collection" element={<BlogPost />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/blogs/integrate-ai-agents-collections-compliance" element={<BlogPostAICompliance />} />
        <Route path="/blogs/collections-integrations-legacy-systems" element={<BlogPostLegacyIntegrations />} />
        <Route path="/blogs/ai-voice-agents-dnc-disputes-compliance-2026" element={<BlogPostDNCVoiceAgents />} />
        <Route path="/blog/reg-f-call-limits-ai-debt-collection" element={<BlogPostRegFCallLimits />} />
        <Route path="/blogs/reg-f-call-limits-call-hours-ai-debt-collection" element={<BlogPostRegFCallLimits />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/newsroom" element={<NewsroomPage />} />
        <Route path="/collections/first-party" element={<FirstPartyCollectionsPage />} />
        <Route path="/customer-stories" element={<CustomerStoriesPage />} />
        <Route path="/customer-stories/greystone-associates" element={<GreystoneStory />} />
        <Route path="/collections/third-party" element={<ThirdPartyCollectionsPage />} />
        <Route path="/collections/debt-buyer" element={<DebtBuyerCollectionsPage />} />
        <Route path="/blogs/ai-voice-agents-debt-disputes-compliance" element={<BlogPostAIVoiceAgents />} />
        <Route path="/blogs/ai-agents-debt-collection-deployment" element={<BlogPostAIAgentsDeployment />} />
        <Route path="/collections-ai-workshop" element={<CollectionsAIWorkshop />} />
        <Route path="/webinars" element={<WebinarsPage />} />
        <Route path="/features/context-aware-voice-ai-agents-for-debt-collection" element={<VoiceAgentsPage />} />
        <Route path="/use-cases/ai-voice-agent-payment-reminders" element={<PaymentReminders />} />
        <Route path="/use-cases/payment-reminders" element={<PaymentReminders />} />
        <Route path="/api-docs" element={<RedirectToApiDocs />} />
        <Route path="/release-notes" element={<RedirectToReleaseNotes />} />
        <Route path="/blogs/omnichannel-ai-debt-collection" element={<BlogPostOmnichannel />} />
        <Route path="/blogs/human-in-the-loop-collections" element={<BlogPostHumanInTheLoop />} />
        <Route path="/blogs/ai-collections-operating-layer" element={<BlogPostAICollectionsOperatingLayer />} />
      </Routes>
      </SmoothScroll>
    </BrowserRouter>
  </StrictMode>
);
