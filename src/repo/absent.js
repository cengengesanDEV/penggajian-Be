const postgreDb = require("../config/postgre.js");
// const moment = require("moment");

const absentEntry = (payload, time, late_hour, dateApp) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into absensi(id_users,date,clock_in,status,description,late_hour,created_at,updated_at) values($1,$2,$3,$4,$5,$6,to_timestamp($7),to_timestamp($8)) returning *";
    const timestamp = Date.now() / 1000;
    const description = "-";
    const status = "masuk";
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();
    // const dateApp = `${year}-${month + 1}-${day}`;
    // const time = moment().format("hh:mm:ss");
    // const hour = date.getHours();
    // const minute = date.getMinutes();
    // const second = date.getSeconds();
    // const time = `${hour}:${minute}:${second}`;
    const checkQuery =
      "select clock_in from absensi where id_users = $1 and absensi.date = $2";
    postgreDb.query(checkQuery, [payload, dateApp], (Error, result) => {
      if (Error) {
        console.log(Error);
        return reject({ status: 500, msg: "internal server error" });
      }
      console.log(result.rows);
      if (result.rows[0]) {
        return reject({ status: 400, msg: "you already absent today" });
      }
      postgreDb.query(
        query,
        [
          payload,
          dateApp,
          time,
          status,
          description,
          late_hour,
          timestamp,
          timestamp,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          result.rows[0] = {
            ...result.rows[0],
            dateNow: dateApp,
            timeNow: time,
          };
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

const absentEntryDesc = (payload, body) => {
  return new Promise((resolve, reject) => {
    const { description, status } = body;
    const query =
      "insert into absensi(id_users,date,status,description,created_at,updated_at) values($1,$2,$3,$4,to_timestamp($5),to_timestamp($6)) returning *";
    const timestamp = Date.now() / 1000;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateApp = `${year}-${month + 1}-${day}`;
    const checkQuery =
      "select clock_in from absensi where id_users = $1 and absensi.date = $2";
    postgreDb.query(checkQuery, [payload, dateApp], (Error, result) => {
      if (Error) {
        console.log(Error);
        return reject({ status: 500, msg: "internal server error" });
      }
      console.log(result.rows);
      if (result.rows[0]) {
        return reject({ status: 400, msg: "you already absent today" });
      }
      postgreDb.query(
        query,
        [payload, dateApp, status, description, timestamp, timestamp],
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

const absentOut = (userId, time, dateApp) => {
  return new Promise((resolve, reject) => {
    const query =
      "update absensi set clock_out = $1,updated_at = to_timestamp($2) where id_users = $3 and date = $4 returning *";
    const timestamp = Date.now() / 1000;
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();
    // const dateApp = `${year}-${month + 1}-${day}`;
    // const hour = date.getHours();
    // const minute = date.getMinutes();
    // const second = date.getSeconds();
    // const time = `${hour}:${minute}:${second}`;
    const checkQuery =
      "select clock_in from absensi where id_users = $1 and absensi.date = $2";
    postgreDb.query(checkQuery, [userId, dateApp], (Error, result) => {
      if (Error) {
        console.log(Error);
        return reject({ status: 500, msg: "internal server error" });
      }
      console.log(result.rows);
      if (!result.rows[0]) {
        return reject({ status: 400, msg: "you havent absent in today" });
      }
      if (!result.rows[0].clock_in) {
        return reject({ status: 400, msg: "you already absent today" });
      }
      postgreDb.query(
        query,
        [time, timestamp, userId, dateApp],
        (error, result) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "internal server error" });
          }
          console.log(result.rows);
          resolve({
            status: 201,
            msg: "absent out created",
            data: result.rows[0],
          });
        }
      );
    });
  });
};

const getAbsentNow = (usersId) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateApp = `${year}-${month + 1}-${day}`;
    const query = "select * from absensi where id_users = $1 and date = $2";
    postgreDb.query(query, [usersId, dateApp], (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      if (!result.rows[0]) {
        result.rows[0] = { date: null, clock_in: null };
      }
      return resolve({ status: 200, msg: "data found", data: result.rows[0] });
    });
  });
};

const getAbsenFilterDate = (id, month, year) => {
  return new Promise((resolve, reject) => {
    if (!year || !month) {
      const query =
        "select clock_in,clock_out,description,extract(year from date) as year,extract(month from date) as month,extract(day from date) as day from absensi where id_users = $1 order by absensi.date asc";
      postgreDb.query(query, [id], (error, result) => {
        let response = [];
        result.rows.forEach((value) =>
          response.push({
            clockin: `${value.clock_in}`.substring(0, 8),
            clockout: `${value.clock_out}`.substring(0, 8),
            description: value.description,
            date: `${value.year}-${value.month}-${value.day}`,
          })
        );
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({
          status: 200,
          msg: "data absensi found",
          data: response,
        });
      });
    } else {
      const prevDate = `${year}-${month - 1}-25`;
      const date = `${year}-${month}-25`;
      const query =
        "select clock_in,clock_out,description,extract(year from date) as year,extract(month from date) as month,extract(day from date) as day from absensi where id_users = $1 and date < $2 and date > $3 order by absensi.date asc";
      postgreDb.query(query, [id, date, prevDate], (err, result) => {
        let response = [];
        result.rows.forEach((value) => {
          response.push({
            clockin: `${value.clock_in}`.substring(0, 8),
            clockout: `${value.clock_out}`.substring(0, 8),
            description: value.description,
            date: `${value.year}-${value.month}-${value.day}`,
          });
        });
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({
          status: 200,
          msg: `data at year: ${year} month: ${month} found`,
          data: response,
        });
      });
    }
  });
};

const getAbsenById = (id, month, year) => {
  return new Promise((resolve, reject) => {
    if (id == 0) {
      return resolve({ status: 200, data: [] });
    }
    const prevDate =
      month == 1 ? `${year - 1}-12-25` : `${year}-${month - 1}-25`;
    console.log(month);
    const date = `${year}-${month}-25`;
    const query =
      "select clock_in,clock_out,description,status,extract(year from date) as year,extract(month from date) as month,extract(day from date) as day from absensi where id_users = $1 and date < $2 and date > $3 and clock_out is not null order by absensi.date asc";
    postgreDb.query(query, [id, date, prevDate], (err, result) => {
      let response = [];
      result?.rows?.forEach((value) => {
        response.push({
          clockin: `${value.clock_in}`.substring(0, 8),
          clockout: `${value.clock_out}`.substring(0, 8),
          status: value.status,
          description: value.description,
          date: `${value.year}-${value.month}-${value.day}`,
        });
      });
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      const queryGetUsers =
        "select users.id,users.email,users.fullname,users.bank_name,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary,users.nik,users.birth_date from users inner join division on division.id = users.id_division where users.id = $1";
      postgreDb.query(queryGetUsers, [id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        const variable = result.rows[0];
        let responseData = {
          fullname: variable.fullname,
          email: variable.email,
          image: variable.image,
          position: variable.position,
          phone_number: variable.phone_number,
          address: variable.address,
          basic_salary: variable.basic_salary,
          nik: variable.nik,
          birth_date: variable.birth_date,
          basic_salary: variable.basic_salary,
          overtime_salary: variable.overtime_salary,
          data_absent: response,
        };
        const checkIzinQuery =
          "SELECT COUNT(CASE WHEN absensi.status  = 'masuk' and absensi.clock_out is not null then 1 end) as jumblah_masuk,COUNT(CASE WHEN absensi.status  = 'izin' then 1 end) as jumblah_izin,COUNT(CASE WHEN absensi.status  = 'sakit' then 1 end) as jumblah_sakit from absensi where date < $1 and date > $2 and id_users = $3;";
        postgreDb.query(checkIzinQuery, [date, prevDate, id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          responseData = {
            ...responseData,
            jumlah_masuk: result.rows[0].jumblah_masuk,
            jumlah_izin: result.rows[0].jumblah_izin,
            jumblah_sakit: result.rows[0].jumblah_sakit,
          };

          const queryCheckJumblahTelat =
            "select sum(CAST(late_hour AS numeric)) as total_telat from absensi where id_users = $1 and date < $2 and date > $3";
          postgreDb.query(
            queryCheckJumblahTelat,
            [id, prevDate, date],
            (err, response) => {
              if (err) {
                console.log(err);
                return reject({ status: 500, msg: "internal server error" });
              }
              if (!response.rows[0].total_telat) {
                responseData = {
                  ...responseData,
                  total_telat: 0,
                };
              } else {
                responseData = {
                  ...responseData,
                  total_telat: response.rows[0].total_telat,
                };
              }
              const getLemburan =
                "select sum(CAST(jam_lembur AS numeric)) as total_jam_lembur from lembur where id_users = $1 and date < $2 and date > $3";
              postgreDb.query(
                getLemburan,
                [id, prevDate, date],
                (err, response) => {
                  if (err) {
                    console.log(err);
                    return reject({
                      status: 500,
                      msg: "internal server error",
                    });
                  }
                  if (!response.rows[0].total_jam_lembur) {
                    responseData = {
                      ...responseData,
                      total_jam_lembur: 0,
                    };
                  } else {
                    responseData = {
                      ...responseData,
                      total_jam_lembur: 0,
                    };
                  }
                  console.log(responseData);
                  return resolve({
                    status: 200,
                    msg: "employee data found",
                    data: responseData,
                  });
                }
              );
            }
          );
        });
      });
    });
  });
};

const getAbsenEmployee = (month, year) => {
  return new Promise((resolve, reject) => {
    const prevDate = `${year}-${month - 1}-25`;
    const date = `${year}-${month}-25`;
    const query =
      "SELECT users.fullname,COUNT(CASE WHEN absensi.description  = 'entry' then 1 end) as jumblah_masuk,COUNT(CASE WHEN absensi.description  = 'sick' then 1 end) as jumblah_izin from absensi join users on absensi.id_users  = users.id where absensi.date < $1 and absensi.date > $2 group by users.fullname ;";
    postgreDb.query(query, [date, prevDate], (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({
        status: 200,
        msg: "employee data found",
        data: result.rows,
      });
    });
  });
};

const absentRepo = {
  absentEntry,
  absentOut,
  getAbsenFilterDate,
  getAbsenById,
  getAbsenEmployee,
  getAbsentNow,
  absentEntryDesc,
};

module.exports = absentRepo;
