const dialogElement = document.querySelector("dialog");
const okButtonElement = document.querySelector("#close-error-btn");

okButtonElement.addEventListener("click", () => {
  dialogElement.close();
});

export function isErrorModalOpen() {
  return dialogElement.open;
}

export function showErrorModalWithText(text) {
  const dialogTextElement = document.querySelector("dialog>p");
  dialogTextElement.innerText = text;

  dialogElement.showModal();
}
