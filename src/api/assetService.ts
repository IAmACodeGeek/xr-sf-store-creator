import { EnvAsset } from "@/stores/ZustandStores";
import { showPremiumPopup } from "@/UI/Components/PremiumRequired";

const UPLOAD_URL = "https://assets-uploading-201137466588.asia-south1.run.app";
const IMPORT_URL = 'https://assets-importing-201137466588.asia-south1.run.app';
const DELETE_URL = 'https://asset-deletion-201137466588.asia-south1.run.app';

const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'model/gltf-binary'];

interface FileResponse {
  name: string;
  originalName: string;
  type: string;
  size: number;
  uploadTime: number;
  src: string;
}

interface Response {
  files: FileResponse[];
  storageUsage: {
    total: number;
    fileCount: number;
  }
}

const ERROR_CODES = {
  NO_FILENAME: 'ERR_NO_FILENAME',
  INVALID_TYPE: 'ERR_INVALID_TYPE',
  FILE_TOO_LARGE: 'ERR_FILE_TOO_LARGE',
  FILE_LIMIT_EXCEEDED: 'ERR_FILE_LIMIT_EXCEEDED',
  UPLOAD_FAILED: 'ERR_UPLOAD_FAILED'
};

interface FileError{
  code: string;
  filename: string;
  message: string;
}

const AssetService = {
  uploadAssetFiles: async function (brandName: string, files: File[], existingAssetCount: number): Promise<{assets: {[id: string]: EnvAsset}, fileErrors: FileError[]} | undefined> {
    const validFiles = files.filter((file) => ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith('.glb'));
    if(validFiles.length === 0){
      console.error('No Valid Files');
      return;
    }

    // Limit the number of assets to 5
    if(files.length + existingAssetCount > 5){
      showPremiumPopup("Your current plan supports up to 5 assets. Reach out to our sales team to unlock more exclusive options.");
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
          'x-shopify-domain': brandName
        },
        body: formData
      });
  
      const resultJSON = await response.json();
      console.log(resultJSON);

      const result: {[id: string]: EnvAsset} = {};
      resultJSON.uploadedFiles.forEach((fileResponse: FileResponse) => {
        result[fileResponse.name] = {
          id: fileResponse.name,
          name: fileResponse.originalName,
          type: (fileResponse.type === 'model/gltf-binary' || fileResponse.originalName.endsWith('.glb')) ? 'MODEL_3D' : 'PHOTO',
          src: fileResponse.src,
          isEnvironmentAsset: false,
          status: 'SUCCESS',
          source: 'OWN'
        };
      });

      return {
        assets: result,
        fileErrors: resultJSON.fileErrors
      };
    }
    catch(error){
      console.error(error);
    }
  },
  
  importAssetFiles: async function (brandName: string): Promise<{[id: string]: EnvAsset}> {
    try {
      const response = await fetch(IMPORT_URL, {
        method: 'GET',
        headers: {
          'x-shopify-domain': brandName
        }
      });
  
      const resultJSON: Response = await response.json();
  
      const result: {[id: string]: EnvAsset} = {};
      
      resultJSON.files.forEach((fileResponse) => {
        result[fileResponse.name] = {
          id: fileResponse.name,
          name: fileResponse.originalName,
          type: (fileResponse.type === 'model/gltf-binary' || fileResponse.originalName.endsWith('.glb')) ? 'MODEL_3D' : 'PHOTO',
          src: fileResponse.src,
          isEnvironmentAsset: false,
          status: 'SUCCESS',
          source: 'OWN'
        };
      });
  
      return result;
    }
    catch(error){
      console.error(error);
    }
    
    return {};
  },

  deleteAssetFile: async function (brandName: string, envAssetId: string): Promise<{status: number, id: string | null}> {
    try {
      const response = await fetch(DELETE_URL, {
        method: 'DELETE',
        headers: {
          'x-shopify-domain': brandName,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: envAssetId
        })
      });
      
      const resultJSON = await response.json();

      return {
        status: response.status,
        id: resultJSON.deletedFile
      };
    }
    catch(error){
      console.error(error);
      return {
        status: 500,
        id: null
      };
    }
  }
}

export {ALLOWED_MIME_TYPES, ERROR_CODES, AssetService};