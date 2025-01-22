import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/UI/Components/Loader";
import { ProductService } from "./api/shopifyAPIService";
import { EnvProduct, useComponentStore, useEnvProductStore } from "./stores/ZustandStores";
import Product from "./Types/Product.js";
import productdata from "./data/ProductData.js";

function CanvasWrapper() {
  const { products, setProducts, setSelectedProduct } = useComponentStore();
  const { progress } = useProgress();
  const { setEnvProducts } = useEnvProductStore();

  async function fetchProducts() {
    // try {
    //   const response = await ProductService.getAllProducts();
    //   setProducts(response);
    //   sessionStorage.setItem("Products", JSON.stringify(response));
    // } catch (err) {
    //   console.error(err);
    // }
    setProducts(productdata);
  }

  useEffect(() => {
    const productsFromSessionStorage = sessionStorage.getItem("Products");
    if(productsFromSessionStorage){
      setProducts(JSON.parse(productsFromSessionStorage));
    }else{
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    setEnvProducts(
      products.map((product) => {
        const envProduct: EnvProduct = {
          id: product.id,
          type: "PHOTO",
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

  // Preload models
  const preloadModels = (products: Product[]) => {
    for (const product of products) {
      for (const model of product.models) {
        const url = model.sources?.[0].url || '';
        if (url) {
          useGLTF.preload(url);
        }
      }
    }
  };

  useEffect(() => {
    preloadModels(products);
  }, [products]);

  return (
    <div id="container">
      {( progress >= 100) && <UI />}
      {(showLoader || progress < 100) && <Load progress={progress}/>}
      <div className="canvas-container">
        <Canvas camera={{ fov: 45 }} shadows>
          <React.Suspense
            fallback={
              <Html center>
                <Load progress={progress}/>
              </Html>
            }
          >
            <App/>
          </React.Suspense>
        </Canvas>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
