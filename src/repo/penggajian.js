const postgreDb = require("../config/postgre.js");

const AddLemburan = (body) => {
  return new Promise((resolve, reject) => {
    const { id_users, jam_lembur, desc, date } = body;
    const timestamp = Date.now() / 1000;
    const query =
      "insert into lembur(id_users,jam_lembur,date,description,created_at) values($1,$2,$3,$4,to_timestamp($5))";
    postgreDb.query(
      query,
      [id_users, jam_lembur, date, desc, timestamp],
      (err) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 201, msg: "lemburan created" });
      }
    );
  });
};

const getLemburan = (date) => {
  return new Promise((resolve, reject) => {
    const query =
      "select users.fullname,division.position,lembur.jam_lembur,lembur.date,lembur.description,users.overtime_salary from lembur inner join users on users.id = lembur.id_users inner join division on division.id = users.id_division where lembur.date = $1";
    postgreDb.query(query, [date], (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({
        status: 200,
        msg: "get lemburan found",
        data: result.rows,
      });
    });
  });
};

const getGajiAll = (month, year) => {
  return new Promise((resolve, reject) => {
    const queryGetKaryawan =
      "select users.id,users.fullname,users.bank_name,users.nik,division.position,users.address,users.role,users.basic_salary,users.overtime_salary,users.suspend from users inner join division on division.id = users.id_division where users.role != 'hrd'";
    const getGaji =
      "select * from penggajian where extract(month from date_paid) = $1 and extract(year from date_paid) = $2";
    postgreDb.query(queryGetKaryawan, [], (err, res) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      postgreDb.query(getGaji, [month, year], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        res.rows.map((x) => {
          if (result.rows[0]) {
            result.rows.map((v) => {
              if (x.id === v.id_users) {
                x.penggajian = v;
              }
            });
          }
        });
        res.rows.map((v) => {
          if (!v.penggajian) {
            if (v.suspend !== "active") {
              v.penggajian = { status: "out" };
            } else {
              v.penggajian = { status: "belum diverifikasi" };
            }
          }
        });
        // result.rows.map((v) => {
        //   res.rows.map((x) => {
        //     if (x.id === v.id_users) {
        //       x.penggajian = v;
        //     } else {
        //       x.penggajian = { status: "belum diverifikasi" };
        //     }
        //   });
        // });

        return resolve({ status: 200, msg: "document found", data: res.rows });
      });
    });
  });
};

const getGajiByIdkaryawan = (id_users, month, year) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from penggajian where id_users = $1 and extract(month from date_paid) = $2 and extract(year from date_paid) = $3";
    postgreDb.query(query, [id_users, month, year], (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      if (!result.rows[0]) {
        result.rows[0] = {};
      }
      return resolve({ status: 201, data: result.rows });
    });
  });
};

const addGaji = (body) => {
  return new Promise((resolve, reject) => {
    const { id_users, total, date } = body;
    const timestamp = Date.now() / 1000;
    const query =
      "insert into penggajian(id_users,total_salary,date_paid,status,created_at,updated_at) values($1,$2,$3,$4,to_timestamp($5),to_timestamp($6))";
    postgreDb.query(
      query,
      [id_users, total, date, "menunggu verifikasi", timestamp, timestamp],
      (err) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 201, msg: "penggajian created" });
      }
    );
  });
};

const verif_gaji = (flags, id) => {
  return new Promise((resolve, reject) => {
    const accGaji = "update penggajian set status = $1 where id = $2";
    const deleteGaji = "delete from penggajian where id = $1";
    if (flags === "0") {
      postgreDb.query(accGaji, ["terverifikasi", id], (err, res) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 200, msg: "gaji updated" });
      });
    } else {
      postgreDb.query(deleteGaji, [id], (err, res) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 200, msg: "gaji deleted" });
      });
    }
  });
};

const getGajiByStatus = (month, year) => {
  return new Promise((resolve, reject) => {
    const status = "menunggu verifikasi";
    let query =
      "select a.*,b.*,c.position,a.id as id_penggajian from penggajian as a inner join users as b on b.id = a.id_users inner join division as c on b.id_division = c.id where a.status = $1";
    if (month && year) {
      query +=
        " and extract(month from date_paid) = $2 and extract(year from date_paid) = $3";
      console.log({ query });
      postgreDb.query(query, [status, month, year], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 201, msg: "data found", data: result.rows });
      });
    } else {
      postgreDb.query(query, [status], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 201, msg: "data found", data: result.rows });
      });
    }
  });
};

const lemburanRepo = {
  AddLemburan,
  getLemburan,
  getGajiByIdkaryawan,
  addGaji,
  getGajiAll,
  verif_gaji,
  getGajiByStatus,
};

module.exports = lemburanRepo;
