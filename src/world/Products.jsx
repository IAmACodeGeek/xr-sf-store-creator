import React, { Suspense } from "react";
import {
  useEnvAssetStore,
  useEnvProductStore,
  useOwnEnvProductStore,
} from "@/stores/ZustandStores";

const LazyDraggableProductContainer = React.lazy(() =>
  import("./DraggableProductContainer").then((module) => ({
    default: module.default || module,
  }))
);

const LazyDraggableOwnProductContainer = React.lazy(() =>
  import("./DraggableOwnProductContainer").then((module) => ({
    default: module.default || module,
  }))
);

const LazyDraggableAssetContainer = React.lazy(() =>
  import("./DraggableAssetContainer").then((module) => ({
    default: module.default || module,
  }))
);

const Products = () => {
  const { envProducts } = useEnvProductStore();
  const { envAssets } = useEnvAssetStore();
  const { ownEnvProducts } = useOwnEnvProductStore();

  return (
    <Suspense fallback={null}>
      {Object.keys(envProducts).map((id) => {
        return (
          envProducts[id].isEnvironmentProduct && (
            <LazyDraggableProductContainer
              placeHolderId={envProducts[id].placeHolderId}
              envPosition={envProducts[id].position}
              envRotation={envProducts[id].rotation}
              envScale={envProducts[id].scale}
              envProduct={envProducts[id]}
              key={id}
            />
          )
        );
      })}
      {Object.keys(ownEnvProducts).map((id) => {
        return (
          ownEnvProducts[id].isEnvironmentProduct && (
            <LazyDraggableOwnProductContainer
              placeHolderId={ownEnvProducts[id].placeHolderId}
              envPosition={ownEnvProducts[id].position}
              envRotation={ownEnvProducts[id].rotation}
              envScale={ownEnvProducts[id].scale}
              ownEnvProduct={ownEnvProducts[id]}
              key={id}
            />
          )
        );
      })}
      {Object.keys(envAssets).map((id) => {
        return (
          envAssets[id].isEnvironmentAsset && (
            <LazyDraggableAssetContainer
              envPosition={envAssets[id].position}
              envRotation={envAssets[id].rotation}
              envScale={envAssets[id].scale}
              envAsset={envAssets[id]}
              key={id}
            />
          )
        );
      })}
    </Suspense>
  );
};

export default Products;
