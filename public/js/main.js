document.addEventListener("DOMContentLoaded", () => {
  // --- FORMULARIO DE BUSQUEDA ---
  const searchForm = document.querySelector("#navbar-search-form");
  const searchInput = document.querySelector("#navbar-search-input");

  if (searchForm && searchInput) {
    searchInput.value = "";

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      }
    });
  }

  // --- RESALTA EL BOTON ACTIVO Y PINTA LOS DE LOGIN Y REGISTER ---
  const navLinks = document.querySelectorAll(".navbar-nav .btn, .dropdown-menu .dropdown-item");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }


    if (link.id === "nav-login-btn" && currentPath.includes("/auth/login")) {
      link.classList.replace("btn-outline-primary", "btn-primary");
      link.classList.add("shadow-sm");
    } else if (link.id === "nav-register-btn" && currentPath.includes("/auth/register")) {
      link.classList.replace("btn-outline-primary", "btn-primary");
      link.classList.add("shadow-sm");
    }
  });
});
