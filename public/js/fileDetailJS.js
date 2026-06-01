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
});
