document.addEventListener("DOMContentLoaded", () => {
  // --- ELIMINAR POST (ÁLBUM) ---
  const deletePostBtn = document.getElementById("deletePost-btn");
  if (deletePostBtn) {
    deletePostBtn.addEventListener("click", (e) => {
      const postId = e.currentTarget.dataset.postId;

      const message =
        "¿Estás seguro de que quieres borrar este álbum y todas sus imágenes? Esta acción no se puede deshacer.";
      const deleteAction = async () => {
        try {
          const response = await fetch(`/post/${postId}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Error desconocido al borrar el álbum.");
          }
          
          setTimeout(()=>{
            window.showGlobalModal(
              "success",
              "Álbum Borrado",
              "El álbum ha sido eliminado correctamente."
            );

            setTimeout(() => (window.location.href = "/dashboard/posts"), 1500);
          },300);

        } catch (error) {
          console.error("Error al borrar el álbum:", error);
          setTimeout(() => {
            window.showGlobalModal("error", "Error", error.message);
          }, 300);
        }
      };

      window.showGlobalModal("info", "Confirmar Borrado", message, "Borrar", deleteAction, "Cancelar");
    });
  }

  // --- ELIMINAR UN ARCHIVO ---
  const deleteFileBtns = document.querySelectorAll(".btn-delete-file");
  deleteFileBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { postId, fileId } = e.currentTarget.dataset;
      const message = "¿Seguro que deseas borrar esta imagen?";

      const deleteAction = async () => {
        try {
          const response = await fetch(`/post/${postId}/file/${fileId}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Error desconocido al borrar la imagen.");
          }
          // Sacar tarjeta del DOM
          e.currentTarget.closest(".col-md-6").remove();

          window.showGlobalModal("success", "Imagen Borrada", "La imagen ha sido eliminada.");
        } catch (error) {
          console.error("Error al borrar la imagen:", error);
          window.showGlobalModal("error", "Error", error.message);
        }
      };

      window.showGlobalModal("info", "Confirmar Borrado", message, "Borrar", deleteAction, "Cancelar");
    });
  });
});

