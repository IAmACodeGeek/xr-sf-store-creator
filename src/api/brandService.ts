const BASE_URL = 'https://get-brand-details-via-customurl-201137466588.asia-south1.run.app';

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