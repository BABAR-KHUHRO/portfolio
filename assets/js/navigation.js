/* Static GitHub Pages navigation */
document.addEventListener("DOMContentLoaded", function () {
  const current = window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  document.querySelectorAll(".sidebar .nav a.nav-item").forEach(function (link) {
    const target = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (target === current) {
      link.classList.add("active");
    }
  });
});
