const absentRouter = require("express").Router();
const isLogin = require("../middleware/isLogin.js");
const validate = require("../middleware/validate");

const { absentEntry, absentOut } = require("../controller/absent.js");

absentRouter.post("/", isLogin(), absentEntry);
absentRouter.patch("/out", isLogin(), absentOut);

module.exports = absentRouter;
