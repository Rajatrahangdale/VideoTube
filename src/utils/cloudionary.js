import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadCloudinory = async (localFilePath) => {
  // Configuration
  // Upload an image
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudionary", uploadResult.url);
    return uploadResult;
  } catch (error) {
    fs.unlink(localFilePath);
    console.error("Error uploading file to cloudinary: ", error);
    return null;
  }
};
export default uploadCloudinory;
