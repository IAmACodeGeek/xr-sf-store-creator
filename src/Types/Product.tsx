import Variant from './Variant';

export default interface Product {
  id: number;
  title: string;
  description?: string;
  images: { src: string; size: number }[];
  models: {
    id: string | undefined;
    sources: {
      url: string,
      format: string,
      mimeType: string,
      filesize?: number
    }[] | undefined;
    filesize: number;
  }[];
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  variants: Variant[];
  arLensLink: string | undefined;
  tags:string;
  totalFileSize?: number; // File size in bytes for all media assets
}