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
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects personal data. Issued by ${LEGAL_ENTITY.name} (company ${LEGAL_ENTITY.companyNumber}) under UK GDPR and the Data Protection Act 2018.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `How ${SITE_NAME} collects, uses and protects personal data.`,
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
        eyebrow="Legal"
        title={
          <>
            Privacy
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              policy.
            </span>
          </>
        }
        deck={
          <>
            How we collect, use, store and protect personal data &mdash; in
            plain English, and in line with the UK GDPR and the Data Protection
            Act 2018.
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
          <ProseSection title="Who we are">
            <p>
              This website, <strong>{SITE_NAME}</strong>, is operated by{" "}
              <strong>{LEGAL_ENTITY.name}</strong>, a company registered in{" "}
              {LEGAL_ENTITY.jurisdiction} under company number{" "}
              {LEGAL_ENTITY.companyNumber}, trading as{" "}
              {LEGAL_ENTITY.tradingAs}. Our registered office is{" "}
              {LEGAL_ENTITY.registeredOffice}.
            </p>
            <p>
              For the purposes of UK data protection law,{" "}
              {LEGAL_ENTITY.name} is the <em>data controller</em> for personal
              data collected through this website and during client
              engagements. Questions about this policy should be sent to{" "}
              <a
                className="editorial-link"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </ProseSection>

          <ProseSection title="What we collect">
            <p>
              We only collect the personal data we actually need to introduce
              your project to lenders and to operate this website. That falls
              into three buckets:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Enquiry and deal data</strong> &mdash; your name, email
                address, phone number, company name and the details of the
                transaction you are seeking finance for. You provide this
                directly via our Deal Room, enquiry forms, email, or telephone.
              </li>
              <li>
                <strong>Technical data</strong> &mdash; IP address, browser
                type, device type, referring URL, and pages visited. Collected
                automatically via server logs and first-party analytics to
                keep the site secure and understand which pages are useful.
              </li>
              <li>
                <strong>Cookies</strong> &mdash; strictly-necessary cookies
                required for forms and authentication, plus analytics cookies
                which you can reject. See the <em>Cookies</em> section below.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> collect special category data (health,
              biometric, political opinion, etc.). If a lender requires
              additional personal information during application, that is
              collected directly by the lender under their own privacy notice.
            </p>
          </ProseSection>

          <ProseSection title="How we use it">
            <p>Personal data is used only for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Responding to your enquiry</strong> and structuring
                your deal &mdash; legal basis: performance of a contract, or
                steps prior to entering a contract.
              </li>
              <li>
                <strong>Introducing your deal to appropriate lenders</strong>,
                with your express consent, so that indicative terms can be
                produced &mdash; legal basis: consent and legitimate interest.
              </li>
              <li>
                <strong>Keeping records of advice given and deals
                completed</strong> for the statutory period &mdash; legal
                basis: legal obligation.
              </li>
              <li>
                <strong>Improving the site</strong>, understanding which
                content is useful, and detecting misuse &mdash; legal basis:
                legitimate interest.
              </li>
              <li>
                <strong>Sending occasional market updates</strong> relevant to
                your project &mdash; only where you have opted in, and you can
                unsubscribe at any time from the footer of any message.
              </li>
            </ul>
          </ProseSection>

          <ProseSection title="Who we share it with">
            <p>
              We never sell personal data. We share it only when strictly
              necessary:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Lenders and funding partners</strong> on our panel,
                once you have authorised us to approach the market on your
                behalf. We introduce your deal to the smallest reasonable set
                of lenders, not the whole panel.
              </li>
              <li>
                <strong>Professional advisers</strong> &mdash; solicitors,
                valuers, monitoring surveyors &mdash; where their involvement
                is necessary to progress a transaction.
              </li>
              <li>
                <strong>Service providers</strong> we use to run this site:
                hosting (Netlify), CRM (GoHighLevel), email delivery (Resend),
                call routing (Twilio), and analytics. Each acts as a processor
                under contract and cannot use your data for their own
                purposes.
              </li>
              <li>
                <strong>Regulatory or legal authorities</strong> where we are
                required by law to do so.
              </li>
            </ul>
          </ProseSection>

          <ProseSection title="How long we keep it">
            <p>
              Enquiry and deal data is retained for the duration of the
              engagement and for seven years afterwards, to satisfy AML, tax
              and professional-indemnity record-keeping requirements. Anonymous
              analytics data is retained for up to 26 months. Marketing
              consents are retained until withdrawn. After these periods data
              is securely deleted.
            </p>
          </ProseSection>

          <ProseSection title="Cookies">
            <p>
              We use a small number of first-party cookies for site
              functionality (e.g. keeping you signed in to admin areas, and
              remembering form progress) and for privacy-preserving analytics.
              We do not use cross-site tracking cookies, social-retargeting
              pixels, or advertising cookies.
            </p>
            <p>
              You can disable non-essential cookies at any time through your
              browser settings. Disabling essential cookies will prevent parts
              of the site from working correctly.
            </p>
          </ProseSection>

          <ProseSection title="Your rights">
            <p>Under the UK GDPR you have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Access the personal data we hold about you (a &lsquo;subject
                access request&rsquo;);
              </li>
              <li>Request correction of inaccurate data;</li>
              <li>
                Request deletion of your data where we no longer have a lawful
                basis to retain it;
              </li>
              <li>Restrict or object to processing;</li>
              <li>
                Withdraw consent for marketing at any time, without affecting
                the lawfulness of prior processing;
              </li>
              <li>
                Lodge a complaint with the Information Commissioner&rsquo;s
                Office (ICO) at{" "}
                <a
                  className="editorial-link"
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ico.org.uk
                </a>
                .
              </li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a
                className="editorial-link"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
              . We aim to respond within 30 days.
            </p>
          </ProseSection>

          <ProseSection title="Security">
            <p>
              Data is transmitted over TLS, stored within the UK or European
              Economic Area, and access is restricted to Matt Lenzie and any
              engaged professional advisers on a strict need-to-know basis. We
              review our security posture regularly and will notify affected
              individuals and the ICO without undue delay in the unlikely event
              of a personal data breach.
            </p>
          </ProseSection>

          <ProseSection title="Changes to this policy">
            <p>
              We will update this page when our data practices change. The
              &lsquo;last updated&rsquo; date at the top tells you when it was
              last revised. Material changes affecting existing clients will be
              notified by email.
            </p>
          </ProseSection>

          <ProseSection title="Contact">
            <p>
              {LEGAL_ENTITY.name} ({LEGAL_ENTITY.tradingAs})
              <br />
              {LEGAL_ENTITY.registeredOffice}
              <br />
              Email:{" "}
              <a
                className="editorial-link"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
              <br />
              Phone:{" "}
              <a
                className="editorial-link numeral-tabular"
                href={`tel:${CONTACT.phoneRaw}`}
              >
                {CONTACT.phone}
              </a>
            </p>
            <p>
              See also our{" "}
              <Link className="editorial-link" href="/terms">
                Terms of Use
              </Link>
              .
            </p>
          </ProseSection>
        </div>
      </EditorialSection>
    </>
  );
}
