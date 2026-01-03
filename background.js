function autoFillPage(data, platform) {
  let titleInput = null;

  if (platform === "tistory") {
    titleInput =
      document.querySelector(".textarea_tit") ||
      document.getElementById("post-title") ||
      document.querySelector('textarea[placeholder="제목을 입력하세요"]');

    const modeBtn = document.querySelector("#editor-mode-layer-btn-open");

    if (modeBtn && modeBtn.textContent.includes("기본모드")) {
      const script = document.createElement("script");
      script.textContent = "window.confirm = function(){ return true; };";
      (document.head || document.documentElement).appendChild(script);
      script.remove();

      modeBtn.click();

      setTimeout(() => {
        const menuItems = document.querySelectorAll(".list_mode *");
        for (let item of menuItems) {
          if (item.textContent.trim() === "마크다운") {
            item.click();
            console.log("AlgoView: 마크다운 모드 전환 성공! ✨");
            break;
          }
        }
      }, 300);
    }
  } else {
    titleInput = document.querySelector(
      'textarea[placeholder="제목을 입력하세요"]'
    );
  }

  if (titleInput) {
    titleInput.value = `[Algorithm] 프로그래머스 - ${data.title}`;
    titleInput.focus();
    titleInput.dispatchEvent(new Event("input", { bubbles: true }));
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));
    titleInput.blur();
  }

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "OPEN_BLOG") {
    const problemData = request.payload;

    chrome.storage.sync.get(["velogUrl", "tistoryUrl", "platform"], (data) => {
      const platform = data.platform || "velog";

      let targetUrl = "";
      if (platform === "tistory") {
        targetUrl = data.tistoryUrl || "https://tistory.com/manage/newpost";
      } else {
        targetUrl = data.velogUrl || "https://velog.io/write";
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
