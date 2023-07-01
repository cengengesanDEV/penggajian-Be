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
  getGajiByStatus,
  gajiKaryawanExcel,
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

penggajianRouter.get("/gaji-excel", isLogin(), gajiKaryawanExcel);

penggajianRouter.post("/gaji", isLogin(), allowedRole("admin"), AddGaji);

penggajianRouter.post(
  "/verif_gaji",
  isLogin(),
  allowedRole("hrd"),
  verifPenggajian
);

penggajianRouter.get("/data-penggajian", isLogin(), getPenggajian);
penggajianRouter.get("/get-verif-gaji", isLogin(), getGajiByStatus);

module.exports = penggajianRouter;
