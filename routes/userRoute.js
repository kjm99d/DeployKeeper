const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const { dbConfig, SecretKey_JWT } = require('./../config');
const ProductService = require('./../services/productService');
const UserService = require('./../services/userService');
const PolicyService = require('./../services/policyService');
const LogService = require('./../services/logService');
const ErrorCodes = require('../errorCodes');

// 로그인
router.post('/login', async (req, res) => {
    var code = ErrorCodes.SUCCESS;
    const { product, username, passwd } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        // 사용자 ID 조회
        const userId = await UserService.FindUserId(connection, username, passwd);
        if (ErrorCodes.SUCCESS != userId.code) {
            return res.json(userId);
        }

        const m_userId = userId.data[0].id;
        const m_userRole = userId.data[0].isAdmin;

        // 관리자 토큰 발급
        if (1 == m_userRole)
        {
            const token = jwt.sign({ "user" : m_userId, "isAdmin" : m_userRole }, SecretKey_JWT, { expiresIn: '24h' });
            return res.json({ code, "data" : [token] });
        }


        // 제품 유효성 검사
        const productInfo = await ProductService.FindProduct(connection, product);
        if (ErrorCodes.SUCCESS != productInfo.code) {
            return res.json(productInfo);
        }

        const productId = productInfo.data[0].id;

        // 사용자의 제품 만료기간 조회
        const userProduct = await UserService.FindUserProduct(connection, m_userId, productId);
        if (ErrorCodes.SUCCESS != userProduct.code) {
            return res.json(userProduct);
        }

        if (undefined == userProduct.data[0].start_date || undefined == userProduct.data[0].end_date) {
            return res.json({ "code" : ErrorCodes.USER_NOT_USE_TIME});
        }

        const m_userEndDate = userProduct.data[0].end_date;
        
        // JWT Token 발급 시 필요한 Secret Key 정보 획득
        if (!SecretKey_JWT)
        {
            code = ErrorCodes.TOKEN_SECRET_KEY_NOT_FOUND;
            return res.json({ code });
        }

        // 만료기간 계산
        const currentDate = new Date();
        const expirationDate = new Date(m_userEndDate);
        const diffMilisec = expirationDate - currentDate;

        // 제품이 만료됨
        if (diffMilisec <= 0) 
        {
            code = ErrorCodes.USER_PRODUCT_EXPIRED
            return res.json({ code });
        }

        // 일반 사용자 토큰 발급
        const token = jwt.sign({ "user" : m_userId, "product" : productId, "isAdmin" : m_userRole }, SecretKey_JWT, { expiresIn: '24h' });
        return res.json({ code, "data" : [token] });

    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send("Database connection failed");
    } finally {
        await connection.end();
    }
});

// 회원가입
router.post('/register', async (req, res) => {
    var code = ErrorCodes.SUCCESS;
    const { product, username, passwd } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {

        // 제품 유효성 검사
        const productInfo = await ProductService.FindProduct(connection, product);
        if (ErrorCodes.SUCCESS != productInfo.code) {
            return res.json(productInfo);
        }

        const productId = productInfo.data[0].id;

        // 사용자 ID 조회
        const userId = await UserService.FindUserId(connection, username, passwd);
        if (ErrorCodes.USER_NOT_FOUND == userId.code) {
            // 사용자 ID가 없으면 사용자를 제품에 추가한다.
            code = await UserService.AddUser(connection, username, passwd, productId);
            if (ErrorCodes.SUCCESS != code) {
                return res.json({ code });
            }

        } else {
            const userProduct = await UserService.FindUserProduct(connection, userId.data[0].id, productId);
            if (ErrorCodes.USER_NOT_FOUND == userProduct.code) {
                return res.json(await UserService.AddUserToUserProduct(connection, userId.data[0].id, productId));
            }
        }

        return res.json({ code });


    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send("Database connection failed");
    } finally {
        await connection.end();
    }
});

// 사용자 정책 가져오기
router.get('/policy/all', async (req, res) => {
    // const { userId, productId } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const tokens = req.headers['authorization'];
    const token = tokens.split(' ')[1]; // 'Bearer TOKEN' 형식을 가정
    const JWT = await jwt.verify(token, SecretKey_JWT);

    const productId = JWT.product;
    const userId = JWT.user;


    try {
        // 특정 사용자 모든 정책 조회
        const policy = await PolicyService.FindAllUserProductPolicy(connection, productId, userId);
        return res.json(policy);

    } catch (e) {

    }
    finally {
        await connection.end();
    }
});

router.put('/log', async (req, res) => {
    const { productId, msg } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const data = await LogService.AddLog(connection, productId, msg);
        return res.json(data);

    } catch (e) {

    }
    finally {
        await connection.end();
    }
});


router.get('/log', async (req, res) => {
    const { productId } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const data = await LogService.GetLogByProduct(connection, productId, 100);
        return res.json(data);

    } catch (e) {

    }
    finally {
        await connection.end();
    }
});

module.exports = router;
