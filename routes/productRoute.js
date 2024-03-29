const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const ProductService = require('./../services/productService');
const {dbConfig} = require('./../config');

// 제품 추가하기
router.put('/', async (req, res) => {
    const { productName } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    try
    {
        return res.json(await ProductService.AddProduct(connection, productName));
    }catch {

    } finally {
        await connection.end();
    }

});

// 제품 삭제하기
router.delete('/', async (req, res) => {
    const { productName } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try
    {
        return res.json(await ProductService.DeleteProduct(connection, productName));
    }catch {

    } finally {
        await connection.end();
    }
});

// 제품의 모든 정책 가져오기 
router.get('/policy/all', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);

    // 토큰 검증 및 페이로드 분리
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN' 형식을 가정
    try {
        const JWT = await jwt.verify(token, SecretKey_JWT);
        const ProductID = JWT.productId;

        return res.json(await PolicyService.FindAllProductPolicy(connection, ProductID));

    } catch (error) {
        return res.json({ "code": ErrorCodes.TOKEN_INVALID });
    } finally {
        await connection.end();
    }
});

// 제품 정책 가져오기
router.get('/policy', async (req, res) => {
    const { policyName } = req.body;
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
            return res.json(await PolicyService.FindPolicyByProductAndUser(connection, policyId, ProductID, UserID));
        }

        return res.json(policyId);

    } catch (error) {
        return res.json({ "code": ErrorCodes.TOKEN_INVALID });
    } finally {
        await connection.end();
    }
});

// 제품 정책 추가하기
router.put('/policy', async (req, res) => {
    const { policyName } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN' 형식을 가정
    try {
        const JWT = await jwt.verify(token, SecretKey_JWT);
        

        const ProductID = JWT.productId;
        
        return res.json(await PolicyService.AddPolicyByProductId(connection, policyName, ProductID));

    } catch (error) {
        return res.json({ "code": ErrorCodes.TOKEN_INVALID });
    } finally {
        await connection.end();
    }

});

module.exports = router;
