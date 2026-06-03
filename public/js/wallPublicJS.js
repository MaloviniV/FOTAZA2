document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.querySelector(".wall-more-btn");
  const gridContainer = document.querySelector(".grid-container");

  if (loadMoreBtn && gridContainer) {
    let offset = document.querySelectorAll(".card").length;

    loadMoreBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/loadMoreFiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
        });

        if (!response.ok)
          throw new Error("Error al intentar recuperar los datos");

        const html = await response.text();

        gridContainer.insertAdjacentHTML("beforeend", html);

        offset = document.querySelectorAll(".card").length;
      } catch (error) {
        console.error("Error al cargar mas imagenes:", error);
        alert("Ocurrio un error al cargar mas imagenes. Intenta nuevamente");
      }
    });
  }
});
