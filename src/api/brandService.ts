import { CLOUD_RUN_ENDPOINTS } from "./cloudUtils";

const BASE_URL = CLOUD_RUN_ENDPOINTS.BRAND_FORM.GET_BRAND_DETAILS;

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      const response = await fetch(`${BASE_URL}?customurl=${brandName}.shackit.in`, {
        method: 'GET'
      });

      if(response.ok){
        return response.json();
      }
      else {
        return response;
      }
    }
    catch(error){
      console.error(error); 
    }
  }
};

export default BrandService;