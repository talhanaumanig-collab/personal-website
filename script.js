const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");
if (storedTheme) root.setAttribute("data-theme", storedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// Mobile sidebar drawer
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function closeSidebar() {
  if (sidebar) sidebar.classList.remove("open");
  if (sidebarOverlay) sidebarOverlay.classList.remove("open");
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    if (sidebar) sidebar.classList.toggle("open");
    if (sidebarOverlay) sidebarOverlay.classList.toggle("open");
  });
}

if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".side-link").forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

// Scrollspy: highlight the sidebar link for the section in view (index.html only)
const links = document.querySelectorAll(".side-link");
const sections = Array.from(links)
  .map((link) => link.dataset.section && document.getElementById(link.dataset.section))
  .filter(Boolean);

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.side-link[data-section="${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Hobby card lightbox
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  let currentPhotos = [];
  let currentIndex = 0;
  let lastFocused = null;

  function showPhoto(i) {
    currentIndex = (i + currentPhotos.length) % currentPhotos.length;
    const photo = currentPhotos[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = photo.alt;
    lightboxCounter.textContent = currentPhotos.length > 1 ? `${currentIndex + 1} / ${currentPhotos.length}` : "";
    const multi = currentPhotos.length > 1;
    lightboxPrev.style.display = multi ? "flex" : "none";
    lightboxNext.style.display = multi ? "flex" : "none";
  }

  function openLightbox(photos, startIndex, trigger) {
    if (!photos.length) return;
    currentPhotos = photos;
    lastFocused = trigger || document.activeElement;
    showPhoto(startIndex);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".hobby-card").forEach((card) => {
    const photos = Array.from(card.querySelectorAll(".hobby-card-media img")).map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
    }));
    card.addEventListener("click", () => openLightbox(photos, 0, card));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showPhoto(currentIndex - 1));
  lightboxNext.addEventListener("click", () => showPhoto(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (e.key === "ArrowRight") showPhoto(currentIndex + 1);
  });
}
