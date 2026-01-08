# @malloc72p/decorator

- 데코레이터 테스트 예제

### 설치

```shell
pnpm i
```

### 개발서버 실행

```shell
pnpm dev
```

### 릴리스

- `npm`으로 `publish`합니다

```shell
# 아래 명령어를 pacakge.json에 추가
"RELEASE": "----------------------------------------------------------------------------------",
"release": "npm run build && cd ./publish/.npm && npm publish"
```

```shell
pnpm release
```