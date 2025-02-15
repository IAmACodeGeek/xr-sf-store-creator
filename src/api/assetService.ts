const UPLOAD_URL = "https://us-central1-global-road-449105-e7.cloudfunctions.net/Assets-Uploading";

const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'model/gltf-binary'];

async function uploadAssetFiles(files: File[]): Promise<unknown> {
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
        'origin': 'https://configurator.strategyfox.in',
        'x-shopify-domain': 'deltaxrstore.myshopify.com'
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

export {ALLOWED_MIME_TYPES, uploadAssetFiles};