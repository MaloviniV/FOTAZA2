document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form_post");
  const postIdInput = form?.querySelector("#postId-input");
  const submitBtn = form?.querySelector("button[type='submit']");
  const cancelBtn = document.getElementById("cancel_btn");
  const tagsSelect = document.getElementById("tags");

  const postId = postIdInput?.value;

  //EVENTO SUBMIT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //AGREGAR VALIDACIONES DE LOS CAMPOS

    submitBtn.disabled = true;

    try {
      const datos = {
        title: form.title?.value,
        description: form.description?.value,
        selectedTags: Array.from(form.selectedTags?.selectedOptions || []).map(
          (opt) => opt.value,
        ),
        openComments: form.openComments?.checked,
      };

      if (postId) {
        //MODIFICAR ALBUM (PUT)
        const response = await fetch(`/post/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        const result = await response.json();

        if (!response.ok)
          throw new Error(result.error || "No se pudo modificar el Album");

        window.showGlobalModal(
          "success",
          "¡Exito!",
          "¡Modificacion del album exitosa!",
          "Ir al Album",
          `/post/${postId}`,
        );
      } else {
        //CREAR ALBUM (POST)
        const response = await fetch("/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        const result = await response.json();

        if (!response.ok)
          throw new Error(result.error || "¡No se pudo crear el Album!");

        window.showGlobalModal(
          "success",
          "¡Exito!",
          "¡Creación del album exitosa!",
          "Ir al Album",
          `/post/${result.postId}`,
          "Subir Archivo",
          `/post/${result.postId}/file?titlePost=${datos.title}`,
        );
      }
    } catch (error) {
      console.error("❌ Error al crear/modifiicar el Album:" + error);

      submitBtn.disabled = false;
      window.showGlobalModal(
        "error",
        "¡Error!",
        error.message,
        "Reintentar",
        null,
        "Cancelar",
        `dashboard/posts/`,
      );
    }
  });

  //EVENTO BOTON CANCELAR
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (postId) {
        window.location.href = `/post/${postId}`;
      } else {
        window.location.href = "/dashboard/posts";
      }
    });
  }

  //Manejo de los tags mediante Slim Select
  if (tagsSelect) {
    try {
      new SlimSelect({
        select: "#tags",
        settings: {
          placeholderText: "Buscar etiqueta...",
          searchText: "No se encontraron etiquetas",
          searchPlaceholder: "Buscar...",
        },
      });
    } catch (error) {
      console.error("Error al inicializar Slim Select:", error);
    }
  }
});
