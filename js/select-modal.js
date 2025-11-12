const selectData = {
    gender: ["여자", "남자"],
    region: ["국내", "국외"],
    feed: ["신고하기", "차단하기"],
};

const selectModal = document.getElementById("selectModal");
const modalList = selectModal.querySelector(".modal-list");

const backdrop = document.createElement("div");
backdrop.className = "backdrop";
document.body.appendChild(backdrop);

let currentType = null;
let currentModal = null;

function openModal(type) {
    currentType = type;
    renderList(type);

    currentModal = selectModal;
    selectModal.classList.add("show");
    backdrop.style.display = "block";
}

function closeModal() {
    if (!currentModal) return;
    currentModal.classList.remove("show");
    currentModal.style.transform = "";
    backdrop.style.display = "none";
    currentModal = null;
}

function renderList(type) {
    modalList.innerHTML = "";

    (selectData[type] ?? []).forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
            const btn = document.querySelector(`[data-target="${type}"]`);
            if (btn) {
                // ✅ 버튼 내부에 img가 있는지 확인
                const hasImage = btn.querySelector("img");
                if (!hasImage) {
                    btn.textContent = item;
                }
            }
            closeModal();
        });
        modalList.appendChild(li);
    });
}

// ✅ 버튼 클릭 → 모달 열기
document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.target));
});

// ✅ 배경 클릭 → 닫기
backdrop.addEventListener("click", closeModal);

// ✅ 닫기 버튼
document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeModal);
});

// ✅ 드래그 핸들
const handle = selectModal.querySelector(".handle");
let startY = 0;
let dragging = false;
let translateY = 0;

handle.addEventListener("pointerdown", e => {
    dragging = true;
    startY = e.clientY;
    translateY = 0;
    selectModal.style.transition = "none";
    handle.setPointerCapture(e.pointerId);
});

handle.addEventListener("pointermove", e => {
    if (!dragging) return;
    const diff = e.clientY - startY;
    if (diff > 0) {
        translateY = diff;
        selectModal.style.transform = `translateY(${diff}px)`;
        e.preventDefault?.();
    }
}, { passive: false });

function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    selectModal.style.transition = "transform 0.25s ease";

    const ratio = translateY / selectModal.offsetHeight;
    if (ratio > 0.35) {
        closeModal();
    } else {
        selectModal.style.transform = "translateY(0)";
    }

    handle.releasePointerCapture?.(e.pointerId);
}

handle.addEventListener("pointerup", endDrag);
handle.addEventListener("pointercancel", endDrag);