import {
  setThemeFromLocalStorageOrDefault,
  toggleTheme,
} from "./scripts/themes.js";
import { Calculator as Calc } from "./scripts/calculator.js";
import { DivByZeroError, DisplayParseError } from "./scripts/errors.js";

document.addEventListener("DOMContentLoaded", () => {
  updateCalcDisplay();
  setThemeFromLocalStorageOrDefault();
});

/********************
 * KEYBOARD SUPPORT *
 ********************/
function downKeyIsCalcKey(key) {
  return (
    (key >= "0" && key <= "9") ||
    [
      ".",
      "+",
      "-",
      "*",
      "/",
      "=",
      "Backspace",
      "Delete",
      "Escape",
      "Enter",
    ].includes(key)
  );
}

document.addEventListener("keydown", (event) => {
  if (downKeyIsCalcKey(event.key)) {
    event.preventDefault();
    return false;
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key == ".") {
    Calc.pushDisplay(event.key);
  }

  if (["+", "-", "*", "/"].includes(key)) {
    Calc.setOperator(key);
    focusOperatorBtn(key);
  }

  if (["=", "Enter"].includes(key)) {
    Calc.equals();
    clearFocus();
  }

  if (key === "Backspace") {
    Calc.backspace();
  }

  if (key === "Delete") {
    Calc.clearDisplay();
  }

  if (key === "Escape") {
    Calc.allClear();
  }

  if (key === "t" || key === "T") {
    toggleTheme();
  }

  updateCalcDisplay();
});

/**************
 * CALCULATOR *
 **************/
const calc = document.querySelector("#calculator");
calc.addEventListener("click", (event) => {
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

    updateCalcDisplay();
  } catch (err) {
    if (err instanceof DisplayParseError) {
      clearFocus();
      focusOperatorBtn(Calc.opStr);
    }

    if (err instanceof DivByZeroError) {
      showErrorModalWithText(err.message);
    }

    updateCalcDisplay();
  }
});

function clearFocus() {
  if (document.hasFocus()) {
    document.activeElement.blur();
  }
}

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

/**********************
 * CALCULATOR DISPLAY *
 **********************/
const calcDisplayElem = document.querySelector("#display");
const calcMemoElem = document.querySelector("#display-memo");

function updateCalcDisplay() {
  calcDisplayElem.textContent = Calc.displayStr;
  calcMemoElem.textContent = Calc.memoStr;
}

/***************
 * ERROR MODAL *
 ***************/
const errDialog = document.querySelector("dialog");
const errDialogOkBtn = document.querySelector("button.close");
errDialogOkBtn.addEventListener("click", () => {
  errDialog.close();
});

function showErrorModalWithText(text) {
  errDialog.firstElementChild.innerText = text;
  errDialog.showModal();
}
