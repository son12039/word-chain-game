import express from "express";
import cors from "cors";
import http from "http";
import { createSocket } from "./socket.js";
import { createDBConnection } from "./mysql.js";
const app = express();
const port = 3001;
app.use(cors());
// 폼이나 JSON 데이터 파싱해서 JS객체로 변환
app.use(express.json());
const server = http.createServer(app);
createSocket(server);
server.listen(port, () => {
  console.log("시작");
});
const connection = createDBConnection();
app.post("/member/user", (req, res) => {
  const { id, password, nickname } = req.body;

  if (nickname == "") {
    const loginQuery = `SELECT * FROM member WHERE id=?AND password=?`;
    connection.query(loginQuery, [id, password], (error, results) => {
      console.log(results[0].nickname);
      if (error) {
        return res.status(500).json({ message: "로그인 실패", error });
      }
      res.status(201).json({ message: nickname });
    });
  } else {
    const signupQuery = `INSERT INTO member (id, password, nickname) VALUES (?, ?, ?)`;

    connection.query(
      signupQuery,
      [id, password, nickname],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: "회원가입 실패", error });
        }
        res.status(201).json({ message: nickname });
      }
    );
  }
});
