# 文 (문) — 단편소설 · 합평

짧은 소설을 올리고, 서로 합평(댓글)로 피드백을 나누는 게시판형 사이트입니다.

## 스택

- Ruby on Rails 7 (Hotwire/Turbo + Stimulus)
- Tailwind CSS (`tailwindcss-rails`)
- PostgreSQL
- Docker 기반 개발 환경(로컬 Ruby 설치 불필요)
- Rate limit: `rack-attack`

## 실행 방법 (개발)

Docker Desktop이 실행 중이어야 합니다.

```bash
cd /Users/seoseungbeom/bunn
cp env.example .env
docker compose build
docker compose run --rm web bin/rails db:prepare
docker compose run --rm web bin/rails db:seed
docker compose up
```

브라우저에서 **Next 프론트** `http://localhost:3001` 접속. (Rails는 API/관리용으로 `http://localhost:3000`)

## 테스트

PostgreSQL을 로컬에 설치하지 않는 것을 전제로, Docker로 실행합니다.

```bash
./bin/test
```

## 보안/운영 메모(요약)

- **SQL 인젝션**: ActiveRecord 바인딩/`sanitize_sql_like` 사용으로 기본 방어
- **HTTP flood(DoS 완화)**: `Rack::Attack`으로 IP 기반 rate limit 적용
  - `/up`은 헬스체크라 allowlist
  - 로그인/회원가입, 쓰기 API는 더 강하게 제한
- **HTML(레거시) 관리 기능 보호**: 프로덕션에서는 `ADMIN_BASIC_AUTH_USER/PASSWORD`를 설정하지 않으면
  스토리/합평의 HTML 생성/수정/삭제는 404로 숨깁니다.

## 주요 기능(현재)

- 소설(Story) CRUD: 제목/필명/본문
- 합평(Critique) 작성/삭제: Turbo Stream으로 즉시 반영
- 다크모드 토글(Stimulus + localStorage)

## Next.js 프론트(현재)

- `frontend/` (App Router + Tailwind)
- 소설 목록/상세/작성 + 합평 작성/삭제가 **Next에서 동작**
- 프록시는 Next `rewrites(/api/*)`로 Rails `api/*`에 연결