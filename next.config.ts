import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async redirects() {
        // The Q1 2026 press-report editions were superseded by their Q2/H1 2026
        // successors. The 5 snapshot-style reports (not inherently period-flow)
        // moved straight to a dated H1 2026 edition; the fastest-growing-markets
        // report's direct successor is its Q2 2026 edition (the next quarter).
        const pressReportSlugRenames: [string, string][] = [
            ['fastest-growing-markets-q1-2026', 'fastest-growing-property-markets-q2-2026'],
            ['affordable-development-hotspots-2026', 'affordable-development-hotspots-h1-2026'],
            ['new-build-premium-report-q1-2026', 'new-build-premium-report-h1-2026'],
            ['planning-pipeline-hotspots-2026', 'planning-pipeline-hotspots-h1-2026'],
            ['property-type-price-gaps-2026', 'property-type-price-gaps-h1-2026'],
            ['development-market-barometer-q1-2026', 'development-market-barometer-h1-2026'],
        ];
        return pressReportSlugRenames.map(([from, to]) => ({
            source: `/market-reports/${from}`,
            destination: `/market-reports/${to}`,
            permanent: true,
        }));
    },
};

export default withBundleAnalyzer(nextConfig);
