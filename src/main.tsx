import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga4';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactGA.initialize('G-TT8WJVR53D');

const BASE_DOMAIN = 'https://dros.ai';

function Analytics() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

function CanonicalTag() {
  const { pathname } = useLocation();
  const canonical = pathname === '/' ? BASE_DOMAIN : `${BASE_DOMAIN}${pathname}`;
  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fix
  }, [pathname]);
  return null;
}
import App from './pages/App.tsx';
import './index.css';

// Every route below the landing page is code-split into its own chunk and
// fetched on demand, so the initial download only carries the home page.
const BookMeeting = lazy(() => import('./pages/BookMeeting.tsx'));
const EventsPage = lazy(() => import('./pages/EventsPage.tsx'));
const EventsListingPage = lazy(() => import('./pages/EventsListingPage.tsx'));
const ArmTechDallasEvent = lazy(() => import('./pages/ArmTechDallasEvent.tsx'));
const RMAILasVegasEvent = lazy(() => import('./pages/RMAILasVegasEvent.tsx'));
const ACAOrlandoEvent = lazy(() => import('./pages/ACAOrlandoEvent.tsx'));
const VideosPage = lazy(() => import('./pages/VideosPage.tsx'));
const WebinarsPage = lazy(() => import('./pages/WebinarsPage.tsx'));
const BlogsPage = lazy(() => import('./pages/BlogsPage.tsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'));
const BlogPostDigitalFirst = lazy(() => import('./pages/BlogPostDigitalFirst.tsx'));
const BlogPostRPC = lazy(() => import('./pages/BlogPostRPC.tsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.tsx'));
const RedirectToApiDocs = lazy(() => import('./pages/RedirectToApiDocs.tsx'));
const RedirectToReleaseNotes = lazy(() => import('./pages/RedirectToReleaseNotes.tsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.tsx'));
const BlogPostAICompliance = lazy(() => import('./pages/BlogPostAICompliance.tsx'));
const BlogPostLegacyIntegrations = lazy(() => import('./pages/BlogPostLegacyIntegrations.tsx'));
const BlogPostDNCVoiceAgents = lazy(() => import('./pages/BlogPostDNCVoiceAgents.tsx'));
const BlogPostRegFCallLimits = lazy(() => import('./pages/BlogPostRegFCallLimits.tsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.tsx'));
const NewsroomPage = lazy(() => import('./pages/NewsroomPage.tsx'));
const CustomerStoriesPage = lazy(() => import('./pages/CustomerStoriesPage.tsx'));
const FirstPartyCollectionsPage = lazy(() => import('./pages/FirstPartyCollectionsPage.tsx'));
const BlogPostAIVoiceAgents = lazy(() => import('./pages/BlogPostAIVoiceAgents.tsx'));
const BlogPostAIAgentsDeployment = lazy(() => import('./pages/BlogPostAIAgentsDeployment.tsx'));
const BlogPostHumanInTheLoop = lazy(() => import('./pages/BlogPostHumanInTheLoop.tsx'));
const BlogPostAICollectionsOperatingLayer = lazy(() => import('./pages/BlogPostAICollectionsOperatingLayer.tsx'));
const ThirdPartyCollectionsPage = lazy(() => import('./pages/ThirdPartyCollectionsPage.tsx'));
const CollectionsAIWorkshop = lazy(() => import('./pages/CollectionsAIWorkshop.tsx'));
const GreystoneStory = lazy(() => import('./pages/GreystoneStory.tsx'));
const VoiceAgentsPage = lazy(() => import('./pages/features/context-aware-voice-ai-agents-for-debt-collection.tsx'));
const UtahConsumerFinanceStory = lazy(() => import('./pages/UtahConsumerFinanceStory.tsx'));
const DebtBuyerCollectionsPage = lazy(() => import('./pages/DebtBuyerCollectionsPage.tsx'));
const PaymentReminders = lazy(() => import('./pages/PaymentReminders.tsx'));
const BlogPostOmnichannel = lazy(() => import('./pages/BlogPostOmnichannel.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <CanonicalTag />
      <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="/events/armtech-rmai-2026" element={<EventsPage />} />
        <Route path="/events" element={<EventsListingPage />} />
        <Route path="/events/2026/armtech-dallas" element={<ArmTechDallasEvent />} />
        <Route path="/events/2026/rmai-las-vegas" element={<RMAILasVegasEvent />} />
        <Route path="/events/2026/aca-orlando" element={<ACAOrlandoEvent />} />
        <Route path="/webinars" element={<WebinarsPage />} />
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
        <Route path="/blogs/ai-agents-debt-collection-deployment" element={<BlogPostAIAgentsDeployment />} />
        <Route path="/blogs/human-in-the-loop-collections" element={<BlogPostHumanInTheLoop />} />
        <Route path="/blogs/ai-collections-operating-layer" element={<BlogPostAICollectionsOperatingLayer />} />
        <Route path="/blog/reg-f-call-limits-ai-debt-collection" element={<BlogPostRegFCallLimits />} />
        <Route path="/blogs/ai-voice-agents-debt-disputes-compliance" element={<BlogPostAIVoiceAgents />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/newsroom" element={<NewsroomPage />} />
        <Route path="/customer-stories" element={<CustomerStoriesPage />} />
        <Route path="/customer-stories/greystone-associates" element={<GreystoneStory />} />
        <Route path="/collections/first-party" element={<FirstPartyCollectionsPage />} />
        <Route path="/collections/third-party" element={<ThirdPartyCollectionsPage />} />
        <Route path="/collections/debt-buyer" element={<DebtBuyerCollectionsPage />} />
        <Route path="/features/context-aware-voice-ai-agents-for-debt-collection" element={<VoiceAgentsPage />} />
        <Route path="/collections-ai-workshop" element={<CollectionsAIWorkshop />} />
        <Route path="/customer-stories/utah-consumer-finance" element={<UtahConsumerFinanceStory />} />
        <Route path="/use-cases/ai-voice-agent-payment-reminders" element={<PaymentReminders />} />
        <Route path="/blogs/omnichannel-ai-debt-collection" element={<BlogPostOmnichannel />} />
        <Route path="/api-docs" element={<RedirectToApiDocs />} />
        <Route path="/release-notes" element={<RedirectToReleaseNotes />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
