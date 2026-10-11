import { create } from 'zustand';
import type { BriefFormData, BriefStatus, BudgetCurrency, ServiceId } from '@/types/freelance';
import { EMPTY_BRIEF } from '@/features/Freelance/constants/inquiry';

export interface FreelanceStoreState {
  brief: BriefFormData;
  briefStatus: BriefStatus;
  /** True once the visitor picked a currency themselves, so the time-zone guess never overrides it. */
  currencyChosen: boolean;

  setBriefField: <K extends keyof BriefFormData>(field: K, value: BriefFormData[K]) => void;
  /** Selects a project type in the inquiry form, e.g. from a Services card. */
  pickService: (id: ServiceId) => void;
  /** Switches budget currency; the budget is cleared because its ranges differ per currency. */
  setCurrency: (currency: BudgetCurrency, options?: { auto?: boolean }) => void;
  setBriefStatus: (status: BriefStatus) => void;
  resetBrief: () => void;
}

export const useFreelanceStore = create<FreelanceStoreState>((set) => ({
  brief: EMPTY_BRIEF,
  briefStatus: 'idle',
  currencyChosen: false,

  setBriefField: (field, value) =>
    set((state) => ({ brief: { ...state.brief, [field]: value }, briefStatus: state.briefStatus === 'sending' ? 'sending' : 'idle' })),

  pickService: (id) => set((state) => ({ brief: { ...state.brief, service: id } })),

  setCurrency: (currency, options) =>
    set((state) => {
      if (options?.auto && state.currencyChosen) return state;
      if (state.brief.currency === currency) return { currencyChosen: state.currencyChosen || !options?.auto };
      return {
        currencyChosen: state.currencyChosen || !options?.auto,
        brief: { ...state.brief, currency, budget: '' },
      };
    }),

  setBriefStatus: (status) => set({ briefStatus: status }),

  resetBrief: () => set((state) => ({ brief: { ...EMPTY_BRIEF, currency: state.brief.currency } })),
}));
