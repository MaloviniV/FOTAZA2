document.addEventListener("DOMContentLoaded", () => {
  const btnDelete = document.getElementById("btn-delete");

  // BOTON BORRAR
  if (btnDelete) {
    btnDelete.addEventListener("click", async (e) => {
      const fileId = btnDelete.dataset.fileId;
      const postId = btnDelete.dataset.postId;
      const deleteButton = e.currentTarget;
      deleteButton.disabled = true; // Desactivamos para evitar dobles clics

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
          deleteButton.disabled = false;
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
        "info",
        "Borrar Archivo",
        message,
        "Borrar",
        deleteFile,
        "Cancelar",
        null,
      );
    });
  }

  //VALORACION
  const starsContainer = document.querySelector(
    ".stars-container:not(.disabled)",
  );
  if (starsContainer) {
    const stars = starsContainer.querySelectorAll(".star-icon");
    const ratingItem = document.querySelector(".rating-item");
    const fileId = ratingItem.dataset.fileId;
    const postId = ratingItem.dataset.postId;

    let currentRating = Array.from(stars).filter((star) =>
      star.classList.contains("fa-solid"),
    ).length;

    const updateStarsUI = (hoverValue) => {
      stars.forEach((star) => {
        const starValue = parseInt(star.dataset.value, 10);
        if (starValue <= hoverValue) {
          star.classList.remove("fa-regular");
          star.classList.add("fa-solid");
        } else {
          star.classList.remove("fa-solid");
          star.classList.add("fa-regular");
        }
      });
    };

    starsContainer.addEventListener("mouseover", (e) => {
      if (e.target.matches(".star-icon")) {
        const hoverValue = parseInt(e.target.dataset.value, 10);
        updateStarsUI(hoverValue);
      }
    });

    starsContainer.addEventListener("mouseleave", () => {
      updateStarsUI(currentRating);
    });

    starsContainer.addEventListener("click", async (e) => {
      if (e.target.matches(".star-icon")) {
        const score = parseInt(e.target.dataset.value, 10);

        try {
          const response = await fetch(`/post/${postId}/file/${fileId}/rate`, {
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

            // Animacion de la estrella
            e.target.style.transform = "scale(1.3)";
            setTimeout(() => (e.target.style.transform = "scale(1)"), 200);
          } else {
            window.showGlobalModal(
              "error",
              "Error de Valoración",
              data.error || "Inicia sesión para poder valorar.",
            );
          }
        } catch (err) {
          console.error("Error de conexión al valorar:", err);
          window.showGlobalModal(
            "error",
            "Error de Conexión",
            "No se pudo guardar la valoración. Inténtalo de nuevo.",
          );
        }
      }
    });
  }

  // BORRAR COMENTARIO
  const deleteCommentBtns = document.querySelectorAll(".btn-delete-comment");
  if (deleteCommentBtns.length > 0) {
    deleteCommentBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.postId;
        const fileId = btn.dataset.fileId;
        const commentId = btn.dataset.commentId;

        const message = "¿Estás seguro de que deseas borrar este comentario?";
        const deleteComment = async () => {
          btn.disabled = true;
          try {
            const response = await fetch(
              `/post/${postId}/file/${fileId}/comment/${commentId}`,
              {
                method: "DELETE",
              },
            );

            const result = await response.json();
            if (!response.ok)
              throw new Error(
                result.error || "No se pudo eliminar el comentario",
              );

            const commentItem = btn.closest(".d-flex.gap-3");
            if (commentItem) {
              const commentsContainer = commentItem.parentElement;
              commentItem.remove();

              if (
                commentsContainer &&
                commentsContainer.children.length === 0
              ) {
                const emptyStateDiv = document.createElement("div");
                emptyStateDiv.className = "text-center py-4";
                const emptyStateP = document.createElement("p");
                emptyStateP.className = "text-muted mb-0";
                emptyStateP.textContent =
                  "No hay comentarios aún. ¡Sé el primero en opinar!";
                emptyStateDiv.appendChild(emptyStateP);

                commentsContainer.replaceWith(emptyStateDiv);
              }
            }
          } catch (error) {
            console.error("❌ Error al borrar el comentario:", error);
            btn.disabled = false;
            setTimeout(
              () =>
                window.showGlobalModal(
                  "error",
                  "¡Error!",
                  error.message,
                  "Aceptar",
                  null,
                ),
              300,
            );
          }
        };

        window.showGlobalModal(
          "info",
          "Borrar Comentario",
          message,
          "Borrar",
          deleteComment,
          "Cancelar",
          null,
        );
      });
    });
  }
});
