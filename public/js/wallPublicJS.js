document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.querySelector(".wall-more-btn");
  const gridContainer = document.querySelector(".grid-container");

  if (loadMoreBtn && gridContainer) {
    loadMoreBtn.addEventListener("click", async (e) => {
      const btn = e.target;
      const offset = btn.dataset.offset; 

      try {
        const response = await fetch(`/image/loadImages?offset=${offset}`);
        const { hasMore, nextOffset, fotos } = await response.json();

        let fragment = document.createDocumentFragment();

        fotos.forEach(foto => {
          const div = document.createElement("div");
          div.classList.add("grid-item");

          const img = document.createElement("img");
          img.src = `/imagenes/${foto}`;
          img.alt = "imagen";
          img.loading = "lazy";

          div.appendChild(img);
          fragment.appendChild(div);
        });

        gridContainer.appendChild(fragment);

        console.log(btn.dataset.offset);
        btn.dataset.offset = nextOffset;

        if (!hasMore) btn.style.display = "none";
      } catch (error) {
        console.error("Error al cargar mas imagenes:", error);
      }
    });
  }
});