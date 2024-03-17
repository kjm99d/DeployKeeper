# DeployKeeper
이 프로젝트는 SaaS 기반 클라우드 서버 플랫폼입니다.   
이 프로젝트는 소프트웨어 형상관리 및 사용자 정책을 관리합니다.   

## Support Rest API
| Description | Role | Route | Request Method | Request Payload | Response Body |
|-------|-------|-------|-------|-------|-------|
| ✅ 로그인 | All | /api/user/login | Post | {product : '', username : '', password : ''} | ... |
| ✅ 회원가입 | User | /api/user/register | Post | {product : '', username : '', password : ''} | ... |
| ❌ 정책 가져오기 | All | /api/policy | Get | ... | ... |
| ❌ 정책 추가하기 | Admin | /api/policy | Put | ... | ... |
| ❌ 정책 수정하기 | Admin | /api/policy | Patch | ... | ... |
| ❌ 정책 삭제하기 | Admin | /api/policy | Delete | ... | ... |
| ❌ 제품 추가하기 | Admin | /api/product | Put | ... | ... |
| ❌ 제품 삭제하기 | Admin | /api/product | Delete | ... | ... |
| ❌ 형상정보 가져오기 | All | /api/... | Get | ... | ... |
| ✅ 서버키 가져오기 | All | /api/chpher/ | Get | ... | ... |

## Error Code
|오류코드|상수명|설명|
|------|---|---|
|0|SUCCESS|오류없이 성공|
|100|USER_NOT_FOUND|사용자를 찾을 수 없음|
|101|USER_ALREADY_EXISTS|이미 존재하는 사용자|
|102|USER_PRODUCT_EXPIRED|제품사용 기간 만료|
|200|REGISTER_FAILED|회원가입 실패|
|300|PRODUCT_NOT_FOUND|지원하는 제품이 없음|
|400|TOKEN_EXPIRED|토큰 사용기간 만료|