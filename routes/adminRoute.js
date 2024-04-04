const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const { dbConfig } = require('./../config');
const { AccessAdmin } = require('./../middlewares/TokenValidate')

const ProductService = require('./../services/productService');

// ========================================================================================== //
/* 
    제품 추가하기
    - { productName : name } 형태로 요청
*/
router.put('/', AccessAdmin, async (req, res) => {
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

/* 
    제품 삭제하기
    - { productId : id } 형태로 요청
*/
router.delete('/', AccessAdmin, async (req, res) => {
    const { productId } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try
    {
        return res.json(await ProductService.DeleteProduct(connection, productId));
    }catch {

    } finally {
        await connection.end();
    }
});
// ========================================================================================== //


/* 
    제품 정책 추가하기
    - { productId : id, policyName : "" } 형태로 요청
*/
router.put('/policy', AccessAdmin, async (req, res) => {
    const { productId, policyName } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const items = await PolicyService.AddPolicyByProductId(connection, policyName, productId)
    await connection.end();
    
    return res.json(items);

});

// ========================================================================================== //

/* 
    사용자 정책 추가하기
    - { userId : id, productId : id, policyId : id, policyValue : value } 형태로 요청
*/
router.put('/policy', AccessAdmin, async (req, res) => {
    const { userId, productId, policyName, policyValue } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const policyId = await PolicyService.FindProductPolicyId(connection, policyName, productId);
    if (ErrorCodes.SUCCESS == policyId.code) {
        const policyId = policyId.data[0].id;
        return res.json(await PolicyService.AddPolicyByProductAndUser(connection, policyValue, policyId, productId, userId));
    }

    await connection.end();
    return res.json(policyId);

});


/* 
    사용자 정책 수정하기
    - { userId : id, productId : id, policyId : id, policyValue : value } 형태로 요청
*/
router.patch('/policy', AccessAdmin, async (req, res) => {
    const { userId, productId, policyName, policyValue } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {

        const policyId = await PolicyService.FindProductPolicyId(connection, policyName, productId);
        if (ErrorCodes.SUCCESS == policyId.code) {
            const policyId = policyId.data[0].id;
            return res.json(await PolicyService.UpdatePolicyByProductAndUser(connection, policyValue, policyId, productId, userId));
        }
        return res.json(policyId);

    } catch (error) {

    } finally {
        await connection.end();
    }

});

// 사용자 정책 삭제하기
router.delete('/policy', AccessAdmin, async (req, res) => {
    return res.status(404).send("404 Not Found");

});


module.exports = router;