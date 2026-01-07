# 文 모바일 (iOS/Android)

Expo(React Native) 기반으로 iOS/Android를 동시에 제공합니다. 백엔드는 기존 Rails API를 사용합니다.

## 실행

```bash
cd /Users/seoseungbeom/bunn/mobile
npm run start
```

Expo Go 앱(실기기) 또는 에뮬레이터/시뮬레이터로 실행하세요.

## API Base URL 설정

`mobile/app.json`의 `expo.extra.apiBaseUrl`로 설정합니다.

기본값은 `http://localhost:3000`이며, 환경별 권장값은 아래와 같습니다:

- iOS 시뮬레이터: `http://localhost:3000`
- Android 에뮬레이터: `http://10.0.2.2:3000`
- 실제 디바이스: 같은 Wi-Fi의 PC IP 사용 (예: `http://192.168.0.10:3000`)

## 포함 기능(최소)

- 소설 목록(검색/태그), 랜덤
- 소설 상세 + 합평 작성
- 이메일 로그인/회원가입
- 글쓰기(로그인 필요)

