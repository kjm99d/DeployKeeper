-- /**************************************************************************************************************** /
-- 사용자 정보 저장 테이블 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 		-- 사용자 고유 ID
    username VARCHAR(50) NOT NULL UNIQUE,	-- 사용자명
	passwd VARCHAR(255) NOT NULL,			-- 비밀번호
    isAdmin int NOT NULL					-- 권한 (관리자/일반 사용자)
);

-- 제품 정보 저장될 테이블
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,			-- 제품 고유 ID
    product_name VARCHAR(255) NOT NULL UNIQUE	-- 제품명
);

-- 제품 정책 테이블
CREATE TABLE IF NOT EXISTS product_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,			-- 정책 ID
    product_id INT,								-- 제품 ID 
    policy_name VARCHAR(255) NOT NULL,			-- 정책명
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- 사용자 정책 테이블
CREATE TABLE IF NOT EXISTS user_policies (	
    user_id INT,			-- 사용자 ID
    product_id INT,			-- 제품 ID
    policy_id INT,			-- 정책 ID
    policy_value LONGTEXT,	-- 정책값
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (policy_id) REFERENCES product_policies(id) ON DELETE CASCADE
);


-- 사용자와 제품을 묶은 연관 테이블
CREATE TABLE IF NOT EXISTS user_product (
    user_id INT,		-- 사용자 ID
    product_id INT,		-- 제품 ID
    alias VARCHAR(255), -- 별명
    start_date DATE,	-- 시작일
    end_date DATE,		-- 종료일
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS log_product (
	log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 로그시간
    product_id INT,		-- 제품 ID
    msg varchar(255),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- /**************************************************************************************************************** /
SELECT * FROM user_product up INNER JOIN users u ON up.user_id = u.id;
SELECT * FROM users;
SELECT * FROM user_policies;
SELECT * FROM product_policies;

SELECT * FROM product_policies WHERE product_id = '1';
SELECT * FROM user_policies WHERE user_id = 3;

SELECT pp.id as policy_id, pp.policy_name, up.policy_value
FROM 
	(SELECT * FROM product_policies WHERE product_id = 1) AS pp
LEFT JOIN 
	(SELECT * FROM user_policies WHERE user_id = 3) AS up
ON 
	up.policy_id = pp.id;


SELECT * FROM product_policies;
SELECT * FROM user_policies;
SELECT * FROM product_policies WHERE product_id = 1;
SELECT * FROM user_product up INNER JOIN users u ON up.user_id = u.id WHERE isAdmin = 0;



-- /**************************************************************************************************************** /
-- 사용자 추가 쿼리
INSERT INTO users (username, passwd, alias, isAdmin) VALUES ('adminUser', 'password123', 'Admin', 1);
INSERT INTO users (username, passwd, alias, isAdmin) VALUES ('normalUser', 'password456', 'User', 0);

-- 제품 추가 쿼리
INSERT INTO product_policies (product_id, policy_name) VALUES (1, "POLICY_MELON_GOTICKETTYPE");
INSERT INTO product_policies (product_id, policy_name) VALUES (2, "POLICY_MELON_GOTICKETTYPE");
INSERT INTO products (product_name) VALUES ('Product 2');

-- 제품 정책 추가 쿼리
INSERT INTO products (product_name) VALUES ('Product 1');

-- 사용자 및 제품 맵핑 데이터 쿼리
INSERT INTO user_product (user_id, product_id, start_date, end_date) VALUES (1, 1, '2023-01-01', '2023-12-31');
INSERT INTO user_product (user_id, product_id, start_date, end_date) VALUES (2, 1, '2023-01-01', '2023-12-31');
INSERT INTO user_product (user_id, product_id, start_date, end_date) VALUES (2, 2, '2023-01-01', '2023-12-31');

-- 사용자 정책 추가 쿼리
INSERT INTO user_policies (user_id, product_id, policy_id, policy_value) VALUES (1, 1, 1, "asd");
