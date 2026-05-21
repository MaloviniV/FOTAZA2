document.addEventListener("DOMContentLoaded", () => {
  const btnCancel = document.querySelector("#cancel_btn");

  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      window.location.href = "/dashboard";
    });
  }
});
