import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";
import { CLOUD_RUN_ENDPOINTS } from "./cloudUtils";

const GET_URL = CLOUD_RUN_ENDPOINTS.ENV_STORE.GET_ENV_DATA + "?brandname=";
const UPLOAD_URL = CLOUD_RUN_ENDPOINTS.ENV_STORE.STORE_ENV_DATA;

const EnvStoreService = {
  getEnvData: async function (
    brandName: string
  ): Promise<{
    envProducts: { [id: number]: EnvProduct };
    envAssets: { [id: string]: EnvAsset };
  }> {
    try {
      const response = await fetch(GET_URL + brandName + ".shackit.in", {
        method: "GET",
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return {
        envProducts: {},
        envAssets: {},
      };
    }
  },

  storeEnvData: async function (
    brandName: string,
    envProducts: EnvProduct[],
    envAssets: EnvAsset[]
  ) {
    try {
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: brandName + ".shackit.in",
          envProducts: envProducts,
          envAssets: envAssets,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default EnvStoreService;
