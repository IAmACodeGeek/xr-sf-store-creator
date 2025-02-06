import Product from "@/Types/Product";
import { create } from "zustand";

interface ComponentStore {
  // Crosshair handling
  crosshairVisible: boolean;
  showCrosshair: () => void;
  hideCrosshair: () => void;

  // Product handling
  products: Product[];
  selectedProduct: Product | undefined;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (productId: number | null) => void;

  // Creator Kit handling
  isCreatorKitOpen: boolean;
  openCreatorKit: () => void;
  closeCreatorKit: () => void;

  // Info Handling
  isInfoModalOpen: boolean;
  openInfoModal: () => void;
  closeInfoModal: () => void;

  // Terms Handling
  isTermsModalOpen: boolean;
  openTermsModal: () => void;
  closeTermsModal: () => void;

  // Contact Handling
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;

  // Settings Handling
  isSettingsModalOpen: boolean;
  isAudioPlaying: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  setAudioPlaying: (play: boolean) => void;

  // Product Searcher
  isProductSearcherOpen: boolean;
  openProductSearcher: () => void;
  closeProductSearcher: () => void;
}

const useComponentStore = create<ComponentStore>((set) => ({
  // Crosshair
  crosshairVisible: true,
  showCrosshair: () => set({ crosshairVisible: true }),
  hideCrosshair: () => set({ crosshairVisible: false }),

  // Product Handling
  products: [],
  selectedProduct: undefined,
  setProducts: (products: Product[]) => set({ products }),
  setSelectedProduct: (productId: number | null) => {
    set((state: { products: Product[] }) => {
      const finalProduct = state.products.find(
        (product: Product) => product.id === productId
      );
      return { ...state, selectedProduct: finalProduct };
    });
  },

  // Creator Kit handling
  isCreatorKitOpen: false,
  openCreatorKit: () => {
    set({ crosshairVisible: false });
    set({ isCreatorKitOpen: true });
  },
  closeCreatorKit: () => {
    set({ crosshairVisible: true });
    set({ isCreatorKitOpen: false });
  },

  // Info Handling
  isInfoModalOpen: false,
  openInfoModal: () => {
    set({ crosshairVisible: false });
    set({ isInfoModalOpen: true });
  },
  closeInfoModal: () => {
    set({ crosshairVisible: false });
    set({ isInfoModalOpen: false });
  },

  // Terms Handling
  isTermsModalOpen: false,
  openTermsModal: () => {
    set({ crosshairVisible: false });
    set({ isTermsModalOpen: true });
  },
  closeTermsModal: () => {
    set({ crosshairVisible: false });
    set({ isTermsModalOpen: false });
  },

  // Contact Handling
  isContactModalOpen: false,
  openContactModal: () => {
    set({ crosshairVisible: false });
    set({ isContactModalOpen: true });
  },
  closeContactModal: () => {
    set({ crosshairVisible: false });
    set({ isContactModalOpen: false });
  },

  // Settings Handling
  isSettingsModalOpen: false,
  isAudioPlaying: false,
  openSettingsModal: () => {
    set({ crosshairVisible: false });
    set({ isSettingsModalOpen: true });
  },
  closeSettingsModal: () => {
    set({ crosshairVisible: true });
    set({ isSettingsModalOpen: false });
  },
  setAudioPlaying: (play: boolean) => set({ isAudioPlaying: play }),

  // Search Handling
  isProductSearcherOpen: false,
  openProductSearcher: () => set({ isProductSearcherOpen: true }),
  closeProductSearcher: () => set({ isProductSearcherOpen: false }),
}));

interface ActiveProductStore {
  activeProductId: number | null;
  setActiveProductId: (value: number | null) => void;
}

const useActiveProductStore = create<ActiveProductStore>((set) => ({
  activeProductId: null,
  setActiveProductId: (value: number | null) => set({activeProductId: value})
}));  

// Touch handling
interface TouchStore {
  isTouchEnabled: boolean;
  enableTouch: () => void;
  disableTouch: () => void;
}

const useTouchStore = create<TouchStore>((set) => ({
  isTouchEnabled: false,
  enableTouch: () => set({ isTouchEnabled: true }),
  disableTouch: () => set({ isTouchEnabled: false }),
}));

// Driver handling
interface DriverStore {
  driverActive: boolean;
  activateDriver: () => void;
  deactivateDriver: () => void;
}

const useDriverStore = create<DriverStore>((set) => ({
  driverActive: false,
  activateDriver: () => set({ driverActive: true }),
  deactivateDriver: () => set({ driverActive: false }),
}));

// Tour handling
interface TourStore {
  tourComplete: boolean;
  setTourComplete: (value: boolean) => void;
}

const useTourStore = create<TourStore>((set) => ({
  tourComplete: false,
  setTourComplete: (value) => set({ tourComplete: value }),
}));

// Search handling
interface SearchStore {
  searchResult: {x: number, y: number, z: number} | undefined,
  initiateSearchGSAP: boolean,
  setSearchResult: (position: { x: number; y: number; z: number }) => void,
  startSearchGSAP: () => void,
  resetSearchGSAP: () => void,
}
const useSearchStore = create<SearchStore>((set) => ({
  searchResult: undefined,
  initiateSearchGSAP: false,
  setSearchResult: (position: { x: number; y: number; z: number }) =>
    set({ searchResult: position }),
  startSearchGSAP: () => set({ initiateSearchGSAP: true }),
  resetSearchGSAP: () =>
    set({
      searchResult: undefined,
      initiateSearchGSAP: false,
    }),
}));

// Environment Product Handling
interface EnvProduct {
  id: number;
  type?: string;
  imageIndex?: number | undefined;
  modelIndex?: number | undefined;
  placeHolderId?: number | undefined;
  position?: number[];
  rotation?: number[];
  scale?: number;
  isEnvironmentProduct: boolean;
}

interface EnvProductStore {
  envProducts: {[id: number]: EnvProduct};
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => void;
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => void;
}

const useEnvProductStore = create<EnvProductStore>((set) => ({
  envProducts: {},
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => set({envProducts: envProducts}),
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => set((state: { envProducts: { [id: number]: EnvProduct } }) => ({
    envProducts: {
      ...state.envProducts,
      [id]: { ...state.envProducts[id], ...envProduct },
    },
  }))
}));

interface ToolStore {
  toolType: "MEDIA" | "3DPARAMS" | null,
  setToolType: (value: "MEDIA" | "3DPARAMS" | null) => void
}

const useToolStore = create<ToolStore>((set) => ({
  toolType: "MEDIA",
  setToolType: (value: "MEDIA" | "3DPARAMS" | null) => set({toolType: value})
}));

// Dynamic Loading of Environment
interface EnvironmentStore {
  environmentType: string | undefined;
  setEnvironmentType: (value: string) => void;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environmentType: undefined,
  setEnvironmentType: (value: string) =>  set({environmentType: value})
}));

export {
  useComponentStore,
  useTouchStore,
  useDriverStore,
  useTourStore,
  useSearchStore,
  useEnvProductStore,
  useActiveProductStore,
  useToolStore,
  useEnvironmentStore
};  
export type { EnvProduct };