export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => feather.replace(), 100); // re-render feather icons
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

// Close modals with ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModals = document.querySelectorAll(
      ".fixed.bg-black.bg-opacity-50:not(.hidden)"
    );
    openModals.forEach((modal) => {
      const modalId = modal.id;
      if (modalId) closeModal(modalId);
    });
  }
});

// Close modals when clicking outside
document
  .querySelectorAll(".fixed.bg-black.bg-opacity-50")
  .forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });