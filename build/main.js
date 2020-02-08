const backToTopBtn = document.querySelector("#btn-back-to-top");

window.addEventListener("scroll", scrollFn);

function scrollFn() {
  if (window.pageYOffset > 250) {
    if (!backToTopBtn.classList.contains("btn-entrance")) {
      backToTopBtn.classList.remove("btn-exit");
      backToTopBtn.classList.add("btn-entrance");
      backToTopBtn.style.display = "block";
    }
  } else {
    if (backToTopBtn.classList.contains("btn-entrance")) {
      backToTopBtn.classList.remove("btn-entrance");
      backToTopBtn.classList.add("btn-exit");
      setTimeout(function() {
        backToTopBtn.style.display = "none";
      }, 150);
    }
  }
}

window.addEventListener("click", smoothScrollBackToTop);

// function backToTop() {
//   window.scrollTo(0, 0);
// }

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;

  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(
      0,
      easeInOutCubic(progress, startPosition, distance, duration)
    );
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}
