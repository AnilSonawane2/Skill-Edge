import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import streamifier from "streamifier"; // ✅ NEW: needed for buffer upload
import AppError from "../utils/error.utils.js";
import sendEmail from "../utils/sendEmail.js";

/*
 ❌ REMOVED:
 import fs from "fs";

 Reason:
 - Vercel does NOT allow file system writes
 - We are using multer.memoryStorage()
*/

// ====================== COOKIE OPTIONS ======================
const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: true,
  sameSite: "none",
};

// ====================== CLOUDINARY BUFFER HELPER ======================
/*
 ✅ NEW FUNCTION
 - Uploads file from memory buffer
 - REQUIRED for Vercel + multer.memoryStorage()
*/
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "Learning-Management-System",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ====================== REGISTER ======================
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return next(new AppError("Email already exists, please login", 400));
    }

    const user = await userModel.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url: "",
      },
    });

    /*
     ✅ FIXED FILE UPLOAD
     ❌ OLD (WRONG):
       cloudinary.uploader.upload(req.file.path)

     ✅ NEW (CORRECT):
       uploadFromBuffer(req.file.buffer)
    */
    if (req.file) {
      try {
        const result = await uploadFromBuffer(req.file.buffer);
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      } catch (e) {
        return next(
          new AppError(e.message || "File not uploaded", 500)
        );
      }
    }

    await user.save();
    user.password = undefined;

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// ====================== LOGIN ======================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return next(new AppError("Email or password incorrect", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// ====================== LOGOUT ======================
const logout = async (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ====================== GET PROFILE ======================
const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userModel.findById(id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch {
    return next(new AppError("Failed to fetch profile", 500));
  }
};

// ====================== FORGOT PASSWORD ======================
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("Email not registered", 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();

  const resetPasswordURL = `${process.env.CLIENT_URL}/user/profile/reset-password/${resetToken}`;

  try {
    await sendEmail(
      email,
      "Reset Password",
      `Reset your password: ${resetPasswordURL}`
    );

    res.status(200).json({
      success: true,
      message: "Reset link sent",
    });
  } catch (e) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    return next(new AppError(e.message, 500));
  }
};

// ====================== RESET PASSWORD ======================
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await userModel.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token invalid or expired", 400));
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// ====================== CHANGE PASSWORD ======================
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    const user = await userModel.findById(id).select("+password");
    if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
      return next(new AppError("Invalid old password", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// ====================== UPDATE PROFILE ======================
const updateUser = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    const { id } = req.user;

    const user = await userModel.findById(id);
    if (!user) {
      return next(new AppError("User not found", 400));
    }

    if (fullName) user.fullName = fullName;

    /*
     ✅ FIXED FILE UPDATE
     ❌ OLD: req.file.path
     ✅ NEW: req.file.buffer
    */
    if (req.file) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      try {
        const result = await uploadFromBuffer(req.file.buffer);
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      } catch (e) {
        return next(
          new AppError(e.message || "File upload failed", 500)
        );
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// ====================== EXPORTS ======================
export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};