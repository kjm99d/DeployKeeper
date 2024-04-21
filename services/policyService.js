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
const AddPolicyByProductAndUser = async (connection, policyValue, policyId, productId, userId) => {
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
    const [result] = await connection.execute(update, [policyValue, policyId, productId, userId]);
    
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

// 특정 사용자의 정책을 삭제시킨다.
const DeleteUserPolicyFromProductIdAndUserId = async (connection, productId, userId) => {
    const query = 'DELETE FROM user_policies WHERE product_id = ? and user_id = ?';
    const [result] = await connection.execute(query, [productId, userId]);
    // result === unused 

    // `affectedRows`를 사용하여 실제로 삭제된 행의 수를 확인
    /*
    // 일단 제품정책 테이블에는 정책이 있을지언정, 사용자는 최초 1회는 없을수도 있음.
    // 그러므로 여기서 정상삭제 여부를 확인하는건 아무의미가 없음. 
    if (result.affectedRows === 0) {
        // 삭제할 데이터가 없는 경우
        return {
            "code": ErrorCodes.USER_NOT_FOUND,
        };
    }
    */

    return {
        "code": ErrorCodes.SUCCESS,
        "data": []
    };
}

// 특정 사용자의 정책을 모두 가져온다.
const FindAllUserProductPolicy = async (connection, productId, userId) => {
    const query = `
        SELECT pp.id as policy_id, pp.policy_name, up.policy_value
        FROM 
            (SELECT * FROM product_policies WHERE product_id = ?) AS pp
        LEFT JOIN 
            (SELECT * FROM user_policies WHERE user_id = ?) AS up
        ON 
            up.policy_id = pp.id;
    `;
    const [rows] = await connection.execute(query, [productId, userId]);

    // 정책이 비어있을 경우
    if (rows.length <= 0) {
        return {
            "code": ErrorCodes.POLICY_NOT_FOUND,
        }
    }

    // 정책이 유효한 경우
    return {
        "code": ErrorCodes.SUCCESS,
        "data": rows
    }
}

// 제품정책추가
const AddPolicyByProductId = async (connection, policyName, productId) => {

    // 정책을 추가한다.
    const query = 'INSERT INTO product_policies (product_id, policy_name) VALUES (?, ?);';
    const [result1] = await connection.execute(query, [username, password]);
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
    FindAllUserProductPolicy,
    DeleteUserPolicyFromProductIdAndUserId,
    AddPolicyByProductId,
    AddPolicyByProductAndUser,
    UpdatePolicyByProductAndUser,
};
