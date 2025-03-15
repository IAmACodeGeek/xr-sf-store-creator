import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/UI/Components/Loader";
import { ProductService } from "./api/shopifyAPIService";
import { EnvProduct, useComponentStore, useEnvironmentStore, useEnvProductStore, useEnvAssetStore, useBrandStore, useResourceFetchStore, EnvAsset } from "./stores/ZustandStores";
import BrandService from "./api/brandService.js";
import EnvStoreService
 from "./api/envStoreService.js";
import { AssetService } from "./api/assetService.js";
function CanvasWrapper() {
  // Load brand data
  const {brandData, setBrandData} = useBrandStore();
  const [brandStatus, setBrandStatus] = useState<'LOADING' | 'VALID' | 'INVALID'>('LOADING');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const brandName = queryParams.get('brandName');
    if(!brandName) return;

    BrandService.fetchBrandData(brandName).then((response) => {
      if(response.status && response.status === 404){
        setBrandStatus('INVALID');
        return;
      }
      console.log(response);
      setBrandStatus('VALID');
      setBrandData(response);
    });
  }, [setBrandData]);
  
  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if(brandStatus === 'VALID' && brandData)
      setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandStatus, brandData, setEnvironmentType]);

  // Set products and assets
  const { envAssets, setEnvAssets, modifyEnvAsset } = useEnvAssetStore();
  const { products, setProducts } = useComponentStore();
  const { envProducts, setEnvProducts, modifyEnvProduct } = useEnvProductStore();
  const { productsLoaded, productsLoading, setProductsLoaded, setProductsLoading } = useResourceFetchStore();
  const {envItemsLoaded, setEnvItemsLoaded, envItemsLoading, setEnvItemsLoading} = useResourceFetchStore();

  const { progress } = useProgress();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);

          const newEnvProducts: {[id: number]: EnvProduct} = {};
          for(let product of response){
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
          console.log('Products:', response);
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }
    
    async function fetchAssets() {
      try {
        if(!brandData) return;

        const response = await AssetService.importAssetFiles(brandData.brand_name);
        const newEnvAssets: {[id: string]: EnvAsset} = {};
        for(let asset of Object.values(response)){
          newEnvAssets[asset.id] = {
            ...asset,
            isEnvironmentAsset: false
          };
        }
        setEnvAssets(newEnvAssets);
        console.log('Assets:', response);

        // Preload asset models
        Object.keys(envAssets).forEach((envAsset) => {
          if(envAssets[envAsset].type === "MODEL_3D")
            useGLTF.preload(envAssets[envAsset].src);
        });
      } catch (err) {
        console.error('Assets error:', err);
      }
    }

    async function fetchEnvData() {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then((response) => {

            const newEnvProducts: {[id: number]: EnvProduct} = {};
            for(let envProduct of Object.values(response.envProducts)){
              newEnvProducts[envProduct.id] = {...envProduct, isEnvironmentProduct: true};
              if(envProduct.type === "MODEL_3D" && envProduct.modelIndex !== undefined){
                console.log(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url);
                useGLTF.preload(products.find((product) => product.id === envProduct.id)?.models[envProduct.modelIndex].sources?.[0].url || '');
              }
            }
            
            const newEnvAssets: {[id: string]: EnvAsset} = {};
            for(let envAsset of Object.values(response.envAssets)){
              newEnvAssets[envAsset.id] = {...envAsset, isEnvironmentAsset: true};
              useGLTF.preload(envAsset.src);
            }
            
            // Preload asset models
            Object.values(envAssets).forEach((envAsset) => {
              if(envAsset.type === "MODEL_3D")
                useGLTF.preload(envAsset.src);
            });

            async function setResults(){
              await new Promise(resolve => setTimeout(resolve, 10000));
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

    if(brandStatus === 'VALID' && brandData){
      fetchProducts().then(() => {
        fetchAssets().then(() => {
          fetchEnvData();
        });
      });
    }
  }, [productsLoaded, productsLoading, brandStatus]);

  // Show loader for minimum of 3 seconds
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false); // Hide loader after 3 seconds
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="container">
      <UI/>
      <Load progress={progress} displayText={brandStatus === 'LOADING' || brandStatus === 'VALID' ? "Delta XR" : "Brand Not Found"} showLoader={showLoader}/>
      {!showLoader && brandStatus === 'VALID' && 
        <div className="canvas-container">
          <Canvas camera={{ fov: 45 }} shadows>
            <React.Suspense>
              <App/>
            </React.Suspense>
          </Canvas>
        </div>
      }
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
