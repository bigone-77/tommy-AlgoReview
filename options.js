const urlData = {
  velog: "",
  tistory: "",
};
let currentPlatform = "velog";

const placeholders = {
  velog: "예: https://velog.io/write",
  tistory: "예: https://내블로그.tistory.com/manage/newpost",
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
  chrome.storage.sync.set(
    {
      velogUrl: urlData.velog,
      tistoryUrl: urlData.tistory,
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
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(["velogUrl", "tistoryUrl", "platform"], (items) => {
    urlData.velog = items.velogUrl || "";
    urlData.tistory = items.tistoryUrl || "";

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
