// background.js

// 1. 블로그 자동 입력 함수 (Velog & Custom 지원)
function autoFillPage(data, platform) {
  let titleInput = null;

  if (platform === "custom") {
    // [변경됨] 자유 형식: 최대한 다양한 제목 입력칸(id='title', placeholder='제목' 등)을 찾도록 시도
    titleInput =
      document.querySelector('input[type="text"][placeholder*="제목"]') ||
      document.querySelector('textarea[placeholder*="제목"]') ||
      document.getElementById("title") ||
      document.getElementById("post-title") ||
      document.querySelector(".title");
  } else {
    // Velog 전용
    titleInput = document.querySelector(
      'textarea[placeholder="제목을 입력하세요"]',
    );
  }

  // 제목 입력 처리
  if (titleInput) {
    titleInput.value = `[Algorithm] 프로그래머스 - ${data.title}`;
    titleInput.focus();
    // 다양한 프레임워크(React, Vue 등) 대응을 위해 여러 이벤트 발송
    titleInput.dispatchEvent(new Event("input", { bubbles: true }));
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));
    titleInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
    titleInput.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
    titleInput.blur();
  } else {
    console.log("AlgoView: 제목 입력칸을 자동으로 찾지 못했습니다.");
  }

  // 템플릿 생성 (마크다운)
  const template = `
## 📚 문제 설명

> **[문제 링크](${data.url})**

(여기에 문제에 대한 간략한 설명이나 핵심 요구사항을 적어주세요.)

---

## 🧩 풀이 과정 (Algorithm)

1.  **아이디어**: 
2.  **접근법**: 

(예: 00 알고리즘을 사용하여 시간복잡도를 O(N)으로 줄이려 했습니다.)

---

## 💻 코드 (Code)

\`\`\`javascript
// 여기에 풀이 코드를 붙여넣어 주세요.
\`\`\`

---

## 📝 회고 (Retrospective)

* **배운 점:** * **아쉬운 점:** * **Time Complexity:** O(?)
`;

  // 클립보드 복사
  navigator.clipboard.writeText(template).then(() => {
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="font-size: 14px; margin-bottom: 4px;">✨ <b>마크다운 템플릿</b> 복사 완료!</div>
      <div style="font-size: 12px; opacity: 0.9;">본문에 붙여넣기(Ctrl+V) 하세요.</div>
    `;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      background: linear-gradient(135deg, #6e8efb, #a777e3); 
      color: white; padding: 15px 20px;
      border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-family: sans-serif; text-align: center;
      animation: slideIn 0.5s ease-out forwards;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  });
}

// 2. 메시지 수신 및 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "OPEN_BLOG") {
    const problemData = request.payload;

    // 저장된 설정(URL, 플랫폼) 가져오기 (tistoryUrl -> customUrl 변경)
    chrome.storage.sync.get(["velogUrl", "customUrl", "platform"], (data) => {
      const platform = data.platform || "velog";

      let targetUrl = "";
      if (platform === "custom") {
        // [변경됨] 자유 형식 URL이 없으면 빈 문자열 (새 탭만 열림)
        targetUrl = data.customUrl || "";
      } else {
        targetUrl = data.velogUrl || "https://velog.io/write";
      }

      // URL이 없으면 경고
      if (!targetUrl && platform === "custom") {
        alert("설정에서 블로그 URL을 먼저 입력해주세요!");
        chrome.runtime.openOptionsPage();
        return;
      }

      chrome.tabs.create({ url: targetUrl }, (tab) => {
        const listener = (tabId, changeInfo) => {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: autoFillPage,
              args: [problemData, platform],
            });
            chrome.tabs.onUpdated.removeListener(listener);
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    });
  }

  if (request.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
  }
});
