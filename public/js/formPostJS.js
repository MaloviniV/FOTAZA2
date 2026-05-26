document.addEventListener("DOMContentLoaded", () => {
  const form  = document.querySelector("form");
  const btnCancel = document.getElementById("cancel_btn");
  const tagsSelect = document.getElementById("tags");

  //Evento submit del formulario deshabilito el boton para evitar doble envio
  if (form) {
    const submitBtn = form.querySelector("button[type='submit']");
    form.addEventListener("submit", () => {
      submitBtn.disabled = true;
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      window.location.href = "/dashboard/posts";
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
