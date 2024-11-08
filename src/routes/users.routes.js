import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import Upload from "../middlewares/multer.middleware.js";
const router = new Router();

router.route("/register").post(registerUser);

Upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

export default router;
