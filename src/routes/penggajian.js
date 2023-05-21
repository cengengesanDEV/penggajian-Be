const penggajianRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
  AddLemburan,
  getGajianByIdKaryawan,
  AddGaji,
} = require("../controller/penggajian.js");
const { addGaji } = require("../repo/penggajian.js");

penggajianRouter.post(
  "/add-lembur",
  isLogin(),
  allowedRole("hrd"),
  AddLemburan
);

penggajianRouter.get(
  "/gaji/:id",
  isLogin(),
  allowedRole("hrd"),
  getGajianByIdKaryawan
);
penggajianRouter.post("/gaji", isLogin(), allowedRole("hrd"), addGaji);

module.exports = penggajianRouter;
