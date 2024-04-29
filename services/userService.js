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

const FindAll = async (connection) => {
    const query = 'SELECT * FROM user_product';
    const [rows] = await connection.execute(query);

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

const FindAllEx = async (connection) => {
    const query = 'SELECT * FROM user_product up INNER JOIN users u ON up.user_id = u.id WHERE isAdmin = 0';
    const [rows] = await connection.execute(query);

    return {
        "code" : ErrorCodes.SUCCESS,
        "data" : rows
    }
}

const AddUserToUserProduct = async (connection, userId, productId) => {
    const query2 = 'INSERT INTO user_product (user_id, product_id) VALUES (?, ?);'
    const [result2] = await connection.execute(query2, [userId, productId]);

    if (result2.affectedRows > 0) {
        return ErrorCodes.SUCCESS;
    }
}

const AddUser = async (connection, username, passwd, productId) => {
    const query1 = 'INSERT INTO users (username, passwd) VALUES (?, ?);';
    const [result1] = await connection.execute(query1, [username, passwd]);
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

const FindUserId = async (connection, username, passwd) =>
{
    const query = 'SELECT * FROM users WHERE username = ? and passwd = ?';
    const [rows] = await connection.execute(query, [username, passwd]);
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

const UpdateUserExpirationDate = async (connection, productId, userId, data, alias) => {
    const query = 'UPDATE user_product SET start_date = ?, end_date = ?, alias = ? WHERE user_id = ? and product_id = ?';
    const [result] = await connection.execute(query, [...data, alias, userId, productId]);
    if (result.affectedRows > 0) {
        return {
            "code": ErrorCodes.SUCCESS
        };
    } else {
        return {
            "code": ErrorCodes.PRODUCT_NOT_FOUND
        };
    }
}

const GetUserExpirationDate = async (connection, productId, userId) => {
    const query = 'SELECT * FROM user_product WHERE user_id = ? and product_id = ?';
    const [rows] = await connection.execute(query, [userId, productId]);
    if (rows.length <= 0) {
        return {
            "code": ErrorCodes.USER_NOT_FOUND
        };
    } 
    
    return {
        "code": ErrorCodes.SUCCESS,
        "data": rows
    };

}

module.exports = {
    FindUserId,
    FindAll, FindAllEx,
    FindUserProduct,
    AddUser,
    AddUserToUserProduct,
    GetUserExpirationDate,
    UpdateUserExpirationDate,
};
