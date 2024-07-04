let displayValueStr = "0";

const updateDisplay = () => {
  let displayElem = document.querySelector("#display");
  displayElem.textContent = displayValueStr;
};

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
});

// TODO: listener on div#calculator that dispatches?
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    displayValueStr += `${event.target.value}`;

    if (displayValueStr.length > 1 && displayValueStr.startsWith("0")) {
      displayValueStr = displayValueStr.substring(1);
    }

    updateDisplay();
  });
});

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
