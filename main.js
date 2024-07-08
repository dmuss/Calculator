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
// TODO: new Map()
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

let downKeys = new Map();

document.addEventListener("keydown", (event) => {
  if (!errDialog.open && !downKeys.has(event.key)) {
    if (keyMap[event.key] !== undefined) {
      downKeys.set(event.key, true);

      event.preventDefault();

      const downKey = event.key;

      const pressedElem = document.querySelector(keyMap[downKey]);
      if (pressedElem) {
        pressedElem.classList.add("active");

        try {
          Calc.processKeyboardInput(downKey);

          if (["=", "Enter", "Escape"].includes(downKey)) {
            clearOperatorButtonHighlight();
          }

          if (["+", "-", "*", "/"].includes(downKey)) {
            highlightOperatorButton(downKey);
          }

          if (downKey === "t" || downKey === "T") {
            toggleTheme();
            highlightOperatorButton(Calc.opStr);
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
});

document.addEventListener("keyup", (event) => {
  downKeys.delete(event.key);

  const upElement = document.querySelector('button[class~="active"]');
  if (upElement) {
    upElement.classList.remove("active");
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
      clearOperatorButtonHighlight();
    }

    if (targetClasses.includes("op-btn")) {
      Calc.pressed(target.textContent);
      highlightOperatorButton(Calc.opStr);
    }

    if (target.id === "theme-btn") {
      toggleTheme();
      highlightOperatorButton(Calc.opStr);
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
    clearOperatorButtonHighlight();
    highlightOperatorButton(Calc.opStr);
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
      clearOperatorButtonHighlight();
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
