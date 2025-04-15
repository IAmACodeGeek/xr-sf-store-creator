import { EnvAsset, EnvProduct } from "@/stores/ZustandStores";

const GET_URL =
  "https://get-env-data-864197837687.asia-south1.run.app?brandname=";
const UPLOAD_URL = "https://store-env-data-864197837687.asia-south1.run.app";

const EnvStoreService = {
  getEnvData: async function (
    brandName: string
  ): Promise<{
    envProducts: { [id: number]: EnvProduct };
    envAssets: { [id: string]: EnvAsset };
  }> {
    try {
      const response = await fetch(GET_URL + brandName, {
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
          brandName: brandName,
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
