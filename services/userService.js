// userService.js

const ErrorCodes = require("../errorCodes");

const FindUserID = async (connection, username, password) => {
    const query = 'SELECT id FROM users WHERE username = ? and pwd = ?';
    const [rows] = await connection.execute(query, [username, password]);
    return rows.length > 0 ? rows[0].id : null;
}

const FindUserProductExpiredDate = async (connection, userId, productId) => {
    const query = 'SELECT end_date FROM user_product WHERE user_id = ? and product_id = ?';
    const [rows] = await connection.execute(query, [userId, productId]);
    return rows.length > 0 ? rows[0].end_date : null;
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

module.exports = {
    FindUserID,
    FindUserProductExpiredDate,
    AddUser,
};
