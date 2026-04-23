import {
  CTAButton,
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CONTACT } from "@/lib/constants";

interface LocationCTAProps {
  townName?: string;
  serviceName?: string;
}

export function LocationCTA({ townName, serviceName }: LocationCTAProps) {
  const product = serviceName ?? "development finance";
  const where = townName ? ` in ${townName}` : "";

  return (
    <EditorialSection tone="navy-dark">
      <SectionHeader
        tone="navy-dark"
        eyebrow="Ready when you are"
        title={
          <>
            Tell us the deal.
            <br />
            <span className="italic" style={{ color: "var(--gold-light)" }}>
              We&rsquo;ll recommend the structure.
            </span>
          </>
        }
        body={
          <>
            Submit your {product} enquiry{where} and a partner will come back
            with an initial structure and indicative terms within one working
            day. No forms-for-forms&rsquo;-sake &mdash; a short note on the
            scheme is enough.
          </>
        }
      />
      <div className="mt-12 flex flex-wrap items-center gap-5">
        <CTAButton href="/deal-room" variant="gold" size="lg">
          Enter the Deal Room
        </CTAButton>
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
          style={{ color: "oklch(1 0 0 / 0.95)" }}
        >
          Or call {CONTACT.phone}
        </a>
      </div>
    </EditorialSection>
  );
}
