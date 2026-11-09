const novaSearchForm = document.getElementById("novaSearchForm");
const novaPrompt = document.getElementById("novaPrompt");
const novaPanel = document.getElementById("novaPanel");
const novaConversation = document.getElementById("novaConversation");
const novaChatForm = document.getElementById("novaChatForm");
const novaChatInput = document.getElementById("novaChatInput");
const novaStatus = document.getElementById("novaStatus");
const openNova = document.getElementById("openNova");
const ctaAskNova = document.getElementById("ctaAskNova");

const promptExamples = document.querySelectorAll(".prompt-example");


function scrollToNova() {
    if (!novaPanel) {
        return;
    }

    novaPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    if (novaChatInput) {
        setTimeout(function () {
            novaChatInput.focus();
        }, 600);
    }
}


function showMessage(message, type) {
    if (!novaConversation) {
        return;
    }

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");
    messageElement.classList.add(type + "-message");

    const messageText = document.createElement("p");
    messageText.textContent = message;

    messageElement.appendChild(messageText);

    novaConversation.appendChild(messageElement);

    novaConversation.scrollTop = novaConversation.scrollHeight;
}


function showLoading() {
    if (!novaConversation) {
        return;
    }

    const loadingElement = document.createElement("div");

    loadingElement.classList.add("message");
    loadingElement.classList.add("ai-message");
    loadingElement.classList.add("loading-message");

    loadingElement.id = "novaLoading";

    const loadingText = document.createElement("p");
    loadingText.textContent = "Nova is thinking";

    const dots = document.createElement("span");
    dots.classList.add("loading-dots");
    dots.textContent = "...";

    loadingText.appendChild(dots);
    loadingElement.appendChild(loadingText);

    novaConversation.appendChild(loadingElement);

    novaConversation.scrollTop = novaConversation.scrollHeight;
}


function removeLoading() {
    const loadingElement = document.getElementById("novaLoading");

    if (loadingElement) {
        loadingElement.remove();
    }
}


async function askNova(message) {
    const cleanMessage = message.trim();

    if (cleanMessage === "" || !novaConversation) {
        return;
    }

    const welcome = document.querySelector(".nova-welcome");

    if (welcome) {
        welcome.remove();
    }

    showMessage(cleanMessage, "user");

    if (novaStatus) {
        novaStatus.textContent = "Thinking...";
    }

    showLoading();

    if (novaChatInput) {
        novaChatInput.value = "";
    }

    if (novaPrompt) {
        novaPrompt.value = "";
    }

    setTimeout(function () {
        removeLoading();

        showMessage(
            "Nova AI is being connected. The interface is ready for a real AI response.",
            "ai"
        );

        if (novaStatus) {
            novaStatus.textContent = "Ready";
        }
    }, 1000);
}


/* =========================
   NOVA SEARCH AND CHAT
========================= */

if (novaSearchForm) {
    novaSearchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = novaPrompt.value;

        scrollToNova();

        setTimeout(function () {
            askNova(message);
        }, 500);
    });
}


if (novaChatForm) {
    novaChatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        askNova(novaChatInput.value);
    });
}


promptExamples.forEach(function (button) {
    button.addEventListener("click", function () {
        const prompt = button.dataset.prompt;

        if (novaPrompt) {
            novaPrompt.value = prompt;
            novaPrompt.focus();
        }
    });
});


if (openNova) {
    openNova.addEventListener("click", function () {
        scrollToNova();
    });
}


if (ctaAskNova) {
    ctaAskNova.addEventListener("click", function () {
        const hero = document.getElementById("discover");

        if (hero) {
            hero.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (novaPrompt) {
            setTimeout(function () {
                novaPrompt.focus();
            }, 700);
        }
    });
}


/* =========================
   ACCOUNT / PROFILE TABS
========================= */

const accountTabs = document.querySelectorAll(".account-tab");
const accountTabContents = document.querySelectorAll(".account-tab-content");

accountTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const target = tab.dataset.tab;

        if (!target) {
            return;
        }

        accountTabs.forEach(function (otherTab) {
            otherTab.classList.remove("active");
        });

        accountTabContents.forEach(function (content) {
            content.classList.remove("active");
        });

        tab.classList.add("active");

        const selectedContent = document.getElementById(target);

        if (selectedContent) {
            selectedContent.classList.add("active");
        }
    });
});


/* =========================
   PROFILE PREFERENCES
========================= */

const preferenceOptions = document.querySelectorAll(".preference-option");

preferenceOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        option.classList.toggle("selected");
    });
});


/* =========================
   PRODUCT INFORMATION TABS
========================= */

const productTabs = document.querySelectorAll(".info-tab");
const productTabContents = document.querySelectorAll(".info-tab-content");

productTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const target = tab.dataset.productTab;

        if (!target) {
            return;
        }

        productTabs.forEach(function (otherTab) {
            otherTab.classList.remove("active");
        });

        productTabContents.forEach(function (content) {
            content.classList.remove("active");
        });

        tab.classList.add("active");

        const selectedContent = document.getElementById(target);

        if (selectedContent) {
            selectedContent.classList.add("active");
        }
    });
});


/* =========================
   PRODUCT GALLERY
========================= */

const galleryThumbnails = document.querySelectorAll(".gallery-thumb");
const mainProductPlaceholder = document.querySelector(".main-product-placeholder");

const productIcons = [
    "◉",
    "◒",
    "◌",
    "◐"
];

galleryThumbnails.forEach(function (thumbnail, index) {
    thumbnail.addEventListener("click", function () {
        galleryThumbnails.forEach(function (otherThumbnail) {
            otherThumbnail.classList.remove("active");
        });

        thumbnail.classList.add("active");

        if (mainProductPlaceholder) {
            mainProductPlaceholder.style.opacity = "0";
            mainProductPlaceholder.style.transform = "scale(0.9)";

            setTimeout(function () {
                mainProductPlaceholder.textContent =
                    productIcons[index] || "◉";

                mainProductPlaceholder.style.opacity = "1";
                mainProductPlaceholder.style.transform = "scale(1)";
            }, 180);
        }
    });
});


/* =========================
   SAVE PRODUCT BUTTONS
========================= */

const saveButtons = document.querySelectorAll(
    ".save-main-product, .icon-button[aria-label='Saved products']"
);

saveButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        button.classList.toggle("saved");

        if (button.classList.contains("saved")) {
            button.style.color = "#7c3aed";

            const text = button.querySelector("span");

            if (text) {
                text.textContent = "Saved";
            }
        } else {
            button.style.color = "";

            const text = button.querySelector("span");

            if (text) {
                text.textContent = "Save";
            }
        }
    });
});


/* =========================
   PRODUCT COMPARE BUTTON
========================= */

const compareButton = document.querySelector(".compare-product-button");

if (compareButton) {
    compareButton.addEventListener("click", function () {
        const originalText = compareButton.innerHTML;

        compareButton.innerHTML = "<span>✓</span> Added to comparison";

        setTimeout(function () {
            compareButton.innerHTML = originalText;
        }, 1800);
    });
}


/* =========================
   ASK NOVA PRODUCT BUTTON
========================= */

const askAboutProduct = document.querySelector(".ask-about-product");
const floatingNova = document.getElementById("floatingNova");

if (askAboutProduct) {
    askAboutProduct.addEventListener("click", function () {
        if (novaPanel) {
            scrollToNova();

            setTimeout(function () {
                askNova("Tell me about this product and whether it is a good choice for me.");
            }, 600);
        } else {
            alert("Nova AI chat will open here when the product page is connected to the Nova assistant.");
        }
    });
}


if (floatingNova) {
    floatingNova.addEventListener("click", function () {
        if (novaPanel) {
            scrollToNova();
        } else {
            alert("Nova AI will be connected across every Nova page.");
        }
    });
}