import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../routes/users.routes.js";
import Cloudinory from "../utils/cloudionary.js";
import ApiResponse from "../utils/ApiResponse.js";
// get user Details from frontend
// validation - not empty
// check if user already exists -usernames -email addresses
// check for images -check for avatar
// upload avatar to cloudinary
// create user object -create entry in db
// remove password and refresh token from response
// check for user validations
// return response

const RegisterUser = asyncHandler(async (req, res) => {
  // get user Details from frontend
  const { fullname, email, username, password } = req.body;
  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are Required");
  }
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  // check for images -check for avatar
  const avtarLocalPath = req.files?.avatar[0];
  const coverImageLocalPath = req.files?.coverImage[0];
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avataar file is required");
  }
  // upload avatar to cloudinary
  const avatarResult = await Cloudinory(avtarLocalPath);
  const coverImageResult = await Cloudinory(coverImageLocalPath);
  if (!avatarResult) {
    throw new ApiError(500, "Failed to upload avatar");
  }
  // create user object -create entry in db
  const user = await User.create({
    fullname,
    avatar: avatarResult,
    coverImage: coverImageResult || "",
    email,
    username: username.lowercase(),
    password,
  });
  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user validations
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }
  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export default RegisterUser;
