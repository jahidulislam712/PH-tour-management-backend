import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})

export const cloudinaryUploader = cloudinary

export const uploadToCloudinary = async (buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryUploader.uploader.upload_stream(
      {
        folder: `tour-management/${folder}`,
        resource_type: "image",
        transformation: [
          {
            width: 800,
            height: 500,
            crop: "fill",
            quality: "auto",
            format: "auto"
          }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        if( !result ){
          return reject(new Error("Cloudinary returned no upload result."))
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export const uploadPDFToCloudinary = async(buffer: Buffer, publicId: string) : Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryUploader.uploader.upload_stream(
      {
        folder: "tour-management/invoices",
        resource_type: "auto",
        format: "pdf",
        public_id: publicId
      },
      (error, result) => {
        if(error) return reject(error)

        if( !result ){
          return reject(new Error("Cloudinary returned no result."))
        }

        resolve(result)
      }
    )

    stream.end(buffer)
  })
}

export const deleteFromCloudinary = async (publicId: string | string[]) => {
  if( !publicId.length ) return

  const ids = publicId
    ? Array.isArray(publicId)
      ? publicId
      : [publicId]
    : []
  try {
    await Promise.all(ids.map((id) => cloudinaryUploader.uploader.destroy(id)))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to delete Cloudinary image:", error);
  }
}