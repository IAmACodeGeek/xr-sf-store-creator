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

function CanvasWrapper() {
  const { products, setProducts, setSelectedProduct } = useComponentStore();
  const { progress } = useProgress();
  const { setEnvProducts } = useEnvProductStore();

  async function fetchProducts() {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
      sessionStorage.setItem("Products", JSON.stringify(response));
      console.log(sessionStorage.getItem("Products"));
    } catch (err) {
      console.error(err);
    }
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
      <Load progress={progress} showLoader={showLoader}/>
      <div className="canvas-container">
        <Canvas camera={{ fov: 45 }} shadows>
          <React.Suspense>
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
