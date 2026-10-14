#!/usr/bin/env bash
# 사용법: scripts/run.sh sql/02_anomalies.sql
# 파일의 문장을 에코하면서 psql로 실행한다. 오류가 나도 끝까지 실행한다.
set -euo pipefail

NAME=pg-norm-lab
DIR="$(cd "$(dirname "$0")/.." && pwd)"
FILE="$1"

docker exec -i "$NAME" sh -c 'psql -U postgres -d lab -X -a --pset=pager=off 2>&1' < "$DIR/$FILE"
