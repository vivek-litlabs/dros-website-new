export const route = '/blogs/right-party-contact-rpc-learnings-from-the-field';
export const tags = ['Field Insights', 'Right Party Contact', 'Collections Strategy & Performance'];
import { Helmet } from 'react-helmet-async';
import BlogLayout, { P, H2, H3, Ul, DarkCard, StepCard, BlogCTA } from './BlogLayout';

const TOC = [
  { id: 'rpc-stuck',        label: 'Why RPC Is Stuck Around 26%' },
  { id: 'how-we-learned',   label: 'How We Learned: Our Data' },
  { id: 'five-killers',     label: 'The 5 Hidden RPC Killers' },
  { id: 'ohio-story',       label: 'Story #1: Ohio Agency at 21% RPC' },
  { id: 'broader-data',     label: 'SMS, Email, and Omnichannel' },
  { id: 'california-story', label: 'Story #2: California Script Problem' },
  { id: 'framework',        label: 'Our RPC Improvement Framework' },
  { id: 'dros-vodex',       label: 'How This Shaped DROS and Vodex' },
  { id: 'next-steps',       label: 'Where to Go From Here' },
];

export default function BlogPostRPC() {
  return (
    <>
      <Helmet>
        <title>Right Party Contact in Debt Collection: What Calls Reveal</title>
        <meta name="description" content="Why right party contact is stuck at 26% and what real collection calls reveal about improving contact rates and recovery outcomes." />
        <meta property="og:title" content="Right Party Contact in Debt Collection: What Calls Reveal" />
        <meta property="og:description" content="Why right party contact is stuck at 26% and what real collection calls reveal about improving contact rates and recovery outcomes." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/blogs/right-party-contact-rpc-learnings-from-the-field" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <BlogLayout
      image="/features/call-analytics.jpg"
      title="What Thousands of Debt Collection Calls Taught Us About Right Party Contact"
      subtitle="Real learnings from the field on why RPC is stuck at 26% and how to fix it"
      readTime="15 min"
      tags={tags}
      tocSections={TOC}
      canonicalPath={route}
      datePublished="2025-10-01"
      category="Collections Strategy"
      cta={
        <BlogCTA
          heading="Ready to improve your RPC?"
          body="Talk to our team about how DROS and Vodex work together to improve right-party contact across your campaigns."
          primaryLabel="Book a Demo"
          primaryHref="https://dros.ai/book-meeting"
          secondaryLabel="Start Free Trial"
          secondaryHref="https://app.dros.ai"
        />
      }
    >
      <P>
        If you run or manage a collections team, you already know this truth: you only get paid when you actually talk to the right person.
      </P>
      <P>
        Yet across the industry, average Right Party Contact (RPC) rates stubbornly hover around 26%, and nearly a quarter of contact centers sit below 20%. That means 3 out of 4 outbound calls never reach the person who can actually resolve the debt.
      </P>
      <P>
        Over the past couple of years, we have worked closely with U.S. collection agencies while building and tuning DROS and Vodex. In the process, we have analyzed thousands of calls, digital conversations, and workflows. This article is our attempt to share those learnings.
      </P>

      <H2 id="rpc-stuck">Why Right Party Contact Is Stuck Around 26%</H2>
      <P>
        Most leaders we talk to feel RPC is "just how it is now"  - consumers don't pick up, carriers mark you as spam, and regulations keep tightening. The data partly supports that story.
      </P>
      <P>
        But when we dug into call recordings and campaign data, we kept seeing something else: low RPC was rarely the result of a single big problem. It was the compound effect of five smaller issues stacking on top of each other. We started thinking of RPC not as a dialer setting, but as the visible symptom of the entire outreach system.
      </P>

      <H2 id="how-we-learned">How We Learned: A Quick Note on Our Data</H2>
      <P>
        We are not a giant network provider with trillions of calls. We sit much closer to the ground: small and mid-sized agencies in the U.S., typically 5–50 collectors, working on everything from early-stage consumer debt to older, harder portfolios.
      </P>
      <Ul items={[
        'Onboarded them into DROS, which centralizes dialer, CRM, notes, and digital channels into one workspace.',
        <>Deployed <a href="https://www.vodex.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Vodex</a> voice AI in selective campaigns where it made sense.</>,
        'Captured and analyzed thousands of calls, SMS and email touches, and campaign outcomes.',
      ]} />
      <P>
        Studies consistently show that digital channels like SMS have far higher engagement than traditional email, with text campaigns delivering around 45% higher response rates and open rates near 98%, often within minutes.
      </P>

      <H2 id="five-killers">The 5 Hidden RPC Killers We Kept Seeing</H2>

      <H3>1. Dirty or Outdated Data</H3>
      <P>Every RPC problem starts or ends with the data layer. Incorrect, incomplete, or outdated phone numbers are one of the main reasons RPC stays low. In our work, we saw:</P>
      <Ul items={[
        'Duplicate accounts with different numbers and no clear "source of truth".',
        'Old landline numbers being dialed for mobile-first consumers.',
        'Accounts never re-enriched after the original placement.',
      ]} />
      <P>Whenever we ran even a basic skip-trace refresh, we almost always found that 10–25% of numbers were either disconnected or obviously wrong  - sitting in live dialing queues for months.</P>

      <H3>2. Voice-Only, Single-Channel Thinking</H3>
      <P>The traditional playbook is "call first, call again, then call some more." The problem is that modern consumers do not behave like the old playbook assumes. Research now shows SMS and email outreach significantly outperform single-channel voice:</P>
      <Ul items={[
        'Text messaging yields about 45% higher response rates than email in collections contexts.',
        'SMS messages achieve open rates near 98%, often within minutes.',
        'Omnichannel programs have seen payment arrangements rise by up to 40% and cost-to-collect cut by around 50%.',
      ]} />

      <H3>3. Wrong Time-of-Day and Day-of-Week Patterns</H3>
      <P>We repeatedly saw heavy call volumes mid-morning on weekdays, right when many consumers are at work or commuting  - with minimal experimentation with evenings or weekends. Once we segmented answer rates by time of day, it was obvious that the same list could produce 2–3× more right-party contacts purely based on timing.</P>

      <H3>4. Caller ID Reputation and "Spam Likely" Labels</H3>
      <P>As call volumes increase and number rotation is mismanaged, more agency numbers get flagged as "Spam" or "Scam Likely." Whenever we onboarded an agency already battling spam labels, we saw much lower answer rates even on good, recent data  - until we addressed caller ID hygiene.</P>

      <H3>5. High Friction Once You Reach the Right Party</H3>
      <P>RPC is usually defined as "did we reach the right person?" But agencies also kill future RPC by what happens after that first contact. When the first successful contact experience requires calling back a generic number and sitting on hold, many debtors simply stop answering next time.</P>

      <H2 id="ohio-story">Mini Story #1: The Ohio Agency Stuck at 21% RPC</H2>
      <P>One mid-sized agency in Ohio had around 25 collectors, a mixed portfolio of medical and utility debt, and an RPC rate stuck around 21%. When we looked at the data together inside DROS:</P>
      <Ul items={[
        'Roughly 18% of numbers on one large campaign were either disconnected or clearly wrong.',
        'First call attempts were heavily concentrated between 9 AM and 11 AM local time.',
        'They were using voice-only outreach with no SMS or email touches.',
      ]} />
      <P>We proposed a three-step experiment over 60 days:</P>

      <DarkCard>
        <H3>Step 1  - Data clean-up first</H3>
        <p className="text-black/70 mb-6 leading-relaxed">We helped them push 8,000 accounts through a modern skip-tracing provider and update numbers in DROS. Disconnected numbers were moved out of active dialing queues.</p>
        <H3>Step 2  - Introduce SMS and email as the first touch</H3>
        <p className="text-black/70 mb-2 leading-relaxed">For eligible accounts, they started with a simple, compliant SMS. Email carried the same message and portal link. Voice calls followed only for non-responders.</p>
        <div className="bg-[#FAFAFA] border border-[#E6E3E3] rounded-xl p-5 my-4">
          <p className="text-black/70 italic text-sm">"Hi [First Name], this is [Agency Name] regarding an important account. You can view details and payment options securely here: [Link]. Reply STOP to opt out."</p>
        </div>
        <H3>Step 3  - Test better call windows by segment</H3>
        <Ul items={[
          'For employed, working-age segments: more calls moved to 5–8 PM local time.',
          'For older segments and certain utilities: focus on late morning and early afternoon.',
        ]} />
      </DarkCard>

      <H3>What Changed</H3>
      <Ul items={[
        'RPC improved from 21% to 34% across the test campaigns  - a relative lift of more than 60%.',
        'Roughly 28% of payments came directly through the SMS/email portal, with no live call involved.',
        'Collectors reported fewer "why are you calling me?" reactions.',
      ]} />
      <P>None of this required complex AI models yet. It was data hygiene, channel mix, and timing.</P>

      <H2 id="broader-data">What the Broader Data Says About SMS, Email, and Omnichannel</H2>
      <Ul items={[
        'Text message outreach delivers about 45% higher response rates than email for collections.',
        'SMS open rates often sit near 98%, with most messages read within minutes.',
        'Collections organizations using digital/omnichannel strategies see payment arrangements increase by up to 40%.',
        'One large digital-first provider reported over 280% higher engagement for omnichannel vs voice-only outreach.',
      ]} />

      <div className="border-l-4 border-cyan-500 pl-5 sm:pl-6 py-3 my-10 bg-slate-50 rounded-r-2xl pr-5 sm:pr-6">
        <p className="text-slate-800 font-semibold text-base sm:text-lg italic">
          RPC is no longer just a dialer KPI. It is a whole-system outcome driven by data quality, channel mix, timing, reputation, and friction.
        </p>
      </div>

      <H2 id="california-story">Mini Story #2: The California Team That Thought They Had a "Script Problem"</H2>
      <P>
        A smaller agency in California, focused mainly on retail and BNPL portfolios, came to us convinced their agents "weren't good on the phone." Their RPC was hovering around 24–25%, and they had recently rotated through several script variations with little effect. What we noticed: many of their successful RPCs happened on second or third attempts, often after a prior digital touch. They had no consistent strategy for combining channels.
      </P>
      <DarkCard>
        <StepCard step="0" title="Day 0  - Digital First">
          If an account was 15–60 days past placement, the first touch would be an email and/or SMS with a portal link. No calls on day 0 unless the consumer initiated.
        </StepCard>
        <StepCard step="2–3" title="Days 2–3  - Targeted Calls Only">
          Agents prioritized accounts that opened the email but didn't pay, accounts that clicked the SMS link but didn't complete payment. Cold numbers with no digital engagement were deprioritized.
        </StepCard>
        <StepCard step="7+" title="Day 7+  - Voice AI + Human Handoff">
          For low-balance accounts, they used Vodex to place reminder calls with DTMF options. If the consumer wanted a human, the call was transferred with full context.
        </StepCard>
      </DarkCard>

      <H3>The Outcome</H3>
      <Ul items={[
        'RPC on targeted call lists stabilized in the 38–41% range.',
        'Overall campaign-level RPC moved from ~25% to ~33%, despite fewer total dials.',
        'A surprising proportion of accounts resolved through SMS/email and self-service portal, never needing a live call.',
      ]} />

      <H2 id="framework">Our RPC Improvement Framework</H2>
      <P>Based on these and other projects, we standardized a five-part RPC improvement framework. You can apply the logic manually with your current stack.</P>

      <DarkCard>
        <StepCard step="1" title="Clean and Enrich Your Data Quarterly">
          Push portfolios through modern skip-tracing tools. Remove disconnected and wrong numbers. Normalize phone types so your strategy can differ by channel.
        </StepCard>
        <StepCard step="2" title="Design a Simple Omnichannel Journey">
          Day 0: Send email/SMS explaining who you are and offering a secure payment link. Day 2–3: Call only accounts that engaged digitally but haven't paid. Day 7+: Use IVR or voice AI for low-balance reminders.
        </StepCard>
        <StepCard step="3" title="Test and Lock In Better Call Windows">
          Split your lists by persona. For each, test at least two time windows for a couple of weeks. Track RPC by window and lock in the better one.
        </StepCard>
        <StepCard step="4" title="Protect and Improve Caller ID Reputation">
          Register your numbers properly and keep CNAM clean. Avoid blasting very high volumes from a single number. Periodically check how numbers appear on call-block apps.
        </StepCard>
        <StepCard step="5" title="Reduce Friction Once You Reach the Right Party">
          Build clear, empathetic scripts. Offer self-service links over SMS/email during or after the call. Send a short, friendly recap message after a call with agreed next steps.
        </StepCard>
      </DarkCard>

      <H2 id="dros-vodex">How These Learnings Shaped DROS and Vodex</H2>
      <H3>What We Baked Into DROS</H3>
      <Ul items={[
        <><strong>Unified workspace:</strong> collectors see calls, SMS, email, and account context on a single screen.</>,
        <><strong>List logic and scoring:</strong> campaigns can be built around engagement signals (opens, clicks, partial payments).</>,
        <><strong>Timing controls:</strong> call windows and local-time rules enforced per segment.</>,
        <><strong>Digital pathways:</strong> every campaign can embed self-service payment flows.</>,
      ]} />
      <H3>Where Vodex Fits</H3>
      <Ul items={[
        'For low-balance or long-tail accounts, Vodex handles high-volume, low-complexity outreach.',
        'It can place calls, leave compliant messages, and follow up with SMS or email.',
        'When a debtor wants to talk to a human, the call routes to a collector with full context on screen.',
      ]} />

      <H2 id="next-steps">Where to Go From Here</H2>
      <P>If your RPC is stuck in the low- to mid-20s, the good news is that you probably don't need a miracle. You need cleaner data, a smarter channel mix, better timing, and less friction once you make contact.</P>
      <P>We have seen agencies move from ~20–22% RPC into the low-30s and even low-40s over just a couple of months  - not by burning out their teams, but by changing how they decide who to contact, when, and on which channel.</P>

      <div className="border-l-4 border-cyan-500 pl-5 sm:pl-6 py-3 my-10 bg-slate-50 rounded-r-2xl pr-5 sm:pr-6">
        <p className="text-slate-900 font-bold text-xl sm:text-2xl text-center">RPC is not a mystery. It is a design problem.</p>
      </div>
    </BlogLayout>
    </>
  );
}
