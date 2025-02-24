import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";

const UPLOAD_URL = "https://store-env-data-934416248688.us-central1.run.app";

const EnvStoreService = {
  storeEnvData: async function (brandName: string, envProducts: EnvProduct[], envAssets: EnvAsset[]) {
    try {
      console.log(envProducts, envAssets);
      await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandName: brandName,
          envProducts: envProducts,
          envAssets: envAssets
        })
      }).then((response) => console.log(response));
    }
    catch(error){
      console.error(error);
    }
  }
};

export default EnvStoreService;