import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/UI/Components/Loader";
import { ProductService } from "./api/shopifyAPIService";
import { EnvProduct, useComponentStore, useEnvProductStore } from "./stores/ZustandStores";

function CanvasWrapper() {
  const { products, setProducts, setSelectedProduct } = useComponentStore();
  const { progress } = useProgress();
  const { setEnvProducts } = useEnvProductStore();

  async function fetchProducts() {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setEnvProducts(
      products.map((product) => {
        const envProduct: EnvProduct = {
          id: product.id,
          type: "MODEL_3D",
          imageIndex: undefined,
          modelIndex: undefined,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
          isEnvironmentProduct: false
        };
        return envProduct;
      })
    )
  }, [products]);

  return (
    <div id="container">
      {progress >= 100 && <UI />}
      <Canvas camera={{ fov: 45 }} shadows>
        <React.Suspense
          fallback={
            <Html center>
              <Load progress={progress} />
            </Html>
          }
        >
          <App />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
