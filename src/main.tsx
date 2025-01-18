import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/UI/Components/Loader";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore } from "./stores/ZustandStores";

function CanvasWrapper() {
  const { setProducts } = useComponentStore();
  const { progress } = useProgress();

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
