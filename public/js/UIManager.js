export class UIManager {
  constructor() {
    this.searchInput = document.querySelector(".navbar-search-input");
    this.searchBtn = document.querySelector(".navbar-search-btn");
    this.loadMoreBtn = document.querySelector(".wall-more-btn");
    this.gridContainer = document.querySelector(".grid-container");
    this.navItems = document.querySelectorAll(".nav-item a");
  }

  init() {
    // Limpio el input de busqueda al cargar la pagina
    if (this.searchInput) {
      this.searchInput.value = "";
    }

    this.#addEventListeners();
    
    this.#highlightLink();

  }

  #addEventListeners() {
    if(this.searchBtn && this.searchInput){
      this.searchBtn.addEventListener("click", () => this.#performSearch());
      this.searchInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") this.#performSearch();
      });
    }

    if(this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", async (e) => {
        const btn = e.target;
        const offset = btn.dataset.offset; 

        const response = await fetch(`/image/loadImages?offset=${offset}`);
        const { hasMore, nextOffset, fotos } = await response.json();

        this.#chargeImages(fotos);
        console.log(btn.dataset.offset);
        btn.dataset.offset = nextOffset;

        if(!hasMore) btn.style.display = "none";
      });
    }
  }

  #performSearch() {
    const searchTerm = this.searchInput.value.trim();

    if(searchTerm){
      console.log(`BUSCAR ${searchTerm}`);
    }
  }

  #chargeImages(fotos) {
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

    this.gridContainer.appendChild(fragment);
  }

  #highlightLink(){
    const currentPath = window.location.pathname;

    this.navItems.forEach((item) => {
      const linkHref = item.getAttribute("href");

      if (linkHref === currentPath) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
}
