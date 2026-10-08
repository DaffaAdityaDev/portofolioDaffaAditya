import { useMemo, useCallback } from 'react';
import type { PackageType, CalculatorInputs, FreelanceFormData } from '@/types/timeline';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import {
  calculateFreelanceQuote,
  PACKAGE_PRESETS,
  ADDON_PRICES,
} from '../utils/calculator';

export type { PackageType, CalculatorInputs, FreelanceFormData };

/**
 * Calculator-scoped state hook (Logic & State Layer).
 * Subscribes only to the calculator/form slices of the Zustand store, so timeline hover
 * and "show all projects" updates never re-render the cost calculator. Timeline components
 * select their own fields straight from useFreelanceStore.
 */
export const useFreelanceCalculator = () => {
  const calculatorInputs = useFreelanceStore((state) => state.calculatorInputs);
  const setCalculatorInputs = useFreelanceStore((state) => state.setCalculatorInputs);
  const formSubmitted = useFreelanceStore((state) => state.formSubmitted);
  const setFormSubmitted = useFreelanceStore((state) => state.setFormSubmitted);
  const formData = useFreelanceStore((state) => state.formData);
  const setFormData = useFreelanceStore((state) => state.setFormData);
  const resetForm = useFreelanceStore((state) => state.resetForm);

  // Derived Real-Time Quote Calculation
  const estimatedQuote = useMemo(() => {
    return calculateFreelanceQuote(calculatorInputs);
  }, [calculatorInputs]);

  // Package Selection Action (resets screens and apis to package recommendations)
  const handlePackageChange = useCallback(
    (pkg: PackageType) => {
      const preset = PACKAGE_PRESETS[pkg] || PACKAGE_PRESETS.crud;
      setCalculatorInputs((prev) => ({
        ...prev,
        selectedPackage: pkg,
        screenCount: preset.includedScreens,
        apiNodes: preset.includedApis,
      }));
    },
    [setCalculatorInputs]
  );

  // Service Addon Toggle Action
  const handleAddonToggle = useCallback(
    (addonId: string) => {
      setCalculatorInputs((prev) => {
        const active = prev.selectedAddons.includes(addonId);
        return {
          ...prev,
          selectedAddons: active
            ? prev.selectedAddons.filter((id) => id !== addonId)
            : [...prev.selectedAddons, addonId],
        };
      });
    },
    [setCalculatorInputs]
  );

  // Proposal Submission Handler
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const preset = PACKAGE_PRESETS[calculatorInputs.selectedPackage] || PACKAGE_PRESETS.crud;
      const pkgLabel = preset.label;

      const addonsList = calculatorInputs.selectedAddons.map(
        (id) => `- ${ADDON_PRICES[id]?.label || id} (+$${ADDON_PRICES[id]?.price || 0})`
      );
      const addonsStr = addonsList.length > 0 ? addonsList.join('\n') : 'None selected';

      const emailSubject = `Project Inquiry: ${pkgLabel} - ${formData.name}`;
      const emailBody = `Hi Daffa,

I'd like to talk about a project. Here is what I picked in the estimator on your freelance page:

## PROJECT OVERVIEW
- Project type: ${pkgLabel}
- Screens: ${calculatorInputs.screenCount}
- Third-party integrations: ${calculatorInputs.apiNodes}
- Schedule: ${calculatorInputs.timelineSpeed === 'urgent' ? 'Urgent (+35%)' : 'Standard'}
- Support hours: ${calculatorInputs.supportCoverage === '24_7' ? 'Extended (+$1,000)' : 'Working hours'}
- Extras:
${addonsStr}

## ROUGH ESTIMATE (NOT A QUOTE)
- From $${estimatedQuote.toLocaleString()} USD

## CLIENT DETAILS
- Name: ${formData.name}
- Email: ${formData.email}

## BRIEF
${formData.projectDesc}

---
Sent from daffaaditya.id/freelance`;

      const mailtoUrl = `mailto:daffaaditya.me@gmail.com?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoUrl;

      setFormSubmitted(true);
      setTimeout(() => {
        resetForm();
      }, 4000);
    },
    [calculatorInputs, formData, estimatedQuote, setFormSubmitted, resetForm]
  );

  return {
    calculatorInputs,
    setCalculatorInputs,
    formSubmitted,
    setFormSubmitted,
    formData,
    setFormData,
    resetForm,

    estimatedQuote,
    handlePackageChange,
    handleAddonToggle,
    handleFormSubmit,
  };
};

/** @deprecated Kept for the features/Freelance barrel export; use useFreelanceCalculator. */
export const useFreelance = useFreelanceCalculator;

export default useFreelanceCalculator;
