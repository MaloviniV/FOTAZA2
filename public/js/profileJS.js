document.addEventListener("DOMContentLoaded", () => {
  const btnFollow = document.getElementById("btn-follow");
  const followersCountEl = document.getElementById("followers-count");

  if (btnFollow) {
    btnFollow.addEventListener("click", async () => {
      const userId = btnFollow.dataset.userId;

      btnFollow.disabled = true;

      try {
        const response = await fetch(`/user/${userId}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          let currentCount = parseInt(followersCountEl.textContent);

          if (data.isFollowing) {
            btnFollow.textContent = "Dejar de seguir";
            btnFollow.classList.replace("primary", "secondary");
            followersCountEl.textContent = currentCount + 1;
          } else {
            btnFollow.textContent = "Seguir";
            btnFollow.classList.replace("secondary", "primary");
            followersCountEl.textContent = currentCount - 1;
          }
        } else {
          alert(data.error || "Ocurrió un error.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      } finally {
        btnFollow.disabled = false;
      }
    });
  }
});
