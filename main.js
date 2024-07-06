import { trySetThemeFromLocalStorage, toggleTheme } from "./scripts/themes.js";
import { Calculator as Calc } from "./scripts/calculator.js";
import { DivByZeroError, DisplayParseError } from "./scripts/errors.js";

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  trySetThemeFromLocalStorage();
});

const calculator = document.querySelector("#calculator");
calculator.addEventListener("click", (event) => {
  // TODO: Can this be tightened up?
  try {
    const target = event.target;

    if (target.id === "theme-btn") {
      toggleTheme();
    }

    const targetClasses = target.className;

    if (targetClasses.includes("operand")) {
      switch (target.id) {
        case "clear-btn":
          Calc.clearDisplay();
          break;
        case "back-btn":
          Calc.backspace();
          break;
        case "negate-btn":
          Calc.negateDisplay();
          break;
        default:
          Calc.pushDisplay(target.textContent);
          break;
      }
    }

    if (targetClasses.includes("operator")) {
      Calc.setOperator(target.textContent);
    }

    if (targetClasses.includes("all-clear")) {
      Calc.allClear();
    }

    if (targetClasses.includes("equals")) {
      Calc.equals();
    }

    updateDisplay();
  } catch (err) {
    if (err instanceof DisplayParseError) {
      if (document.hasFocus()) {
        document.activeElement.blur();
      }

      focusOperatorBtn(Calc.opStr);
    }

    if (err instanceof DivByZeroError) {
      showErrorDialogWithText(err.message);
    }

    updateDisplay();
  }
});

function focusOperatorBtn(char) {
  switch (char) {
    case "+":
      document.querySelector("#add-btn").focus();
      break;
    case "-":
      document.querySelector("#sub-btn").focus();
      break;
    case "*":
      document.querySelector("#mul-btn").focus();
      break;
    case "/":
      document.querySelector("#div-btn").focus();
      break;
    default:
      break;
  }
}

const errDialog = document.querySelector("dialog");
const errDialogOkBtn = document.querySelector("button.close");
errDialogOkBtn.addEventListener("click", () => {
  errDialog.close();
});

const updateDisplay = () => {
  document.querySelector("#current-operand").textContent = Calc.displayStr;
  document.querySelector("#memo").textContent = Calc.memoStr;
};

const showErrorDialogWithText = (text) => {
  errDialog.firstElementChild.innerText = text;
  errDialog.showModal();
};
