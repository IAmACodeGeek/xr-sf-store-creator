import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/UI/Components/Loader";
import { ProductService } from "./api/shopifyAPIService";
import { AssetService } from "./api/assetService.js";
import { EnvProduct, useComponentStore, useEnvironmentStore, useEnvProductStore, useEnvAssetStore, useBrandStore } from "./stores/ZustandStores";
import BrandService from "./api/brandService.js";

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
  const { envAssets, setEnvAssets, assetsLoaded, setAssetsLoaded, assetsLoading, setAssetsLoading } = useEnvAssetStore();
  const { products, setProducts, productsLoaded, productsLoading, setProductsLoaded, setProductsLoading } = useComponentStore();
  const { progress } = useProgress();
  const { setEnvProducts } = useEnvProductStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);
          setProductsLoaded(true);
          console.log('Products:', response);
        }
      } catch (err) {
        console.error('Products error:', err);
      }
    }
  
    async function fetchAssets() {
      try {
        if (!assetsLoaded && !assetsLoading) {
          setAssetsLoading(true);
          const response = await AssetService.importAssetFiles('deltaxrstore.myshopify.com');
          setEnvAssets(response);
          setAssetsLoaded(true);
          console.log('Assets:', response);

          // Preload asset models
          Object.keys(envAssets).forEach((envAsset) => {
            if(envAssets[envAsset].type === "MODEL_3D")
              useGLTF.preload(envAssets[envAsset].src);
          });
        }
      } catch (err) {
        console.error('Assets error:', err);
      }
    }

    if(brandStatus === 'VALID' && brandData){
      fetchProducts();
      fetchAssets();
    }
  }, [productsLoaded, productsLoading, assetsLoaded, assetsLoading, , brandStatus]);
  
  useEffect(() => {
    setEnvProducts(
      products.map((product) => {
        const envProduct: EnvProduct = {
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
        return envProduct;
      })
    );
  }, [products]);

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
