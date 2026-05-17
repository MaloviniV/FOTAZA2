import { UIManager } from "./UIManager.js";

const ui = new UIManager();

const checkbox = document.querySelector("#hasCopyright_image input");
const textCopyright = document.querySelector("#copyright_text");
const inputTextCopyright = document.querySelector("#copyright_text input");
const imageInput = document.querySelector("#image");
const imagePreview = document.querySelector("#image_preview");

const handleCheckbox = () => {
  if (checkbox.checked) {
    inputTextCopyright.required = true;
    inputTextCopyright.disabled = false;
  } else {
    inputTextCopyright.disabled = true;
    inputTextCopyright.required = false;
    inputTextCopyright.value = "";
  }
  textCopyright.classList.toggle("oculto", !checkbox.checked);
};

const handleImagePreview = () => {
  const file = imageInput.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove("oculto");
  } else {
    imagePreview.src = "";
    imagePreview.classList.add("oculto");
  }
};

checkbox.addEventListener("change", () => {
  handleCheckbox();
  if (checkbox.checked) inputTextCopyright.focus();
});

imageInput.addEventListener("change", handleImagePreview);

handleCheckbox();
handleImagePreview();