import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: "dqgs2g9b1",
    api_key: "514282715965622",
    api_secret: "f0csx8WK2vTzOOtQj1zqKIOVvoM",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("ghjkl", localFilePath);

        if (!localFilePath) return null;
        //upload file on cloudinary .
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log(response);

        console.log("file has been upload sucessfully ", response.url);
        // we have to unlink the local file path here also .
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // if file uploading failed so we have to localfilepath .
        console.log(error);

        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteOnCloudinary = async (arr) => {
    try {
        const res = await cloudinary.api.delete_resources(arr);
        console.log(res, "images deleted successfully");
        return true;
    } catch (error) {
        throw new ApiError(400, error);
        return false;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };
