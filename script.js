const revealElements = document.querySelectorAll(".reveal");
const siteUrl =
  document.body.dataset.siteUrl ||
  (window.location.protocol.startsWith("http")
    ? window.location.href
    : "https://thalitatoscano.github.io/Site/");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  revealObserver.observe(element);
});

const canvas = document.getElementById("ambient-canvas");
const context = canvas.getContext("2d");
const particles = [];
const particleCount = window.innerWidth < 768 ? 28 : 48;

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function createParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.8,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: Math.random() * 0.22 + 0.08,
    alpha: Math.random() * 0.35 + 0.08,
  };
}

function seedParticles() {
  particles.length = 0;
  for (let index = 0; index < particleCount; index += 1) {
    particles.push(createParticle());
  }
}

function drawParticles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.y > window.innerHeight + 20) {
      particle.y = -20;
      particle.x = Math.random() * window.innerWidth;
    }

    if (particle.x < -20) {
      particle.x = window.innerWidth + 20;
    }

    if (particle.x > window.innerWidth + 20) {
      particle.x = -20;
    }

    context.beginPath();
    context.fillStyle = `rgba(242, 216, 162, ${particle.alpha})`;
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });

  window.requestAnimationFrame(drawParticles);
}

resizeCanvas();
seedParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

const qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(siteUrl)}`;
const qrImage = document.getElementById("qr-image");
const qrImageLarge = document.getElementById("qr-image-large");
const qrTrigger = document.getElementById("qr-trigger");
const qrModal = document.getElementById("qr-modal");
const qrClose = document.getElementById("qr-close");
const qrSiteLink = document.getElementById("qr-site-link");
const qrDirectLink = document.getElementById("qr-direct-link");

qrImage.src = qrSource;
qrImageLarge.src = qrSource;
qrSiteLink.href = siteUrl;
qrDirectLink.href = siteUrl;

function openQrModal() {
  qrModal.classList.add("is-open");
  qrModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeQrModal() {
  qrModal.classList.remove("is-open");
  qrModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

qrTrigger.addEventListener("click", openQrModal);
qrClose.addEventListener("click", closeQrModal);

qrModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeQr === "true") {
    closeQrModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && qrModal.classList.contains("is-open")) {
    closeQrModal();
  }
});
