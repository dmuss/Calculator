import * as ErrorModal from "./errorModal.js";
import * as Calc from "../calculator/calculator.js";

export * from "./mouseInput.js";
export * from "./keyboardInput.js";
export function handleCalculatorException(err) {
  if (err instanceof Calc.DisplayParseError) {
    highlightOperatorButtonOrClear(Calc.getOperatorString());
    ErrorModal.showErrorModalWithText(err.message);
  }

  if (err instanceof Calc.DivByZeroError) {
    ErrorModal.showErrorModalWithText(err.message);
  }
}

const calcDisplayTextElem = document.querySelector("#display-text");
const calcMemoElem = document.querySelector("#display-memo");

export function updateCalcDisplay() {
  calcDisplayTextElem.textContent = Calc.getDisplayString();
  calcMemoElem.textContent = Calc.getMemoString();
}

export function highlightOperatorButtonOrClear(char = "") {
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

function clearOperatorButtonHighlight() {
  const currentlyHighlightedButton = document.querySelector(
    '.op-btn[class~="highlight"]',
  );

  if (currentlyHighlightedButton) {
    currentlyHighlightedButton.classList.remove("highlight");
  }
}
