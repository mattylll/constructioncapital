import type { Metadata } from "next";
import Link from "next/link";

import {
  EditorialSection,
  PageHero,
  ProseSection,
} from "@/components/editorial/primitives";
import {
  CONTACT,
  LEGAL_ENTITY,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

const LAST_UPDATED = "22 April 2026";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms and conditions for using the ${SITE_NAME} website, operated by ${LEGAL_ENTITY.name} (company ${LEGAL_ENTITY.companyNumber}).`,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: `Terms of Use | ${SITE_NAME}`,
    description: `Terms and conditions for using the ${SITE_NAME} website.`,
    url: `${SITE_URL}/terms`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        eyebrow="Legal"
        title={
          <>
            Terms
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              of use.
            </span>
          </>
        }
        deck={
          <>
            The terms on which we make this website and our introduction
            services available. Please read them before using the site or
            submitting a deal.
          </>
        }
      />

      <EditorialSection tone="paper">
        <p
          className="mb-12 text-[11px] font-medium uppercase tracking-[0.26em]"
          style={{ color: "oklch(0.50 0.02 255)" }}
        >
          Last updated &middot; {LAST_UPDATED}
        </p>

        <div className="space-y-16">
          <ProseSection title="About us">
            <p>
              <strong>{SITE_NAME}</strong> is a trading name of{" "}
              <strong>{LEGAL_ENTITY.name}</strong>, a company registered in{" "}
              {LEGAL_ENTITY.jurisdiction} under company number{" "}
              {LEGAL_ENTITY.companyNumber}, with registered office at{" "}
              {LEGAL_ENTITY.registeredOffice}.
            </p>
            <p>
              By using this website you agree to these Terms of Use. If you do
              not agree, please do not use the site.
            </p>
          </ProseSection>

          <ProseSection title="What we do">
            <p>
              We arrange introductions between UK property developers and
              specialist lenders and investors on a fee basis. We are a
              commercial introducer and property finance broker. We are not a
              lender, we do not provide investment advice, and we do not advise
              on regulated residential mortgages or other consumer credit.
            </p>
            <p>
              All finance terms are issued by third-party lenders, subject to
              their own underwriting, valuation and legal processes. We make no
              guarantee that any deal will be offered terms, accepted or
              completed.
            </p>
          </ProseSection>

          <ProseSection title="Regulatory status">
            <p>
              {LEGAL_ENTITY.name} is not authorised by the Financial Conduct
              Authority. The transactions we arrange are unregulated commercial
              property finance for professional developers and corporate
              borrowers and do not constitute a regulated activity under the
              Financial Services and Markets Act 2000. We are not members of
              the National Association of Commercial Finance Brokers.
            </p>
            <p>
              If your deal is regulated (for example, a loan secured against
              your own home), we will tell you and refer you to an
              appropriately authorised firm.
            </p>
          </ProseSection>

          <ProseSection title="Content on the website">
            <p>
              The information on this site &mdash; including guides, market
              reports, calculators, indicative rates and location pages &mdash;
              is provided for general information only. It is not financial,
              legal, tax or investment advice and should not be relied on as
              such. Rates, LTVs and terms are indicative, change frequently and
              are subject to lender underwriting.
            </p>
            <p>
              Calculators are modelling tools; they make simplifying
              assumptions and do not represent a quote, offer, or guarantee of
              availability. Any figures are illustrative only.
            </p>
          </ProseSection>

          <ProseSection title="Third-party data and sources">
            <p>
              Market statistics on this site incorporate data from HM Land
              Registry Price Paid data, local planning authorities via public
              Civica and Idox portals, and other publicly available sources.
              Data is processed in good faith but we accept no responsibility
              for errors or omissions in third-party datasets.
            </p>
          </ProseSection>

          <ProseSection title="Intellectual property">
            <p>
              All original content on this site &mdash; text, calculators,
              design, and code &mdash; is copyright of {LEGAL_ENTITY.name}{" "}
              unless otherwise stated. Imagery is licensed from Unsplash under
              the Unsplash licence. You may view and print material for your
              own non-commercial use, but you may not copy, re-publish or
              redistribute substantial portions of the site without written
              permission.
            </p>
          </ProseSection>

          <ProseSection title="Submissions">
            <p>
              When you submit a deal via the Deal Room, enquiry form or email,
              you confirm that the information provided is accurate to the
              best of your knowledge and that you are authorised to submit it.
              We will handle any personal data in line with our{" "}
              <Link className="editorial-link" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              No contractual relationship is created by an enquiry alone. Any
              introduction or broking engagement is governed by a separate
              written terms-of-business letter which we will send before
              approaching the market on your behalf.
            </p>
          </ProseSection>

          <ProseSection title="Liability">
            <p>
              Nothing in these Terms limits our liability for death or personal
              injury caused by negligence, fraud, or any other liability that
              cannot lawfully be excluded.
            </p>
            <p>
              Subject to that, to the maximum extent permitted by law we will
              not be liable for any indirect, incidental or consequential loss
              &mdash; including loss of profits, loss of business, or wasted
              costs &mdash; arising from use of, or reliance on, the content
              of this website. Where we arrange a transaction, our liability
              is governed by the terms-of-business letter for that engagement.
            </p>
          </ProseSection>

          <ProseSection title="External links">
            <p>
              This site contains links to third-party websites (for example,
              lender pages, planning portals and news sources). We are not
              responsible for the content, accuracy, or availability of those
              sites. A link does not imply endorsement.
            </p>
          </ProseSection>

          <ProseSection title="Changes to these terms">
            <p>
              We may update these Terms from time to time. The &lsquo;last
              updated&rsquo; date above tells you when they were last revised.
              Continued use of the site after a change constitutes acceptance
              of the revised Terms.
            </p>
          </ProseSection>

          <ProseSection title="Governing law">
            <p>
              These Terms, and any dispute arising from them or from your use
              of the site, are governed by the laws of England and Wales. The
              courts of England and Wales have exclusive jurisdiction.
            </p>
          </ProseSection>

          <ProseSection title="Contact">
            <p>
              Questions about these Terms should be sent to{" "}
              <a
                className="editorial-link"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>{" "}
              or by post to {LEGAL_ENTITY.name}, {LEGAL_ENTITY.registeredOffice}.
            </p>
            <p>
              See also our{" "}
              <Link className="editorial-link" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          </ProseSection>
        </div>
      </EditorialSection>
    </>
  );
}
