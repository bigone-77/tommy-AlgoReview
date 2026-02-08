// options.js

// 1. 플랫폼별 URL 저장 변수 (tistory -> custom 변경)
const urlData = {
  velog: "",
  custom: "", // 자유 형식
};
let currentPlatform = "velog";

// 2. Placeholder 문구 변경
const placeholders = {
  velog: "예: https://velog.io/write",
  custom: "예: https://blog.naver.com/..., https://tistory.com/...", // 범용 예시
};

function setupCustomSelect() {
  const wrapper = document.querySelector(".custom-select-wrapper");
  const trigger = document.querySelector(".custom-select-trigger");
  const triggerText = trigger.querySelector("span");
  const options = document.querySelectorAll(".custom-option");
  const hiddenInput = document.getElementById("platform");
  const urlInput = document.getElementById("blogUrl");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();

      const newPlatform = this.getAttribute("data-value");
      const text = this.textContent;

      if (currentPlatform !== newPlatform) {
        triggerText.textContent = text;
        hiddenInput.value = newPlatform;

        options.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        currentPlatform = newPlatform;
        urlInput.value = urlData[currentPlatform] || "";
        urlInput.placeholder = placeholders[currentPlatform];
      }

      wrapper.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
    }
  });

  urlInput.addEventListener("input", (e) => {
    urlData[currentPlatform] = e.target.value;
  });
}

function saveOptions() {
  // 저장 키값 변경: tistoryUrl -> customUrl
  chrome.storage.sync.set(
    {
      velogUrl: urlData.velog,
      customUrl: urlData.custom,
      platform: currentPlatform,
    },
    () => {
      const status = document.getElementById("status");
      status.textContent = "✅ 설정이 저장되었습니다!";
      status.className = "success";

      setTimeout(() => {
        status.textContent = "";
        status.className = "";
      }, 1500);
    },
  );
}

function restoreOptions() {
  // 불러오기 키값 변경
  chrome.storage.sync.get(["velogUrl", "customUrl", "platform"], (items) => {
    urlData.velog = items.velogUrl || "";
    urlData.custom = items.customUrl || ""; // 자유 형식 URL

    currentPlatform = items.platform || "velog";
    document.getElementById("platform").value = currentPlatform;

    const options = document.querySelectorAll(".custom-option");
    const triggerText = document.querySelector(".custom-select-trigger span");

    options.forEach((opt) => {
      if (opt.getAttribute("data-value") === currentPlatform) {
        opt.classList.add("selected");
        triggerText.textContent = opt.textContent;
      } else {
        opt.classList.remove("selected");
      }
    });

    const urlInput = document.getElementById("blogUrl");
    urlInput.value = urlData[currentPlatform];
    urlInput.placeholder = placeholders[currentPlatform];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCustomSelect();
  restoreOptions();
});

document.getElementById("saveBtn").addEventListener("click", saveOptions);
