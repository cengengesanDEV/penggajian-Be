const absentRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
  absentEntry,
  absentOut,
  absentNow,
  getAbsenByDate,
  absentEntryDesc,
  getAbsenById,
  getAbsenEmployee,
} = require("../controller/absent.js");

absentRouter.post("/in", isLogin(), absentEntry);
absentRouter.post("/not-in", isLogin(), absentEntryDesc);
absentRouter.patch("/out", isLogin(), absentOut);
absentRouter.get("/now", isLogin(), absentNow);
absentRouter.get("/", isLogin(), allowedRole("user"), getAbsenByDate);
absentRouter.get("/employee/:id", isLogin(), getAbsenById);
absentRouter.get("/employee", isLogin(), getAbsenEmployee);

module.exports = absentRouter;
