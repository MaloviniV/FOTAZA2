document.addEventListener("DOMContentLoaded", () => {
  const btnDelete = document.getElementById("btn-delete");

  // BOTON BORRAR
  if (btnDelete) {
    btnDelete.addEventListener("click", async (e) => {
      const fileId = btnDelete.dataset.fileId;
      const postId = btnDelete.dataset.postId;
      const submitBtn = e.target;
      submitBtn.disabled = true; // Desactivamos para evitar dobles clics

      const message =
        "¿Estás seguro de que deseas borrar este archivo permanentemente?";

      const deleteFile = async () => {
        try {
          const response = await fetch(`/post/${postId}/file/${fileId}`, {
            method: "DELETE",
          });

          const result = await response.json();

          if (!response.ok)
            throw new Error(result.error || "No se pudo eliminar el Archivo");

          window.location.href = `/post/${postId}`;
        } catch (error) {
          console.error("❌ Error al intentar borrar un archivo:", error);
          submitBtn.disabled = false;
          setTimeout(() => {
            //lo demoro para no superponer los modales y tener un error
            window.showGlobalModal(
              "error",
              "¡Error!",
              error.message,
              "Aceptar",
              null,
            );
          }, 300);
        }
      };
      window.showGlobalModal(
        "",
        "Borrar Registro",
        message,
        "Aceptar",
        deleteFile,
        "Cancelar",
        "",
      );
    });
  }

  //VALORACION
  const starsContainer = document.querySelector(".stars-container");
  if (!starsContainer) return;

  const stars = starsContainer.querySelectorAll(".star-icon");
  const ratingItem = document.querySelector(".rating-item");
  const fileId = ratingItem.dataset.fileId;

  let currentRating = document.querySelectorAll(".star-icon.fa-solid").length;

  //pintar estrellas
  const updateStarsUI = (hoverValue) => {
    stars.forEach((star) => {
      const starValue = parseInt(star.dataset.value);
      if (starValue <= hoverValue) {
        star.classList.replace("fa-regular", "fa-solid");
      } else {
        star.classList.replace("fa-solid", "fa-regular");
      }
    });
  };

  stars.forEach((star) => {
    star.addEventListener("mouseover", (e) => {
      updateStarsUI(parseInt(e.target.dataset.value));
    });

    star.addEventListener("mouseout", () => {
      updateStarsUI(currentRating);
    });

    star.addEventListener("click", async (e) => {
      const score = parseInt(e.target.dataset.value);

      try {
        const response = await fetch(`/api/file/${fileId}/rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        });

        const data = await response.json();

        if (data.success) {
          currentRating = score;
          updateStarsUI(currentRating);

          const avgElement = document.querySelector(".rating-average");
          const countElement = document.querySelector(".rating-count");

          if (avgElement) avgElement.textContent = `${data.newAverage} / 5`;
          if (countElement)
            countElement.textContent = `(${data.newTotal} votos)`;

          //animacion de las estrellas
          e.target.style.transform = "scale(1.3)";
          setTimeout(() => (e.target.style.transform = "scale(1)"), 200);
        } else {
          alert(data.error || "Inicia sesión para poder valorar.");
        }
      } catch (err) {
        console.error("Error de conexión:", err);
      }
    });
  });
});
