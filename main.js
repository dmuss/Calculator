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

let keyDown = false;

console.log(keyMap["sup"]);

document.addEventListener("keydown", (event) => {
  if (!keyDown) {
    keyDown = true;
    if (keyMap[event.key] !== undefined) {
      event.preventDefault();

      const pressedElem = document.querySelector(keyMap[event.key]);
      if (pressedElem) {
        pressedElem.className += " active";
      }

      return false;
    }
  }
});

document.addEventListener("keyup", (event) => {
  keyDown = false;

  const key = event.key;

  let elem = document.querySelector(keyMap[key]);
  if (elem) {
    elem.className = elem.className.replace(" active", "");
  }

  if (key >= "0" && key <= "9") {
    Calc.pushDisplay(event.key);
  }

  if (key === "." || key === ",") {
    Calc.pushDisplay(".");
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
    clearFocus();
  }

  if (key === "t" || key === "T") {
    toggleTheme();
    focusOperatorBtn(Calc.opStr);
  }

  if (key === "s" || key === "S") {
    Calc.flipSign();
  }

  updateCalcDisplay();
});

/**************
 * CALCULATOR *
 **************/
const calc = document.querySelector("#calculator");
calc.addEventListener("click", (event) => {
  try {
    const target = event.target;

    if (target.id === "theme-btn") {
      toggleTheme();
      focusOperatorBtn(Calc.opStr);
    }

    if (targetClasses.id === "equals-btn") {
      Calc.equals();
    }

    const targetClasses = target.className;

    if (targetClasses.includes("input-btn")) {
      onInputButton(target);
    }

    // TODO: just use op-btn class?
    if (targetClasses.includes("operator")) {
      Calc.setOperator(target.textContent);
    }

    if (targetClasses.includes("all-clear")) {
      Calc.allClear();
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

function onInputButton(target) {
  switch (target.id) {
    case "clear-btn":
      Calc.clearDisplay();
      break;
    case "back-btn":
      Calc.backspace();
      break;
    case "sign-btn":
      Calc.flipSign();
      break;
    default:
      Calc.pushDisplay(target.textContent);
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
