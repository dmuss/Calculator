import { trySetThemeFromLocalStorage, toggleTheme } from "./scripts/themes.js";
import { Calculator as Calc } from "./scripts/calculator.js";

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  trySetThemeFromLocalStorage();
});

const calculator = document.querySelector("#calculator");
calculator.addEventListener("click", (event) => {
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
          // All buttons without a specific `id` push to the display.
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
  } catch (e) {
    showErrorDialogWithText(e.message);
    Calc.allClear();
    updateDisplay();
  }
});

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
