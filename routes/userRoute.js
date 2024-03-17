const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const { dbConfig } = require('./../config');
const ProductService = require('./../services/productService');
const UserService = require('./../services/userService');
const { secretKey } = require('./../serectKey');
const ErrorCodes = require('../errorCodes');

router.post('/login', async (req, res) => {
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
        if (!userId) {
            code = ErrorCodes.USER_NOT_FOUND;
            return res.json({ code });
        }

        const expiredDate = await UserService.FindUserProductExpiredDate(connection, userId, productId);
        if (!expiredDate) {
            code = ErrorCodes.USER_PRODUCT_EXPIRED;
            return res.json({ code });
        }


        // 성공
        const currentDate = new Date();
        const expirationDate = new Date(expiredDate);
        const diffMilisec = expirationDate - currentDate;

        if (diffMilisec > 0) {
            // Create Access Token
            const token = jwt.sign({ userId, productId }, secretKey, { expiresIn: '24h' });
            return res.json({ code, token });
        }

    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send("Database connection failed");
    } finally {
        await connection.end();
    }
});

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

module.exports = router;
