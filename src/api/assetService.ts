import { EnvAsset } from "@/stores/ZustandStores";

const UPLOAD_URL = "https://us-central1-global-road-449105-e7.cloudfunctions.net/Assets-Uploading";
const IMPORT_URL = 'https://asset-importing-934416248688.us-central1.run.app';

const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'model/gltf-binary'];

async function uploadAssetFiles(shopifyDomain: string, files: File[]): Promise<unknown> {
  const validFiles = files.filter((file) => ALLOWED_MIME_TYPES.includes(file.type));
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
}

async function importAssetFiles(shopifyDomain: string): Promise<unknown> {
  try {
    const response = await fetch(IMPORT_URL, {
      method: 'GET',
      headers: {
        'x-shopify-domain': shopifyDomain
      }
    });

    const result = await response.json();
    console.log(result);
    return result;
  }
  catch(error){
    console.error(error);
  }
}

export {ALLOWED_MIME_TYPES, uploadAssetFiles, importAssetFiles};