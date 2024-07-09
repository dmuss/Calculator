export function removeHighlightFromOperatorButtons() {
  const currentlyHighlightedButtonElement = document.querySelector(
    '.operator-btn[class~="highlight"]',
  );

  if (currentlyHighlightedButtonElement) {
    currentlyHighlightedButtonElement.classList.remove("highlight");
  }
}

export function highlightOperatorButton(buttonChar) {
  removeHighlightFromOperatorButtons();

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

/**
 * Shows the same button down effect as a mouse click when using keyboard
 * input.
 */
export function pressButtonById(id) {
  const buttonElementToPress = document.querySelector(id);
  if (buttonElementToPress) {
    buttonElementToPress.classList.add("active");
  }
}

/**
 * Returns a button to default display as though user released a click when
 * using keyboard input.
 */
export function releaseButtonById(id) {
  const buttonElementToRelease = document.querySelector(id);
  buttonElementToRelease.classList.remove("active");
}
