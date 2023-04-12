const postgreDb = require("../config/postgre"); //koneksi database
const bcrypt = require("bcrypt"); // kon

const register = (body) => {
  return new Promise((resolve, reject) => {
    let query = `insert into users(fullName,password,idDivision,role,basicSalary,createdAt,updatedAt) values($1, $2,$3 ,$4,$5,$6, to_timestamp($7),to_timestamp($8)) returning role,phone_number,email,status_acc,full_name `;
    const { fullName, password, idDivision, basicSalary } = body;
    const role = "user";
    const validasiFullname = `select fullName from users where fullName like $1`;
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
            fullName,
            hashedPasswords,
            idDivision,
            role,
            basicSalary,
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

const userRepo = {
  register,
};

module.exports = userRepo;
