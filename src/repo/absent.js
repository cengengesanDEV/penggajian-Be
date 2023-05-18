const postgreDb = require("../config/postgre.js");

const absentEntry = (payload) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into absensi(id_users,date,clock_in,description,created_at,updated_at) values($1,$2,$3,$4,to_timestamp($5),to_timestamp($6)) returning *";
    const timestamp = Date.now() / 1000;
    const description = "entry";
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateApp = `${year}-${month + 1}-${day}`;
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const time = `${hour}:${minute}:${second}`;
    const checkQuery =
      "select clock_in from absensi where id_users = $1 and absensi.date = $2";
    postgreDb.query(checkQuery, [payload, dateApp], (Error, result) => {
      if (Error) {
        console.log(Error);
        return reject({ status: 500, msg: "internal server error" });
      }
      console.log(result.rows);
      if (result.rows[0]?.clock_in) {
        return reject({ status: 400, msg: "you already absent today" });
      }
      postgreDb.query(
        query,
        [payload, dateApp, time, description, timestamp, timestamp],
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
      "update absensi set clock_out = $1,updated_at = to_timestamp($2) where id_users = $3 and date = $4 returning *";
    const timestamp = Date.now() / 1000;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateApp = `${year}-${month + 1}-${day}`;
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const time = `${hour}:${minute}:${second}`;
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
    const prevDate =
      month == 1 ? `${year - 1}-12-25` : `${year}-${month - 1}-25`;
    console.log(month);
    const date = `${year}-${month}-25`;
    const query =
      "select clock_in,clock_out,description,extract(year from date) as year,extract(month from date) as month,extract(day from date) as day from absensi where id_users = $1 and date < $2 and date > $3 and clock_out is not null order by absensi.date asc";
    postgreDb.query(query, [id, date, prevDate], (err, result) => {
      let response = [];
      result?.rows?.forEach((value) => {
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
      const queryGetUsers =
        "select users.id,users.email,users.fullname,users.image,division.position,users.role,users.phone_number,users.address,users.basic_salary from users inner join division on division.id = users.id_division where users.id = $1";
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
          data_absent: response,
        };
        const checkIzinQuery =
          "SELECT COUNT(CASE WHEN absensi.description  = 'entry' then 1 end) as jumblah_masuk,COUNT(CASE WHEN absensi.description  = 'sick' then 1 end) as jumblah_izin from absensi where date < $1 and date > $2 and id_users = $3;";
        postgreDb.query(checkIzinQuery, [date, prevDate, id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          responseData = {
            ...responseData,
            jumblah_masuk: result.rows[0].jumblah_masuk,
            jumblah_izin: result.rows[0].jumblah_izin,
          };
          return resolve({
            status: 200,
            msg: "employee data found",
            data: responseData,
          });
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
};

module.exports = absentRepo;
