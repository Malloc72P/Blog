-- 정규화 전 테이블: 주문 한 행에 고객, 주문, 상품 정보가 모두 들어 있다.
SET client_min_messages = warning;
DROP SCHEMA IF EXISTS nf2 CASCADE;
DROP SCHEMA IF EXISTS nf3 CASCADE;
DROP TABLE IF EXISTS order_flat;

CREATE TABLE order_flat (
  order_no       int  NOT NULL,
  customer_id    text NOT NULL,
  customer_name  text NOT NULL,
  customer_phone text NOT NULL,
  product_code   text NOT NULL,
  product_name   text NOT NULL,
  quantity       int  NOT NULL,
  PRIMARY KEY (order_no, product_code)
);

INSERT INTO order_flat VALUES
  (1001, 'C001', '김민수', '010-1111-2222', 'P100', '키보드',   1),
  (1001, 'C001', '김민수', '010-1111-2222', 'P200', '마우스',   2),
  (1002, 'C002', '이영희', '010-3333-4444', 'P100', '키보드',   2),
  (1002, 'C002', '이영희', '010-3333-4444', 'P300', '모니터',   1),
  (1003, 'C001', '김민수', '010-1111-2222', 'P200', '마우스',   1),
  (1003, 'C001', '김민수', '010-1111-2222', 'P300', '모니터',   1),
  (1003, 'C001', '김민수', '010-1111-2222', 'P400', 'USB 허브', 3),
  (1004, 'C003', '박지훈', '010-5555-6666', 'P100', '키보드',   1);

SELECT * FROM order_flat ORDER BY order_no, product_code;
