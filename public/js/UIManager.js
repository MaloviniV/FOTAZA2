export class UIManager {
  constructor() {
    this.searchForm = document.querySelector("#navbar-search-form");
    this.searchInput = document.querySelector("#navbar-search-input");
    this.navItems = document.querySelectorAll(".nav-item a");
    this.userBtn = document.querySelector("#user-btn");
    this.userMenuItem = document.querySelector(".user-menu-item");
  }

  init() {
    // Limpio el input de busqueda al cargar la pagina
    if (this.searchInput) {
      this.searchInput.value = "";
    }

    this.#addEventListeners();
    this.#initUserMenu();
    this.#highlightLink();
  }

  #addEventListeners() {
    if (this.searchForm && this.searchInput) {
      this.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.#performSearch();
      });
    }
  }

  #performSearch() {
    const searchTerm = this.searchInput.value.trim();

    if (searchTerm) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  }

  #initUserMenu() {
    if (this.userBtn && this.userMenuItem) {
      this.userBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.userMenuItem.classList.toggle("open");
      });

      document.addEventListener("click", (event) => {
        if (!this.userMenuItem.contains(event.target)) {
          this.userMenuItem.classList.remove("open");
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.userMenuItem.classList.remove("open");
        }
      });
    }
  }

  #highlightLink() {
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
