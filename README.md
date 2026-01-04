# 文 (문) — 단편소설 · 합평

짧은 소설을 올리고, 서로 합평(댓글)로 피드백을 나누는 게시판형 사이트입니다.

## 스택

- Ruby on Rails 7 (Hotwire/Turbo + Stimulus)
- Tailwind CSS (`tailwindcss-rails`)
- SQLite
- Docker 기반 개발 환경(로컬 Ruby 설치 불필요)

## 실행 방법 (개발)

Docker Desktop이 실행 중이어야 합니다.

```bash
cd /Users/seoseungbeom/bunn
docker compose build
docker compose run --rm web bin/rails db:prepare
docker compose run --rm web bin/rails db:seed
docker compose up
```

브라우저에서 `http://localhost:3000` 접속.

## 주요 기능(현재)

- 소설(Story) CRUD: 제목/필명/본문
- 합평(Critique) 작성/삭제: Turbo Stream으로 즉시 반영
- 다크모드 토글(Stimulus + localStorage)

