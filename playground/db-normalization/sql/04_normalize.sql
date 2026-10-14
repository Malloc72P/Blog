-- order_flat(1NF) → 2NF → 3NF. 단계마다 스키마(nf2, nf3)를 따로 만들어 같은 이름의 테이블이 겹치지 않게 한다.

-- 2NF: 키의 일부에 종속되는 고객 정보(order_no)와 상품명(product_code)을 분할
CREATE SCHEMA nf2;

CREATE TABLE nf2.orders (
  order_no       int  PRIMARY KEY,
  customer_id    text NOT NULL,
  customer_name  text NOT NULL,
  customer_phone text NOT NULL
);

CREATE TABLE nf2.products (
  product_code text PRIMARY KEY,
  product_name text NOT NULL
);

CREATE TABLE nf2.order_items (
  order_no     int  NOT NULL REFERENCES nf2.orders (order_no),
  product_code text NOT NULL REFERENCES nf2.products (product_code),
  quantity     int  NOT NULL,
  PRIMARY KEY (order_no, product_code)
);

INSERT INTO nf2.orders
SELECT DISTINCT order_no, customer_id, customer_name, customer_phone FROM order_flat;
INSERT INTO nf2.products
SELECT DISTINCT product_code, product_name FROM order_flat;
INSERT INTO nf2.order_items
SELECT order_no, product_code, quantity FROM order_flat;

-- 3NF: 고객 성명·연락처를 고객 테이블로 분할
CREATE SCHEMA nf3;

CREATE TABLE nf3.customers (
  customer_id    text PRIMARY KEY,
  customer_name  text NOT NULL,
  customer_phone text NOT NULL
);

CREATE TABLE nf3.orders (
  order_no    int  PRIMARY KEY,
  customer_id text NOT NULL REFERENCES nf3.customers (customer_id)
);

CREATE TABLE nf3.products (
  product_code text PRIMARY KEY,
  product_name text NOT NULL
);

CREATE TABLE nf3.order_items (
  order_no     int  NOT NULL REFERENCES nf3.orders (order_no),
  product_code text NOT NULL REFERENCES nf3.products (product_code),
  quantity     int  NOT NULL,
  PRIMARY KEY (order_no, product_code)
);

INSERT INTO nf3.customers
SELECT DISTINCT customer_id, customer_name, customer_phone FROM nf2.orders;
INSERT INTO nf3.orders   SELECT order_no, customer_id FROM nf2.orders;
INSERT INTO nf3.products SELECT * FROM nf2.products;
INSERT INTO nf3.order_items SELECT * FROM nf2.order_items;

SELECT 'nf2' AS stage, 'orders' AS tbl, count(*) AS row_count FROM nf2.orders
UNION ALL SELECT 'nf2', 'products', count(*) FROM nf2.products
UNION ALL SELECT 'nf2', 'order_items', count(*) FROM nf2.order_items
UNION ALL SELECT 'nf3', 'customers', count(*) FROM nf3.customers
UNION ALL SELECT 'nf3', 'orders', count(*) FROM nf3.orders
UNION ALL SELECT 'nf3', 'products', count(*) FROM nf3.products
UNION ALL SELECT 'nf3', 'order_items', count(*) FROM nf3.order_items;
