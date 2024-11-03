import express from "express";
import cors from "cors";
import http from "http";
import { createSocket } from "./socket.js";
import { createDBConnection } from "./mysql.js";
const app = express();
const port = 3001;
app.use(cors());
// 폼이나 JSON 데이터 파싱해서 JS객체로 변환함
app.use(express.json());
const server = http.createServer(app);
createSocket(server);
server.listen(port, () => {
  console.log("시작");
});
const connection = createDBConnection();
app.post("/member/user", (req, res) => {
  let { id, password, nickname } = req.body;
  if (nickname == "") {
    const loginQuery = `SELECT * FROM member WHERE id=? AND password=?`;
    connection.query(loginQuery, [id, password], (error, results) => {
      // if (error) {
      //   return res.status(500).json({ message: "로그인 실패", error });
      // }
      let nickname = results.length === 0 ? "로그인 실패" : results[0].nickname;

      res.status(201).json({ nickname });
    });
  } else {
    const signupQuery = `INSERT INTO member (id, password, nickname) VALUES (?, ?, ?)`;
    const a = String(Math.floor(Math.random() * 9000 + 1000));
    nickname += "#" + a;
    connection.query(
      signupQuery,
      [id, password, nickname],
      (error, results) => {
        console.log(id, password, nickname, "회원가입");
        if (!error) {
          res.status(201).json({ nickname });
        } else {
          console.log(error, "실패함");
          res.status(201).json({});
        }
      }
    );
  }
});
app.post("/member/point", (req, res) => {
  let { point, nickname } = req.body;
  const pointQuery = `UPDATE member SET point = point + ? WHERE nickname = ?`;
  connection.query(pointQuery, [point, nickname], (error, results) => {
    if (!error) {
      console.log(point, "성공", nickname);
      res.status(201).json({});
    } else {
      console.log("실패함");
      res.status(201).json({});
    }
  });
});
