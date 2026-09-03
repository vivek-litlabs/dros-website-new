export const route = '/blog/reg-f-call-limits-ai-debt-collection';
export const tags = ['Compliance & Operations', 'Reg F', 'AI Voice Agents', 'FDCPA'];
import { Helmet } from 'react-helmet-async';
import BlogLayout, {
  P, H2, H3, Ul, DarkCard, BlogCTA, BlogFAQ,
  type FaqItem,
} from './BlogLayout';

const TOC = [
  { id: 'what-rules-say',      label: 'What Reg F and FDCPA Actually Say' },
  { id: 'operating-layer',     label: 'Why Rules Belong in the Operating Layer' },
  { id: 'call-hour-design',    label: 'Designing Call-Hour and Timezone Rules' },
  { id: 'seven-in-seven',      label: 'Implementing the 7-in-7 Limit' },
  { id: 'coordinating',        label: 'Coordinating AI and Human Campaigns' },
  { id: 'examples',            label: 'Safe vs Risky Calling Patterns' },
  { id: 'metrics',             label: 'Metrics and QA for Compliance' },
  { id: 'how-dros',            label: 'How DROS Makes Call Rules Easier' },
  { id: 'faq',                 label: 'FAQ' },
];

const FAQ: FaqItem[] = [
  {
    q: 'What time can debt collectors call under FDCPA?',
    a: 'FDCPA generally presumes that calls before 8 a.m. or after 9 p.m. in the consumer\'s local time are inconvenient and therefore problematic, unless the consumer has indicated otherwise. Even within allowed hours, collectors should avoid times they know are inconvenient for a particular consumer.',
  },
  {
    q: 'What is the Reg F 7-in-7 rule?',
    a: 'Regulation F introduced a rebuttable presumption of violation if a collector places more than seven calls to a consumer about a particular debt within seven consecutive days, or places any call within seven days after having a live conversation with that consumer about that debt.',
  },
  {
    q: 'Do call limits apply to AI and human collectors equally?',
    a: 'Yes. Reg F and FDCPA apply to the contact itself, not the channel. Whether the call comes from an AI agent or a human collector, it counts toward the same frequency limits and must respect the same call-hour rules.',
  },
  {
    q: 'How does AI collections software enforce call hours and timezones?',
    a: 'A well-designed platform like DROS lets you define allowed call hours per campaign and apply them in each consumer\'s local timezone. The system then blocks outbound calls - from both AI and human campaigns - that fall outside those windows.',
  },
  {
    q: 'How does DROS handle call hours and Reg F compliance?',
    a: 'DROS centralizes call-hour windows, timezone rules, and per-debt frequency tracking at the campaign and workflow level. Once configured, these rules apply automatically to every AI and human call, so no campaign can accidentally schedule contacts outside your compliance parameters.',
  },
];

function ComparisonTable() {
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#FAFAFA] text-black">
            <th className="px-5 py-3.5 text-left font-semibold w-1/3">Rule</th>
            <th className="px-5 py-3.5 text-left font-semibold">What it says</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-5 py-4 font-semibold text-slate-800 align-top">FDCPA - Call times</td>
            <td className="px-5 py-4 text-slate-600 leading-relaxed">Calls before 8 a.m. or after 9 p.m. in the consumer's local time are presumed inconvenient. Even during allowed hours, collectors should avoid times they know are inconvenient - for example, after being told not to call at work.</td>
          </tr>
          <tr className="border-t border-slate-100 bg-slate-50/50">
            <td className="px-5 py-4 font-semibold text-slate-800 align-top">Reg F - Call frequency</td>
            <td className="px-5 py-4 text-slate-600 leading-relaxed">More than seven calls in seven days about a particular debt is presumed a violation. Any call within seven days after a live conversation about that debt is also presumed a violation.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TimelineRow() {
  const steps: { label: string; sub: string; color: string }[] = [
    { label: 'Days 1 - 7', sub: 'Up to 7 attempts', color: 'bg-cyan-500' },
    { label: 'Live conversation', sub: 'Resets the clock', color: 'bg-amber-400' },
    { label: '7-day cooldown', sub: 'No new calls about this debt', color: 'bg-red-400' },
  ];
  return (
    <div className="my-8 flex flex-col sm:flex-row gap-3">
      {steps.map((s, i) => (
        <div key={i} className="flex-1 flex items-start gap-3 bg-[#FAFAFA] border border-[#E6E3E3] rounded-2xl px-5 py-4">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${s.color}`} />
          <div>
            <p className="text-black font-semibold text-sm">{s.label}</p>
            <p className="text-black/50 text-xs mt-0.5">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SideCard({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className={`flex-1 rounded-2xl border ${accent} p-5 sm:p-6`}>
      <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${accent.includes('emerald') ? 'text-emerald-600' : 'text-red-500'}`}>{title}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${accent.includes('emerald') ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SideCards({ left, right }: { left: { title: string; items: string[] }; right: { title: string; items: string[] } }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 my-8">
      <SideCard title={left.title} items={left.items} accent="border-emerald-200 bg-emerald-50/40" />
      <SideCard title={right.title} items={right.items} accent="border-red-200 bg-red-50/40" />
    </div>
  );
}

export default function BlogPostRegFCallLimits() {
  return (
    <>
      <Helmet>
        <title>How Reg F Call Limits and Call Hours Work in AI Debt Collection</title>
        <meta name="description" content="Understand FDCPA call-hour rules, Reg F's 7-in-7 limit, and how AI collections software can apply them consistently with built-in settings." />
        <meta property="og:title" content="How Reg F Call Limits and Call Hours Work in AI Debt Collection" />
        <meta property="og:description" content="Understand FDCPA call-hour rules, Reg F's 7-in-7 limit, and how AI collections software can apply them consistently with built-in settings." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/blog/reg-f-call-limits-ai-debt-collection" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <BlogLayout
        image="/blog/podium-steps.avif"
        title="How Reg F Call Limits and Call Hours Work in AI Debt Collection"
        readTime="10 min"
        tags={tags}
        tocSections={TOC}
        canonicalPath={route}
        datePublished="2026-05-14"
        category="Compliance"
        faq={FAQ}
        cta={
          <BlogCTA
            heading="Ready to enforce call rules automatically?"
            body="If you are reviewing your call-hour and Reg F strategy, we can walk you through how DROS enforces call rules for AI and human campaigns."
            primaryLabel="Book a Demo"
            primaryHref="https://dros.ai/book-meeting"
            secondaryLabel="Learn More"
            secondaryHref="https://dros.ai/collections/first-party"
          />
        }
      >
        <P>
          Most collections teams are not scared of AI because of its voice. They are scared because of its volume. The fear is simple: what if the system calls people too often, or at the wrong times, and breaks Reg F or FDCPA?
        </P>
        <P>
          FDCPA considers calls made at inconvenient times - typically before 8 a.m. or after 9 p.m. in the consumer's local time - to be problematic unless the consumer has agreed otherwise. The CFPB's Regulation F then adds a call-frequency presumption: more than seven calls in seven days about a particular debt, or any call within seven days after a live conversation about that debt, is presumed a violation.
        </P>
        <P>
          This article explains what those rules actually mean in practice, how to build call-hour and frequency guardrails for AI campaigns, and how DROS makes those guardrails easier to enforce for both AI and human outreach. If you want the full picture on how these rules sit alongside DNC and dispute handling, we cover all three in our <a href="/blogs/ai-voice-agents-dnc-disputes-compliance-2026" className="text-cyan-600 hover:text-cyan-500 underline underline-offset-2 transition-colors">overview of AI voice compliance in collections</a>.
        </P>

        <H2 id="what-rules-say">What Reg F and FDCPA Actually Say About When and How Often You Can Call</H2>
        <P>
          FDCPA and Regulation F work together to shape two big questions: when is it okay to call, and how often is it okay to call about a particular debt?
        </P>
        <ComparisonTable />
        <P>
          Collectors can argue that more frequent calls were still reasonable, but the 7-in-7 framework is the line most agencies design around to stay clearly on the safe side.
        </P>

        <H2 id="operating-layer">Why Call Rules Belong in the Operating Layer, Not Just the AI Script</H2>
        <P>
          Many early AI pilots tried to solve call rules inside the agent's prompt: "don't call at night", "avoid too many attempts." That approach is fragile for two reasons.
        </P>
        <P>
          First, the model can only see the current call, not the full contact history or campaign schedule. Second, prompts are not enforcement. They can nudge behavior but cannot guarantee that call attempts stay within Reg F limits when many calls are being scheduled across time zones and channels.
        </P>
        <P>
          The safer pattern is to treat AI voice agents as coworkers inside a governed operating system. The platform controls when calls are allowed and how often each debt can be contacted, and the AI simply executes within those boundaries.
        </P>
        <P>
          DROS follows this pattern: call windows, per-account time zones, and per-debt frequency limits live in the platform's campaign and workflow settings, and the AI cannot schedule or place calls that violate those rules.
        </P>

        <H2 id="call-hour-design">Designing Call-Hour and Timezone Rules for AI Campaigns</H2>
        <P>
          Before you worry about the 7-in-7 math, you need to make sure calls only happen at sensible times for each consumer. A practical design includes three things:
        </P>
        <Ul items={[
          'Global allowed hours - for example, 09:00-17:00 or 09:00-20:00, defined per campaign.',
          "Local-time enforcement - ensuring those hours apply in the consumer's local time, not just the agency's.",
          'Per-account overrides - honoring consumer requests not to be called at specific times or places, such as "don\'t call me at work" or "no calls after 6 p.m."',
        ]} />
        <P>
          In DROS, this translates into concrete configuration. Campaigns define allowed call hours in a base timezone. A toggle for "use each account's local timezone" tells DROS to translate that window into each consumer's local time, falling back to the campaign timezone if no local timezone is available. Account-level fields can further refine which hours are valid for each consumer.
        </P>

        <H2 id="seven-in-seven">Implementing Reg F's 7-in-7 Limits in Software</H2>
        <P>
          Once call-hour windows are set, the next step is enforcing Reg F call-frequency expectations at the debt level - not just by counting calls globally.
        </P>
        <P>A simple and defensible approach works in three parts.</P>
        <DarkCard>
          <H3>Track calls per debt over a rolling 7-day window</H3>
          <p className="text-black/70 text-sm leading-relaxed">Each outbound attempt about a particular debt increments a counter for that debt. When the count reaches seven, the system prevents additional calls until older attempts age out of the window.</p>
          <H3>Track live conversations separately</H3>
          <p className="text-black/70 text-sm leading-relaxed">When a live conversation about a debt occurs, start a seven-day cooldown during which new calls to that person about that debt are blocked. Other compliant channels - letters, approved digital messages - may still be available depending on your policy.</p>
          <H3>Model exceptions in policy, not inside AI</H3>
          <p className="text-black/70 text-sm leading-relaxed">If your legal team defines scenarios where additional calls are appropriate, those should be explicit policy rules with logging, not instructions buried in AI prompts.</p>
        </DarkCard>
        <P>
          In <a href="/" className="text-cyan-600 hover:text-cyan-500 underline underline-offset-2 transition-colors">DROS</a>, these ideas are implemented as part of the campaign and workflow logic. For each debt, the platform tracks attempt counts and days since last live contact, and uses that data when scheduling calls so an AI campaign cannot contact the same debt more often than your rules allow.
        </P>
        <TimelineRow />

        <H2 id="coordinating">Coordinating AI and Human Campaigns Under the Same Rules</H2>
        <P>
          Reg F and FDCPA do not care whether a call came from a human or an AI agent. What matters is whether the consumer was contacted and how often.
        </P>
        <P>
          To stay safe, all outbound efforts - AI calls, human calls, and dialer-assisted sessions - should write to the same contact history. Call-frequency counters and cooldowns should look at that shared history, not just one channel. When a debt hits your limit, both AI and human campaigns should see the account as ineligible for new calls.
        </P>
        <P>
          DROS is built on this assumption. AI and human calls both live in the same operating layer, so once call rules are configured they apply consistently across all campaigns. This removes the risk that one team or tool overrides another by accident. For how that coordination works when AI needs to hand off to a human mid-call, see our guide to <a href="/blogs/human-in-the-loop-collections" className="text-cyan-600 hover:text-cyan-500 underline underline-offset-2 transition-colors">human-in-the-loop collections</a>.
        </P>

        <H2 id="examples">Examples of Safe vs Risky AI Calling Patterns</H2>
        <SideCards
          left={{
            title: 'Safe pattern',
            items: [
              'Monday: AI attempts one call about Debt A at 10:00 local time, no answer.',
              'Wednesday: Human collector attempts a second call at 14:00 local time, voicemail.',
              'Friday: AI attempts a third call, connects, and has a live conversation about the debt.',
              'Next seven days: No further calls about Debt A. Communication shifts to letters or approved digital channels.',
            ],
          }}
          right={{
            title: 'Risky pattern without good controls',
            items: [
              'Day 1: AI preview dialer makes three attempts in one day.',
              'Days 2-4: Human collectors make additional attempts during different shifts.',
              "Day 5: AI campaign, unaware of all prior attempts, makes more calls - pushing the total over seven in seven days for the same debt.",
            ],
          }}
        />
        <P>
          The safe pattern stays comfortably under 7-in-7 and respects the seven-day post-conversation cooldown. Without a shared contact history and per-debt counters, teams can cross the presumptive violation threshold without realizing it.
        </P>
        <P>
          Payment reminder campaigns are one of the most common places these call-hour and frequency rules apply - see how DROS handles them in our <a href="https://dros.ai/use-cases/payment-reminders" className="text-cyan-600 hover:text-cyan-500 underline underline-offset-2">AI payment reminders guide</a>.
        </P>

        <H2 id="metrics">Metrics and QA for Call-Hour and Reg F Compliance</H2>
        <P>To keep AI campaigns trustworthy, collections leaders should monitor a few signals:</P>
        <Ul items={[
          'Calls scheduled outside allowed call windows - should be near zero after initial setup.',
          'Calls to consumers at unreasonable local times - measure by local-time logs; should be effectively zero.',
          'Debts with more than seven calls in seven days - ideally zero, unless your legal team has documented rebuttals for specific cases.',
          'Calls placed within seven days after a live conversation - should be zero for standard policies.',
          'Proportion of calls blocked by call rules - this tells you whether your rules are actually being enforced across channels.',
        ]} />
        <P>
          AI can increase outreach capacity significantly, but without monitoring these numbers it can also scale over-contact. Simple dashboards around these metrics keep that from happening.
        </P>

        <H2 id="how-dros">How DROS Makes Call Rules Easier to Manage</H2>
        <P>
          For many teams, the hardest part of Reg F and FDCPA compliance is not knowing the rules - it is operationalizing them across tools, teams, and time zones.
        </P>
        <P>
          DROS is designed to make this easier by centralizing call-hour windows so you define allowed hours once per campaign and choose whether to apply them in each account's local timezone. AI calls, human calls, and dialer campaigns all write to the same contact record, so call-frequency logic always sees the full picture. The platform enforces your version of 7-in-7 automatically when scheduling calls, and once a debt is outside allowed hours or over your attempt threshold, DROS marks it ineligible for new calls regardless of who or what is trying to dial.
        </P>
        <P>
          This lets AI agents act like well-trained coworkers who always respect the rules - because the <a href="/blogs/ai-collections-operating-layer" className="text-cyan-600 hover:text-cyan-500 underline underline-offset-2 transition-colors">AI collections operating layer</a> simply does not let them cross the lines.
        </P>

        <H2 id="faq">FAQ</H2>
        <BlogFAQ items={FAQ} />
      </BlogLayout>
    </>
  );
}
