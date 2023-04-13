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

const { register, getData } = require("../controller/users.js");

usersRouter.post(
  "/",
  validate.body("fullName", "password", "idDivision", "role", "basicSalary"),
  register
);

usersRouter.get("/", isLogin(), getData);

module.exports = usersRouter;
