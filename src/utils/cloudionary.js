import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadCloudinory = async (localFilePath) => {
  try {
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File is uploaded to Cloudinary:", uploadResult.url);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  } finally {
    // Attempt to delete the local file regardless of upload success or failure
    // console.log("Deleting file at path:", localFilePath);
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });
  }
};

export default uploadCloudinory;
