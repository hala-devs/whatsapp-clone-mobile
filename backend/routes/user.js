import express from "express";
import {
    getFriends,
    login,
    register,
    updateProfilePicture,
    updateUser,
} from "../controllers/user.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", isAuth, getFriends);
userRouter.put("/", isAuth, updateUser);
userRouter.put("/profile-picture", isAuth, upload.single("profilePicture"), updateProfilePicture)

export default userRouter;