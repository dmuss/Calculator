import * as Maths from "./maths.js";
import * as Display from "./display.js";

export { DivByZeroError, DisplayParseError } from "./errors.js";

// These variables store the parsed numbers and operator
// required for math functions, per assignment direction.
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

function reset(newDisplayString = Display.getDefault()) {
  firstOperand = null;
  secondOperand = null;
  operatorString = null;
  Display.reset(newDisplayString);
}

function setOperator(operator) {
  try {
    const parsedDisplay = Display.parse();

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

    operatorString = operator;
    Display.setMemo(`${firstOperand} ${operatorString}`);

    Display.clear();
  } catch (err) {
    if (firstOperand !== null) {
      operatorString = operator;
      Display.setMemo(`${firstOperand} ${operatorString}`);
    }

    secondOperand = null;

    Display.clear();

    throw err;
  }
}

function equals() {
  try {
    if (firstOperand === null) {
      return;
    }

    secondOperand = Display.parse();

    firstOperand = Maths.operate(firstOperand, secondOperand, operatorString);

    Display.reset(firstOperand.toString());
  } catch (err) {
    Display.clear();

    throw err;
  }
}
