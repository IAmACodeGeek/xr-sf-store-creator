import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { EnvProduct, useComponentStore, useEnvironmentStore, useEnvProductStore, useEnvAssetStore, useBrandStore, useResourceFetchStore, EnvAsset } from "./stores/ZustandStores";
import BrandService from "./api/brandService.js";
import EnvStoreService
  from "./api/envStoreService.js";
import { AssetService } from "./api/assetService.js";

function CanvasWrapper() {
  // Load brand data
  const { brandData, setBrandData } = useBrandStore();
  const [brandStatus, setBrandStatus] = useState<'LOADING' | 'VALID' | 'INVALID' | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const brandName = queryParams.get('brandName');
    
    if(brandStatus !== null) return;
    
    async function fetchBrandDetails(){
      try{
        if (!brandName) return;

        setBrandStatus('LOADING');
        BrandService.fetchBrandData(brandName).then((response) => {
          if (response.status && response.status === 404) {
            setBrandStatus('INVALID');
            return;
          }

          console.log(response);
          setBrandStatus('VALID');
          setBrandData(response);
        });
      }
      catch(error){
        console.error('Brand Error: ', error);
      }
    }

    fetchBrandDetails();
  }, [setBrandData, brandStatus]);

  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if (brandStatus === 'VALID' && brandData)
      setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandStatus, brandData, setEnvironmentType]);

  // Load All resources
  const { envAssets, setEnvAssets } = useEnvAssetStore();
  const { products, setProducts } = useComponentStore();
  const { envProducts, setEnvProducts } = useEnvProductStore();
  const { productsLoaded, productsLoading, setProductsLoaded, setProductsLoading } = useResourceFetchStore();
  const { envItemsLoaded, setEnvItemsLoaded, envItemsLoading, setEnvItemsLoading } = useResourceFetchStore();

  const [myProgress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);

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
              isEnvironmentProduct: false
            };
          }
          setEnvProducts(newEnvProducts);
          setProductsLoaded(true);
          console.log('All Products:', response);
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }

    async function fetchAssets() {
      try {
        if (brandData && !envItemsLoading && !envItemsLoaded){
          const response = await AssetService.importAssetFiles(brandData.brand_name);
          const newEnvAssets: { [id: string]: EnvAsset } = {};
          for (const asset of Object.values(response)) {
            newEnvAssets[asset.id] = {
              ...asset,
              isEnvironmentAsset: false
            };
          }
          setEnvAssets(newEnvAssets);
          console.log('All Assets:', response);
  
          // Preload asset models
          Object.keys(envAssets).forEach((envAsset) => {
            if (envAssets[envAsset].type === "MODEL_3D")
              useGLTF.preload(envAssets[envAsset].src);
          });
        }
      } catch (err) {
        console.error('Assets error:', err);
      }
    }

    async function fetchEnvData() {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then((response) => {

            const newEnvProducts: { [id: number]: EnvProduct } = {};
            for (const envProduct of Object.values(response.envProducts)) {
              newEnvProducts[envProduct.id] = { ...envProduct, isEnvironmentProduct: true };
              if (envProduct.type === "MODEL_3D" && envProduct.modelIndex !== undefined) {
                useGLTF.preload(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url || '');
              }
              if(newEnvProducts[envProduct.id].placeHolderId === -1){
                newEnvProducts[envProduct.id].placeHolderId = undefined;
              }
            }

            const newEnvAssets: { [id: string]: EnvAsset } = {};
            for (const envAsset of Object.values(response.envAssets)) {
              newEnvAssets[envAsset.id] = { ...envAsset, isEnvironmentAsset: true };
            }

            console.log("Env Products: ", response.envProducts);
            console.log("Env Assets: ", response.envAssets);

            async function setResults() {
              setEnvProducts(newEnvProducts);
              setEnvAssets(newEnvAssets);
            }

            setResults().then(() => setEnvItemsLoaded(true));
          });
        }
      } catch (err) {
        console.error('Env data error:', err);
      }
    }

    async function fetchModels() {
      // Preload asset models
      Object.values(envAssets).forEach((envAsset) => {
        if (envAsset.type === "MODEL_3D")
          useGLTF.preload(envAsset.src);
      });

      // Preload product models
      Object.values(envProducts).forEach((envProduct) => {
        if (envProduct.isEnvironmentProduct && envProduct.type === "MODEL_3D" && envProduct.modelIndex) {
          useGLTF.preload(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url || '');
        }
      });
    }

    (async () => {
      if(brandData && brandStatus === 'VALID') {
        await fetchProducts(); setProgress(myProgress > 32 ? myProgress : 32);
        await fetchAssets(); setProgress(myProgress > 58 ? myProgress : 58);
        await fetchEnvData(); setProgress(myProgress > 76 ? myProgress : 76);
        await fetchModels(); setProgress(myProgress > 99 ? myProgress : 99);
        await new Promise(() => {setTimeout(() => setProgress(100), 800)}); // Delay to show fully loaded progress bar
      }
    })();
    
  }, [brandStatus]);

  // Loader video
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  return (
    <div id="container">
      {myProgress >= 100 ? (
        <UI />
      ) : (
        <div className="video-loader">
          <video
            ref={videoRef}
            src="/media/Intro.MOV"
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoLoaded(true)}
          />
          {videoLoaded && (
            <>
              <div className="loading-text">{brandStatus === 'INVALID'? 'Brand name does not exist': 'Your experience is loading!'}</div>
              {brandStatus === 'VALID' && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${Math.min(myProgress, 100)}%` }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
      {myProgress >= 100 && <div className="canvas-container">
        <Canvas camera={{ fov: 45 }} shadows>
          <React.Suspense fallback={null}>
            <App />
          </React.Suspense>
        </Canvas>
      </div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
