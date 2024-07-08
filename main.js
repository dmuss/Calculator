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
 NOTE: The current keyboard input handling will not properly display
 "pressed" and "unpressed" buttons on the page where there are multiple
 hotkeys for that button (e.g., if you press and hold `.`, then press and
 release `,` while still holding `.`, the page will render the decimal
 button "unpressed" as it handled a `keyup` event for one of the hotkeys.
 ----------------------------------------------------------------------------
 In practice, this really shouldn't be much of an issue as only the equals
 and decimal buttons share a hotkey, and:
  - the equals button is unlikely to be held and resets the calculator; and,
  - while the decimal button will always display as "." in the display,
    the multiple hotkeys support regional differences in how decimals
    are represented and it is unlikely a user would press and hold both
 ********************/
let keyMap = new Map([
  ["backspace", { buttonId: "#back-btn", down: false }],
  ["delete", { buttonId: "#clear-btn", down: false }],
  ["escape", { buttonId: "#all-clear-btn", down: false }],
  ["enter", { buttonId: "#equals-btn", down: false }],
  ["=", { buttonId: "#equals-btn", down: false }],
  [".", { buttonId: "#decimal-btn", down: false }],
  [",", { buttonId: "#decimal-btn", down: false }],
  ["+", { buttonId: "#add-btn", down: false }],
  ["-", { buttonId: "#sub-btn", down: false }],
  ["*", { buttonId: "#mul-btn", down: false }],
  ["/", { buttonId: "#div-btn", down: false }],
  ["0", { buttonId: "#zero-btn", down: false }],
  ["1", { buttonId: "#one-btn", down: false }],
  ["2", { buttonId: "#two-btn", down: false }],
  ["3", { buttonId: "#three-btn", down: false }],
  ["4", { buttonId: "#four-btn", down: false }],
  ["5", { buttonId: "#five-btn", down: false }],
  ["6", { buttonId: "#six-btn", down: false }],
  ["7", { buttonId: "#seven-btn", down: false }],
  ["8", { buttonId: "#eight-btn", down: false }],
  ["9", { buttonId: "#nine-btn", down: false }],
  ["t", { buttonId: "#theme-btn", down: false }],
  ["s", { buttonId: "#sign-btn", down: false }],
]);

document.addEventListener("keydown", (event) => {
  // Handles alpha keys regardless of case.
  const key = event.key.toLowerCase();

  // Only accept calculator hotkeys while the error modal is not displayed.
  if (!errDialog.open && keyMap.has(key)) {
    event.preventDefault();

    let keyState = keyMap.get(key);

    // If the key has already been marked down, return.
    if (keyState.down) {
      return;
    } else {
      keyState.down = true;
    }

    // Make the button associated to the key active, to appear as pressed.
    const buttonToPress = document.querySelector(keyState.buttonId);
    if (buttonToPress) {
      buttonToPress.classList.add("active");

      try {
        Calc.processKeyboardInput(key);

        if (["=", "Enter", "Escape"].includes(key)) {
          clearOperatorButtonHighlight();
        }

        if (["+", "-", "*", "/"].includes(key)) {
          highlightOperatorButton(key);
        }

        if (key === "t" || key === "T") {
          toggleTheme();
          highlightOperatorButton(Calc.opStr);
        }
      } catch (err) {
        handleCalculatorException(err);
      } finally {
        updateCalcDisplay();
      }
    }

    return false;
  }
});

document.addEventListener("keyup", (event) => {
  // Handles alpha keys regardless of case.
  const key = event.key.toLowerCase();

  // The two specific cases here naively handles the case where a key requiring
  // the `Shift` modifier is released after `Shift` has already been released.
  // It functions properly on any keyboard layout where the keys share a
  // physical key (QWERTY, DVORAK, COLEMAK), but not other common layouts
  // such as AZERTY and QWERTZ.
  // TODO: Handle this across keyboard layouts?
  switch (event.code) {
    case "Digit8":
      releaseButtonByKey("*");
      releaseButtonByKey("8");
      break;
    case "Equal":
      releaseButtonByKey("+");
      releaseButtonByKey("=");
      break;
    default:
      releaseButtonByKey(key);
      break;
  }
});

function releaseButtonByKey(key) {
  if (keyMap.has(key)) {
    let keyToRelease = keyMap.get(key);
    if (keyToRelease.down) {
      keyToRelease.down = false;
      const buttonToRelease = document.querySelector(keyToRelease.buttonId);
      buttonToRelease.classList.remove("active");
    }
  }
}

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
