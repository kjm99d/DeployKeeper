require('dotenv').config();

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL 데이터베이스 연결 설정
const dbConfig = {
    host: process.env.DB_HOST,  // 데이터베이스 호스트 주소
    user: process.env.DB_USER,  // 데이터베이스 사용자 이름
    password: process.env.DB_PASSWORD,  // 데이터베이스 비밀번호
    database: process.env.DB_NAME       // 연결할 데이터베이스 이름
};

// 정책 가져오기
router.get('/policy', async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users2 WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            res.send("Login successful");
        } else {
            res.send("Login failed");
        }
        await connection.end();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send("Database connection failed");
    }
});

// 정책 추가하기
router.put('/policy', async (req, res) => {
    const { product, policyName, policyValue} = req.body;

});

// 정책 업데이트
router.patch('/policy', async (req, res) => {
    const { product, policyName, policyValue} = req.body;

});

// 정책 삭제하기
router.delete('/policy', async (req, res) => {
    const { product, policyName, policyValue} = req.body;

});

module.exports = router;
