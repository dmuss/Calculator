const ACTIVE_CLASS_NAME = "active";

export function removeHighlightFromOperatorButton() {
  const currentlyHighlightedButton = document.querySelector(
    '.op-btn[class~="highlight"]',
  );

  if (currentlyHighlightedButton) {
    currentlyHighlightedButton.classList.remove("highlight");
  }
}

export function highlightOperatorButton(buttonChar) {
  removeHighlightFromOperatorButton();

  let operatorButton = null;
  switch (buttonChar) {
    case "+":
      operatorButton = document.querySelector("#add-btn");
      break;
    case "-":
      operatorButton = document.querySelector("#sub-btn");
      break;
    case "*":
      operatorButton = document.querySelector("#mul-btn");
      break;
    case "/":
      operatorButton = document.querySelector("#div-btn");
      break;
    default:
      break;
  }

  if (operatorButton) {
    operatorButton.classList.add("highlight");
  }
}

export function pressButtonById(id) {
  const buttonElementToPress = document.querySelector(id);
  if (buttonElementToPress) {
    buttonElementToPress.classList.add(ACTIVE_CLASS_NAME);
  }
}

export function releaseButtonById(id) {
  const buttonElementToRelease = document.querySelector(id);
  buttonElementToRelease.classList.remove(ACTIVE_CLASS_NAME);
}
