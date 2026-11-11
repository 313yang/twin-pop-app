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

## 로컬 에뮬레이터 켜기

아래 명령은 **이 저장소를 내려받은 내 컴퓨터**에서 실행합니다. 최초에는 `npm ci`, 이후 의존성이 바뀌면 다시 `npm ci`를 실행하세요.

### Android — Windows / macOS / Linux

1. [Android Studio](https://developer.android.com/studio)를 설치하고 최초 설정에서 Android SDK를 설치합니다.
2. **Settings → Languages & Frameworks → Android SDK → SDK Tools**에서 **Android Emulator**, **Android SDK Platform-Tools**가 설치되어 있는지 확인합니다. SDK Location 경로도 확인하세요.
3. 시작 화면의 **More Actions → Virtual Device Manager** 또는 프로젝트 창의 **Tools → Device Manager**를 엽니다.
4. **Create Virtual Device / +** → Pixel 계열 기기 → 시스템 이미지를 다운로드 → Finish. Apple Silicon은 ARM64, Intel/AMD는 x86_64 이미지를 선택합니다.
5. 만들어진 기기 옆 **실행(삼각형)** 버튼을 누르고 Android 홈 화면이 나올 때까지 기다립니다.
6. 프로젝트 폴더의 터미널에서 실행합니다.

```sh
npm run android
```

또는 `npx expo start` 실행 후 그 터미널에서 `a`를 누릅니다. Expo가 실행 중인 가상 기기에 Expo Go를 설치/실행하고 앱을 연결합니다. 개발 서버 터미널은 켜둡니다.

**기기가 안 잡힐 때**

- 새 터미널에서 `adb devices`를 실행했을 때 `emulator-... device`가 보여야 합니다.
- `adb`를 찾을 수 없으면 SDK Location의 `platform-tools`와 `emulator` 폴더를 OS의 PATH에 추가하고 터미널을 다시 엽니다. `ANDROID_HOME`도 SDK Location으로 설정합니다.
- SDK 기본 위치 예: macOS `~/Library/Android/sdk`, Windows `%LOCALAPPDATA%\Android\Sdk`, Linux `~/Android/Sdk`. 실제 설치 위치가 우선입니다.
- 기기가 멈추면 Device Manager의 기기 메뉴에서 **Cold Boot Now**를 실행합니다.
- 가상화 오류는 BIOS/UEFI 하드웨어 가상화 및 운영체제의 Android Emulator 가속 설정을 확인합니다.

### iOS Simulator — macOS만 가능

1. Mac App Store에서 **Xcode**를 설치하고 한 번 실행해 초기 구성과 라이선스 절차를 완료합니다.
2. **Xcode → Settings → Locations → Command Line Tools**에서 설치된 Xcode를 선택합니다.
3. **Settings → Components**(버전에 따라 **Platforms**)에서 iOS Simulator 런타임을 설치합니다.
4. Xcode의 **Open Developer Tool → Simulator**, 또는 터미널에서 아래 명령으로 켭니다.

```sh
open -a Simulator
```

5. Simulator의 **File → Open Simulator**에서 설치된 iPhone을 선택합니다. 목록이 비어 있으면 Xcode의 **Window → Devices and Simulators → Simulators → +**에서 기기를 만듭니다.
6. 프로젝트 폴더에서 실행합니다.

```sh
npm run ios
```

또는 `npx expo start` 후 `i`를 누릅니다. `Shift+i`로 기기를 선택할 수 있습니다. 로컬 시뮬레이터의 Expo Go 실행에는 Apple 배포 서명이 필요하지 않습니다.

**기기가 안 잡힐 때**

```sh
xcrun simctl list devices available
```

목록이 없으면 iOS 런타임을 설치합니다. Command Line Tools 관련 오류는 위 Locations 설정을 확인하세요. Windows/Linux에서는 로컬 iOS Simulator를 실행할 수 없으므로 Android 에뮬레이터 또는 실제 iPhone의 Expo Go를 사용합니다.

### 실행 후 조작 / 재시작

- 게임판에서 마우스를 누른 채 끌어 놓으면 스와이프됩니다. 터미널 방향키로 플레이하는 방식이 아닙니다.
- 코드 수정은 Fast Refresh로 반영됩니다. 터미널의 `r`은 새로고침, `Ctrl+C`는 개발 서버 종료입니다.
- 폰트/의존성 변경 후 반영이 안 되면 `npx expo start --clear`로 다시 시작한 뒤 `a` 또는 `i`를 누르세요.
- 이 앱은 Expo SDK 58입니다. Expo Go의 SDK 지원 버전이 맞아야 하며, 버전 불일치와 에뮬레이터 부팅 문제는 별개입니다.

참고: [Expo Android 설정](https://docs.expo.dev/workflow/android-studio-emulator/), [Expo iOS 설정](https://docs.expo.dev/workflow/ios-simulator/).

## 폰트

전체 문구는 **KccSign(KCC간판체)**를 사용합니다. 제공된 웹폰트를 네이티브용 OpenType으로 압축 해제해 `assets/fonts/KccSign.otf`에 포함했습니다. `expo-font`가 로드한 뒤 화면을 표시하며 `AppText`가 제목·본문·버튼·숫자에 동일하게 적용합니다. 아이콘은 Font Awesome 전용 폰트를 사용합니다. 출처·라이선스는 `assets/fonts/README.md`와 `OFL.txt`에 있습니다.

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
