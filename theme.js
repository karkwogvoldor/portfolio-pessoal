const projectGrid = document.querySelector(".projects-grid");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectExpanded = document.getElementById("projectExpanded");
const projectsNext = document.querySelector(".projects-next");
const projectsPrev = document.querySelector(".projects-prev");
const scrollTopLinks = document.querySelectorAll("[data-scroll-top]");
const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formStatus = document.getElementById("formStatus");
const reloadPageLinks = document.querySelectorAll("[data-reload-page]");

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.innerHTML = `
  <button class="image-lightbox-nav image-lightbox-prev" type="button" aria-label="Imagem anterior">&lsaquo;</button>
  <button class="image-lightbox-close" type="button" aria-label="Fechar imagem">×</button>
  <img class="image-lightbox-img" alt="">
  <button class="image-lightbox-nav image-lightbox-next" type="button" aria-label="Próxima imagem">&rsaquo;</button>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".image-lightbox-img");
const lightboxClose = lightbox.querySelector(".image-lightbox-close");
const lightboxPrev = lightbox.querySelector(".image-lightbox-prev");
const lightboxNext = lightbox.querySelector(".image-lightbox-next");
let lightboxImages = [];
let lightboxIndex = 0;

const projectReadmes = {
  brasileirao: {
    stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Pydantic", "Cloudinary"],
    highlights: [
      "Galeria web para navegar pelos 20 clubes da Série A.",
      "Visualização de escalações, formações, reservas e craques dos times.",
      "Back-end focado em API REST, persistência relacional e integração com imagens em nuvem.",
    ],
    images: [
      {
        src: "https://raw.githubusercontent.com/karkwogvoldor/football_brasileirao_update/main/static/images/preview_home.png",
        alt: "Tela inicial do Football Brasileirão",
      },
      {
        src: "https://raw.githubusercontent.com/karkwogvoldor/football_brasileirao_update/main/static/images/preview_clube.png",
        alt: "Tela de escalação de clube",
      },
    ],
  },
  joseph: {
    stack: ["Python 3.12", "Django", "discord.py", "PostgreSQL", "BeautifulSoup4", "Playwright"],
    highlights: [
      "Bot de Discord para consultar granadas de Counter-Strike 2 por mapa e destino.",
      "Comandos para smokes, flashes, molotovs e HEs com instruções e vídeos de execução.",
      "Une bot, banco de dados, painel administrativo e importação de dados por scraping.",
    ],
    images: [
      { src: "assets/imagens/bot1.jpg", alt: "Joseph Bot no Discord" },
      { src: "assets/imagens/bot2.jpg", alt: "Resposta do Joseph Bot com utilitário de CS2" },
      { src: "assets/imagens/bot3.jpg", alt: "Consulta de granadas no Joseph Bot" },
      { src: "assets/imagens/bot4.jpg", alt: "Detalhe de execução enviada pelo Joseph Bot" },
    ],
  },
  avatar: {
    stack: ["Python 3.12", "Django", "PostgreSQL", "Gunicorn", "Railway", "HTML/CSS"],
    highlights: [
      "Consulta de personagens e lore de Avatar: The Last Airbender.",
      "Busca avançada, conteúdo bilíngue e tradução temática.",
      "Organização visual para personagens principais e secundários, priorizando personagens com imagem.",
    ],
    images: [
      { src: "assets/imagens/avatar-principal.png", alt: "Personagens principais do projeto Avatar" },
      { src: "assets/imagens/avatar-secundario.png", alt: "Personagens secundários do projeto Avatar" },
    ],
  },
  netflix: {
    stack: ["HTML5", "CSS3", "JavaScript", "Flexbox", "Grid", "Google Fonts"],
    highlights: [
      "Interface responsiva inspirada na Netflix, criada durante a Imersão Front-End da Alura.",
      "Layout com banner principal, navegação fixa e cards com efeitos de hover.",
      "Projeto focado em semântica HTML, composição visual, responsividade e organização de assets.",
    ],
    images: [
      { src: "assets/imagens/netflix1.png", alt: "Tela principal do Netflix Clone" },
      { src: "assets/imagens/netflix2.png", alt: "Cards e layout do Netflix Clone" },
    ],
  },
  "road-game": {
    stack: ["JavaScript", "HTML", "CSS", "GitHub Pages"],
    highlights: [
      "Jogo web de travessia com movimentação, obstáculos e lógica de colisão.",
      "Bom exercício de eventos, controle de estado, posicionamento e loop de jogo.",
      "O jogo roda direto no navegador pelo GitHub Pages.",
    ],
    embed: "https://karkwogvoldor.github.io/game_atravessar_a_estrada/",
    embedGame: true,
  },
};

scrollTopLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const scrollTarget = document.scrollingElement || document.documentElement;
    scrollTarget.scrollTop = 0;
    document.body.scrollTop = 0;
  });
});

reloadPageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.reload();
  });
});

function getProjectData(card) {
  return {
    number: card.querySelector(".card-num")?.textContent.trim() || "",
    tag: card.querySelector(".card-tag")?.textContent.trim() || "",
    title: card.querySelector(".card-title")?.textContent.trim() || "",
    desc: card.querySelector(".card-desc")?.textContent.trim() || "",
    expanded: card.dataset.expanded || card.querySelector(".card-desc")?.textContent.trim() || "",
    readme: projectReadmes[card.dataset.project],
    links: Array.from(card.querySelectorAll(".card-links a")).map((link) => ({
      href: link.href,
      label: link.textContent.trim(),
    })),
  };
}

function selectProject(card) {
  const project = getProjectData(card);
  const stack = project.readme?.stack || [];
  const highlights = project.readme?.highlights || [];
  const images = project.readme?.images || [];
  const embed = project.readme?.embed;
  const embedGame = project.readme?.embedGame;

  projectCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  projectExpanded.innerHTML = `
    <div class="project-expanded-card">
      <p class="project-expanded-kicker">${project.number} / ${project.tag}</p>
      <h2 class="project-expanded-title">${project.title}</h2>
      <p class="project-expanded-desc">${project.expanded}</p>
      ${
        stack.length
          ? `<div class="project-readme-section">
              <p class="project-readme-label">stack</p>
              <div class="project-stack">${stack.map((item) => `<span>${item}</span>`).join("")}</div>
            </div>`
          : ""
      }
      ${
        highlights.length
          ? `<div class="project-readme-section">
              <p class="project-readme-label">destaques</p>
              <ul class="project-highlights">${highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>`
          : ""
      }
      ${
        images.length
          ? `<div class="project-readme-section">
              <p class="project-readme-label">pr&eacute;via do README</p>
              <div class="project-gallery">
                ${images
                  .map(
                    (image) => `
                      <button class="project-gallery-item" type="button" data-full="${image.src}" data-alt="${image.alt}">
                        <img src="${image.src}" alt="${image.alt}" loading="lazy">
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </div>`
          : ""
      }
      ${
        embed
          ? `<div class="project-readme-section">
              <p class="project-readme-label">execu&ccedil;&atilde;o</p>
              <div class="project-embed-wrap ${embedGame ? "is-game" : ""}">
                <iframe class="project-embed ${embedGame ? "project-embed-game" : ""}" src="${embed}" title="Game Atravessar a Estrada" loading="lazy" scrolling="${embedGame ? "no" : "auto"}"></iframe>
                ${
                  embedGame
                    ? `<button class="project-game-focus" type="button">clique para jogar</button>`
                    : ""
                }
              </div>
              <p class="project-embed-help">
                &uarr; para andar para cima &middot; &darr; para andar para baixo
              </p>
            </div>`
          : ""
      }
      <div class="project-expanded-links">
        ${project.links
          .map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderLightboxImage() {
  const image = lightboxImages[lightboxIndex];
  if (!image) return;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxPrev.disabled = lightboxImages.length <= 1;
  lightboxNext.disabled = lightboxImages.length <= 1;
}

function openLightbox(src, alt, images = []) {
  lightboxImages = images.length ? images : [{ src, alt }];
  lightboxIndex = Math.max(0, lightboxImages.findIndex((image) => image.src === src));
  renderLightboxImage();
  lightbox.classList.add("is-open");
  document.body.classList.add("has-lightbox");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.classList.remove("has-lightbox");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxImages = [];
  lightboxIndex = 0;
}

function moveLightbox(direction) {
  if (lightboxImages.length <= 1) return;

  lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  renderLightboxImage();
}

function focusGame(gameWrap) {
  const iframe = gameWrap.querySelector(".project-embed-game");

  document.documentElement.classList.add("game-is-focused");
  document.body.classList.add("game-is-focused");
  gameWrap.classList.add("is-focused");
  iframe?.focus();
}

function releaseGameFocus() {
  document.documentElement.classList.remove("game-is-focused");
  document.body.classList.remove("game-is-focused");
  document.querySelectorAll(".project-embed-wrap.is-focused").forEach((wrap) => {
    wrap.classList.remove("is-focused");
  });
}

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    selectProject(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectProject(card);
  });
});

function updateProjectNav() {
  if (!projectGrid || !projectsPrev || !projectsNext) return;

  const maxScroll = projectGrid.scrollWidth - projectGrid.clientWidth;
  const atStart = projectGrid.scrollLeft <= 4;
  const atEnd = projectGrid.scrollLeft >= maxScroll - 4;

  projectsPrev.classList.toggle("is-hidden", atStart);
  projectsNext.classList.toggle("is-hidden", atEnd || maxScroll <= 0);
  projectsPrev.disabled = atStart;
  projectsNext.disabled = atEnd || maxScroll <= 0;
}

function scrollProjects(direction) {
  if (!projectGrid) return;

  projectGrid.scrollBy({
    left: direction * projectGrid.clientWidth * 0.85,
    behavior: "smooth",
  });

  window.setTimeout(updateProjectNav, 450);
}

projectsPrev?.addEventListener("click", () => scrollProjects(-1));
projectsNext?.addEventListener("click", () => scrollProjects(1));
projectGrid?.addEventListener("scroll", updateProjectNav);
window.addEventListener("resize", updateProjectNav);

projectExpanded?.addEventListener("click", (event) => {
  const galleryItem = event.target.closest(".project-gallery-item");
  const gameFocus = event.target.closest(".project-game-focus");

  if (galleryItem) {
    const galleryImages = [...galleryItem.closest(".project-gallery").querySelectorAll(".project-gallery-item")].map((item) => ({
      src: item.dataset.full,
      alt: item.dataset.alt || "",
    }));

    openLightbox(galleryItem.dataset.full, galleryItem.dataset.alt || "", galleryImages);
    return;
  }

  if (gameFocus) {
    focusGame(gameFocus.closest(".project-embed-wrap"));
  }
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => moveLightbox(-1));
lightboxNext.addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }

  if (lightbox.classList.contains("is-open") && event.key === "ArrowLeft") {
    moveLightbox(-1);
  }

  if (lightbox.classList.contains("is-open") && event.key === "ArrowRight") {
    moveLightbox(1);
  }

  if (event.key === "Escape" && document.body.classList.contains("game-is-focused")) {
    releaseGameFocus();
  }

  if (document.body.classList.contains("game-is-focused") && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
    event.preventDefault();
  }
});

window.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".project-embed-wrap")) {
    releaseGameFocus();
  }
});

if (projectCards.length > 0) {
  selectProject(projectCards[0]);
}

updateProjectNav();

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);

  sendBtn.disabled = true;
  sendBtn.textContent = "enviando...";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const response = await fetch("https://formsubmit.co/ajax/jeronimoef7@gmail.com", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("send failed");
    }

    formStatus.textContent = "mensagem enviada com sucesso.";
    formStatus.classList.add("ok");
    contactForm.reset();
  } catch {
    formStatus.textContent = "não foi possível enviar agora. tente novamente.";
    formStatus.classList.add("err");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "enviar mensagem →";
  }
});
