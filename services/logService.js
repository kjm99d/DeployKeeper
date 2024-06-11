//logService.js
const mysql = require('mysql2/promise');
const ErrorCodes = require('../errorCodes');

// 로그 추가
const AddLog = async (connection, productId, msg) => {
    const query = 'INSERT INTO log_product (product_id, msg) VALUES (?, ?)';
    const [result] = await connection.execute(query, [productId, msg]);

    // 삽입된 행의 수를 확인하여 성공 여부를 판단할 수 있습니다.
    if (result.affectedRows > 0) {
        return {
            "code" : ErrorCodes.SUCCESS,
            "data" : []
        };
    } else {
        return {
            "code" : ErrorCodes.LOG_ADD_FAILED,
            "data" : []
        };
    }
};

const GetLogByProduct = async (connection, productId, limit) => {
    try {
        const query = 'SELECT * FROM log_product WHERE product_id = ? ORDER BY log_time DESC LIMIT ?';
        const [rows] = await connection.execute(query, [productId, limit]);

        return {
            "code": ErrorCodes.SUCCESS,
            "data": rows
        };
    } catch (error) {
    }
};

module.exports = {
    AddLog,
    GetLogByProduct
};
