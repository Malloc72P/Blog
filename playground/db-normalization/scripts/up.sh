#!/usr/bin/env bash
# PostgreSQL 18 컨테이너(pg-norm-lab)를 띄우고 접속 가능해질 때까지 기다린다.
set -euo pipefail

NAME=pg-norm-lab
PORT="${PORT:-55434}"

docker run -d --name "$NAME" \
  -e POSTGRES_PASSWORD=lab -e POSTGRES_DB=lab \
  -p "$PORT:5432" postgres:18 >/dev/null

until docker exec "$NAME" pg_isready -U postgres -d lab >/dev/null 2>&1; do
  sleep 1
done
# 초기화 중 임시 서버가 한 번 내려갔다 올라오므로 한 번 더 확인한다.
sleep 2
until docker exec "$NAME" psql -U postgres -d lab -Atc 'SELECT 1' >/dev/null 2>&1; do
  sleep 1
done
docker exec "$NAME" psql -U postgres -d lab -Atc 'SHOW server_version'
