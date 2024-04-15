// productService.js
const ErrorCodes = require('../errorCodes');

const FindProduct = async (connection, productName) => {
    const query = 'SELECT id FROM products WHERE product_name = ?';
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

const FindAllProduct = async (connection) => {
    const query = 'SELECT * FROM products';
    const [rows] = await connection.execute(query);

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

const AddProduct = async (connection, productName) => {
    const query = 'SELECT * from products WHERE product_name = ?'
    const [rows] = await connection.execute(query, [productName]);
    if (rows.length > 0)
    {
        return {
            "code" : ErrorCodes.PRODUCT_ALREADY_EXISTS
        }
    }

    const query1 = 'INSERT INTO products (product_name) VALUES (?);';
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

const DeleteProduct = async (connection, productId) => {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await connection.execute(query, [productId]);
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
    FindAllProduct,
    AddProduct,
    DeleteProduct
};
