import express from 'express'; 
import mysql from 'mysql2';  
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwer1234',
    database: 'final'
});

// 데이터베이스 연결
connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err);
        return;
    }
    console.log('데이터베이스에 성공적으로 연결됨');
});

app.get('/list', (req, res) => {
    const query = 'SELECT * FROM wordlist limit 10';

    // 데이터베이스에서 데이터 조회
    connection.query(query, (err, results) => {
        if (err) {
            console.error('데이터 조회 실패:', err);
            return res.status(500).json({ error: '잘못됐어' }); // 오류 발생 시 500 응답
        }
        // 조회된 데이터 반환
        res.status(200).json(results); // 200 OK 응답과 함께 조회된 데이터 반환
    });
});
app.post('/add', (req, res) => {
    const { content, nickname } = req.body; 

    // SQL 쿼리 작성
    const query = 'INSERT INTO wordlist (content, nickname) VALUES (?, ?)';

    connection.query(query, [content, nickname], (err, results) => {
        if (err) {
            console.error('데이터 추가 실패:', err);
            return res.status(500).json({ error: '데이터 추가에 실패했습니다.' }); // 오류 발생 시 500 응답
        }
        // 성공적으로 데이터가 추가되면 결과를 반환
        res.status(201).json({ message: '데이터가 성공적으로 추가되었습니다.', id: results.insertId }); // 201 Created 응답
    });
    return;
});




// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
