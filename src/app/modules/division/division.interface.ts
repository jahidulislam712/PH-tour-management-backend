export interface IImage{
  url: string;
  publicId: string;
  altText?: string;
  height?: number;
  width?: number;
  format?: string;
}

export interface IDivision{
  name: string;
  slug: string;
  description? : string;
  thumbnail? : IImage | null;
}