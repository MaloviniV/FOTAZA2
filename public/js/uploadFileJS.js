document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file");
  const imagePreview = document.getElementById("image_preview");
  const videoPreview = document.getElementById("video_preview");
  const hasCopyrightCheckbox = document.getElementById("hasCopyright");
  const copyrightTextContainer = document.getElementById("copyright_text");
  const uploadBtn = document.getElementById("upload_btn");
  const cancelBtn = document.getElementById("cancel_btn");
  const form = document.getElementById("form_uploadFile");

  //Previsializacion del archivo
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

  //Copyright
  if (hasCopyrightCheckbox && copyrightTextContainer) {
    hasCopyrightCheckbox.addEventListener("change", function () {
      copyrightTextContainer.classList.toggle("oculto", !this.checked);
    });
  }

  //Evento submit del formulario deshabilito el boton para evitar doble envio
  if (form && uploadBtn) {
    form.addEventListener("submit", () => {
      uploadBtn.disabled = true;
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "/dashboard"; // O a donde prefieras redirigir
    });
  }
});
