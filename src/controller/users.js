const userRepo = require("../repo/users");
const sendResponse = require("../helper/sendResponse");

const register = async (req, res) => {
  try {
    const { body } = req;
    const response = await userRepo.register(body);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getData = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = await userRepo.getDataById(userPayload);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const userController = {
  register,
  getData,
};

module.exports = userController;
