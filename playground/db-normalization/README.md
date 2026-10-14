# db-normalization

블로그 포스트 "DB 정규화와 함수 종속: 1NF부터 3NF까지"의 예제입니다.
주문, 주문상품, 상품, 고객 데이터를 한 테이블에서 시작해 1NF(셀을 행으로 푼 상태), 2NF, 3NF 순서로 분할하고
PostgreSQL 18에서 실제로 실행해 결과를 확인합니다.

## 준비

docker만 있으면 됩니다. `postgres:18` 이미지를 사용합니다.

```bash
scripts/up.sh        # pg-norm-lab 컨테이너 실행 (포트 55434)
scripts/run-all.sh   # sql/ 의 파일을 순서대로 실행하고 out/ 에 출력 저장
scripts/down.sh      # 컨테이너 삭제
```

한 파일만 실행하려면 `scripts/run.sh sql/02_anomalies.sql` 처럼 실행합니다.
`01_flat_table.sql` 이 모든 테이블을 다시 만들기 때문에 순서와 상관없이 처음부터 다시 실행해도 됩니다.

## SQL 파일

| 파일 | 내용 |
| --- | --- |
| `sql/01_flat_table.sql` | 1NF 테이블 `order_flat` 생성과 데이터 입력 |
| `sql/02_anomalies.sql` | 갱신, 삽입, 삭제 이상 실행 |
| `sql/03_dependency_check.sql` | `GROUP BY ... HAVING count(DISTINCT ...) > 1` 로 함수 종속이 깨졌는지 확인 |
| `sql/04_normalize.sql` | 스키마 `nf2`, `nf3` 에 단계별로 테이블 분할 |
| `sql/05_verify_join.sql` | JOIN 으로 복원한 결과와 원본을 `EXCEPT` 로 비교 |
| `sql/06_after_normalization.sql` | 3NF 구조에서 상품명 변경, 상품 등록, 삭제, FK 오류 확인 |
| `sql/07_show_tables.sql` | 단계별 테이블 내용 출력 |

`out/` 은 `run-all.sh` 가 만드는 출력 폴더이고 git 에는 포함하지 않습니다.
