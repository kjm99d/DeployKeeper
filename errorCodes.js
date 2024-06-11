// errorCodes.js
const ErrorCodes = {
    SUCCESS : 0, // <<! 성공
    
    // 로그인 관련 에러 100~
    USER_NOT_FOUND : 100,       // <<! 사용자를 찾을 수 없음 
    USER_ALREADY_EXISTS : 101,  // <<! 이미 존재하는 유저임.
    USER_PRODUCT_EXPIRED : 102, // <<! 사용자의 제품 사용기간이 만료됨
    USER_NOT_USE_TIME : 103,    // <<! 사용자의 제품 사용기간이 만료됨
    USER_NOT_ADMIN : 104,        // <<! 관리자가 아님

    // 회원가입 과련 에러 200~
    REGISTER_FAILED : 200,      // <<! 회원가입 오류

    // 제품 관련 에러 300~
    PRODUCT_NOT_FOUND : 300,        // <<! 제품을 찾을 수 없음
    PRODUCT_ALREADY_EXISTS : 301,   // <<! 제품이 이미 존재함
    PRODUCT_ADD_FAILED : 301,   // <<! 제품 추가 실패

    // 토큰 관련에러 400~
    TOKEN_EXPIRED : 400,                // <<! 토큰이 만료됨
    TOKEN_SECRET_KEY_NOT_FOUND : 401,   // <<! 토큰 시크립키를 찾을 수 없음
    TOKEN_INVALID : 402,                // <<! 토큰이 유효하지 않음

    // 서버키 관련에러 500~
    SERVER_KEY_NOT_FOUND : 500, // <<! 서버키를 찾을 수 없음

    // 정책 관련 에러 600~
    POLICY_NOT_FOUND : 600,         // <<! 정책을 찾을 수 없음
    POLICY_ALREADY_EXISTS : 601,    // <<! 이미 동일한 정책이 존재함
    POLICY_ADD_FAILED : 602,        // <<! 정책 추가 오류
    

    // 로그 관련 에러 700~
    LOG_ADD_FAILED : 700
};

module.exports = ErrorCodes;
