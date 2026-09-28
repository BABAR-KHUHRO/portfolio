// assets/js/preloader.js
// Exact copy of your old working behavior, isolated in one file.

document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector(".preloader");
    const fill = document.querySelector(".progress-fill");
  
    if (!preloader || !fill) return;
  
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2; // +2% per tick
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => preloader.classList.add("hidden"), 500);
      }
      fill.style.width = progress + "%";
    }, 50); // tick every 50ms
  });
  