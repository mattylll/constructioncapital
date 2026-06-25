// Cross-domain "finance mesh" links, keyed by `${countySlug}/${townSlug}`.
// Surfaces co-located finance partners (our other brands serving the same town)
// on the matching location page only. Add a new key as each local mesh ships.
export interface LocalFinancePartner {
  href: string;
  label: string;
  description: string;
}

export const LOCAL_FINANCE_NETWORK: Record<string, LocalFinancePartner[]> = {
  "west-midlands/birmingham": [
    {
      href: "https://commercialmortgagesbirmingham.co.uk",
      label: "Commercial Mortgages Birmingham",
      description:
        "Specialist commercial mortgage broker for Birmingham and the West Midlands.",
    },
    {
      href: "https://birminghamdevelopmentfinance.co.uk",
      label: "Development Finance Birmingham",
      description:
        "Senior debt, mezzanine and JV equity for Birmingham property developers.",
    },
    {
      href: "https://commercialmortgagesbroker.co.uk/locations/west-midlands/birmingham",
      label: "Commercial Mortgage Brokers Birmingham",
      description:
        "Whole-of-market commercial mortgage brokers covering Birmingham commercial property.",
    },
  ],
};

export function getLocalFinancePartners(
  countySlug: string,
  townSlug: string,
): LocalFinancePartner[] {
  return LOCAL_FINANCE_NETWORK[`${countySlug}/${townSlug}`] ?? [];
}
