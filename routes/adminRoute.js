const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const { dbConfig } = require('./../config');
const { AccessAdmin } = require('./../middlewares/TokenValidate')

const ProductService = require('./../services/productService');
const PolicyService = require('./../services/policyService');
const UserService = require('./../services/userService');
const ErrorCodes = require('../errorCodes');

// ========================================================================================== //
/*
    모든 사용자 조회하기
    - {}
*/
router.get("/users", AccessAdmin, async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    
    try
    {
        return res.json(await UserService.FindAllEx(connection));
    }catch {

    } finally {
        await connection.end();
    }
});


// ========================================================================================== //
/* 
    제품 추가하기
    - { productName : name } 형태로 요청
*/
router.put('/product', AccessAdmin, async (req, res) => {
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
router.delete('/product', AccessAdmin, async (req, res) => {
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


// 모든 제품 가져오기
router.get('/product/all', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    
    try
    {
        return res.json(await ProductService.FindAllProduct(connection));
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
router.put('/product/policy', AccessAdmin, async (req, res) => {
    const { productId, policyName } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const items = await PolicyService.AddPolicyByProductId(connection, policyName, productId)
    await connection.end();
    
    return res.json(items);

});

/* 
    제품 정책 삭제하기
    - 요청 파라미터에 ID값 전달
*/
router.delete('/product/policy/:productId/:policyId', AccessAdmin, async (req, res) => {
    const { productId, policyId } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const items = await PolicyService.DeletePolicyByProductIdAndPolicyId(connection, policyId, productId)
    await connection.end();
    
    return res.json(items);

});

// 제품의 모든 정책 가져오기 
router.get('/product/policy/:productId', async (req, res) => {
    const { productId } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const result = await PolicyService.FindAllProductPolicy(connection, productId);
    await connection.end();

    return res.json(result);
});

// ========================================================================================== //


/* 
    사용자 정책 갱신하기 ( 삭제 → 추가 )

    - { 
        userId : id, 
        productId : id,
        data : [ { policyId : id, policyValue : value }, 
                    ... , 
                    {...}
                    { 정책 정보 SET } 
                ] 
        } 
        
        형태로 요청
*/
router.patch('/user/policy', AccessAdmin, async (req, res) => {
    const { userId, productId, data } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    // 특정 사용자 모든 정책 삭제
    await PolicyService.DeleteUserPolicyFromProductIdAndUserId(connection, productId, userId);

    // 정책 다시 추가 ㅎㅅㅎ
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const policyId = element["policy_id"];
        const policyValue = element["policy_value"];
        await PolicyService.AddPolicyByProductAndUser(connection, policyValue, policyId, productId, userId);    
    }
    
    await connection.end();

    return res.json({"code" : ErrorCodes.SUCCESS});
});


/* 
    사용자 정책 갱신하기

    - { 
        userId : id, 
        productId : id
      }
        
        형태로 요청
*/
router.post('/user/policy', AccessAdmin, async (req, res) => {
    const { userId, productId } = req.body;
    const connection = await mysql.createConnection(dbConfig);

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

module.exports = router;