import {
  setThemeFromLocalStorageOrDefault,
  toggleTheme,
} from "./scripts/themes.js";
import { Calculator as Calc } from "./scripts/calculator.js";
import { DivByZeroError, DisplayParseError } from "./scripts/errors.js";

document.addEventListener("DOMContentLoaded", () => {
  setThemeFromLocalStorageOrDefault();
  updateCalcDisplay();
});

/********************
 * KEYBOARD SUPPORT *
 ********************/
const keyMap = {
  Backspace: "#back-btn",
  Delete: "#clear-btn",
  Escape: "#all-clear-btn",
  Enter: "#equals-btn",
  "=": "#equals-btn",
  ".": "#decimal-btn",
  "+": "#add-btn",
  "-": "#sub-btn",
  "*": "#mul-btn",
  "/": "#div-btn",
  0: "#zero-btn",
  1: "#one-btn",
  2: "#two-btn",
  3: "#three-btn",
  4: "#four-btn",
  5: "#five-btn",
  6: "#six-btn",
  7: "#seven-btn",
  8: "#eight-btn",
  9: "#nine-btn",
  t: "#theme-btn",
  T: "#theme-btn",
  s: "#sign-btn",
  S: "#sign-btn",
};

document.addEventListener("keydown", (event) => {
  if (!errDialog.open) {
    if (keyMap[event.key] !== undefined) {
      event.preventDefault();

      const downKey = event.key;
      const pressedElem = document.querySelector(keyMap[downKey]);
      if (pressedElem) {
        if (!pressedElem.className.includes("active")) {
          pressedElem.className += " active";

          try {
            Calc.processKeyboardInput(downKey);

            if (["=", "Enter", "Escape"].includes(downKey)) {
              clearFocus();
            }

            if (["+", "-", "*", "/"].includes(downKey)) {
              focusOperatorBtn(downKey);
            }

            if (downKey === "t" || downKey === "T") {
              toggleTheme();
              focusOperatorBtn(Calc.opStr);
            }
          } catch (err) {
            handleCalculatorException(err);
          } finally {
            updateCalcDisplay();
          }
        }
      }

      return false;
    }
  }
});

document.addEventListener("keyup", (event) => {
  const elem = document.querySelector(keyMap[event.key]);
  if (elem) {
    elem.className = elem.className.replace(" active", "");
  }
});

/**************
 * CALCULATOR *
 **************/
const calc = document.querySelector("#calculator");
calc.addEventListener("click", (event) => {
  try {
    const target = event.target;
    const targetClasses = target.className;

    if (target.id === "equals-btn") {
      Calc.pressed("=");
    }

    if (targetClasses.includes("op-btn")) {
      Calc.pressed(target.textContent);
    }

    if (target.id === "theme-btn") {
      toggleTheme();
      focusOperatorBtn(Calc.opStr);
    }

    if (targetClasses.includes("input-btn")) {
      onInputButton(target);
    }
  } catch (err) {
    handleCalculatorException(err);
  } finally {
    updateCalcDisplay();
  }
});

function handleCalculatorException(err) {
  if (err instanceof DisplayParseError) {
    clearFocus();
    focusOperatorBtn(Calc.opStr);
  }

  if (err instanceof DivByZeroError) {
    showErrorModalWithText(err.message);
  }
}

function onInputButton(target) {
  switch (target.id) {
    case "clear-btn":
      Calc.pressed("Delete");
      break;
    case "all-clear-btn":
      Calc.pressed("Escape");
      break;
    case "back-btn":
      Calc.pressed("Backspace");
      break;
    case "sign-btn":
      Calc.pressed("s");
      break;
    default:
      Calc.pressed(target.textContent);
      break;
  }
}

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
const calcDisplayTextElem = document.querySelector("#display-text");
const calcMemoElem = document.querySelector("#display-memo");

function updateCalcDisplay() {
  calcDisplayTextElem.textContent = Calc.displayStr;
  calcMemoElem.textContent = Calc.memoStr;
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
