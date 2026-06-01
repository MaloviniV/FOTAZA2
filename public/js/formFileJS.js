document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form_uploadFile");

  if (!form) return;

  const fileInput = document.getElementById("file");
  const imagePreview = document.getElementById("image_preview");
  const videoPreview = document.getElementById("video_preview");
  const hasCopyrightCheckbox = document.getElementById("hasCopyright");
  const copyrightTextContainer = document.getElementById("copyright_text");
  const cancelBtn = document.getElementById("cancel_btn");
  const tagsSelect = document.getElementById("tags");

  //PREVISUALIZACION DEL ARCHIVO
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0]; //Selecciono el archivo subido
      if (file) {
        // Creo una URL temporal para poder hacer la previsualizacion
        const fileURL = URL.createObjectURL(file);

        // Verifico el tipo de archivo
        if (file.type.startsWith("image/")) {
          imagePreview.src = fileURL;
          imagePreview.classList.remove("oculto");
          videoPreview.classList.add("oculto");
          videoPreview.src = "";
        } else if (file.type.startsWith("video/")) {
          videoPreview.src = fileURL;
          videoPreview.classList.remove("oculto");
          imagePreview.classList.add("oculto");
          imagePreview.src = "";
        }
      } else {
        imagePreview.classList.add("oculto");
        videoPreview.classList.add("oculto");
        imagePreview.src = "";
        videoPreview.src = "";
      }
    });
  }

  //MOSTRAR INPUT text Copyright
  const textCopyrightInput = document.querySelector(
    "input[name='textCopyright']",
  );
  if (textCopyrightInput && textCopyrightInput.value.trim() !== "") {
    hasCopyrightCheckbox.checked = true;
    copyrightTextContainer.classList.remove("oculto");
  }

  if (hasCopyrightCheckbox && copyrightTextContainer) {
    hasCopyrightCheckbox.addEventListener("change", function () {
      copyrightTextContainer.classList.toggle("oculto", !this.checked);
    });
  }

  //MANEJO DE LOS TAGS mediante Slim Select
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

  //BOTON GUARDAR (evento submit)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //VALIDACIONES DEL FORMULARIO
    // Validar que haya al menos un tag
    if (tagsSelect?.selectedOptions.length === 0) {
      alert(
        "Por favor, selecciona al menos una etiqueta (TAG) antes de subir el archivo.",
      );
      return;
    }

    //DESACTIVAR EL BOTON PARA EVITAR MULTIPLES ENVIOS
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    //ACCION
    try {
      const formData = new FormData(form);
      const idPost = formData.get("idPost");

      // Determinamos si es una edición (si hay un fileId en la URL)
      const urlParams = new URLSearchParams(window.location.search);
      const fileId = urlParams.get("fileId");

      if (fileId) {
        // EDITAR ARCHIVO (PUT)
        const response = await fetch(`/post/${idPost}/file/${fileId}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "No se pudo actualizar el archivo");

        window.showGlobalModal(
          "success",
          "¡Exito!",
          "¡Archivo actualizado exitosamente!",
          "Aceptar",
          `/post/${idPost}/file/${fileId}`,
        );
      } else {
        // CREAR ARCHIVO (POST)
        const response = await fetch(`/post/${idPost}/file/`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "No se pudo subir el archivo");

        form.reset();
        window.showGlobalModal(
          "success",
          "¡Exito!",
          "¡Archivo subido exitosamente!",
          "Subir otro archivo",
          window.location.href,
          "Ver mis Posts",
          "/dashboard/posts",
        );
      }

      submitBtn.disabled = false;
    } catch (error) {
      console.error("❌ Error al procesar el archivo: " + error);

      submitBtn.disabled = false;
      window.showGlobalModal(
        "error",
        "¡Error!",
        error.message,
        "Reintentar",
        null,
        "Cancelar",
        `/dashboard/posts/`,
      );
    }
  });

  //BOTON CANCELAR
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      const idPost = form.querySelector("#idPost_input")?.value;
      const urlParams = new URLSearchParams(window.location.search);
      const fileId = urlParams.get("fileId");

      if (fileId && idPost) {
        window.location.href = `/post/${idPost}/file/${fileId}`;
      } else if (idPost) {
        window.location.href = `/post/${idPost}`;
      } else {
        window.location.href = "/dashboard/posts";
      }
    });
  }
});
