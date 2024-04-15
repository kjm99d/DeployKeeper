const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const ProductService = require('./../services/productService');
const PolicyService = require('./../services/policyService');
const {dbConfig} = require('./../config');



// 제품 정책 가져오기
router.get('/policy', async (req, res) => {
    const { policyName } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const ProductID = req.data.productId;
    const UserID = req.data.userId;
    const policyId = await PolicyService.FindProductPolicyId(connection, policyName, productId);
    if (ErrorCodes.SUCCESS == policyId.code) {
        const policyId = policyId.data[0].id;
        const policy = await PolicyService.FindPolicyByProductAndUser(connection, policyId, ProductID, UserID)
        
        await connection.end();
        return res.json(policy);
    }
    await connection.end();

    return res.json(policyId);

});



module.exports = router;
