const postgreDb = require("../config/postgre"); //koneksi database
const bcrypt = require("bcrypt"); // kon

const register = (body) => {
  return new Promise((resolve, reject) => {
    let query = `insert into users(email,nik,username,fullname,password,image,id_division,role,phone_number,address,basic_salary,overtime_salary,note,birth_date,norek,created_at,updated_at) values($1, $2,$3 ,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,to_timestamp($16),to_timestamp($17))`;
    const {
      email,
      nik,
      username,
      fullname,
      image,
      id_division,
      phone_number,
      address,
      basic_salary,
      overtime_salary,
      role,
      note,
      norek,
      password,
      birth_date,
    } = body;
    const validasiNik = "select nik from users where nik = $1";
    const validasiFullname = `select email from users where email like $1`;
    postgreDb.query(validasiFullname, [email], (error, resFullName) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (resFullName.rows.length > 0) {
        return reject({ status: 401, msg: "email already use" });
      }

      postgreDb.query(validasiNik, [nik], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        if (result.rows.length > 0) {
          return reject({ status: 401, msg: "nik already use" });
        }
        bcrypt.hash(password, 10, (error, hashedPasswords) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server error" });
          }
          const timestamp = Date.now() / 1000;
          postgreDb.query(
            query,
            [
              email,
              nik,
              username,
              fullname,
              hashedPasswords,
              image,
              id_division,
              role,
              phone_number,
              address,
              basic_salary,
              overtime_salary,
              note,
              birth_date,
              norek,
              timestamp,
              timestamp,
            ],
            (error, response) => {
              if (error) {
                console.log(error);
                return reject({
                  status: 500,
                  msg: "Internal Server Error",
                });
              }
              resolve({
                status: 200,
                msg: "register sucess",
                data: response.rows[0],
              });
            }
          );
        });
      });
    });
  });
};

const getDataById = (payload) => {
  return new Promise((resolve, reject) => {
    postgreDb.query(
      "select users.id,users.email,users.fullname,users.bank_name,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary,users.overtime_salary,users.birth_date,users.nik,users.norek from users inner join division on division.id = users.id_division where users.id = $1",
      [payload.userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            msg: "internal server error",
          });
        }
        resolve({ status: 200, msg: "data found", data: result.rows[0] });
      }
    );
  });
};

const getDataKaryawanById = (id) => {
  return new Promise((resolve, reject) => {
    postgreDb.query(
      "select users.id,users.email,users.fullname,users.bank_name,users.username,users.id_division,users.note,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary,users.overtime_salary,users.birth_date,users.nik,users.norek from users inner join division on division.id = users.id_division where users.id = $1",
      [id],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            msg: "internal server error",
          });
        }
        resolve({ status: 200, msg: "data found", data: result.rows[0] });
      }
    );
  });
};

const getDataAllKaryawan = (search) => {
  return new Promise((resolve, reject) => {
    let query =
      "select users.id,users.email,users.fullname,users.bank_name,users.username,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary,users.overtime_salary,users.birth_date,users.nik,users.norek,users.id_division from users join division on division.id = users.id_division";
    if (query !== "") {
      query = `select users.id,users.email,users.fullname,users.bank_name,users.username,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary,users.overtime_salary,users.birth_date,users.nik,users.norek,users.id_division from users join division on division.id = users.id_division where users.fullname like '%${search}%'`;
    }
    console.log(query);
    postgreDb.query(query, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "internal server error",
        });
      }
      resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};
const getDivision = () => {
  return new Promise((resolve, reject) => {
    let query = "select * from division";
    console.log(query);
    postgreDb.query(query, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "internal server error",
        });
      }
      resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const getNameUsers = () => {
  return new Promise((resolve, reject) => {
    let query =
      "select users.id,users.fullname,users.bank_name,users.nik,division.position,users.address,users.role from users inner join division on division.id = users.id_division";
    console.log(query);
    postgreDb.query(query, [], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "internal server error",
        });
      }
      resolve({ status: 200, msg: "data found", data: result.rows });
    });
  });
};

const profile = (body, token) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    const timestamp = Date.now() / 1000;
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1},updated_at = to_timestamp($${
          idx + 2
        }) where id = $${idx + 3} returning *`;
        values.push(body[key], timestamp, token);
        console.log(values);
        console.log(query);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const userRepo = {
  register,
  getDataById,
  profile,
  getDataAllKaryawan,
  getDataKaryawanById,
  getDivision,
  getNameUsers,
};

module.exports = userRepo;
