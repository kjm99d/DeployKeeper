require('dotenv').config();

// MySQL 데이터베이스 연결 설정
const dbConfig = {
    host: process.env.DB_HOST,  // 데이터베이스 호스트 주소
    user: process.env.DB_USER,  // 데이터베이스 사용자 이름
    password: process.env.DB_PASSWORD,  // 데이터베이스 비밀번호
    database: process.env.DB_NAME       // 연결할 데이터베이스 이름
};

const ServerKey = process.env.SERVER_KEY;       // 서버에 저장된 암호화키 ( ETC )
const SecretKey_JWT = process.env.SECRET_KEY;   // JWT 토큰 Secret Key


module.exports = {
    dbConfig,
    ServerKey,
    SecretKey_JWT
}