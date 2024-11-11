import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
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

const registerUser = asyncHandler(async (req, res) => {
  // get user Details from frontend

  const { fullName, email, username, password } = req.body;
  // console.log(req.files.avatar[0]);

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are Required");
  }
  // Check if user already exists
  const existingUserName = await User.findOne({
    username,
  });
  const existingUserEmail = await User.findOne({
    email,
  });
  if (existingUserName) {
    throw new ApiError(409, "Username already exists");
  }
  if (existingUserEmail) {
    throw new ApiError(409, "email already exists");
  }
  // check for images -check for avatar

  const avtarLocalPath = await req.files?.avatar[0].path;
  // const coverImageLocalPath = await req.files?.coverImage[0]?.path;
  // check coverImage given or not
  const coverImageLocalPath = (await (req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0))
    ? await req.files.coverImage[0].path
    : "";

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avataar file is required");
  }
  // upload avatar to cloudinary
  const avatarResult = await Cloudinory(avtarLocalPath);
  const coverImageResult = await Cloudinory(coverImageLocalPath);

  // console.log(coverImageResult);
  if (!avatarResult) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  // create user object -create entry in db
  const user = await User.create({
    fullName,
    avatar: avatarResult.url,
    coverImage: (coverImageResult && coverImageResult.url) || "",
    email,
    username: username.toLowerCase(),
    password,
  });
  console.log("user data", user);

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

export { registerUser };
