// productService.js
const mysql = require('mysql2/promise');
const ErrorCodes = require('../errorCodes');

const FindProduct = async (connection, productName) => {
    const query = 'SELECT id FROM products WHERE name = ?';
    const [rows] = await connection.execute(query, [productName]);
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.PRODUCT_NOT_FOUND
        }
    }

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

const AddProduct = async (connection, productName) => {
    const query = 'SELECT * from products WHERE name = ?'
    const [rows] = await connection.execute(query, [productName]);
    if (rows.length > 0)
    {
        return {
            "code" : ErrorCodes.PRODUCT_ALREADY_EXISTS
        }
    }

    const query1 = 'INSERT INTO products (name) VALUES (?);';
    const [result1] = await connection.execute(query1, [productName]);
    if (result1.affectedRows <= 0) // 데이터 추가 실패
    {
        return {
            "code" : ErrorCodes.PRODUCT_ADD_FAILED
        }
    }

    return {
        "code" : ErrorCodes.SUCCESS
    }
}

const DeleteProduct = async (connection, productName) => {
    const query = 'DELETE FROM products WHERE name = ?';
    const [result] = await connection.execute(query, [productName]);
    if (result.affectedRows > 0) {
        return {
            "code": ErrorCodes.SUCCESS
        };
    } else {
        return {
            "code": ErrorCodes.PRODUCT_NOT_FOUND
        };
    }
};

module.exports = {
    FindProduct,
    AddProduct,
    DeleteProduct
};
