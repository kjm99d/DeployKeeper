// cipherRoute.js
const express = require('express');
const router = express.Router();

const { secretKey } = require('./../serectKey');
const ErrorCodes = require('../errorCodes');

router.post('/', async (req, res) => {
    var code = ErrorCodes.SUCCESS;

    const data = secretKey;

    return res.json({ code, data })
});