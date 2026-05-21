document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".nav-tab");
  const wallNavegation = document.getElementById("wall-navegation");

  //Cargo el contenido de cada pestaña
  const loadTabContent = async (tabId) => {
    //Muestro el estado de carga
    wallNavegation.innerHTML =
      "<p class='loading-text'>Cargando contenido...</p>";

    try {
      //***** HARDCODEADO FECTCH AL SERVIDOR *****/
      setTimeout(() => {
        if (tabId === "posts-btn") {
          wallNavegation.innerHTML = `
            <div class="posts-grid">
              <img src="https://picsum.photos/id/10/300/300" alt="Post 1">
              <img src="https://picsum.photos/id/11/300/300" alt="Post 2">
              <img src="https://picsum.photos/id/12/300/300" alt="Post 3">
              <img src="https://picsum.photos/id/13/300/300" alt="Post 4">
              <img src="https://picsum.photos/id/14/300/300" alt="Post 5">
              <img src="https://picsum.photos/id/15/300/300" alt="Post 6">
            </div>
          `;
        } else if (tabId === "colections-btn") {
          wallNavegation.innerHTML = `
            <div class="collections-list">
              <div class="collection-item">
                <h4>Mis Paisajes Favoritos</h4>
                <p>12 fotos • Actualizado hace 2 días</p>
              </div>
              <div class="collection-item">
                <h4>Inspiración UI/UX</h4>
                <p>45 fotos • Actualizado hace 1 semana</p>
              </div>
            </div>
          `;
        } else if (tabId === "following-btn") {
          wallNavegation.innerHTML = `
            <div class="followers-list">
              <div class="follower-item">
                <img src="https://i.pravatar.cc/150?u=1" alt="User 1">
                <div>
                  <p class="follower-name">Ana García</p>
                  <p class="follower-username">@anagarcia</p>
                </div>
              </div>
              <div class="follower-item">
                <img src="https://i.pravatar.cc/150?u=2" alt="User 2">
                <div>
                  <p class="follower-name">Carlos López</p>
                  <p class="follower-username">@carlopez</p>
                </div>
              </div>
            </div>
          `;
        }
      }, 300);
    } catch (error) {
      console.error("Error al cargar el contenido de la pestaña:", error);
      wallNavegation.innerHTML =
        "<p class='error-text'>Error al cargar el contenido.</p>";
    }
  };

  // Asigno el evento a las pestañas
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      tabs.forEach((t) => t.classList.remove("active"));

      const selectedTab = e.currentTarget;
      selectedTab.classList.add("active");

      loadTabContent(selectedTab.id);
    });
  });

  // CARGO LOS "POSTS" AL INICIAR LA PAGINA
  loadTabContent("posts-btn");
});
