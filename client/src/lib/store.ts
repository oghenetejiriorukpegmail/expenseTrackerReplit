import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

// Define available OCR templates
export type OcrTemplate = 'travel';

interface SettingsState {
  theme: ThemeMode;
  ocrMethod: string;
  ocrApiKey: string | null;
  ocrTemplate: OcrTemplate; // Add template state
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setOcrMethod: (method: string) => void;
  setOcrApiKey: (apiKey: string | null) => void;
  setOcrTemplate: (template: OcrTemplate) => void; // Add template setter
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: (localStorage.getItem('theme') as ThemeMode) || 'light',
  ocrMethod: localStorage.getItem('ocrMethod') || 'gemini',
  ocrApiKey: localStorage.getItem('ocrApiKey'),
  ocrTemplate: (localStorage.getItem('ocrTemplate') as OcrTemplate) || 'travel', // Initialize template to travel by default
  
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    });
  },
  
  setOcrMethod: (method) => {
    localStorage.setItem('ocrMethod', method);
    set({ ocrMethod: method });
  },
  
  setOcrApiKey: (apiKey) => {
    if (apiKey) {
      localStorage.setItem('ocrApiKey', apiKey);
    } else {
      localStorage.removeItem('ocrApiKey');
    }
    set({ ocrApiKey: apiKey });
  },
  setOcrTemplate: (template) => { // Implement template setter
    localStorage.setItem('ocrTemplate', template);
    set({ ocrTemplate: template });
  },
}));

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

interface ModalState {
  addExpenseOpen: boolean;
  addTripOpen: boolean;
  receiptViewerOpen: boolean;
  currentReceiptUrl: string | null;
  defaultTripName: string | null; // Add state for default trip
  toggleAddExpense: (defaultTrip?: string) => void; // Update signature
  toggleAddTrip: () => void;
  openReceiptViewer: (url: string) => void;
  closeReceiptViewer: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  addExpenseOpen: false,
  addTripOpen: false,
  receiptViewerOpen: false,
  currentReceiptUrl: null,
  defaultTripName: null, // Initialize default trip state
  
  toggleAddExpense: (defaultTrip?: string) => set((state) => ({
    addExpenseOpen: !state.addExpenseOpen,
    defaultTripName: !state.addExpenseOpen ? (defaultTrip || null) : null, // Set default trip only when opening
    addTripOpen: false,
    receiptViewerOpen: false
  })),
  
  toggleAddTrip: () => set((state) => ({ 
    addTripOpen: !state.addTripOpen,
    addExpenseOpen: false,
    receiptViewerOpen: false
  })),
  
  openReceiptViewer: (url) => set({ 
    receiptViewerOpen: true,
    currentReceiptUrl: url,
    addExpenseOpen: false,
    addTripOpen: false
  }),
  
  closeReceiptViewer: () => set({ 
    receiptViewerOpen: false,
    currentReceiptUrl: null
  }),
  
  closeAll: () => set({
    addExpenseOpen: false,
    addTripOpen: false,
    receiptViewerOpen: false,
    currentReceiptUrl: null,
    defaultTripName: null // Reset default trip on closeAll
  }),
}));
