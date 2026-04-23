const steps = [
  {
    num: "01",
    title: "Tell us the deal",
    body:
      "Two minutes on a call or form. Scheme, site, borrower, capital stack. We take the full picture on day one so nothing surfaces later.",
    annotation: "Average 24 hours to indicative terms.",
  },
  {
    num: "02",
    title: "We source terms",
    body:
      "Targeted packaging to the three to five lenders on our panel best suited to the deal. No scattergun enquiries, no damaged pricing from repeat footprints.",
    annotation: "Panel of 100+ lenders: high-street, challenger, specialist, family office, institutional.",
  },
  {
    num: "03",
    title: "Through to drawdown",
    body:
      "We manage valuation, legals and credit through to completion. Single point of contact, weekly updates, no dropped stitches.",
    annotation: "60%+ of origination is repeat business.",
  },
];

export function HowItWorksTimeline() {
  return (
    <section
      className="relative py-24 sm:py-32"
      style={{ background: "var(--stone)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <header className="mb-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <span className="rule-gold" aria-hidden />
              <p
                className="text-[11px] font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--navy)" }}
              >
                How it works
              </p>
            </div>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              From enquiry to drawdown.
            </h2>
          </div>
          <p
            className="max-w-[40ch] text-[17px] leading-[1.65] lg:col-span-6 lg:col-start-7"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            No onboarding flows, no scripts, no gatekeeping. You speak to the
            principal on the first call and every call after it. Here&rsquo;s
            how a deal moves through the firm.
          </p>
        </header>

        <ol className="grid gap-px border-y sm:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", backgroundColor: "var(--stone-dark)" }}
        >
          {steps.map((step) => (
            <li
              key={step.num}
              className="flex flex-col justify-between gap-12 p-8 sm:p-10"
              style={{ background: "var(--stone)" }}
            >
              <div>
                <p
                  className="numeral-tabular font-heading text-5xl font-medium tracking-tight"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {step.num}
                </p>
                <h3
                  className="font-heading mt-6 text-xl font-medium tracking-tight sm:text-2xl"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-4 text-[15px] leading-[1.6]"
                  style={{ color: "oklch(0.40 0.03 255)" }}
                >
                  {step.body}
                </p>
              </div>
              <p
                className="border-t pt-4 text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{
                  color: "oklch(0.42 0.03 255)",
                  borderColor: "var(--stone-dark)",
                }}
              >
                {step.annotation}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
