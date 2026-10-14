#!/usr/bin/env bash
# 컨테이너를 삭제한다.
docker rm -f pg-norm-lab >/dev/null && echo "pg-norm-lab 삭제"
