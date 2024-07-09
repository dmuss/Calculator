const errDialog = document.querySelector("dialog");
const errDialogOkBtn = document.querySelector("#close-error-btn");
errDialogOkBtn.addEventListener("click", () => {
  errDialog.close();
});

export function showErrorModalWithText(text) {
  const errDialogText = document.querySelector("dialog>p");
  errDialogText.innerText = text;
  errDialog.showModal();
}

export function modalIsOpen() {
  return errDialog.open;
}
