import * as Page from "./modules/page/page.js";

document.addEventListener("DOMContentLoaded", () => {
  Page.setThemeFromLocalStorageOrDefault();
});

// TODO: Move theme toggle into page, not part of calculator despite button
// being visually part of it.
document.addEventListener("keydown", Page.handleKeyDown);
document.addEventListener("keyup", Page.handleKeyUp);

/**************
 * CALCULATOR *
 **************/
const calc = document.querySelector("#calculator");
function handleCalculatorException(err) {
  if (err instanceof Calc.DisplayParseError) {
    highlightOperatorButton(Calc.getOperatorString());
    showErrorModalWithText(err.message);
  }

  if (err instanceof Calc.DivByZeroError) {
    showErrorModalWithText(err.message);
  }
}
function clearOperatorButtonHighlight() {
  let currentlyHighlightedButton = document.querySelector(
    '.op-btn[class~="highlight"]',
  );

  if (currentlyHighlightedButton) {
    currentlyHighlightedButton.classList.remove("highlight");
  }
}

function highlightOperatorButton(char) {
  clearOperatorButtonHighlight();

  let operatorButton = null;
  switch (char) {
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

/**********************
 * CALCULATOR DISPLAY *
 **********************/
const calcDisplayTextElem = document.querySelector("#display-text");
const calcMemoElem = document.querySelector("#display-memo");

function updateCalcDisplay() {
  calcDisplayTextElem.textContent = Calc.getDisplayString();
  calcMemoElem.textContent = Calc.getMemoString();
}

/***************
 * ERROR MODAL *
 ***************/
const errDialog = document.querySelector("dialog");
const errDialogOkBtn = document.querySelector("#close-error-btn");
errDialogOkBtn.addEventListener("click", () => {
  errDialog.close();
});

function showErrorModalWithText(text) {
  const errDialogText = document.querySelector("dialog>p");
  errDialogText.innerText = text;
  errDialog.showModal();
}
calc.addEventListener("click", Page.handleMouseInput);
