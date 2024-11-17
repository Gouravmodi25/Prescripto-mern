const { v2 } = require("cloudinary");
const cloudinary = v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCLoudinary = async function (localFIlePath) {
  try {
    if (!localFIlePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFIlePath, {
      resource_type: "auto",
    });
    console.log("FIle upload on Cloudinary", response);
    fs.unlinkSync(localFIlePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFIlePath);
    return null;
  }
};

module.exports = uploadOnCLoudinary;
