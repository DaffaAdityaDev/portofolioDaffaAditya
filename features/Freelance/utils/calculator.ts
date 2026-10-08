import type { CalculatorInputs, PackageType } from '@/types/timeline';

export const PACKAGE_PRESETS: Record<
  PackageType,
  { label: string; basePrice: number; includedScreens: number; includedApis: number }
> = {
  crud: {
    label: 'Admin System',
    basePrice: 3000,
    includedScreens: 5,
    includedApis: 3,
  },
  'low-code': {
    label: 'Visual Editor',
    basePrice: 5000,
    includedScreens: 8,
    includedApis: 5,
  },
  ai: {
    label: 'LLM Feature',
    basePrice: 7000,
    includedScreens: 6,
    includedApis: 8,
  },
  saas: {
    label: 'SaaS Application',
    basePrice: 8500,
    includedScreens: 12,
    includedApis: 10,
  },
  custom: {
    label: 'Website / MVP',
    basePrice: 1500,
    includedScreens: 2,
    includedApis: 2,
  },
};

export const ADDON_PRICES: Record<string, { label: string; price: number }> = {
  uiux: { label: 'UI Design in Figma', price: 1500 },
  sla: { label: '3 Months of Support', price: 2000 },
  hosting: { label: 'Deployment Setup', price: 800 },
  domain: { label: 'Domain & DNS Setup', price: 300 },
};

export const EXTRA_SCREEN_COST = 250;
export const EXTRA_API_COST = 400;
export const URGENT_SPEED_MULTIPLIER = 1.35;
export const SUPPORT_24_7_COST = 1000;

/**
 * Pure calculation function for real-time freelance scope quotes.
 * Zero side-effects, unit-testable math formula.
 */
export function calculateFreelanceQuote(inputs: CalculatorInputs): number {
  const preset = PACKAGE_PRESETS[inputs.selectedPackage] || PACKAGE_PRESETS.crud;
  const extraScreens = Math.max(0, inputs.screenCount - preset.includedScreens);
  const extraApis = Math.max(0, inputs.apiNodes - preset.includedApis);

  const devSubtotal =
    preset.basePrice +
    extraScreens * EXTRA_SCREEN_COST +
    extraApis * EXTRA_API_COST;

  const speedMultiplier = inputs.timelineSpeed === 'urgent' ? URGENT_SPEED_MULTIPLIER : 1.0;
  let subtotal = devSubtotal * speedMultiplier;

  for (const addonId of inputs.selectedAddons) {
    if (ADDON_PRICES[addonId]) {
      subtotal += ADDON_PRICES[addonId].price;
    }
  }

  if (inputs.supportCoverage === '24_7') {
    subtotal += SUPPORT_24_7_COST;
  }

  return Math.round(subtotal);
}
