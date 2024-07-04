let currentOperandStr = "0";
let memoStr = "";
let firstOperand = null;
let secondOperand = null;
let operator = null;

const updateDisplay = () => {
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
        currentOperandStr = "-" + currentOperandStr;
      }
      break;
    default:
      currentOperandStr += clickedTarget.value;
      break;
  }
};

const onOperatorClick = (clickedTarget) => {
  if (firstOperand === null && currentOperandStr === "0") {
    return;
  }

  if (firstOperand === null) {
    // TODO: Validation.
    firstOperand = Number.parseFloat(currentOperandStr);
    currentOperandStr = "0";

    setAndHighlightOperator(`#${clickedTarget.id}`);

    memoStr = `${firstOperand} ${operator}`;
  } else if (secondOperand === null && currentOperandStr !== "0") {
    // TODO: Validation.
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

const clear = () => {
  currentOperandStr = "0";
  memoStr = "";
  firstOperand = null;
  secondOperand = null;
  operator = null;
  resetOperatorBtns();
};

const onEqualsPressed = () => {
  if (!Number.isNaN(firstOperand) && !Number.isNaN(secondOperand)) {
    if (secondOperand === null) {
      parsedOperand = Number.parseFloat(currentOperandStr);

      if (isNaN(parsedOperand)) {
        console.log("cannot operate on non-number");
        return;
      }

      secondOperand = parsedOperand;
      memoStr = `${firstOperand} ${operator} ${secondOperand} =`;

      result = operate(firstOperand, secondOperand, operator);

      currentOperandStr = result.toString();

      firstOperand = null;
      secondOperand = null;
      operator = null;
      memoStr = "";
      resetOperatorBtns();
    }
  } else {
    console.log("one of the operands is not a number");
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
