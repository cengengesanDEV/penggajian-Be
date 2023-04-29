const absentRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const validate = require("../middleware/validate");
const allowedRole = require("../middleware/allowedRole.js");

const {
  absentEntry,
  absentOut,
  getAbsenByDate,
  getAbsenById,
  getAbsenEmployee,
} = require("../controller/absent.js");

absentRouter.post("/in", isLogin(), allowedRole("user"), absentEntry);
absentRouter.patch("/out", isLogin(), allowedRole("user"), absentOut);
absentRouter.get("/", isLogin(), allowedRole("user"), getAbsenByDate);
absentRouter.get("/employee/:id", isLogin(), getAbsenById);
absentRouter.get("/employee", isLogin(), getAbsenEmployee);

module.exports = absentRouter;
