const jwt = require('jsonwebtoken');
const { SecretKey_JWT } = require('./../config')

const AccessAdmin = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN' 형식을 가정
    const JWT = await jwt.verify(token, SecretKey_JWT);
    
    req.data = JWT;
    

    if (1 === JWT.isAdmin)
        next();
    else
        res.status(403).send("Access denied");
}

const AccessAll = async (req, res, next) => {
    next();
}

module.exports = {
    AccessAdmin,
    AccessAll,
}