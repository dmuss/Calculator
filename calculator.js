let displayValueStr = "0";
let firstOperand = 0;
let secondOperand = 0;
let operator = "";

const updateDisplay = () => {
  let displayElem = document.querySelector("#display");

  if (displayValueStr.length > 1 && displayValueStr.startsWith("0")) {
    displayValueStr = displayValueStr.substring(1);
  }

  displayElem.textContent = displayValueStr;
};

const updateCurrentOperand = (clickedTarget) => {
  switch (clickedTarget.id) {
    case "del":
      if (displayValueStr.length === 1) {
        displayValueStr = "0";
      } else {
        displayValueStr = displayValueStr.substring(
          0,
          displayValueStr.length - 1,
        );
      }
      break;
    case "negate":
      if (displayValueStr.startsWith("-")) {
        displayValueStr = displayValueStr.substring(1);
      } else {
        displayValueStr = "-" + displayValueStr;
      }
      break;
    default:
      displayValueStr += clickedTarget.value;
      break;
  }
};

const clear = () => {
  displayValueStr = "0";
  firstOperand = 0;
  secondOperand = 0;
  operator = "";
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
      updateDisplay();
      break;
    case "operator":
      console.log("operator clicked!");
      break;
    case "clear":
      clear();
      updateDisplay();
      break;
    case "equals":
      console.log("equals clicked!");
      break;
    default:
      break;
  }
});

/*
let NUM1 = 0;
let NUM2 = 0;
let OP = "";
let RESULT = 0;

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
  // TODO:: Divide by zero results in `Infinity`, proper error handling / display?
  if (num2 === 0) {
    console.log("Cannot divide by 0.");
    return;
  }

  return num1 / num2;
};

const operate = (num1, num2, op) => {
  if (!isNumber(num1) || !isNumber(num2)) {
    console.log("Cannot operate on non-numeric inputs.");
    return;
  }

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
*/
