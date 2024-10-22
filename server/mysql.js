import mysql from "mysql2";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "qwer1234",
  database: "final",
};
let DBConnection;
export const createDBConnection = () => {
  DBConnection = mysql.createConnection(connectionConfig);

  DBConnection.connect((error) => {
    if (error) {
      console.error("데이터베이스 연결 실패:", error);
      return;
    }
    console.log("데이터베이스에 연결되었습니다.");
  });

  return DBConnection;
};
