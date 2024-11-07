import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Invalid email format",
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinarry url
      required: true,
      //   default: "default_avatar.jpg",
    },
    coverImage: {
      type: String, // cloudinarry url
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      maxlength: 100,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.genrateAccessToken = function () {
  return jwt.sing(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCCESS_TOKEN_SECRET,
    { expiresIn: ACCCESS_TOKEN_EXPIRY }
  );
};
userSchema.methods.genrateRefreshToken = function () {
  return jwt.sing(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};
export const user = mongoose.model("user", userSchema);
