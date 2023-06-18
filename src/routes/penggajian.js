const penggajianRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
  AddLemburan,
  getGajianByIdKaryawan,
  AddGaji,
  getLemburan,
  gajiKaryawan,
  getPenggajian,
  verifPenggajian,
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

penggajianRouter.get("/gaji-karyawan", isLogin(), gajiKaryawan);

penggajianRouter.post("/gaji", isLogin(), allowedRole("hrd"), AddGaji);

penggajianRouter.post(
  "/verif_gaji",
  isLogin(),
  allowedRole("hrd"),
  verifPenggajian
);

penggajianRouter.get("/data-penggajian", isLogin(), getPenggajian);

module.exports = penggajianRouter;
