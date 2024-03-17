// errorCodes.js
const ErrorCodes = {
    SUCCESS : 0,
    
    // 로그인 관련 에러 100~
    USER_NOT_FOUND : 100,
    USER_ALREADY_EXISTS : 101,
    USER_PRODUCT_EXPIRED : 102,

    // 회원가입 과련 에러 200~
    REGISTER_FAILED : 200,

    // 제품 관련 에러 300~
    PRODUCT_NOT_FOUND : 300,

    // 토큰 관련에러 400~
    TOKEN_EXPIRED : 400,
    
};

module.exports = ErrorCodes;
