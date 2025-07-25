import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Perf } from 'r3f-perf';
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import {
  EnvProduct,
  useComponentStore,
  useEnvironmentStore,
  useEnvProductStore,
  useEnvAssetStore,
  useBrandStore,
  useResourceFetchStore,
  EnvAsset,
} from "./stores/ZustandStores";
import BrandService from "./api/brandService.js";
import EnvStoreService from "./api/envStoreService.js";
import { AssetService } from "./api/assetService.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Load from "./UI/Components/Loader";
import { LinearToneMapping, NoToneMapping } from "three";
import TutorialOverlay from "./UI/Components/TutorialOverlay";

export default function CanvasWrapper() {
  // Load brand data
  const { brandData, setBrandData } = useBrandStore();
  const { environmentType } = useEnvironmentStore();
  const [brandStatus, setBrandStatus] = useState<"VALID" | "INVALID" | null>(
    null
  );
  const navigate = useNavigate();

  // Environments that should use LinearToneMapping
  const linearToneMappingEnvironments = ["GLOWBAR", "LUXECRADLE"];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const brandName = queryParams.get("brandName");
    const initialBrandName = Cookies.get("brandName");

    console.log("brandName:", brandName);
    console.log("initialBrandName:", initialBrandName);

    // Check if the current brandName matches the initial one
    if (brandName !== initialBrandName) {
      // If they don't match, redirect back to auth with the original brandName
      navigate("/auth");
      return;
    }

    async function fetchBrandDetails() {
      try {
        if (!brandName) {
          setBrandStatus("INVALID");
          return;
        }

        const response = await BrandService.fetchBrandData(brandName);
        if (response.status && response.status === 404) {
          setBrandStatus("INVALID");
          return;
        }

        console.log("BrandService:", response);
        setBrandStatus("VALID");
        setBrandData(response);
      } catch (error) {
        console.error("Brand Error: ", error);
        setBrandStatus("INVALID");
      }
    }

    fetchBrandDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBrandData, navigate, window.location.search]); // Add dependencies to track URL changes

  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if (brandStatus === "VALID" && brandData)
      setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandStatus, brandData, setEnvironmentType]);

  // Load All resources
  const { envAssets, setEnvAssets } = useEnvAssetStore();
  const { products, setProducts, isAdvancedPerfVisible, isTutorialOpen, closeTutorial } = useComponentStore();
  const { envProducts, setEnvProducts } = useEnvProductStore();
  const {
    productsLoaded,
    productsLoading,
    setProductsLoaded,
    setProductsLoading,
  } = useResourceFetchStore();
  const {
    envItemsLoaded,
    setEnvItemsLoaded,
    envItemsLoading,
    setEnvItemsLoading,
  } = useResourceFetchStore();
  const {
    assetLibraryLoaded,
    setAssetLibraryLoaded,
    assetLibraryLoading,
    setAssetLibraryLoading,
  } = useResourceFetchStore();

  const [myProgress, setProgress] = useState(0);
  const assetLibraryRef = useRef<{[id: string]: EnvAsset}>({});
  useEffect(() => {

    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = (brandData.shopify_store_name === 'nufewd-83.myshopify.com' || brandData.shopify_store_name === 'h49c6z-yr.myshopify.com') 
            ? await ProductService.getAllProductsFromVendor(brandData.brand_name)
            : await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);
          console.log("All Products:", response);

          const newEnvProducts: { [id: number]: EnvProduct } = {};
          for (const product of response) {
            newEnvProducts[product.id] = {
              id: product.id,
              type: "PHOTO",
              placeHolderId: undefined,
              imageIndex: undefined,
              modelIndex: undefined,
              position: undefined,
              rotation: undefined,
              scale: 1,
              isEnvironmentProduct: false,
            };
          }
          setEnvProducts(newEnvProducts);
          setProductsLoaded(true);
          console.log("All Products:", response);
        }
      } catch (err) {
        console.error("Products error:", err);
      }
    }

    async function fetchLibraryAssets() {
      try {
        if (brandData && !assetLibraryLoaded && !assetLibraryLoading) {
          setAssetLibraryLoading(true);
          const assets = await ProductService.getLibraryAssets(
            brandData.brand_name
          );

          const newEnvAssets: { [id: string]: EnvAsset } = {};
          assets.forEach((asset) => {
            newEnvAssets[asset.id] = asset;
            assetLibraryRef.current[asset.id] = asset; // Use ref instead of local variable
          });
          
          setEnvAssets(newEnvAssets);
          setAssetLibraryLoaded(true);
        }
      } catch (err) {
        console.error("Products error:", err);
      }
    }

    async function fetchAssets() {
      try {
        if (brandData && !envItemsLoading && !envItemsLoaded) {
          const response = await AssetService.importAssetFiles(
            brandData.brand_name
          );

          const newEnvAssets: { [id: string]: EnvAsset } = {...assetLibraryRef.current};

          for (const asset of Object.values(response)) {
            newEnvAssets[asset.id] = {
              ...asset,
              isEnvironmentAsset: false,
            };
          }
          setEnvAssets(newEnvAssets);

          // Preload asset models
          Object.keys(envAssets).forEach((envAsset) => {
            if (envAssets[envAsset].type === "MODEL_3D")
              useGLTF.preload(envAssets[envAsset].src);
          });
          
          return newEnvAssets; // Return the loaded assets
        }
      } catch (err) {
        console.error("Assets error:", err);
      }
      return {}; // Return empty object on error
    }

    async function fetchEnvData(currentAssets: { [id: string]: EnvAsset }) {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then(
            (response) => {
              const newEnvProducts: { [id: number]: EnvProduct } = {};
              for (const envProduct of Object.values(response.envProducts)) {
                newEnvProducts[envProduct.id] = {
                  ...envProduct,
                  isEnvironmentProduct: true,
                };
                if (
                  envProduct.type === "MODEL_3D" &&
                  envProduct.modelIndex !== undefined
                ) {
                  useGLTF.preload(
                    products.find((product) => product.id === envProduct.id)
                      ?.models[envProduct.modelIndex].sources?.[0].url || ""
                  );
                }
                if (newEnvProducts[envProduct.id].placeHolderId === -1) {
                  newEnvProducts[envProduct.id].placeHolderId = undefined;
                }
              }

              const newEnvAssets: { [id: string]: EnvAsset } = {...currentAssets};

              for (const envAsset of Object.values(response.envAssets)) {
                const cleanId = envAsset.id.replace('.shackit.in', '');
                
                if (newEnvAssets[cleanId]) {
                  // Asset already exists (from library or personal), update it
                  newEnvAssets[cleanId] = {
                    ...newEnvAssets[cleanId], // Keep existing data
                    ...envAsset,             // Overlay env data
                    id: cleanId,               // Ensure clean ID
                    isEnvironmentAsset: true,  // Set as active
                  };
                } else {
                  // New asset from env data
                  newEnvAssets[cleanId] = {
                    ...envAsset,
                    id: cleanId,
                    isEnvironmentAsset: true,
                  };
                }
              }

              async function setResults() {
                setEnvProducts(newEnvProducts);
                setEnvAssets(newEnvAssets);
              }

              setResults().then(() => setEnvItemsLoaded(true));
            }
          );
        }
      } catch (err) {
        console.error("Env data error:", err);
      }
    }

    async function fetchModels() {
      // Preload asset models
      Object.values(envAssets).forEach((envAsset) => {
        if (envAsset.type === "MODEL_3D") useGLTF.preload(envAsset.src);
      });

      // Preload product models
      Object.values(envProducts).forEach((envProduct) => {
        if (
          envProduct.isEnvironmentProduct &&
          envProduct.type === "MODEL_3D" &&
          envProduct.modelIndex
        ) {
          useGLTF.preload(
            products.find((product) => product.id === envProduct.id)?.models[
              envProduct.modelIndex
            ].sources?.[0].url || ""
          );
        }
      });
    }

    (async () => {
      if (brandData && brandStatus === "VALID") {
        await fetchProducts();
        setProgress(myProgress > 24 ? myProgress : 24);
        await fetchLibraryAssets();
        setProgress(myProgress > 47 ? myProgress : 47);
        const currentAssets = await fetchAssets();
        setProgress(myProgress > 62 ? myProgress : 62);
        await fetchEnvData(currentAssets);
        setProgress(myProgress > 76 ? myProgress : 76);
        await fetchModels();
        setProgress(myProgress > 99 ? myProgress : 99);
        await new Promise(() => {
          setTimeout(() => setProgress(100), 800);
        }); // Delay to show fully loaded progress bar
      }
    })();
  }, [brandStatus]);

  return (
    <div id="container">
      {myProgress >= 100 ? (
        <UI />
      ) : (
        <Load progress={myProgress} />
      )}
      {myProgress >= 100 && (
        <div className="canvas-container">
          <Canvas camera={{ fov: 45 }} 
          gl={{
            toneMapping: environmentType && linearToneMappingEnvironments.includes(environmentType) ? LinearToneMapping : NoToneMapping,
          }}
          shadows>
            <React.Suspense fallback={null}>
              {isAdvancedPerfVisible && <Perf position="top-right" />}
              <App />
            </React.Suspense>
          </Canvas>
        </div>
      )}

      {/* Tutorial Overlay - rendered at app level to appear above canvas */}
      {isTutorialOpen && (
        <TutorialOverlay
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          onClose={closeTutorial}
        />
      )}
    </div>
  );
}
