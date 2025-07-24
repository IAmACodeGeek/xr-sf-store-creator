import Product from "@/Types/Product";
import { create } from "zustand";

interface ResourceFetchStore {
  // Products loading
  productsLoading: boolean;
  productsLoaded: boolean;
  setProductsLoading: (value: boolean) => void;
  setProductsLoaded: (value: boolean) => void;

  // Environment products and assets
  envItemsLoaded: boolean;
  setEnvItemsLoaded: (value: boolean) => void;
  envItemsLoading: boolean;
  setEnvItemsLoading: (value: boolean) => void;

  // Asset library
  assetLibraryLoaded: boolean;
  setAssetLibraryLoaded: (value: boolean) => void;
  assetLibraryLoading: boolean;
  setAssetLibraryLoading: (value: boolean) => void;
}

const useResourceFetchStore = create<ResourceFetchStore>((set) => ({
  // Products
  productsLoading: false,
  setProductsLoading: (value: boolean) => set({productsLoading: value}),
  productsLoaded: false,
  setProductsLoaded: (value: boolean) => set({productsLoaded: value}),

  // EnvAssets and EnvProducts
  envItemsLoaded: false,
  setEnvItemsLoaded: (value: boolean) => set({envItemsLoaded: value}),
  envItemsLoading: false,
  setEnvItemsLoading: (value: boolean) => set({envItemsLoading: value}),

  // Asset library
  assetLibraryLoaded: false,
  setAssetLibraryLoaded: (value: boolean) => set({assetLibraryLoaded: value}),
  assetLibraryLoading: false,
  setAssetLibraryLoading: (value: boolean) => set({assetLibraryLoading: value}),
}));

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

  // Performance Monitor
  isAdvancedPerfVisible: boolean;
  toggleAdvancedPerf: () => void;
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

  // Performance Monitor
  isAdvancedPerfVisible: false,
  toggleAdvancedPerf: () => set((state) => ({ isAdvancedPerfVisible: !state.isAdvancedPerfVisible })),
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
  searchResult: {x: number, y: number, z: number, face?: "N" | "S" | "E" | "W"} | undefined,
  initiateSearchGSAP: boolean,
  setSearchResult: (position: { x: number; y: number; z: number; face?: "N" | "S" | "E" | "W" }) => void,
  startSearchGSAP: () => void,
  resetSearchGSAP: () => void,
}
const useSearchStore = create<SearchStore>((set) => ({
  searchResult: undefined,
  initiateSearchGSAP: false,
  setSearchResult: (position: { x: number; y: number; z: number; face?: "N" | "S" | "E" | "W" }) =>
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
  type?: "MODEL_3D" | "PHOTO";
  imageIndex?: number | undefined;
  modelIndex?: number | undefined;
  placeHolderId?: number | undefined;
  position?: number[];
  rotation?: number[];
  scale?: number;
  isEnvironmentProduct: boolean;
  face?: "N" | "S" | "E" | "W"; // North, South, East, West
}

interface EnvProductStore {
  envProducts: {[id: number]: EnvProduct};
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => void;
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => void;

  activeProductId: number | null,
  setActiveProductId: (value: number | null) => void;
  
  activeTab: "MEDIA" | "POSITION";
  setActiveTab: (value: "MEDIA" | "POSITION") => void;
}

const useEnvProductStore = create<EnvProductStore>((set) => ({
  envProducts: {},
  setEnvProducts: (envProducts: {[id: number]: EnvProduct}) => set((state: {envProducts: { [id: number]: EnvProduct }}) => ({
    envProducts: { ...state.envProducts, ...envProducts },
  })),
  modifyEnvProduct: (id: number, envProduct: EnvProduct) => set((state: { envProducts: { [id: number]: EnvProduct } }) => ({
    envProducts: {
      ...state.envProducts,
      [id]: { ...state.envProducts[id], ...envProduct },
    },
  })),

  activeProductId: null,
  setActiveProductId: (value: number | null) => set({activeProductId: value}),
  
  activeTab: "MEDIA" as "MEDIA" | "POSITION",
  setActiveTab: (value: "MEDIA" | "POSITION") => set({activeTab: value})
}));

interface EnvAsset {
  id: string;
  type: "MODEL_3D" | "PHOTO";
  status: 'SUCCESS' | 'FAILURE';
  position?: number[];
  rotation?: number[];
  scale?: number;
  src: string;
  name: string;
  isEnvironmentAsset: boolean;
  source: 'OWN' | 'LIBRARY';
  image?: string;
  filesize?: number; // Add file size property
}

interface EnvAssetStore {
  envAssets: {[id: string]: EnvAsset};
  setEnvAssets: (envAssets: {[id: string]: EnvAsset}) => void;
  modifyEnvAsset: (id: string, envAsset: EnvAsset) => void;

  activeAssetId: string | null;
  setActiveAssetId: (value: string | null) => void;
  
  activeTab: "MEDIA" | "POSITION";
  setActiveTab: (value: "MEDIA" | "POSITION") => void;
}

const useEnvAssetStore = create<EnvAssetStore>((set) => ({
  envAssets: {},
  setEnvAssets: (envAssets: { [id: string]: EnvAsset }) => set({ envAssets }),
  modifyEnvAsset: (id: string, envAsset: EnvAsset) => set((state: {envAssets: {[id: string]: EnvAsset}}) => ({
    envAssets: {
      ...state.envAssets,
      [id]: {...state.envAssets[id], ...envAsset}
    }
  })),
  
  activeAssetId: null,
  setActiveAssetId: (value: string | null) => set({activeAssetId: value}),
  
  activeTab: "MEDIA" as "MEDIA" | "POSITION",
  setActiveTab: (value: "MEDIA" | "POSITION") => set({activeTab: value})
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
  setEnvironmentType: (value: string | undefined) => void;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environmentType: undefined,
  setEnvironmentType: (value: string | undefined) =>  set({environmentType: value})
}));

// Brand Store Handling
interface BrandData {
  id: string;
  brand_name: string;
  brand_logo_url: string;
  brand_poster_url: string;
  brand_video_url: string;
  environment_name: string;
  email: string;
  shopify_store_name: string;
  original_brand_name: string;
}

interface BrandStore {
  brandData: BrandData | null;
  setBrandData: (data: BrandData) => void;
}

const useBrandStore = create<BrandStore>((set) => ({
  brandData: null,
  setBrandData: (data) => set({ brandData: data }),
}));

interface SliderMouseStore {
  mouseDown: boolean;
  setMouseDown: (mouseDown: boolean) => void;
}

const useSliderMouseStore = create<SliderMouseStore>((set) => ({
  mouseDown: false,
  setMouseDown: (mouseDown: boolean) => set({mouseDown: mouseDown}),
}));

export {
  useResourceFetchStore,
  useComponentStore,
  useTouchStore,
  useDriverStore,
  useTourStore,
  useSearchStore,
  useEnvProductStore,
  useEnvAssetStore,
  useToolStore,
  useEnvironmentStore,
  useBrandStore,
  useSliderMouseStore
};  
export type { EnvProduct, EnvAsset };