-- 분할한 테이블을 JOIN 해서 원본(order_flat)과 같은 결과가 나오는지 확인한다.
-- EXCEPT 는 집합 비교라서 중복 행을 구분하지 못한다. 그래서 양방향 EXCEPT 와 함께 행 수도 비교한다.

\echo '== nf2 JOIN 복원'
CREATE TEMP VIEW restored_nf2 AS
SELECT o.order_no, o.customer_id, o.customer_name, o.customer_phone,
       i.product_code, p.product_name, i.quantity
FROM nf2.orders o
JOIN nf2.order_items i ON i.order_no = o.order_no
JOIN nf2.products p ON p.product_code = i.product_code;

SELECT 'flat에만 있음' AS side, count(*) FROM (SELECT * FROM order_flat EXCEPT SELECT * FROM restored_nf2) d
UNION ALL
SELECT 'nf2에만 있음', count(*) FROM (SELECT * FROM restored_nf2 EXCEPT SELECT * FROM order_flat) d
UNION ALL
SELECT 'flat 행 수', count(*) FROM order_flat
UNION ALL
SELECT 'nf2 복원 행 수', count(*) FROM restored_nf2;

\echo '== nf3 JOIN 복원'
CREATE TEMP VIEW restored_nf3 AS
SELECT o.order_no, c.customer_id, c.customer_name, c.customer_phone,
       i.product_code, p.product_name, i.quantity
FROM nf3.orders o
JOIN nf3.customers c ON c.customer_id = o.customer_id
JOIN nf3.order_items i ON i.order_no = o.order_no
JOIN nf3.products p ON p.product_code = i.product_code;

SELECT 'flat에만 있음' AS side, count(*) FROM (SELECT * FROM order_flat EXCEPT SELECT * FROM restored_nf3) d
UNION ALL
SELECT 'nf3에만 있음', count(*) FROM (SELECT * FROM restored_nf3 EXCEPT SELECT * FROM order_flat) d
UNION ALL
SELECT 'flat 행 수', count(*) FROM order_flat
UNION ALL
SELECT 'nf3 복원 행 수', count(*) FROM restored_nf3;
