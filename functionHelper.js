var db = require("./dbConnection");
var bcrypt = require("bcrypt");
var loadingSpinner = require("loading-spinner");
var date = new Date();

module.exports = {
  doSignup: async (inputData) => {
    const { username, email, password } = inputData;
    var password_encrypted = await bcrypt.hash(password, 10);
    const sqlQuery = `INSERT INTO users(username,email,password) VALUES('${username}','${email}','${password_encrypted}') `;
    return new Promise((resolve, reject) => {
      const sqlQuery1 = `SELECT * FROM users WHERE email='${email}'`;
      db.query(sqlQuery1, (err, users) => {
        if (users.length === 0) {
          db.query(sqlQuery, (err, results) => {
            db.query(sqlQuery1, (err, user) => {
              resolve(user[0]);
            });
          });
        } else {
          reject("Account already exists. Please Login");
        }
      });
      //
    });
  },
  doLogin: (inputData) => {
    const { email, password } = inputData;

    const sqlQuery = `SELECT * FROM users WHERE email='${email}'`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, async (err, user) => {
        user = user[0];
        if (user) {
          const status = await bcrypt.compare(password, user.password);
          if (status) {
            resolve(user);
          } else {
            reject("Incorrect password.");
          }
        } else {
          reject("Account does not exist.");
        }
      });
    });
  },
  addQuestion: (body) => {
    //  console.log(body.questionText);
    const { questionText, userId, category } = body;
    let qn_date =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    const sqlQuery = `INSERT INTO questions(qn_text,user_id,category,ans_count,qn_date) VALUES('${questionText}','${userId}','${category}',0,'${qn_date}')`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, results) => {
        // console.log(res);
        resolve(results);
      });
    });
  },

  getAllQuestions: (category) => {
    const sqlQuery = `SELECT username,qn_id,qn_text,ans_count,qn_date,view_count FROM users,questions WHERE users.user_id=questions.user_id and questions.category='${category}'`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, questions) => {
        //  console.log(questions);
        //  console.log(err);
        if (questions.length != 0) {
          resolve(questions.reverse());
        } else {
          reject(
            "No questions in this section. Be the first person to ask one."
          );
        }
      });
    });
  },
  getMyQuestions: (userId) => {
    const sqlQuery = `select * from questions where user_id='${userId}'`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, questions) => {
        if (questions.length != 0) {
          resolve(questions);
        } else {
          reject("You have not asked any questions");
        }
      });
    });
  },

  addAnswer: (ansBody) => {
    let qn_id = ansBody.qn_id;
    let user_id = ansBody.user_id;
    let ans_text = ansBody.ans_text;
    let ans_date =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    const sqlQuery = `INSERT INTO ANSWERS(ans_text,qn_id,user_id,ans_date) VALUES('${ans_text}','${qn_id}','${user_id}','${ans_date}')`;
    const sqlQuery1 = `UPDATE QUESTIONS SET ans_count=ans_count+1 WHERE qn_id=${qn_id}`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, async (err, results) => {
        await db.query(sqlQuery1);
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    });
  },

  getAnswers: (qnId) => {
    const sqlQuery = `SELECT ans_text,ans_date,username,qn_text FROM answers,users,questions WHERE answers.qn_id=${qnId} and users.user_id=answers.user_id and questions.qn_id=answers.qn_id`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    });
  },
  getQuestion: (qnId) => {
    const sqlQuery = `SELECT qn_text,qn_date,view_count FROM questions WHERE qn_id=${qnId}`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, results) => {
        if (!err) {
          resolve(results[0]);
        }
      });
    });
  },
  updateViewCount: (qnId) => {
    const sqlQuery = `UPDATE questions SET view_count=view_count+1 WHERE qn_id=${qnId}`;
    return new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, results) => {
        if (!err) {
          resolve();
        }
      });
    });
  },
};
