// productService.js
const mysql = require('mysql2/promise');
const ErrorCodes = require('../errorCodes');


// 특정 제품의 모든 정책 조회
const FindAllProductPolicy = async (connection, productId) => {
    const query = 'SELECT * FROM product_policies WHERE product_id = ?';
    const [rows] = await connection.execute(query, [productId]);
    
    // 정책이 비어있을 경우
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_NOT_FOUND,
        }
    }

    // 정책이 유효한 경우
    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

// 사용자 정책 조회
const FindPolicyByProductAndUser = async (connection, policyId, productId, userId ) => {
    const query = 'SELECT * FROM user_policies WHERE policy_Id = ? and product_id = ? and user_Id = ?';
    const [rows] = await connection.execute(query, [policyId, productId, userId]);
    
    // 정책이 비어있을 경우
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_NOT_FOUND,
        }
    }

    // 정책이 유효한 경우
    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

// 사용자 정책 추가
const AddPolicyByProductAndUser = async (connection, policyValue, policyId, productId, userId ) => {
    const query = 'INSERT INTO user_policies (user_id, product_id, policy_id, policy_value) VALUES (?, ?, ?, ?);';
    const [result1] = await connection.execute(query, [userId, productId, policyId, policyValue]);
    
    // 정책이 비어있을 경우
    if (result1.affectedRows <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_ADD_FAILED,
        }
    }

    return {
        "code" : ErrorCodes.SUCCESS,
    }
};

// 사용자 정책 수정
const UpdatePolicyByProductAndUser = async (connection, policyValue, policyId, productId, userId ) => {
    const query = 'SELECT * FROM user_policies WHERE policy_Id = ? and product_id = ? and user_Id = ?';
    const [rows] = await connection.execute(query, [policyId, productId, userId]);
    
    // 정책이 비어있을 경우
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_NOT_FOUND,
        }
    }

    const update = 'UPDATE user_policies SET policy_value = ? WHERE policy_Id = ? and product_id = ? and user_Id = ?';
    const [result] = await connection.execute(query, [policyValue, policyId, productId, userId]);
    
    return {
        "code" : ErrorCodes.SUCCESS,
    }
}

const FindProductPolicyId = async (connection, policyName, productId) => {
    const query = 'SELECT * FROM product_policies WHERE product_id = ? and policy_name = ?';
    const [rows] = await connection.execute(query, [productId, policyName]);
    
    // 정책이 비어있을 경우
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_NOT_FOUND,
        }
    }

    // 정책이 유효한 경우
    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

// 제품정책추가
const AddPolicyByProductId = async (connection, policyName, productId) => {
    // 정책이 이미 존재하는지 확인한다.
    const querySelect = 'SELECT * FROM user_policies WHERE policy_name = ? and policy_Id = ?';
    const [rows] = await connection.execute(querySelect, [policyName, productId]);
    if (rows.length > 0)
    {
        return {
            "code" : ErrorCodes.POLICY_ALREADY_EXISTS
        }
    }

    // 정책을 추가한다.
    const query1 = 'INSERT INTO product_policies (product_id, policy_name) VALUES (?, ?);';
    const [result1] = await connection.execute(query1, [username, password]);
    if (result1.affectedRows <= 0)
    {
        return {
            "code" : ErrorCodes.POLICY_ADD_FAILED
        }
    }
    
    return {
        "code" : ErrorCodes.SUCCESS
    }
}

module.exports = {
    FindAllProductPolicy,
    FindProductPolicyId,
    FindPolicyByProductAndUser,
    AddPolicyByProductId,
    UpdatePolicyByProductAndUser,
};
