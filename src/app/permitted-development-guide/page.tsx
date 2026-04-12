import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { getHubBySlug } from "@/lib/hubs";
import { HubPageLayout } from "@/components/hubs/hub-page-layout";

const hub = getHubBySlug("permitted-development-guide")!;

export const metadata: Metadata = {
  title: hub.metaTitle,
  description: hub.metaDescription,
  alternates: { canonical: `${SITE_URL}/${hub.slug}` },
  openGraph: {
    title: hub.metaTitle,
    description: hub.metaDescription,
    url: `${SITE_URL}/${hub.slug}`,
    type: "website",
  },
};

export default function Page() {
  return <HubPageLayout hub={hub} />;
}
