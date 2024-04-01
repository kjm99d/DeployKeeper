-- 사용자 권한 관리 테이블
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 사용자 정보 저장 테이블 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    alias VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 제품 정보 저장될 테이블
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    encryption_key VARCHAR(255), -- 암복호화 키를 저장할 필드
    other TEXT
);

-- 제품 정책 테이블
CREATE TABLE IF NOT EXISTS product_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    policy_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- 사용자 정책 테이블
CREATE TABLE IF NOT EXISTS user_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    policy_id INT,
    policy_value LONGTEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (policy_id) REFERENCES product_policies(id)
);


-- 사용자와 제품을 묶은 연관 테이블
CREATE TABLE IF NOT EXISTS user_product (
    user_id INT,
    product_id INT,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('user');

INSERT INTO users (username, pwd, alias, role_id) VALUES ('adminUser', 'password123', 'Admin', 1);
INSERT INTO users (username, pwd, alias, role_id) VALUES ('normalUser', 'password456', 'User', 3);

INSERT INTO products (name, encryption_key) VALUES ('Product 1', 'encryption_key_1');
INSERT INTO products (name, encryption_key) VALUES ('Product 2', 'encryption_key_2');

INSERT INTO user_product (user_id, product_id, start_date, end_date) VALUES (1, 1, '2023-01-01', '2023-12-31');
INSERT INTO user_product (user_id, product_id, start_date, end_date) VALUES (2, 3, '2023-01-01', '2023-12-31');
