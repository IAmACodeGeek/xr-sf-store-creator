import Variant from "@/Types/Variant";
import Product from "../Types/Product";
import { EnvAsset } from "@/stores/ZustandStores";
import { CLOUD_RUN_ENDPOINTS } from "./cloudUtils";

const BASE_URL = CLOUD_RUN_ENDPOINTS.PRODUCT_FETCH.SHOPIFY_PRODUCTS + "?brandname=";
const LIBRARY_URL = CLOUD_RUN_ENDPOINTS.ASSETS.OWN_STORE;
const OWN_STORE_PRODUCT_URL = CLOUD_RUN_ENDPOINTS.OWN_STORE.FETCH_PRODUCTS + "?vendor=";

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
                  filesize?: number;
                }[];
                originalSource?: {
                  fileSize: number;
                };
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
            filesize: model.node.originalSource?.fileSize || 0,
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || "",
            size: image.node.originalSource?.fileSize || 0,
          }));

        // Calculate total file size for all media assets
        const totalFileSize = product.node.media.edges.reduce((total, media) => {
          let size = media.node.originalSource?.fileSize || 0;
          if (media.node.sources && media.node.sources.length) {
            media.node.sources.forEach((src) => {
              // Some APIs use filesize or fileSize; check both
              size += (src.filesize ?? (src as any).fileSize ?? 0);
            });
          }
          return total + size;
        }, 0);

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
          arLensLink: arLensLink || undefined,
          totalFileSize: totalFileSize
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
            filesize: model.node.originalSource?.fileSize || 0,
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || "",
            size: image.node.originalSource?.fileSize || 0,
          }));

        // Calculate total file size for all media assets
        const totalFileSize = product.node.media.edges.reduce((total, media) => {
          let size = media.node.originalSource?.fileSize || 0;
          if (media.node.sources && media.node.sources.length) {
            media.node.sources.forEach((src) => {
              // Some APIs use filesize or fileSize; check both
              size += (src.filesize ?? (src as any).fileSize ?? 0);
            });
          }
          return total + size;
        }, 0);

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
          arLensLink: arLensLink || undefined,
          totalFileSize: totalFileSize
        };

        products.push(parsedProduct);
      }
    });

    return products;
  },

  async getLibraryAssetsAsProducts(): Promise<Product[]> {
    const response = await fetch(LIBRARY_URL);
    const resultJSON: ProductResponse = await response.json();


    const products: Product[] = resultJSON.data.products.edges
      .map((product) => {
        const productImages: { src: string; size: number }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "IMAGE" &&
              edge.node.image
          )
          .map((edge) => {
            return { 
              src: edge.node.image?.url || "",
              size: edge.node.originalSource?.fileSize || 0
            };
          });

        const models: {
          id: string | undefined;
          sources:
            | {
                url: string;
                format: string;
                mimeType: string;
              }[]
            | undefined;
        }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "MODEL_3D" &&
              edge.node.sources
          )
          .map((edge) => {
            return {
              id: edge.node.id,
              sources: edge.node.sources,
            };
          });

        const productVariants: Variant[] = product.node.variants.edges.map(
          (variant) => {
            return {
              id: Number(variant.node.id.split("/").pop()),
              price: variant.node.price,
              compareAtPrice: variant.node.compareAtPrice,
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
            filesize: model.node.originalSource?.fileSize || 0,
          }));

        const images = product.node.media.edges
          .filter((media) => media.node.mediaContentType === "IMAGE")
          .map((image) => ({
            src: image.node.image?.url || "",
            size: image.node.originalSource?.fileSize || 0,
          }));

          // Calculate total file size for all media assets
          const totalFileSize = product.node.media.edges.reduce((total, media) => {
            let size = media.node.originalSource?.fileSize || 0;
            if (media.node.sources && media.node.sources.length) {
              media.node.sources.forEach((src) => {
                // Some APIs use filesize or fileSize; check both
                size += (src.filesize ?? (src as any).fileSize ?? 0);
              });
            }
            return total + size;
          }, 0);

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
          arLensLink: arLensLink || undefined,
          totalFileSize: totalFileSize
        };

          return parsedProduct;
        }
        return undefined;
      })
      .filter((product): product is Product => product !== undefined);
    return products;
  },

  async getLibraryAssets(brandName: string): Promise<EnvAsset[]> {
    const products = await this.getLibraryAssetsAsProducts();


    const libraryAssets = products.map((product) => {
      // Calculate file size based on the asset type
      let fileSize = 0;
      if (product.models.length > 0) {
        // For 3D models, use the product's totalFileSize since individual model filesize is not available
        fileSize = product.totalFileSize || 0;
      } else if (product.images.length > 0) {
        // For images, use the first image's size
        fileSize = product.images[0].size || 0;
      }

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
        filesize: fileSize, // Add file size information
      };
      
      
      return assets;
    });

    return libraryAssets;
  },
};
