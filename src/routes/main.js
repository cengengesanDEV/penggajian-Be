const express = require("express");

const mainRouter = express.Router();

const authRouter = require("./auth.js");
const userRouter = require("./users");
const absentRouter = require("./absent");

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/users`, userRouter);
mainRouter.use(`${prefix}/absent`, absentRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Berjalan dengan baik",
  });
});

//export
module.exports = mainRouter;
