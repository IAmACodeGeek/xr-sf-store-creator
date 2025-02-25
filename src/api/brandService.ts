const BASE_URL = 'https://function-11-934416248688.us-central1.run.app?brandname=';

const BrandService = {
  fetchBrandData: async function(brandName: string){
    try{
      const response = await fetch(BASE_URL + brandName, {
        method: 'GET'
      });
      const result = response.json();
      return result;
    }
    catch(error){
      console.error(error);
    }
  }
};

export default BrandService;