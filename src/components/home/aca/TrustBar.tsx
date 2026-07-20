import AcaContainer from './AcaContainer';

const COMPLIANCE = ['FDCPA', 'Reg F', 'TCPA', 'SOC 2', 'HIPAA'];

export default function TrustBar() {
  return (
    <section className="bg-paper py-9 text-ink-dark">
      <AcaContainer>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="font-inter text-[0.92rem] text-ink-grey">
            Built by the team behind <span className="font-semibold text-ink-dark">Vodex</span> - Backed by{' '}
            <span className="font-semibold text-ink-dark">100X VC, Unicorn &amp; Penthalon Ventures</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-line-dark px-3.5 py-1.5 font-inter text-[0.78rem] font-medium text-ink-dark"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </AcaContainer>
    </section>
  );
}
