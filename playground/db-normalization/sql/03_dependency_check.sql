-- 함수 종속 X → Y 를 데이터로 확인한다.
-- 같은 X 값에 서로 다른 Y 값이 둘 이상이면 X → Y 는 이 데이터에서 성립하지 않는다.
-- 결과가 0행이어도 종속이 증명되는 것은 아니다. 지금 들어 있는 행에서 깨지지 않았다는 뜻이다.

\echo '== product_code → product_name'
SELECT product_code FROM order_flat
GROUP BY product_code HAVING count(DISTINCT product_name) > 1;

\echo '== order_no → customer_id'
SELECT order_no FROM order_flat
GROUP BY order_no HAVING count(DISTINCT customer_id) > 1;

\echo '== customer_id → customer_name, customer_phone'
SELECT customer_id FROM order_flat
GROUP BY customer_id
HAVING count(DISTINCT customer_name) > 1 OR count(DISTINCT customer_phone) > 1;

\echo '== product_code → quantity (깨진 종속)'
SELECT product_code FROM order_flat
GROUP BY product_code HAVING count(DISTINCT quantity) > 1;

\echo '== customer_id → order_no (깨진 종속)'
SELECT customer_id FROM order_flat
GROUP BY customer_id HAVING count(DISTINCT order_no) > 1;

\echo '== 갱신 이상이 생긴 뒤의 product_code → product_name'
BEGIN;
UPDATE order_flat SET product_name = '기계식 키보드'
WHERE order_no = 1001 AND product_code = 'P100';
SELECT product_code FROM order_flat
GROUP BY product_code HAVING count(DISTINCT product_name) > 1;
ROLLBACK;
