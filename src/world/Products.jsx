import React, { Suspense } from "react";
import { useEnvProductStore } from "@/stores/ZustandStores";

const LazyDraggableContainer = React.lazy(() => 
  import("./DraggableContainer").then(module => ({ 
    default: module.default || module 
  }))
);

const Products = () => {
  const {envProducts} = useEnvProductStore();

  return (
    <Suspense fallback={null}>
      {
        Object.keys(envProducts).map((id) => {
          return ( envProducts[id].isEnvironmentProduct &&
            <LazyDraggableContainer
              position={envProducts[id].position}
              rotation={envProducts[id].rotation}
              scale={envProducts[id].scale}
              envProduct={envProducts[id]}
              key={id}
            />
          );
        })
      }
    </Suspense>
  );
};

export default Products;
