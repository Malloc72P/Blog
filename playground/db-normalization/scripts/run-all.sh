#!/usr/bin/env bash
# sql/ 아래 파일을 번호 순서대로 실행하고 출력을 out/ 에 저장한다.
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$DIR/out"

for f in "$DIR"/sql/*.sql; do
  name="$(basename "$f" .sql)"
  echo "### $name"
  "$DIR/scripts/run.sh" "sql/$name.sql" 2>&1 | tee "$DIR/out/$name.txt"
done
