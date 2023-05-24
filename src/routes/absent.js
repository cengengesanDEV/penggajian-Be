const absentRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
  absentEntry,
  absentOut,
  absentNow,
  getAbsenByDate,
  getAbsenById,
  getAbsenEmployee,
} = require("../controller/absent.js");

absentRouter.post("/in", isLogin(), absentEntry);
absentRouter.patch("/out", isLogin(), absentOut);
absentRouter.patch("/now", isLogin(), absentNow);
absentRouter.get("/", isLogin(), allowedRole("user"), getAbsenByDate);
absentRouter.get("/employee/:id", isLogin(), getAbsenById);
absentRouter.get("/employee", isLogin(), getAbsenEmployee);

module.exports = absentRouter;
