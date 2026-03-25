import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.slateinvoice.com'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/how-to-write-a-professional-invoice`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/how-to-get-paid-faster-freelancer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/invoice-vs-receipt-difference`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/best-invoicing-software-small-business`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/client-wont-pay-invoice`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
