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

// 제품 추가하기
router.put('/product', (req, res) => {
    res.status(200).send("hello, world");
});

// 제품 삭제하기
router.delete('/product', (req, res) => {
    res.status(200).send("hello, world");
});

module.exports = router;
