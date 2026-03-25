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
    { url: `${base}/blog/how-to-create-professional-invoice`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/invoice-software-freelancers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/get-paid-faster-invoicing-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/free-invoice-generator-small-business`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/invoice-vs-receipt-difference`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/how-to-follow-up-unpaid-invoice`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
