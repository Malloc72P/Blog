-- 단계별로 분할된 테이블의 내용을 확인한다.
\echo '== nf1.orders'
SELECT * FROM nf1.orders ORDER BY order_no;
\echo '== nf1.order_items'
SELECT * FROM nf1.order_items ORDER BY order_no, product_code;

\echo '== nf2.products'
SELECT * FROM nf2.products ORDER BY product_code;
\echo '== nf2.order_items'
SELECT * FROM nf2.order_items ORDER BY order_no, product_code;

\echo '== nf2.orders: 같은 고객의 성명·연락처가 주문마다 반복된다'
SELECT * FROM nf2.orders ORDER BY order_no;

\echo '== nf3.customers'
SELECT * FROM nf3.customers ORDER BY customer_id;
\echo '== nf3.orders'
SELECT * FROM nf3.orders ORDER BY order_no;
