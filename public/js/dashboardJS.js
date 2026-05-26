document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".nav-tab");
  const divButtons = document.getElementById("bottons-container");
  const divCards = document.getElementById("cards-container");

  //Cargo el contenido de cada pestaña
  const loadTabContent = (tabId) => {
    divButtons.innerHTML = "";
    divCards.innerHTML = "";
    //Muestro el estado de carga
    divButtons.innerHTML = "<p class='loading-text'>Cargando contenido...</p>";

    let fragmentCards = document.createDocumentFragment();

    try {
      //***** HARDCODEADO FECTCH AL SERVIDOR *****/
      setTimeout(async () => {
        divButtons.innerHTML = "";
        if (tabId === "posts-btn") {
          const response = await fetch("/post/posts");
    
          const postsList = await response.json();

          const button = document.createElement("button");
          button.textContent = "Nuevo post";
          button.setAttribute("id","newPost-btn");
          divButtons.appendChild(button);

          postsList.forEach(post => {
            const cardPost = document.createElement("div");
            cardPost.classList.add("cardPost-container");
            cardPost.title = post.title;

              const containerImage = document.createElement("div");
              containerImage.classList.add("image-container");

                const postImage = document.createElement("img");
                postImage.src = post.path;
                postImage.alt = post.title;
                containerImage.appendChild(postImage);
            
              const metadata = document.createElement("div");
              metadata.classList.add("metadata-container");

                const title = document.createElement("h3");
                title.textContent = post.title;
                metadata.appendChild(title);

              cardPost.append(containerImage, metadata);
            fragmentCards.append(cardPost);
          });

          divCards.appendChild(fragmentCards);

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
      divButtons.innerHTML =
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

  divButtons.addEventListener("click", (e) => {
    if (e.target.id === "newPost-btn") {
      // Acción para crear post
    }
  });

  // CARGO LOS "POSTS" AL INICIAR LA PAGINA
  loadTabContent("posts-btn");
});