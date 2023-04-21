const absentRepo = require("../repo/absent.js");
const sendResponse = require("../helper/sendResponse");

const absentEntry = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = absentRepo.absentEntry(userPayload.userId);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log("error ini:", error);
    sendResponse.error(res, error.status, error);
  }
};

const absentOut = async (req, res) => {
  try {
    const response = absentRepo.absentOut(req.userPayload.userId);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const absentController = { absentEntry, absentOut };

module.exports = absentController;
