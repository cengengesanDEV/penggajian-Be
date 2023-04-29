const postgreDb = require("../config/postgre"); //koneksi database
const bcrypt = require("bcrypt"); // kon

const register = (body) => {
  return new Promise((resolve, reject) => {
    let query = `insert into users(password,id_division,role,basic_salary,fullname,created_at,updated_at) values($1, $2,$3 ,$4,$5, to_timestamp($6),to_timestamp($7))`;
    const { fullName, password, idDivision, basicSalary } = body;
    const role = "user";
    const validasiFullname = `select fullname from users where fullname like $1`;
    postgreDb.query(validasiFullname, [fullName], (error, resFullName) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (resFullName.rows.length > 0) {
        return reject({ status: 401, msg: "full name already use" });
      }

      // Hash Password
      bcrypt.hash(password, 10, (error, hashedPasswords) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server error" });
        }
        const timestamp = Date.now() / 1000;
        postgreDb.query(
          query,
          [
            hashedPasswords,
            idDivision,
            role,
            basicSalary,
            fullName,
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
};

const getDataById = (payload) => {
  return new Promise((resolve, reject) => {
    postgreDb.query(
      "select users.id,users.email,users.fullname,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary from users inner join division on division.id = users.id_division where users.id = $1",
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

const getDataAllKaryawan = () => {
  return new Promise((resolve, reject) => {
    postgreDb.query(
      "select users.id,users.email,users.fullname,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary from users inner join division on division.id = users.id_division where not users.role = 'admin' ",
      [],
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
};

module.exports = userRepo;
