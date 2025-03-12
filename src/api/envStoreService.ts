import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";

const UPLOAD_URL = "https://store-env-data-934416248688.us-central1.run.app";

const EnvStoreService = {
  storeEnvData: async function (brandName: string, envProducts: EnvProduct[], envAssets: EnvAsset[]) {
    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandName: brandName,
          envProducts: envProducts,
          envAssets: envAssets
        })
      });
      return await response.json();
    }
    catch(error){
      console.error(error);
      return undefined;
    }
  }
};

export default EnvStoreService;