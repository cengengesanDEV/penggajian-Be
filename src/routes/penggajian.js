const penggajianRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
  AddLemburan,
  getGajianByIdKaryawan,
  AddGaji,
  getLemburan,
} = require("../controller/penggajian.js");

penggajianRouter.post(
  "/add-lembur",
  isLogin(),
  allowedRole("hrd"),
  AddLemburan
);

penggajianRouter.get("/lembur", isLogin(), allowedRole("hrd"), getLemburan);

penggajianRouter.get(
  "/gaji/:id",
  isLogin(),
  allowedRole("hrd"),
  getGajianByIdKaryawan
);
penggajianRouter.post("/gaji", isLogin(), allowedRole("hrd"), AddGaji);

module.exports = penggajianRouter;
