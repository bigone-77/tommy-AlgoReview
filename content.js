let isProcessing = false;

const modalStyles = `
  :root {
    --algo-bg: #263747;
    --algo-text: #ffffff;
    --algo-desc: #d7e2eb;
    --algo-btn-primary: #0078ff;
    --algo-btn-hover: #006ae0;
    --algo-btn-secondary: #44576c;
    --algo-btn-sec-hover: #354656;
  }

  #algolog-modal {
    position: fixed;
    top: 24px;
    right: 24px;
    width: 340px;
    background: var(--algo-bg);
    color: var(--algo-text);
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideInNatural 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    will-change: transform, opacity;
  }

  @keyframes slideInNatural {
    0% { transform: translateX(120%) scale(0.95); opacity: 0; }
    100% { transform: translateX(0) scale(1); opacity: 1; }
  }
  
  /* 부드럽게 퇴장하는 키프레임 */
  @keyframes slideOutNatural {
    0% { transform: translateX(0) scale(1); opacity: 1; }
    100% { transform: translateX(120%) scale(0.95); opacity: 0; }
  }

  #algolog-title {
    font-size: 20px; font-weight: 800; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  #algolog-desc {
    font-size: 15px; color: var(--algo-desc); margin-bottom: 24px; line-height: 1.5;
  }
  .algolog-btn-group {
    display: flex; gap: 12px;
  }
  .algolog-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  #btn-write {
    background: var(--algo-btn-primary); color: white;
  }
  #btn-write:hover { background: var(--algo-btn-hover); transform: translateY(-2px); }
  #btn-setting {
    background: var(--algo-btn-secondary); color: white; flex: 0.5;
  }
  #btn-setting:hover { background: var(--algo-btn-sec-hover); transform: translateY(-2px); }
  #btn-close {
    position: absolute; top: 16px; right: 16px;
    background: none; border: none; color: #8a9bad; 
    cursor: pointer; font-size: 20px; padding: 4px;
    transition: color 0.2s;
  }
  #btn-close:hover { color: white; }
`;

function injectStyles() {
  if (document.getElementById("algolog-style")) return;
  const style = document.createElement("style");
  style.id = "algolog-style";
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

function showModal(title, url) {
  const existingModal = document.getElementById("algolog-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "algolog-modal";
  modal.innerHTML = `
    <button id="btn-close">✕</button>
    <div id="algolog-title">🎉 정답입니다!</div>
    <div id="algolog-desc">축하합니다! 방금 푼 문제를<br>블로그에 기록해볼까요?</div>
    <div class="algolog-btn-group">
      <button id="btn-write" class="algolog-btn">🚀 회고록 쓰기</button>
      <button id="btn-setting" class="algolog-btn">⚙️ 설정</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-write").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "OPEN_BLOG",
      payload: { title, url },
    });
    closeModal();
  });

  document.getElementById("btn-setting").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" });
  });

  document.getElementById("btn-close").addEventListener("click", closeModal);

  setTimeout(closeModal, 10000);
}

function closeModal() {
  const modal = document.getElementById("algolog-modal");
  if (modal) {
    modal.style.animation =
      "slideOutNatural 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      if (modal) modal.remove();
    }, 500);
  }
}

injectStyles();

const observer = new MutationObserver((mutations) => {
  if (isProcessing) return;

  const successModal = document.querySelector(".modal-title");

  if (
    successModal &&
    successModal.innerText.includes("정답입니다") &&
    successModal.offsetParent !== null
  ) {
    console.log(
      "🎉 AlgoView: 정답 화면이 감지되었습니다! (Visible Check Passed)"
    );
    isProcessing = true;

    const problemTitleElement = document.querySelector(".challenge-title");
    const title = problemTitleElement
      ? problemTitleElement.innerText
      : document.title;
    const url = window.location.href;

    showModal(title, url);

    setTimeout(() => {
      isProcessing = false;
    }, 10000);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
