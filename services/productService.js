// productService.js
const mysql = require('mysql2/promise');

const FindProductID = async (connection, productName) => {
    const query = 'SELECT id FROM products WHERE name = ?';
    const [rows] = await connection.execute(query, [productName]);
    return rows.length > 0 ? rows[0].id : null;
}

module.exports = {
    FindProductID
};
