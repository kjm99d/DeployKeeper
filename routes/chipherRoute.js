// cipherRoute.js
const express = require('express');
const router = express.Router();

const { ServerKey } = require('./../config');
const ErrorCodes = require('../errorCodes');

router.get('/', async (req, res) => {
    var code = ErrorCodes.SUCCESS;

    if (!ServerKey) {
        code = ErrorCodes.SERVER_KEY_NOT_FOUND;
        return res.json({ code })
    }

    return res.json({ code, data: ServerKey });
});

module.exports = router;