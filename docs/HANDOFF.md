# TWINPOP 작업 인수인계 (2026-11-12 기준)

이 문서는 다음 작업자(에이전트)가 바로 이어서 작업할 수 있도록 지금까지의 변경 사항, 현재 구조, 주의점, 남은 할 일을 정리한 것이다.
기준 커밋: `bcf70d3` (이 문서 이전의 마지막 기능 커밋)

---

## 1. 실행·빌드 (네이티브 모듈 추가로 바뀐 점)

- **Expo Go로는 실행 불가**(AdMob·오디오·햅틱·iCloud 네이티브 모듈 필요). 개발용 빌드로 실행:
  ```bash
  LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npx expo run:ios
  ```
- **CocoaPods 로케일 오류**(`Unicode Normalization not appropriate for ASCII-8BIT`)가 나면 위처럼 `LANG/LC_ALL=en_US.UTF-8`을 붙인다.
- `app.json`의 네이티브 설정(entitlements, locales, 플러그인)을 바꾸면 `CI=1 npx expo prebuild -p ios --clean` 후 다시 빌드한다. `/ios`는 생성물이라 gitignore 대상.

## 2. 코드 구조 (주요 파일)

| 경로 | 역할 |
|---|---|
| `App.tsx` | 화면 전환(home/levels/game), 다이얼로그(pause/help/settings/result), 광고 타이밍, 상수들. 한 줄이 매우 긴 압축 스타일이므로 수정 시 정확한 문자열 치환 권장 |
| `src/game/` | 엔진(`engine.ts`: move/solve/getLevel), 레벨 데이터, 리듀서(`state.ts`), 별 계산(`stars.ts`), 진행 병합(`progressMerge.ts`) |
| `src/components/` | 보드(`Board`), 도착지점 꽃봉오리(`Goal`), 돌벽(`WallBlock`), 캐릭터(`Character` + `src/art/character.ts` SVG), 클리어 별(`ClearStars`), 색종이(`Celebration`), 게임 설명(`HelpContent`), 설정(`SettingsContent`, `VolumeRow`), 홈(`HomeScreen`) |
| `src/components/stage-map/` | 스테이지 선택 지도(`StageMap`, `StageNode`, 레이아웃 `mapLayout.ts`) |
| `src/ads/` | AdMob. `sdk.ts`(네이티브 모듈 없으면 null), `interstitial.ts`(클리어 전면광고), `rewarded.ts`(힌트 보상형) |
| `src/hooks/useHintQuota.ts` | 하루 무료 힌트 3개 + 소진 시 보상형 광고 |
| `src/feedback/` | 효과음·햅틱(`feedback.ts`), 이동 결과별 피드백 훅(`useMoveFeedback.ts`), 배경음(`bgm.ts`) |
| `src/settings/settingsStore.ts` | 설정(sfxVolume/bgmVolume 0~5, haptics) AsyncStorage 저장 + `useSyncExternalStore` 훅 |
| `src/i18n/` | 다국어. `strings.ts`에 ko/en/ja/zh 사전, `index.ts`의 `t(key, params)` |
| `src/sync/useCloudProgress.ts` | 진행 기록 iCloud 동기화 훅 |
| `modules/icloud-kv/` | 직접 만든 Expo 로컬 네이티브 모듈(Swift, `NSUbiquitousKeyValueStore`) |
| `scripts/make-sounds.py` | 효과음 합성 스크립트 → `assets/sounds/*.wav` |
| `locales/*.json` | 언어별 앱 표시 이름(CFBundleDisplayName) |
| `tests/` | `game.test.ts`, `stars.test.ts`, `progressMerge.test.ts` |

## 3. 지금까지 한 작업 (커밋 순)

### c9493e2 / 3586c35 — AdMob 광고
- `react-native-google-mobile-ads` + config plugin. iOS 앱 ID `ca-app-pub-8097019015758092~4634388658`.
- **전면광고**(`.../6494265234`): 클리어 시 CLEAR 창이 뜨고 **1초 뒤** 노출(`CLEAR_AD_DELAY_MS`).
- **보상형 광고**(`.../3313054774`): 무료 힌트(하루 3개) 소진 후 광고 시청 시 힌트 1회. 힌트 버튼에 남은 개수/`AD` 뱃지.
- 보상형 광고 시청 후 5분간 전면광고 생략. **캠페인 1~10스테이지는 광고 없음 + 힌트 무제한**(`AD_FREE_UNTIL_STAGE`).
- 게재빈도 제한은 AdMob 콘솔에서 설정(1회/5분). 개발 모드(`__DEV__`)는 항상 테스트 광고 ID.
- 튜토리얼 스와이프 손 방향을 1스테이지 정답의 첫 수에 맞춤.

### f9d134f — 스테이지 화면 디자인·클리어 연출·별
- 헤더·도구 아이콘 축소, 뒤로가기 `angle-left`, "다시" → "처음부터".
- 돌벽을 솟은 블록(`WallBlock`)으로, 사과 이목구비 확대·눈 깜빡임 주기 개선.
- 도착지점: **꽃봉오리** → 사과 도착 시 퐁! 개화(꽃이 사과 뒤 후광). 클리어 시 두 꽃 뒤로 빛·별 반짝임.
- 클리어 색종이를 화면 양쪽 아래 크래커 방식(`Celebration`, CLEAR 모달 안에서 렌더)으로 교체.
- **별 1~3개**: 최단과 같으면 3개, 최단의 4배 이상이면 1개, 그 사이 2개. 클리어 창 별 팝·맥박·햇살 애니메이션. 결과창은 클리어 1.4초 후(`RESULT_DELAY_MS`).

### 66038e7 — 스테이지 선택 지도
- 아래에서 위로 올라가는 **랜덤하게 꺾이는 길** 지도(챕터 첫 번호로 시드 고정 → 항상 같은 모양). 이웃 노드 최소 가로 간격으로 별 가림 방지.
- 챕터 **40개씩 6개**, 진입 시 현재 챕터 자동 선택 + 현재 스테이지로 자동 스크롤.
- 미해금 스테이지 잠금(클리어/다음/진행 중 스테이지만 열림). 위아래 페이드.

### bcf70d3 — 설정·사운드·다국어·iCloud
- 홈 우상단 `?`(게임 설명) 옆 **설정** 버튼, 일시정지 창에도 설정 버튼.
- 설정: **효과음·배경음 볼륨 0~5 버튼**, 진동 토글, iCloud 동기화 상태, 버전.
- 효과음(합성 wav): 이동/벽 막힘/꽃봉오리 도착/클리어 + 햅틱. 무음 모드에서는 소리 안 남.
- **배경음**: 반복 재생, 백그라운드 시 정지. **현재 `assets/sounds/bgm.wav`는 1초 무음 임시 파일.**
- **다국어**: 기기 언어로 ko/en/ja/zh(간체) 자동 선택, 그 외는 영어. 앱 이름 현지화(트윈팝/TWINPOP/ツインポップ/双子泡泡).
- **iCloud 키-값 동기화**: 진행 기록(wins/nextStage/swipeLearned)을 업로드, 시작 시와 외부 변경 시 병합(더 앞선 진행·더 적은 이동 수 유지, resume은 로컬 유지). entitlement `com.apple.developer.ubiquity-kvstore-identifier` 설정됨.
- 게임 설명 문구 전면 개편(규칙 5개), 화면 표기 `STAGE`로 통일(CLEAR!/AD 등 영문 표기는 의도적으로 유지).

## 4. 결정된 사항 (바꾸지 말 것)

- 화면 표기: 홈 버튼·선택 화면 제목·게임 제목 모두 **`STAGE`**. `CLEAR!`, `ALL CLEAR!`, 힌트 뱃지 `AD`는 영문 유지. 그 외 문구는 `t()`로 다국어.
- 일시정지 창 제목 "일시정지", 버튼 "게임 설명". 게임 설명 창 제목 "게임 설명".
- 지도에는 사과 캐릭터를 표시하지 않음.
- 로고(`src/art/homeLogo.ts`)는 모든 언어에서 그대로(한글 로고).

## 5. 남은 할 일 (우선순위 순)

1. **배경음 교체**: 사용자가 파일을 전달 예정. `assets/sounds/bgm.wav`를 교체하고 확장자가 다르면 `src/feedback/bgm.ts`의 `BGM_SOURCE` require 경로 수정. 루프 재생 확인.
2. **iCloud 실기기 검증**: Apple Developer에서 App ID(`com.twinpop.game`)의 iCloud(Key-value storage) Capability 활성화 필요(사용자 작업). 실기기에서 iCloud 로그인 상태로 앱 삭제→재설치 시 기록 복원 확인. 시뮬레이터는 iCloud 미로그인이라 "iCloud 꺼짐" 표시가 정상.
3. **사운드·햅틱 실기기 확인**: 시뮬레이터는 햅틱 미지원, 소리 단계별 볼륨 미검증.
4. **개인정보처리방침 링크·문의 이메일**: 광고 앱이라 App Store 심사에 필요. 사용자에게 URL·이메일을 받아 설정 창(`SettingsContent.tsx`)에 행 추가. iOS ATT(추적 권한) 요청과 `SKAdNetworkItems` 설정도 출시 전 필요(현재 비개인화 광고만 요청 중).
5. **번역 검수**: `src/i18n/strings.ts`의 en/ja/zh는 에이전트가 직접 번역. 원어민 검수 권장. 중국어 앱 이름 "双子泡泡"는 임시 작명.
6. **폰트**: KccSign 폰트에 한자가 없어 일본어·중국어 한자는 시스템 폰트로 대체 표시됨. 한자 지원 둥근 폰트 도입 검토.
7. **스테이지 선택 화면 별 표시는 최고 기록 기준**(`progress.wins`). 오늘의 퍼즐은 별 표시 없음.

## 6. 주의점

- `App.tsx`는 압축된 긴 한 줄 JSX가 많다. 편집 시 정확한 부분 문자열 치환 후 `npm run typecheck`로 확인.
- 화면 문구 추가 시 반드시 `src/i18n/strings.ts`의 **ko에 키 추가 + en/ja/zh 모두 채우기**(타입이 강제함).
- 새 네이티브 모듈 추가 시 Expo Go 대응으로 `requireOptionalNativeModule` 또는 TurboModuleRegistry 체크로 감싸기(`src/ads/sdk.ts` 참고).
- 커밋 메시지 형식: `type(scope): 설명`, 본문 한국어. 커밋·push는 사용자 요청 시에만.
- 사용자 선호: 작업 후 시뮬레이터 스크린샷으로 직접 확인. 모르는 건 물어보기. 요청하지 않은 문서 업데이트 금지.
