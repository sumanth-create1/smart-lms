import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (
  fileBuffer,
  folder,
  resourceType = "image",
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,

          resource_type:
            resourceType,

          use_filename: true,

          unique_filename: true,

          ...options,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(stream);
  });
};

export default uploadToCloudinary;