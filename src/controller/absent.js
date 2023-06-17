const absentRepo = require("../repo/absent.js");
const sendResponse = require("../helper/sendResponse");

const absentEntry = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = await absentRepo.absentEntry(userPayload.userId);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log("error ini:", error);
    sendResponse.error(res, error.status, error);
  }
};

const absentEntryDesc = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = await absentRepo.absentEntryDesc(
      userPayload.userId,
      req.body
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log("error ini:", error);
    sendResponse.error(res, error.status, error);
  }
};

const absentNow = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = await absentRepo.getAbsentNow(userPayload.userId);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log("error ini:", error);
    sendResponse.error(res, error.status, error);
  }
};

const absentOut = async (req, res) => {
  try {
    const response = await absentRepo.absentOut(req.userPayload.userId);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getAbsenByDate = async (req, res) => {
  try {
    const response = await absentRepo.getAbsenById(
      req.userPayload.userId,
      req.query.month,
      req.query.year
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getAbsenById = async (req, res) => {
  try {
    const response = await absentRepo.getAbsenById(
      req.params.id,
      req.query.month,
      req.query.year
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getAbsenEmployee = async (req, res) => {
  try {
    const response = await absentRepo.getAbsenEmployee(
      req.query.month,
      req.query.year
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const absentController = {
  absentEntry,
  absentOut,
  getAbsenByDate,
  getAbsenById,
  getAbsenEmployee,
  absentNow,
  absentEntryDesc,
};

module.exports = absentController;
