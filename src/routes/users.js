const express = require("express");
const usersRouter = express.Router();
const validate = require("../middleware/validate");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole.js");

const multer = require("multer");
const cloudinaryUploader = require("../middleware/cloudinaryProfile");
const { memoryUpload } = require("../middleware/upload");
function uploadFile(req, res, next) {
  memoryUpload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ msg: "Size to large" });
    } else if (err) {
      console.log(err);
      return res.status(400).json({ msg: "Format Wrong" });
    }
    next();
  });
}

const {
  register,
  getDataById,
  profile,
  getDataAllKaryawan,
  getDataKaryawanById,
  getDivision,
  getNameUsers,
  profileKaryawan,
  getCountDivision,
  getDataAllRole,
  updateSuspend,
  SendInformation
} = require("../controller/users.js");

usersRouter.post(
  "/",
  isLogin(),
  allowedRole("hrd"),
  uploadFile,
  cloudinaryUploader,
  register
);

usersRouter.get("/", isLogin(), getDataById);

usersRouter.patch(
  "/profile/:id",
  isLogin(),
  allowedRole("hrd"),
  uploadFile,
  cloudinaryUploader,
  profile
);

usersRouter.patch("/profile-karyawan", isLogin(), profileKaryawan);

usersRouter.get("/all-karyawan", getDataAllKaryawan);

usersRouter.get("/all-role", getDataAllRole);

usersRouter.get("/division", getDivision);

usersRouter.get("/name", getNameUsers);

usersRouter.get("/karyawan/:id", getDataKaryawanById);

usersRouter.get("/division/karyawan", getCountDivision);

usersRouter.patch("/suspend", updateSuspend);

usersRouter.post("/sendInformation", SendInformation);

module.exports = usersRouter;
