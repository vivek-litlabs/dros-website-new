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

// After a deploy, chunk filenames get new hashes. A returning visitor may still
// have the old index.html cached, which references chunk names that no longer
// exist on the server, so the dynamic import() rejects and the page appears to
// hang on the Suspense fallback until a hard refresh. Wrap every lazy import so
// that when a chunk fails to load we reload the page once to pull fresh HTML.
type ComponentModule = { default: React.ComponentType<unknown> };

function lazyWithRetry(factory: () => Promise<ComponentModule>) {
  return lazy(async () => {
    const RELOAD_KEY = 'chunk-reload';
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (err) {
      // Only force a reload once, to avoid an infinite loop if the failure is
      // not actually caused by a stale chunk.
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
        // Return a never-resolving promise so nothing renders before reload.
        return new Promise<ComponentModule>(() => {});
      }
      throw err;
    }
  });
}

// Every route below the landing page is code-split into its own chunk and
// fetched on demand, so the initial download only carries the home page.
const BookMeeting = lazyWithRetry(() => import('./pages/BookMeeting.tsx'));
const EventsPage = lazyWithRetry(() => import('./pages/EventsPage.tsx'));
const EventsListingPage = lazyWithRetry(() => import('./pages/EventsListingPage.tsx'));
const ArmTechDallasEvent = lazyWithRetry(() => import('./pages/ArmTechDallasEvent.tsx'));
const RMAILasVegasEvent = lazyWithRetry(() => import('./pages/RMAILasVegasEvent.tsx'));
const ACAOrlandoEvent = lazyWithRetry(() => import('./pages/ACAOrlandoEvent.tsx'));
const VideosPage = lazyWithRetry(() => import('./pages/VideosPage.tsx'));
const WebinarsPage = lazyWithRetry(() => import('./pages/WebinarsPage.tsx'));
const BlogsPage = lazyWithRetry(() => import('./pages/BlogsPage.tsx'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost.tsx'));
const BlogPostDigitalFirst = lazyWithRetry(() => import('./pages/BlogPostDigitalFirst.tsx'));
const BlogPostRPC = lazyWithRetry(() => import('./pages/BlogPostRPC.tsx'));
const ContactUs = lazyWithRetry(() => import('./pages/ContactUs.tsx'));
const RedirectToApiDocs = lazyWithRetry(() => import('./pages/RedirectToApiDocs.tsx'));
const RedirectToReleaseNotes = lazyWithRetry(() => import('./pages/RedirectToReleaseNotes.tsx'));
const PricingPage = lazyWithRetry(() => import('./pages/PricingPage.tsx'));
const BlogPostAICompliance = lazyWithRetry(() => import('./pages/BlogPostAICompliance.tsx'));
const BlogPostLegacyIntegrations = lazyWithRetry(() => import('./pages/BlogPostLegacyIntegrations.tsx'));
const BlogPostDNCVoiceAgents = lazyWithRetry(() => import('./pages/BlogPostDNCVoiceAgents.tsx'));
const BlogPostRegFCallLimits = lazyWithRetry(() => import('./pages/BlogPostRegFCallLimits.tsx'));
const AboutUs = lazyWithRetry(() => import('./pages/AboutUs.tsx'));
const NewsroomPage = lazyWithRetry(() => import('./pages/NewsroomPage.tsx'));
const CustomerStoriesPage = lazyWithRetry(() => import('./pages/CustomerStoriesPage.tsx'));
const FirstPartyCollectionsPage = lazyWithRetry(() => import('./pages/FirstPartyCollectionsPage.tsx'));
const BlogPostAIVoiceAgents = lazyWithRetry(() => import('./pages/BlogPostAIVoiceAgents.tsx'));
const BlogPostAIAgentsDeployment = lazyWithRetry(() => import('./pages/BlogPostAIAgentsDeployment.tsx'));
const BlogPostHumanInTheLoop = lazyWithRetry(() => import('./pages/BlogPostHumanInTheLoop.tsx'));
const BlogPostAICollectionsOperatingLayer = lazyWithRetry(() => import('./pages/BlogPostAICollectionsOperatingLayer.tsx'));
const ThirdPartyCollectionsPage = lazyWithRetry(() => import('./pages/ThirdPartyCollectionsPage.tsx'));
const CollectionsAIWorkshop = lazyWithRetry(() => import('./pages/CollectionsAIWorkshop.tsx'));
const GreystoneStory = lazyWithRetry(() => import('./pages/GreystoneStory.tsx'));
const VoiceAgentsPage = lazyWithRetry(() => import('./pages/features/context-aware-voice-ai-agents-for-debt-collection.tsx'));
const DebtBuyerCollectionsPage = lazyWithRetry(() => import('./pages/DebtBuyerCollectionsPage.tsx'));
const PaymentReminders = lazyWithRetry(() => import('./pages/PaymentReminders.tsx'));
const BlogPostOmnichannel = lazyWithRetry(() => import('./pages/BlogPostOmnichannel.tsx'));
const Aca = lazyWithRetry(() => import('./pages/Aca.tsx'));

const ConsumerLendingCollectionsPage = lazyWithRetry(() => import('./pages/ConsumerLendingCollectionsPage.tsx'));
const CreditUnionCollectionsPage = lazyWithRetry(() => import('./pages/CreditUnionCollectionsPage.tsx'));
const TrustCenter = lazyWithRetry(() => import('./pages/TrustCenter.tsx'));
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
        <Route path="/aca" element={<Aca />} />
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
        <Route path="/use-cases/ai-voice-agent-payment-reminders" element={<PaymentReminders />} />
        <Route path="/blogs/omnichannel-ai-debt-collection" element={<BlogPostOmnichannel />} />
        <Route path="/api-docs" element={<RedirectToApiDocs />} />
        <Route path="/release-notes" element={<RedirectToReleaseNotes />} />
        <Route path="/collections/consumer-lending" element={<ConsumerLendingCollectionsPage />} />
        <Route path="/collections/credit-unions" element={<CreditUnionCollectionsPage />} />
        <Route path="/trust-center" element={<TrustCenter />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
