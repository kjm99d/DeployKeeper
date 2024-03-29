const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const { dbConfig, SecretKey_JWT } = require('./../config');
const ProductService = require('./../services/productService');
const UserService = require('./../services/userService');
const ErrorCodes = require('../errorCodes');

// 로그인
router.post('/login', async (req, res) => {
    var code = ErrorCodes.SUCCESS;
    const { product, username, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        // 제품 유효성 검사
        const productInfo = await ProductService.FindProduct(connection, product);
        if (ErrorCodes.SUCCESS != productInfo.code) {
            return res.json(productInfo);
        }

        const productId = productInfo.data[0].id;

        // 사용자 ID 조회
        const userId = await UserService.FindUserId(connection, username, password);
        if (ErrorCodes.SUCCESS != userId.code) {
            return res.json(userId);
        }

        const m_userId = userId.data[0].id;
        const m_userRole = userId.data[0].role_id;

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

        if (diffMilisec > 0) {
            // Access Token 발급
            const token = jwt.sign({ m_userId, productId, m_userRole }, SecretKey_JWT, { expiresIn: '24h' });
            return res.json({ code, token });
        }

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
    const { product, username, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {

        const productId = await ProductService.FindProductID(connection, product);
        if (!productId) {
            code = ErrorCodes.PRODUCT_NOT_FOUND;
            return res.json({ code });
        }

        const userId = await UserService.FindUserID(connection, username, password);
        if (userId) {
            code = ErrorCodes.USER_ALREADY_EXISTS;
            return res.json({ code });
        }

        code = await UserService.AddUser(connection, username, password, productId);
        if (ErrorCodes.SUCCESS != code)
        {
            return res.json({code});
        }

        return res.json({code});

        
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send("Database connection failed");
    } finally {
        await connection.end();
    }
});


// 사용자 정책 수정하기
router.patch('/policy', async (req, res) => {
    const { policyName, policyValue } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN' 형식을 가정
    try {
        const JWT = await jwt.verify(token, SecretKey_JWT);
        const ProductID = JWT.productId;
        const UserID = JWT.userId;
        const policyId = await PolicyService.FindProductPolicyId(connection, policyName, productId);
        if (ErrorCodes.SUCCESS == policyId.code)
        {
            const policyId = policyId.data[0].id;
            return res.json(await PolicyService.UpdatePolicyByProductAndUser(connection, policyValue, policyId, ProductID, UserID));
        }

        return res.json(policyId);

    } catch (error) {
        return res.json({ "code": ErrorCodes.TOKEN_INVALID });
    } finally {
        await connection.end();
    }
});

// 사용자 정책 삭제하기
router.delete('/policy', async (req, res) => {
    return res.status(404).send("404 Not Found");

});

module.exports = router;
