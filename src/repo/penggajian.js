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

const getGajiByIdkaryawan = (id_users, month, year) => {
  return new Promise((resolve, reject) => {
    const prevDate =
      month == 1 ? `${year - 1}-12-25` : `${year}-${month - 1}-25`;
    const date = `${year}-${month}-25`;
    const queryGetLemburan =
      "select sum(CAST(jam_lembur AS numeric)) as total_jam_lembur from lembur where id_users = $1 and date < $2 and date > $3";
    postgreDb.query(
      queryGetLemburan,
      [id_users, date, prevDate],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, msg: "internal server error" });
        }
        let hasil = { jam_lembur: result.rows[0].total_jam_lembur };
        const queryGetusers =
          "select users.username,users.fullname,users.basic_salary,users.overtime_salary,division.position from users inner join division on division.id = users.id_division where users.id = $1";
        postgreDb.query(queryGetusers, [id_users], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ status: 500, msg: "internal server error" });
          }
          hasil = { ...hasil, ...result.rows[0] };
          const queryGetAbsensi =
            "select COUNT(CASE WHEN absensi.status  = 'masuk' and absensi.clock_out is not null then 1 end) as jumblah_masuk from absensi where date < $1 and date > $2 and id_users = $3";
          postgreDb.query(
            queryGetAbsensi,
            [date, prevDate, id_users],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({ status: 500, msg: "internal server error" });
              }
              return resolve({
                status: 200,
                msg: `data : ${hasil.fullname} found`,
                data: { ...hasil, ...result.rows[0] },
              });
            }
          );
        });
      }
    );
  });
};

const addGaji = (body) => {
  return new Promise((resolve, reject) => {
    const { id_users, tip, minus, total, date } = body;
    const query =
      "insert into penggajian(id_users,tip_salary,minus_salary,total_salary,date_paid,created_at) values($1,$2,$3,$4,$5,to_timestamp($6))";
    postgreDb.query(query, [id_users, tip, minus, total, date], (err) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 201, msg: "penggajian created" });
    });
  });
};

const lemburanRepo = {
  AddLemburan,
  getGajiByIdkaryawan,
  addGaji,
};

module.exports = lemburanRepo;
