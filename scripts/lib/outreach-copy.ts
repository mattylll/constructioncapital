/**
 * Email sequence for the weekly planning-approval campaign in Instantly.
 *
 * Three emails. The first congratulates the developer on the consent and lays
 * out an indicative capital stack for the scheme: senior debt at 65% LTGDV,
 * stretch senior, mezzanine to 75% LTGDV, and the equity or JV balance. The
 * GDV comes from HM Land Registry sold prices and three recent comparables are
 * quoted; the cost side comes from the site's appraisal model.
 *
 * Variables are set per lead as custom variables (Instantly's own {{firstName}}
 * is a core variable). See CUSTOM_VARIABLE_NAMES.
 *
 * Copy rules: plain text, no rate promises, no regulatory claims (Construction
 * Capital is not FCA regulated and must not imply it), no em-dashes, and an
 * explicit "reply no" opt-out on the first email.
 */

import type { InstantlySequenceStep, InstantlyScheduleWindow } from "./instantly";

export const CAMPAIGN_NAME_DEFAULT = "Planning Approvals - Weekly";

export const CUSTOM_VARIABLE_NAMES = [
  "siteAddress",
  "sitePostcode",
  "planningReference",
  "localAuthority",
  "consentStage",
  "unitsText",
  "gdv",
  "costSuffix",
  "unitValue",
  "soldMedian",
  "soldCount12m",
  "comp1",
  "comp2",
  "comp3",
  "seniorLine",
  "stretchLine",
  "mezzLine",
  "equityLine",
  "seniorLoan",
  "seniorLtgdv",
  "stretchSenior",
  "mezzanine",
  "totalDebt",
  "totalDebtLtgdv",
  "equityWithSenior",
  "equityWithMezz",
  "termMonths",
  "townName",
  "planningUrl",
  "locationPageUrl",
  "intro",
  "contactRole",
  "decisionDate",
] as const;

export const INTRO_OWNER =
  "I arrange development finance for consented residential schemes across England and Wales, and I have put together a high-level view of how this one could be funded, from senior debt through to equity.";

export const INTRO_DIRECTOR =
  "Your name came up on the application, so I hope you are the right person. I arrange development finance for consented residential schemes, and I have put together a high-level view of how this one could be funded, from senior debt through to equity.";

export const INTRO_AGENT =
  "I appreciate you will be the agent rather than the developer, but in case it is useful for your client, I have put together a high-level view of how this scheme could be funded, from senior debt through to equity.";

function lines(...rows: string[]): string {
  return rows.map((r) => (r === "" ? "<div><br /></div>" : `<div>${r}</div>`)).join("");
}

export function buildSequence(): InstantlySequenceStep[] {
  return [
    {
      type: "email",
      delay: 0,
      variants: [
        {
          subject: "Congratulations on securing planning for {{siteAddress}}",
          body: lines(
            "Hi {{firstName}},",
            "",
            "Congratulations on securing planning for {{siteAddress}}. I saw that {{localAuthority}} has granted {{consentStage}} under {{planningReference}}.",
            "",
            "{{intro}}",
            "",
            "Estimated GDV: {{gdv}} for {{unitsText}}{{costSuffix}}.",
            "",
            "Indicative funding options, high level:",
            "Senior debt: {{seniorLine}}",
            "Stretch senior: {{stretchLine}}",
            "Senior plus mezzanine: {{mezzLine}}",
            "Equity or JV: {{equityLine}}",
            "Term: around {{termMonths}} months, interest rolled up, drawn against the build",
            "",
            "The GDV is based on HM Land Registry sold prices in {{townName}} ({{soldCount12m}} sales in the last 12 months, median {{soldMedian}}), at roughly {{unitValue}} per unit for this type of scheme. Recent local sales:",
            "{{comp1}}",
            "{{comp2}}",
            "{{comp3}}",
            "",
            "These are not lender terms; they are a starting point subject to valuation, your build costs, track record and full underwriting. If it is useful, I can get proper indicative terms back from our lender panel within 24 hours, for whichever structure suits you, with no cost or obligation.",
            "",
            "Would a short call this week make sense?",
            "",
            "Matt Lenzie",
            "Construction Capital",
            "constructioncapital.co.uk",
            "",
            "If this is not relevant, just reply with \"no\" and I will not follow up."
          ),
        },
      ],
    },
    {
      type: "email",
      delay: 3,
      variants: [
        {
          subject: "",
          body: lines(
            "Hi {{firstName}},",
            "",
            "A quick follow-up on {{siteAddress}}.",
            "",
            "The structure that works best usually depends on how much of your own cash you want in the deal. Senior debt at {{seniorLtgdv}} of GDV is the cheapest money but leaves the most equity to find. Adding mezzanine can take total debt to {{totalDebt}} ({{totalDebtLtgdv}} of GDV) and cut the equity, although mezzanine is always subject to the lender evaluating the scheme, the costs and your track record. A JV partner can cover the rest if you would rather keep your capital for the next site.",
            "",
            "Lenders are keen on schemes with planning in place right now, so it is a good moment to test the market. If you already have a lender lined up, a second set of terms costs nothing and usually sharpens the first one.",
            "",
            "Matt Lenzie",
            "Construction Capital"
          ),
        },
      ],
    },
    {
      type: "email",
      delay: 4,
      variants: [
        {
          subject: "",
          body: lines(
            "Hi {{firstName}},",
            "",
            "I will leave it there on {{siteAddress}}.",
            "",
            "If the timing is wrong right now, reply with a rough start date and I will get back in touch nearer the time. Otherwise, good luck with the build.",
            "",
            "Matt Lenzie",
            "Construction Capital",
            "constructioncapital.co.uk"
          ),
        },
      ],
    },
  ];
}

/**
 * Instantly rejects "Europe/London" with a 400 ("timezone must be equal to one of
 * the allowed values"); the workspace's existing campaigns use Europe/Isle_of_Man,
 * which follows the same GMT/BST clock. Override with INSTANTLY_TIMEZONE.
 */
export function buildSchedule(timezone = process.env.INSTANTLY_TIMEZONE ?? "Europe/Isle_of_Man"): InstantlyScheduleWindow[] {
  return [
    {
      name: "UK business hours",
      timing: { from: "08:30", to: "17:30" },
      days: { "0": false, "1": true, "2": true, "3": true, "4": true, "5": true, "6": false },
      timezone,
    },
  ];
}
