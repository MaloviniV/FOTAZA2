document.addEventListener("DOMContentLoaded", ()=>{
  const deleteBtn = document.getElementById("deletePost-btn");

  if(deleteBtn){
    deleteBtn.addEventListener("click", async () => {
      const postId = deleteBtn.getAttribute("data-idPost");

      const message = "¿Estás seguro de que deseas borrar este álbum? Esta acción no se puede deshacer.";
      const deletePost = async () => {
        try {
          const response = await fetch(`/post/${postId}`,{
            method: "DELETE"
          });

          const result = await response.json();

          if(!response.ok) throw new Error(result.error || "No se pudo eliminar el Album");

          window.location.href = `/dashboard/posts`;
        } catch (error) {
          console.error("❌ Error al borrar el Album", error);
          setTimeout(() => {  //lo demoro para no superponer los modales y tener un error
            window.showGlobalModal("error", "¡Error!", error.message, "Aceptar", null);            
          }, 300);
        }
      };
      window.showGlobalModal("","Borrar Registro", message, "Aceptar",deletePost,"Cancelar","");
    });
  }
});