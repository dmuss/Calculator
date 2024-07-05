const MAX_DISPLAY_DIGITS = 12;

let displayStr = "0";
let memoStr = "";
let firstOperand = null;
let secondOperand = null;
let opStr = null;
let currOpBtn = null;

const updateDisplay = () => {
  if (displayStr.length > 1 && displayStr.startsWith("0")) {
    displayStr = displayStr.substring(1);
  }

  document.querySelector("#current-operand").textContent = displayStr;
  document.querySelector("#memo").textContent = memoStr;
};

const updateOperandByTargetID = (target) => {
  switch (target.id) {
    case "clear-btn":
      displayStr = "0";
      break;
    case "back-btn":
      deleteLeastSignificantDigit();
      break;
    case "negate-btn":
      negateCurrentOperand();
      break;
    // All buttons without specific `id`s update the currently displayed
    // operand.
    default:
      updateDisplayStrWithTargetContent(target);
      break;
  }
};

const deleteLeastSignificantDigit = () => {
  if (displayStr.length <= 1) {
    displayStr = "0";
  } else {
    displayStr = displayStr.substring(0, displayStr.length - 1);
  }
};

const negateCurrentOperand = () => {
  if (displayStr.startsWith("-")) {
    displayStr = displayStr.substring(1);
  } else {
    if (displayStr !== "0") {
      displayStr = "-" + displayStr;
    }
  }
};

/***
 * If the target was the decimal button and the displayed string
 * already contains a decimal, ignore that click. Otherwise, add
 * the value of the clicked button to the display.
 */
const updateDisplayStrWithTargetContent = (target) => {
  if (
    !(target.id === "decimal-btn" && displayStr.includes(".")) &&
    displayStr.length < MAX_DISPLAY_DIGITS
  ) {
    displayStr += target.textContent;
  }
};

const operatorClicked = (clickedTarget) => {
  // Operator buttons should do nothing if the user has not entered any
  // numbers.
  if (firstOperand === null && displayStr === "0") {
    return;
  }
  // If the first operand has not been entered by the user.
  else if (firstOperand === null) {
    // Parse the currently displayed number and reset the display.
    firstOperand = Number.parseFloat(displayStr);
    displayStr = "0";

    // TODO: Move these two lines into function.
    updateCurrentOperatorByBtnID(clickedTarget.id);
    memoStr = `${firstOperand} ${opStr}`;
  } else if (secondOperand === null && displayStr !== "0") {
    secondOperand = Number.parseFloat(displayStr);

    firstOperand = operate(firstOperand, secondOperand, opStr);
    displayStr = "0";
    secondOperand = null;

    updateCurrentOperatorByBtnID(clickedTarget.id);
    memoStr = `${firstOperand} ${opStr}`;
  } else {
    updateCurrentOperatorByBtnID(clickedTarget.id);
    memoStr = `${firstOperand} ${opStr}`;
  }
};

const updateCurrentOperatorByBtnID = (id) => {
  updateAndHighlightCurrentOpBtnByID(id);
  opStr = currOpBtn.textContent;
};

const updateAndHighlightCurrentOpBtnByID = (id) => {
  if (currOpBtn !== null) {
    currOpBtn.removeAttribute("disabled");
  }
  currOpBtn = document.querySelector(`#${id}`);
  currOpBtn.setAttribute("disabled", true);
};

/***
 * Resets the calculator.
 * @param {newOperandStr} - The new value to be displayed to the user.
 */
const reset = (newDisplayStr = "0") => {
  displayStr = fitDisplayStrToDisplay(newDisplayStr);
  memoStr = "";
  firstOperand = null;
  secondOperand = null;
  opStr = null;

  if (currOpBtn !== null) {
    currOpBtn.removeAttribute("disabled");
    currOpBtn = null;
  }
};

/***
 * The display can show a maximum of `MAX_DISPLAY_DIGITS`. If the
 * provided string is longer than that, convert it to an approximate
 * E notation that will fit within the maximum number of digits.
 */
const fitDisplayStrToDisplay = (str) => {
  if (str.length > MAX_DISPLAY_DIGITS) {
    str = Number.parseFloat(str).toExponential().toString();

    const [significandStr, expStr] = str.split("e+");

    // Keep space for "e" by subtracting an additional 1.
    const maxSignificandLen = MAX_DISPLAY_DIGITS - expStr.length - 1;

    // Though not mathematically accurate, trim digits from the right side of
    // the significand string and recompose the display string with the
    // exponent.
    str = significandStr.substring(0, maxSignificandLen) + "e" + expStr;
  }

  return str;
};

const equalsPressed = () => {
  // Cannot evaluate an operation without first operand or operator.
  if (!firstOperand || !opStr) {
    return;
  } else {
    secondOperand = Number.parseFloat(displayStr);

    try {
      result = operate(firstOperand, secondOperand, opStr);
      firstOperand = result;
      reset(result.toString());
    } catch (e) {
      showErrorDialogWithText(e.message);
      reset();
    }
  }
};

const showErrorDialogWithText = (text) => {
  errDialog.firstElementChild.innerText = text;
  errDialog.showModal();
};

const add = (num1, num2) => {
  return num1 + num2;
};

const subtract = (num1, num2) => {
  return num1 - num2;
};

const multiply = (num1, num2) => {
  return num1 * num2;
};

const divide = (num1, num2) => {
  if (num2 === 0 || isNaN(num2)) {
    throw new Error("Cannot divide by zero!");
  }

  return num1 / num2;
};

const operate = (num1, num2, op) => {
  let result = null;

  switch (op) {
    case "+":
      result = add(num1, num2);
      break;
    case "-":
      result = subtract(num1, num2);
      break;
    case "*":
      result = multiply(num1, num2);
      break;
    case "/":
      result = divide(num1, num2);
      break;
  }

  return result;
};

/***
 * Tries to set the theme from local storage, otherwise sets a default theme.
 */
const trySetThemeFromLocalStorage = () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  } else {
    setTheme("light");
  }
};

const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

/**************************
 * DOM && EVENT LISTENERS *
 **************************/

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  trySetThemeFromLocalStorage();
});

const calculator = document.querySelector("#calculator");
calculator.addEventListener("click", (event) => {
  const target = event.target;

  if (target.id === "theme-btn") {
    toggleTheme();
  }

  const targetClasses = target.className;

  if (targetClasses.includes("operand")) {
    updateOperandByTargetID(target);
  }

  if (targetClasses.includes("operator")) {
    operatorClicked(target);
  }

  if (targetClasses.includes("all-clear")) {
    reset();
  }

  if (targetClasses.includes("equals")) {
    equalsPressed();
  }

  updateDisplay();
});

const errDialog = document.querySelector("dialog");
const dialogCloseBtn = document.querySelector("button.close");
dialogCloseBtn.addEventListener("click", () => {
  errDialog.close();
});
