const userRepo = require("../repo/users");
const sendResponse = require("../helper/sendResponse");

const register = async (req, res) => {
  try {
    const { body } = req;
    if (req.file) {
      body.image = req.file.secure_url;
    }
    const response = await userRepo.register(body);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getDataById = async (req, res) => {
  try {
    const { userPayload } = req;
    const response = await userRepo.getDataById(userPayload);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getDataAllKaryawan = async (req, res) => {
  try {
    const response = await userRepo.getDataAllKaryawan(req.query.search);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getDataKaryawanById = async (req, res) => {
  try {
    const response = await userRepo.getDataKaryawanById(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};
const getDivision = async (req, res) => {
  try {
    const response = await userRepo.getDivision();
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};
const getNameUsers = async (req, res) => {
  try {
    const response = await userRepo.getNameUsers();
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const profile = async (req, res) => {
  try {
    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
      req.body.image = req.file.secure_url;
    }

    const response = await userRepo.profile(req.body, req.params.id);
    sendResponse.success(res, 200, {
      msg: "Edit Profile Success",
      data: response.rows,
      filename: image,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "internal server error");
  }
};

const profileKaryawan = async (req, res) => {
  try {
    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
      req.body.image = req.file.secure_url;
    }

    const response = await userRepo.profile(req.body, req.userPayload.userId);
    sendResponse.success(res, 200, {
      msg: "Edit Profile Success",
      data: response.rows,
      filename: image,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "internal server error");
  }
};

const userController = {
  register,
  getDataById,
  profile,
  getDataAllKaryawan,
  getDataKaryawanById,
  getDivision,
  getNameUsers,
  profileKaryawan,
};

module.exports = userController;
