import { create } from 'zustand';
import type { BriefFormData, BriefStatus, BudgetCurrency, ProjectTypeId } from '@/types/freelance';
import { EMPTY_BRIEF } from './constants/inquiry';

export type StartMode = 'brief' | 'call';

export interface FreelanceStoreState {
  brief: BriefFormData;
  briefStatus: BriefStatus;
  /** The API's message for a rejected brief, e.g. a failed spam check; shown while briefStatus is 'error'. */
  briefError: string | null;
  /** True once the visitor picked a currency themselves, so the time-zone guess never overrides it. */
  currencyChosen: boolean;
  /** Which panel the Start a project section shows: the brief form or the booking calendar. */
  startMode: StartMode;
  /** True once the calendar was shown, so it stays mounted and does not reload when switching back. */
  callOpened: boolean;

  setBriefField: <K extends keyof BriefFormData>(field: K, value: BriefFormData[K]) => void;
  /** Selects a project type in the inquiry form. */
  pickService: (id: ProjectTypeId) => void;
  /** Switches budget currency; the budget is cleared because its ranges differ per currency. */
  setCurrency: (currency: BudgetCurrency, options?: { auto?: boolean }) => void;
  setBriefStatus: (status: BriefStatus, error?: string | null) => void;
  resetBrief: () => void;
  /** The one way to choose the Start a project panel, from its tabs or any CTA; a CTA can preselect a project type. */
  setStartMode: (mode: StartMode, service?: ProjectTypeId) => void;
}

export const useFreelanceStore = create<FreelanceStoreState>((set) => ({
  brief: EMPTY_BRIEF,
  briefStatus: 'idle',
  briefError: null,
  currencyChosen: false,
  startMode: 'brief',
  callOpened: false,

  setBriefField: (field, value) =>
    set((state) => ({
      brief: { ...state.brief, [field]: value },
      briefStatus: state.briefStatus === 'sending' ? 'sending' : 'idle',
      briefError: null,
    })),

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

  setBriefStatus: (status, error = null) => set({ briefStatus: status, briefError: error }),

  resetBrief: () => set((state) => ({ brief: { ...EMPTY_BRIEF, currency: state.brief.currency } })),

  setStartMode: (mode, service) =>
    set((state) => ({
      startMode: mode,
      callOpened: state.callOpened || mode === 'call',
      ...(service && { brief: { ...state.brief, service } }),
    })),
}));
