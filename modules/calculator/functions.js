import * as Maths from "./maths.js";
import * as Display from "./display.js";

/* NOTE:  Per assignment, create these three variables to be passed
 * to `Maths.operate` and update display. Have decided to manage display
 * as a string that's parsed by this module's functions.
 */
let firstOperand = null;
let secondOperand = null;
let operatorString = null;

export function getDisplayString() {
  return Display.getDisplay();
}

export function getMemoString() {
  return Display.getMemo();
}

export function getOperatorString() {
  return operatorString;
}

export function keyPressed(key) {
  if (key >= "0" && key <= "9") {
    Display.push(key);
  }

  if (key === "." || key === ",") {
    Display.push(".");
  }

  if (["+", "-", "*", "/"].includes(key)) {
    setOperator(key);
  }

  if (["=", "enter"].includes(key)) {
    equals();
  }

  if (key === "backspace") {
    Display.backspace();
  }

  if (key === "delete") {
    Display.clear();
  }

  if (key === "escape") {
    allClear();
  }

  if (key === "s") {
    Display.changeSign();
  }
}

function allClear() {
  reset();
  Display.reset();
}

/**
 * Resets all operating variables and the display.
 *
 * @param {String} newDisplayString - The string to display on the calculator.
 * If a new string is not provided, resets to default display.
 */
function reset(newDisplayString = Display.getDefault()) {
  firstOperand = null;
  secondOperand = null;
  operatorString = null;
  Display.reset(newDisplayString);
}

/**
 * @throws {DisplayParseError} - Thrown if the parsed value of the current
 * display is not a number.
 */
function setOperator(operatorChar) {
  try {
    const parsedDisplay = Display.parse();

    /* NOTE: Assignment states the calculator "should not evaluate more than a
     * single pair of numbers at a time. However, this felt awkward and
     * disruptive if a new operator was pressed with a first operand and a
     * value of `0` in the display. Instead, the calculator will only
     * automatically evaluate the current display in that case if it is not
     * showing `0`, and just updates the selected operator.
     */
    if (firstOperand === null) {
      firstOperand = parsedDisplay;
    } else if (Display.getDisplay() != Display.getDefault()) {
      secondOperand = parsedDisplay;

      let operationResultString = Maths.operate(
        firstOperand,
        secondOperand,
        operatorString,
      ).toString();

      operationResultString = Display.fit(operationResultString);

      firstOperand = parseFloat(operationResultString);
      secondOperand = null;
    }

    updateOperator(operatorChar);

    Display.clear();
  } catch (err) {
    if (firstOperand !== null) {
      updateOperator(operatorChar);
    }

    secondOperand = null;

    Display.clear();

    throw err;
  }
}

function updateOperator(operatorChar) {
  operatorString = operatorChar;
  Display.setMemo(`${firstOperand} ${operatorString}`);
}

/**
 * @throws {DivideByZeroError}
 */
function equals() {
  try {
    if (firstOperand === null) {
      return;
    }

    secondOperand = Display.parse();

    const resultString = Maths.operate(
      firstOperand,
      secondOperand,
      operatorString,
    ).toString();

    reset(resultString);
  } catch (err) {
    Display.clear();

    throw err;
  }
}
