const postgreDb = require("../config/postgre.js");
const JWTR = require("jwt-redis").default;
const bcrypt = require("bcrypt");
const client = require("../config/redis");

// Login Authentikasi
const login = (body) => {
  return new Promise((resolve, reject) => {
    const { fullName, password } = body;
    const jwtr = new JWTR(client);
    const getPasswordsByEmailValues =
      "select id, fullName, password, role from users where fullName = $1";
    const getPasswordsEmailValues = [fullName];
    postgreDb.query(
      getPasswordsByEmailValues,
      getPasswordsEmailValues,
      (err, response) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        if (response.rows.length === 0)
          return reject({ status: 401, msg: "full name/password wrong" });
        // 3. Process Login => create jwt => return jwt to users
        const payload = {
          userId: response.rows[0].id,
          fullName: response.rows[0].fullName,
          role: response.rows[0].role,
        };
        const hashedPasswords = response.rows[0].password; // <= Get passwords from database
        bcrypt.compare(password, hashedPasswords, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          if (!isSame)
            return reject({
              status: 401,
              msg: "email/password wrong",
            });
          jwtr
            .sign(payload, process.env.SECRET_KEY, {
              expiresIn: "1d",
              issuer: process.env.ISSUER,
            })
            .then((token) => {
              // Token verification
              return resolve({
                status: 200,
                msg: "login success",
                data: { token, ...payload },
              });
            });
        });
      }
    );
  });
};

const logout = (token) => {
  return new Promise((resolve, reject) => {
    const jwtr = new JWTR(client);
    jwtr.destroy(token.jti).then((res) => {
      if (!res) reject({ status: 500, msg: "internal server error" });
      return resolve({ status: 200, msg: "logout success" });
    });
  });
};

const authRepo = {
  login,
  logout,
};

module.exports = authRepo;
