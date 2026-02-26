const links = document.querySelectorAll(".nav a");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!link.getAttribute("href").startsWith("#")) return;
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.");
    form.reset();
  });
}

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tab;
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    const panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add("active");
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));
