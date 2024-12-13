import { GTagEvent } from '@/types/gtag';

// Use environment variable for GA4 measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Ensure GA is initialized before calling these functions
export const pageview = (url: string) => {
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
