let currentOperandStr = "0";
let memoStr = "";
let firstOperand = null;
let secondOperand = null;
let operator = null;

const updateDisplay = () => {
  // Remove leading zero, if necessary.
  if (currentOperandStr.length > 1 && currentOperandStr.startsWith("0")) {
    currentOperandStr = currentOperandStr.substring(1);
  }

  document.querySelector("#current-operand").textContent = currentOperandStr;
  document.querySelector("#memo").textContent = memoStr;
};

const updateCurrentOperand = (clickedTarget) => {
  switch (clickedTarget.id) {
    case "del":
      if (currentOperandStr.length === 1) {
        currentOperandStr = "0";
      } else {
        currentOperandStr = currentOperandStr.substring(
          0,
          currentOperandStr.length - 1,
        );
      }
      break;
    case "negate":
      if (currentOperandStr.startsWith("-")) {
        currentOperandStr = currentOperandStr.substring(1);
      } else {
        if (currentOperandStr !== "0") {
          currentOperandStr = "-" + currentOperandStr;
        }
      }
      break;
    default: // All buttons without specific `id`s update the current operand.
      if (
        clickedTarget.textContent === "." &&
        currentOperandStr.includes(".")
      ) {
        console.log("can not have more than one decimal place");
        return;
      } else {
        currentOperandStr += clickedTarget.textContent;
      }
      break;
  }
};

const onOperatorClick = (clickedTarget) => {
  if (firstOperand === null && currentOperandStr === "0") {
    return;
  }

  if (firstOperand === null) {
    firstOperand = Number.parseFloat(currentOperandStr);
    currentOperandStr = "0";

    setAndHighlightOperator(`#${clickedTarget.id}`);
    memoStr = `${firstOperand} ${operator}`;
  } else if (secondOperand === null && currentOperandStr !== "0") {
    secondOperand = Number.parseFloat(currentOperandStr);

    firstOperand = operate(firstOperand, secondOperand, operator);
    currentOperandStr = "0";
    secondOperand = null;

    setAndHighlightOperator(`#${clickedTarget.id}`);
    memoStr = `${firstOperand} ${operator}`;
  } else {
    setAndHighlightOperator(`#${clickedTarget.id}`);
    memoStr = `${firstOperand} ${operator}`;
  }
};

const setAndHighlightOperator = (selector) => {
  // TODO: Just reset the individual buttons to no styling?
  resetOperatorBtns();

  const btnToHighlight = document.querySelector(selector);
  btnToHighlight.style.backgroundColor = "yellow";

  operator = btnToHighlight.textContent;
};

const resetOperatorBtns = () => {
  const operatorBtns = document.querySelectorAll(".operator");
  operatorBtns.forEach((btn) => {
    btn.style.backgroundColor = "white";
  });
};

const clear = (newOperandStr = "0") => {
  currentOperandStr = newOperandStr;
  memoStr = "";
  firstOperand = null;
  secondOperand = null;
  operator = null;
  resetOperatorBtns();
};

const onEqualsPressed = () => {
  if (firstOperand === null) {
    console.log("cannot equate sensible operation without first operand");
    return;
  } else {
    // TODO: Validation.
    secondOperand = Number.parseFloat(currentOperandStr);
    result = operate(firstOperand, secondOperand, operator);

    currentOperandStr = result.toString();
    clear(currentOperandStr);
  }
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
  if (num2 === 0) {
    console.log("Cannot divide by 0.");
    return;
  }

  return num1 / num2;
};

const operate = (num1, num2, op) => {
  switch (op) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      console.log("Incorrect operator");
  }
};

const isNumber = (num) => {
  return typeof num === "number" && !isNaN(num);
};

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    `${firstOperand} ${secondOperand} ${operator} ${currentOperandStr} ${memoStr}`,
  );
  updateDisplay();
});

const calculator = document.querySelector("#calculator");
calculator.addEventListener("click", (event) => {
  const clickedTarget = event.target;

  switch (clickedTarget.className) {
    case "operand":
      updateCurrentOperand(clickedTarget);
      break;
    case "operator":
      onOperatorClick(clickedTarget);
      break;
    case "clear":
      clear();
      break;
    case "equals":
      onEqualsPressed();
      break;
    default:
      break;
  }

  updateDisplay();
});
