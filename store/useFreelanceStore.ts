import { create } from 'zustand';
import type {
  TimelineNode,
  PackageType,
  CalculatorInputs,
  FreelanceFormData,
} from '@/types/timeline';

export interface FreelanceStoreState {
  showAllProjects: boolean;
  hoveredNode: TimelineNode | null;
  calculatorInputs: CalculatorInputs;
  formSubmitted: boolean;
  formData: FreelanceFormData;

  // Actions
  setShowAllProjects: (show: boolean | ((prev: boolean) => boolean)) => void;
  toggleShowAllProjects: () => void;
  setHoveredNode: (node: TimelineNode | null) => void;
  setCalculatorInputs: (
    inputs: CalculatorInputs | ((prev: CalculatorInputs) => CalculatorInputs)
  ) => void;
  handlePackageChange: (pkg: PackageType) => void;
  handleAddonToggle: (addonId: string) => void;
  setFormData: (
    data: FreelanceFormData | ((prev: FreelanceFormData) => FreelanceFormData)
  ) => void;
  setFormSubmitted: (submitted: boolean) => void;
  resetForm: () => void;
}

const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  selectedPackage: 'crud',
  screenCount: 5,
  apiNodes: 3,
  selectedAddons: [],
  timelineSpeed: 'standard',
  supportCoverage: 'standard',
};

const DEFAULT_FORM_DATA: FreelanceFormData = {
  name: '',
  email: '',
  projectDesc: '',
};

export const useFreelanceStore = create<FreelanceStoreState>((set) => ({
  showAllProjects: false,
  hoveredNode: null,
  calculatorInputs: DEFAULT_CALCULATOR_INPUTS,
  formSubmitted: false,
  formData: DEFAULT_FORM_DATA,

  setShowAllProjects: (show) =>
    set((state) => ({
      showAllProjects: typeof show === 'function' ? show(state.showAllProjects) : show,
    })),

  toggleShowAllProjects: () =>
    set((state) => ({ showAllProjects: !state.showAllProjects })),

  setHoveredNode: (node) => set({ hoveredNode: node }),

  setCalculatorInputs: (inputs) =>
    set((state) => ({
      calculatorInputs:
        typeof inputs === 'function' ? inputs(state.calculatorInputs) : inputs,
    })),

  handlePackageChange: (pkg) =>
    set((state) => ({
      calculatorInputs: { ...state.calculatorInputs, selectedPackage: pkg },
    })),

  handleAddonToggle: (addonId) =>
    set((state) => {
      const exists = state.calculatorInputs.selectedAddons.includes(addonId);
      const nextAddons = exists
        ? state.calculatorInputs.selectedAddons.filter((id) => id !== addonId)
        : [...state.calculatorInputs.selectedAddons, addonId];
      return {
        calculatorInputs: { ...state.calculatorInputs, selectedAddons: nextAddons },
      };
    }),

  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : data,
    })),

  setFormSubmitted: (submitted) => set({ formSubmitted: submitted }),

  resetForm: () =>
    set({
      formData: DEFAULT_FORM_DATA,
      formSubmitted: false,
    }),
}));
