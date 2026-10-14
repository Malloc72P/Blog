-- 이상현상 세 가지. 각 실험은 트랜잭션 안에서 실행하고 ROLLBACK 해서 데이터를 되돌린다.

-- 갱신 이상: 키보드(P100) 이름을 한 행에서만 고친다.
BEGIN;
UPDATE order_flat
SET product_name = '기계식 키보드'
WHERE order_no = 1001 AND product_code = 'P100';

SELECT order_no, product_code, product_name
FROM order_flat
WHERE product_code = 'P100'
ORDER BY order_no;

SELECT product_code, count(DISTINCT product_name) AS name_count
FROM order_flat
GROUP BY product_code
HAVING count(DISTINCT product_name) > 1;
ROLLBACK;

-- 삽입 이상: 주문이 없는 새 상품을 등록할 수 없다.
INSERT INTO order_flat (product_code, product_name)
VALUES ('P500', '웹캠');

-- 삭제 이상: 1003번 주문에서 USB 허브 행을 지우면 USB 허브 상품 정보가 함께 사라진다.
BEGIN;
SELECT product_code, product_name FROM order_flat WHERE product_code = 'P400';
DELETE FROM order_flat WHERE order_no = 1003 AND product_code = 'P400';
SELECT product_code, product_name FROM order_flat WHERE product_code = 'P400';
ROLLBACK;
