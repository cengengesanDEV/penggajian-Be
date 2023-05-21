const penggajianRepo = require("../repo/penggajian");
const sendResponse = require("../helper/sendResponse");

const AddLemburan = async (req, res) => {
  try {
    const { body } = req;
    const response = await penggajianRepo.AddLemburan(body);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getLemburan = async (req, res) => {
  try {
    const { query } = req;
    const response = await penggajianRepo.getLemburan(query.date);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const getGajianByIdKaryawan = async (req, res) => {
  try {
    const { params, query } = req;
    const response = await penggajianRepo.getGajiByIdkaryawan(
      params.id,
      query.month,
      query.year
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const AddGaji = async (req, res) => {
  try {
    const { body } = req;
    const response = await penggajianRepo.addGaji(body);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    sendResponse.error(res, error.status, error);
  }
};

const penggajianController = {
  AddLemburan,
  getLemburan,
  getGajianByIdKaryawan,
  AddGaji,
};

module.exports = penggajianController;
