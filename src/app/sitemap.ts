import type { MetadataRoute } from 'next';
import { getSitemapRoutes, SITE_BASE } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getSitemapRoutes();
  return routes.map(({ path }) => ({
    url: `${SITE_BASE}${path}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path.match(/^\/[a-z]{2}\/?$/) ? 1 : 0.8,
  }));
}
