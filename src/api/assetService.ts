import { EnvAsset } from "@/stores/ZustandStores";

const UPLOAD_URL = "https://us-central1-global-road-449105-e7.cloudfunctions.net/Assets-Uploading";
const IMPORT_URL = 'https://asset-importing-934416248688.us-central1.run.app';

const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'model/gltf-binary'];

interface FileResponse {
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
}

interface Response {
  files: FileResponse[];
  storageUsage: {
    total: number;
    fileCount: number;
  }
}

const AssetService = {
  uploadAssetFiles: async function (shopifyDomain: string, files: File[]): Promise<unknown> {
    const validFiles = files.filter((file) => ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith('.glb'));
    if(validFiles.length === 0){
      console.error('No Valid Files');
      return;
    }
  
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append(`files`, file);
    });
  
    try{
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'x-shopify-domain': shopifyDomain
        },
        body: formData
      });
  
      const result = await response.json();
      console.log(result);
      return result;
    }
    catch(error){
      console.error(error);
    }
  },
  
  importAssetFiles: async function (shopifyDomain: string): Promise<{[id: string]: EnvAsset}> {
    try {
      const response = await fetch(IMPORT_URL, {
        method: 'GET',
        headers: {
          'x-shopify-domain': shopifyDomain
        }
      });
  
      const resultJSON: Response = await response.json();
      console.log(resultJSON);
  
      const result: {[id: string]: EnvAsset} = {};
      resultJSON.files.forEach((fileResponse) => {
        result[fileResponse.path] = {
          id: fileResponse.path,
          name: fileResponse.name,
          type: (fileResponse.type === 'model/gltf-binary' || fileResponse.name.endsWith('.glb')) ? 'MODEL_3D' : 'PHOTO',
          src: fileResponse.url,
          isEnvironmentAsset: false,
          status: 'SUCCESS'
        };
      });
  
      return result;
    }
    catch(error){
      console.error(error);
    }
  
    return {};
  }
}

export {ALLOWED_MIME_TYPES, AssetService};