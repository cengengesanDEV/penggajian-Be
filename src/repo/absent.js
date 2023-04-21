const postgreDb = require("../config/postgre.js");

const absentEntry = (payload) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into absensi(id_users,date,clock_in,description,created_at,updated_at) values($1,current_date,current_time,$2,to_timestamp($3),to_timestamp($4)) returning *";
    const timestamp = Date.now() / 1000;
    const description = "entry";
    const checkQuery =
      "select clock_in from absensi where id_users = $1 and absensi.date = current_date()";
    postgreDb.query(checkQuery, payload, (Error, result) => {
      if (Error) {
        console.log(Error);
        return reject({ status: 500, msg: "internal server error" });
      }
      if (result.rows[0].clock_in) {
        console.log("sini");
        return reject({ status: 400, msg: "you already absent today" });
      }
      postgreDb.query(
        query,
        [payload, description, timestamp, timestamp],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          return resolve({
            status: 201,
            msg: "absent entry created",
            data: result.rows[0],
          });
        }
      );
    });
  });
};

const absentOut = (userId) => {
  return new Promise((resolve, reject) => {
    const query =
      "update absensi set clock_out = current_time(),updated_at = to_timestamp($1) where id_users = $2 and date = current_date() returning *";
    const timestamp = date.now() / 1000;
    postgreDb.query(query, [timestamp, userId], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      resolve({
        status: 201,
        msg: "absent out created",
        data: result.rows[0],
      });
    });
  });
};

const absentRepo = {
  absentEntry,
  absentOut,
};

module.exports = absentRepo;
