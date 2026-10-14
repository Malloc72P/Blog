-- 3NF 구조에서 세 가지 이상현상이 사라졌는지 확인한다.
SET search_path = nf3;

\echo '== 갱신: 상품명 변경은 UPDATE 한 행'
BEGIN;
UPDATE products SET product_name = '기계식 키보드' WHERE product_code = 'P100';

SELECT o.order_no, i.product_code, p.product_name
FROM orders o
JOIN order_items i ON i.order_no = o.order_no
JOIN products p ON p.product_code = i.product_code
WHERE i.product_code = 'P100'
ORDER BY o.order_no;
ROLLBACK;

\echo '== 삽입: 주문이 없는 상품도 등록할 수 있다'
BEGIN;
INSERT INTO products VALUES ('P500', '웹캠');
SELECT * FROM products ORDER BY product_code;
ROLLBACK;

\echo '== 삭제: 주문상품 행을 지워도 상품 정보는 남는다'
BEGIN;
DELETE FROM order_items WHERE order_no = 1003 AND product_code = 'P400';
SELECT * FROM products WHERE product_code = 'P400';
ROLLBACK;

\echo '== 무결성: 없는 상품코드로 주문상품을 넣으면 FK가 막는다'
INSERT INTO order_items VALUES (1001, 'P999', 1);

\echo '== 무결성: 주문상품이 참조하는 상품은 지울 수 없다'
DELETE FROM products WHERE product_code = 'P100';
