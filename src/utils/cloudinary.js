import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "Could not find the File Path";
    //Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "File has been uploaded successfully on cloudinay",
      response.url
    );
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    //Removes the file which is temporarily stored in the server
    return null;
  }
};

export { uploadOnCloudinary };
