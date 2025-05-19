const BASE_URL = 'https://function-11-201137466588.asia-south1.run.app?brandname=';

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      const response = await fetch(BASE_URL + brandName, {
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