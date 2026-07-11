import { deleteFromCloudinary } from "../config/cloudinary.config"

export const withCloudinaryCleanup = async <T>(publicIds: string[] | string | null, fn: () => Promise<T>): Promise<T> => {
  const ids = publicIds
    ? Array.isArray(publicIds)
      ? publicIds
      : [publicIds]
    : [];
  try {
    return await fn()
  } catch (error) {
    
    await Promise.allSettled(ids.map((id) => deleteFromCloudinary(id)))
    
    throw error
  }
}