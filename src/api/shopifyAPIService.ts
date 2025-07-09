import Variant from "@/Types/Variant";
import Product from "../Types/Product";
import { EnvAsset } from "@/stores/ZustandStores";

const BASE_URL =
  "https://function-14-201137466588.asia-south1.run.app?brandname=";
const LIBRARY_URL = "https://ownstoreasset-201137466588.asia-south1.run.app";
const OWN_STORE_PRODUCT_URL = "https://fetch-products-by-vendor-201137466588.asia-south1.run.app?vendor=";

// Market to Shopify country code mapping
const MARKET_TO_COUNTRY_CODE: { [key: string]: string } = {
  'EUR': 'FR', // France for Euro
  'INR': 'IN', // India for Indian Rupee
  'GBP': 'GB', // Great Britain for British Pound
  'USD': 'US', // United States for US Dollar
  'GER': 'DE'  // Germany
};

interface ProductResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          media: {
            edges: {
              node: {
                mediaContentType: string;
                image?: {
                  url: string;
                  altText: string;
                };
                id?: string;
                sources?: {
                  url: string;
                  format: string;
                  mimeType: string;
                }[];
              };
            }[];
          };
          options: {
            id: string;
            name: string;
            position: number;
            values: string[];
          }[];
          variants: {
            edges: {
              node: {
                id: string;
                title: string;
                price: string;
                compareAtPrice?: string;
                availableForSale: boolean;
                selectedOptions: {
                  name: string;
                  value: string;
                }[];
                contextualPricing?: {
                  price?: {
                    amount: string;
                  };
                  compareAtPrice?: {
                    amount: string;
                  };
                };
              };
            }[];
          };
          tags: string[];
          metafields: {
            edges: {
              node: {
                namespace: string;
                key: string;
                value: string;
                type: string;
                description: string;
              };
            }[];
          };
          descriptionHtml: string;
        };
      }[];
    };
  };
}

export const ProductService = {
  async getAllProducts(brandName: string): Promise<Product[]> {
    const response = await fetch(BASE_URL + brandName);
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = [];

    resultJSON.data.products.edges.forEach((product) => {
      const productVariants: Variant[] = product.node.variants.edges.map(
        (variant) => {
          const price = variant.node.contextualPricing?.price?.amount || variant.node.price || "0";
          const compareAtPrice = variant.node.contextualPricing?.compareAtPrice?.amount || variant.node.compareAtPrice;

          return {
            id: Number(variant.node.id.split("/").pop()),
            price: price,
            compareAtPrice: compareAtPrice,
            productId: Number(product.node.id.split("/").pop()),
            selectedOptions: variant.node.selectedOptions,
            availableForSale: variant.node.availableForSale,
          };
        }
      ).filter(variant => parseFloat(variant.price) > 0);

      if (productVariants.length > 0) {
        const models = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "MODEL_3D")
          .map((model) => ({
            id: model.node.id,
            sources: model.node.sources || [],
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || ""
          }));

        const arLensLink = product.node.metafields?.edges?.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: images,
          models: models,
          variants: productVariants,
          options: product.node.options,
          tags: product.node.tags ? product.node.tags.join(" ") : "",
          arLensLink: arLensLink || undefined
        };

        products.push(parsedProduct);
      }
    });

    return products;
  },

  async getAllProductsFromVendor(brandName: string, market: string = 'USD'): Promise<Product[]> {
    // Get country code from market, default to US if not found
    const countryCode = MARKET_TO_COUNTRY_CODE[market] || 'US';
    
    const response = await fetch(OWN_STORE_PRODUCT_URL + brandName, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vendor: brandName,
        region: "global",
        country: countryCode
      })
    });
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = [];

    resultJSON.data.products.edges.forEach((product) => {
      const productVariants: Variant[] = product.node.variants.edges.map(
        (variant) => {
          const price = variant.node.contextualPricing?.price?.amount || variant.node.price || "0";
          const compareAtPrice = variant.node.contextualPricing?.compareAtPrice?.amount || variant.node.compareAtPrice;

          return {
            id: Number(variant.node.id.split("/").pop()),
            price: price,
            compareAtPrice: compareAtPrice,
            productId: Number(product.node.id.split("/").pop()),
            selectedOptions: variant.node.selectedOptions,
            availableForSale: variant.node.availableForSale,
          };
        }
      ).filter(variant => parseFloat(variant.price) > 0);

      if (productVariants.length > 0) {
        const models = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "MODEL_3D")
          .map((model) => ({
            id: model.node.id,
            sources: model.node.sources || [],
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || ""
          }));

        const arLensLink = product.node.metafields?.edges?.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: images,
          models: models,
          variants: productVariants,
          options: product.node.options,
          tags: product.node.tags ? product.node.tags.join(" ") : "",
          arLensLink: arLensLink || undefined
        };

        products.push(parsedProduct);
      }
    });

    return products;
  },

  async getLibraryAssetsAsProducts(): Promise<Product[]> {
    const response = await fetch(LIBRARY_URL);
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = [];

    resultJSON.data.products.edges.forEach((product) => {
      const productVariants: Variant[] = product.node.variants.edges.map(
        (variant) => {
          const price = variant.node.contextualPricing?.price?.amount || variant.node.price || "0";
          const compareAtPrice = variant.node.contextualPricing?.compareAtPrice?.amount || variant.node.compareAtPrice;

          return {
            id: Number(variant.node.id.split("/").pop()),
            price: price,
            compareAtPrice: compareAtPrice,
            productId: Number(product.node.id.split("/").pop()),
            selectedOptions: variant.node.selectedOptions,
            availableForSale: variant.node.availableForSale,
          };
        }
      );

      if (productVariants.length > 0) {
        const models = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "MODEL_3D")
          .map((model) => ({
            id: model.node.id,
            sources: model.node.sources || [],
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || ""
          }));

        const arLensLink = product.node.metafields?.edges?.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: images,
          models: models,
          variants: productVariants,
          options: product.node.options,
          tags: product.node.tags ? product.node.tags.join(" ") : "",
          arLensLink: arLensLink || undefined
        };

        products.push(parsedProduct);
      }
    });

    return products;
  },

  async getLibraryAssets(brandName: string): Promise<EnvAsset[]> {
    const products = await this.getLibraryAssetsAsProducts();

    const libraryAssets = products.map((product) => {
      const assets: EnvAsset = {
        id: `${brandName}/${product.id}`,
        type: product.models.length > 0 ? "MODEL_3D" : "PHOTO",
        status: "SUCCESS",
        src:
          product.models.length > 0
            ? product.models[0].sources?.[0].url || ""
            : product.images[0].src,
        name: product.title,
        source: "LIBRARY",
        image : product?.images[0] && product?.images[0].src,
        isEnvironmentAsset: false,
      };
      return assets;
    });

    return libraryAssets;
  },
};
