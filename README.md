# 🚀 AlgoView (알고뷰)

> **프로그래머스 문제 풀이를 자동으로 감지하고, 벨로그(Velog) & 티스토리(Tistory) 회고록 템플릿을 생성해주는 크롬 확장 프로그램**

![AlgoView Logo](icon.png)

알고리즘 공부, 문제 풀고 나서 기록하는 게 귀찮으셨나요?
**AlgoView**는 문제를 풀자마자 **예쁜 모달창**을 띄워주고, 클릭 한 번으로 **문제 정보와 고퀄리티 회고 템플릿**을 블로그 에디터에 자동으로 작성해줍니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 👀 스마트 정답 감지 & 커스텀 모달

시스템 알림이 아닌, **직관적이고 예쁜 HTML 모달창**을 제공합니다.
페이지 로딩 시 숨겨진 정답 코드는 무시하고, **진짜 정답 화면이 떴을 때만** 정확하게 반응합니다.

![정답 모달 화면](./스크린샷%202026-01-04%20오전%204.02.35.jpg)

### 2. 📝 원클릭 회고록 작성 (Velog & Tistory 지원)

버튼 하나만 누르면 설정해둔 블로그 에디터가 열립니다.

- **제목 자동 완성:** `[Algorithm] 프로그래머스 - 문제이름` 형식을 자동으로 입력합니다.
- **템플릿 자동 복사:** 문제 링크, 설명, 풀이 접근법, 코드 블록, 회고가 포함된 **마크다운(Markdown)** 양식을 클립보드에 복사해줍니다.

### 3. 🪄 티스토리 마크다운 모드 '자동 전환'

티스토리는 기본적으로 '기본모드'로 열리지만, AlgoView는 이를 감지하여 **자동으로 '마크다운' 모드로 전환**해줍니다. 번거로운 클릭 없이 바로 `Ctrl+V`만 하세요!

![티스토리 자동 전환](./스크린샷%202026-01-04%20오전%205.07.02.jpg)

### 4. ⚙️ 편리한 설정 관리 (플랫폼 스위칭)

벨로그와 티스토리 주소를 각각 저장해두고, 원할 때마다 드롭다운으로 간편하게 전환할 수 있습니다.

![설정 화면](./스크린샷%202026-01-04%20오전%204.43.53.jpg)

---

## 🛠 기술 스택 (Tech Stack)

- **Language**: JavaScript (ES6+), HTML5, CSS3
- **Environment**: Chrome Extension Manifest V3
- **Key Concepts**:
  - `MutationObserver`: DOM 변화를 실시간으로 감지하여 정답 화면 포착
  - `CSS Animations`: Cubic Bezier를 활용한 부드러운 모달 등장 효과
  - `Chrome Storage API`: 사용자별 블로그 설정(URL, 플랫폼) 저장 및 관리
  - `Scripting API`: 외부 페이지(블로그) 제어 및 스크립트 주입

---

## 📦 설치 방법 (Installation)

이 프로젝트는 아직 크롬 웹 스토어에 등록되지 않았으므로, **개발자 모드**를 통해 설치할 수 있습니다.

1. 이 저장소를 `git clone` 하거나 우측 상단 `Code` -> `Download ZIP`으로 다운로드 후 압축을 풉니다.

   ```bash
   git clone [https://github.com/bigone-77/tommy-AlgoReview.git](https://github.com/bigone-77/tommy-AlgoReview.git)

   ```

2. 크롬 브라우저 주소창에 chrome://extensions 를 입력해 이동합니다.

3. 우측 상단의 '개발자 모드' 스위치를 켭니다.

4. 좌측 상단의 '압축해제된 확장 프로그램을 로드합니다' 버튼을 클릭합니다.

5. 다운로드 받은 tommy-AlgoReview 폴더를 선택하면 설치 완료! 🎉

---

### **📝 [4/4] 파트 4 (사용 가이드 ~ 라이선스)**

```markdown
## 🚀 사용 가이드 (How to use)

1. **설정하기**:
   - 확장 프로그램 아이콘을 클릭하여 `⚙️ 설정` 페이지로 이동합니다.
   - Velog를 선택하거나, 자유 형식을 선택하여 본인이 사용하는 블로그(티스토리 등)의 글쓰기 URL을 입력하고 저장합니다.
2. **문제 풀기**:
   - [프로그래머스](https://school.programmers.co.kr/)에서 문제를 풀고 '제출 후 채점하기'를 누릅니다.
3. **회고록 작성**:
   - '정답입니다!' 화면과 함께 뜨는 모달창에서 **`🚀 회고록 쓰기`** 버튼을 클릭합니다.
   - 자동으로 열린 블로그 에디터 본문에 `Ctrl + V` (붙여넣기)를 하면 템플릿 작성이 끝납니다!

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 bigone-77

---

### 📬 Contact

기능 추가 제안이나 버그 리포트는 [Issues](https://github.com/bigone-77/tommy-AlgoReview/issues)에 남겨주세요!
```
