// userService.js

const ErrorCodes = require("../errorCodes");

const FindUserProduct = async (connection, userId, productId) => {
    const query = 'SELECT * FROM user_product WHERE user_id = ? and product_id = ?';
    const [rows] = await connection.execute(query, [userId, productId]);
    
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.USER_NOT_FOUND
        }
    }

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

const AddUser = async (connection, username, password, productId) => {
    const query1 = 'INSERT INTO users (username, pwd) VALUES (?, ?);';
    const [result1] = await connection.execute(query1, [username, password]);
    if (result1.affectedRows > 0)
    {
        const query2 = 'INSERT INTO user_product (user_id, product_id) VALUES (?, ?);'
        const [result2] = await connection.execute(query2, [result1.insertId, productId]);

        if (result2.affectedRows > 0)
        {
            return ErrorCodes.SUCCESS;
        }
    }
    
    return ErrorCodes.REGISTER_FAILED;
};

const FindUserId = async (connection, username, password) =>
{
    const query = 'SELECT * FROM users WHERE username = ? and pwd = ?';
    const [rows] = await connection.execute(query, [username, password]);
    if (rows.length <= 0)
    {
        return {
            "code" : ErrorCodes.USER_NOT_FOUND
        }
    }

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

module.exports = {
    FindUserId,
    FindUserProduct,
    AddUser,
};
