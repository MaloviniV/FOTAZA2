document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.querySelector(".wall-more-btn");
  const gridContainer = document.querySelector(".grid-container");

  if (loadMoreBtn && gridContainer) {
    let offset = document.querySelectorAll(".card").length;

    loadMoreBtn.addEventListener("click", async () => {
      loadMoreBtn.disabled = true;

      try {
        const response = await fetch("/loadMoreFiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
        });

        if (!response.ok)
          throw new Error("Error al intentar recuperar los datos");

        const contentType = response.headers.get("Content-Type");
        
        if(contentType?.includes("application/json")){
          const data = await response.json();
          if(data.files.length === 0) loadMoreBtn.style.display="none";
        }else{
          const html = await response.text();
          gridContainer.insertAdjacentHTML("beforeend", html);
          offset = document.querySelectorAll(".card").length;
        }        
      } catch (error) {
        console.error("Error al cargar mas imagenes:", error);
        window.showGlobalModal("error", "Error de Carga", "Ocurrió un error al cargar más imágenes. Intenta nuevamente.");
      } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = "Cargar Más";
      }
    });
  }
});
