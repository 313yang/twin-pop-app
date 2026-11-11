# TWINPOP · 트윈팝 — React Native + Expo

iOS/Android 네이티브 컴포넌트로 만든 세로형 퍼즐 앱입니다. WebView를 사용하지 않습니다.

## 실행

Node.js 22.13 이상(Node 24 권장)과 npm을 설치한 뒤:

```sh
npm ci
npx expo start
```

같은 Wi-Fi의 휴대폰에서 **Expo Go**로 터미널 QR을 스캔하세요. 이 프로젝트는 Expo SDK 58을 사용합니다. Expo Go가 해당 SDK를 지원하는 버전이어야 합니다. 로컬 시뮬레이터/에뮬레이터가 준비되어 있으면 터미널의 `i` 또는 `a`를 누르세요.

```sh
npm run typecheck
npm test
npm run export
```

`export`는 iOS/Android용 JS/Hermes 번들 검사입니다. IPA/APK나 앱스토어 배포 파일을 만드는 명령은 아닙니다.

## 포함된 기능

- 홈 / 240개 스테이지 선택 / 게임 / 일시정지 / 클리어 화면
- 기존 웹 버전과 동일한 240개 스테이지, 한국 날짜 기준 일일 퍼즐
- PanResponder 스와이프, 첫 스테이지 손짓 안내, 스크린리더 방향 액션
- Animated 기반 이동·벽 충돌·클리어·색종이·캐릭터 움직임
- 되돌리기, 재시작, 현재 위치에서 계산한 힌트
- AsyncStorage 진행 기록, 중단 위치 복원, 손상된 저장 데이터 검증
- Safe Area, 세로 화면, 동작 줄이기 설정 지원
- 오디오·광고 SDK·로그인·분석 SDK 없음

웹의 localStorage 기록은 네이티브 AsyncStorage와 별개이므로 자동 이전하지 않습니다. 네이티브 빌드에는 스테이지 데이터와 그림이 포함되어 있어 게임 플레이는 네트워크가 필요하지 않습니다(Expo Go 개발 서버 접속은 별도).

## 파일 구조

- `App.tsx`: 화면, 모달, 스와이프, 저장 연결
- `src/game/engine.ts`: 이동 규칙, 최단 경로, 일일 퍼즐
- `src/game/state.ts`: 게임 상태 전이 및 저장 검증
- `src/game/levels.ts`: 기존 240개 레벨 데이터
- `src/components/`: 네이티브 보드·캐릭터·가이드·효과
- `tests/game.test.ts`: 레벨 풀이 및 진행/복원 회귀 검사

## 설치 파일 / 출시 준비

`app.json`의 `com.twinpop.game`은 **개발용 임시 식별자**입니다. Apple/Google 계정에 등록된 실제 식별자로 바꾼 뒤 네이티브 빌드를 연결하세요. 표시 이름은 TWINPOP입니다.

EAS 계정으로 로그인하고 프로젝트를 연결한 다음:

```sh
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile simulator
```

`preview`의 Android 결과는 APK, `simulator`의 iOS 결과는 시뮬레이터용입니다. 실제 iPhone 배포는 Apple 서명/기기 등록 또는 TestFlight 설정이 필요합니다. `production` 프로필도 준비되어 있지만 계정 연결, 식별자, 서명, 스토어 정보와 개인정보 표시는 출시 전에 설정해야 합니다.

현재 환경에서는 Xcode·Android 에뮬레이터가 없어 실제 기기의 화면·터치감·프레임 성능은 검증하지 못했습니다. 타입 검사, 단위 테스트와 양 플랫폼 번들 생성까지 확인했습니다. 배포/스토어 제출은 수행하지 않았습니다.
