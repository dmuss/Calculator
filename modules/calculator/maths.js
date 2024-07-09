import { DivByZeroError } from "./errors.js";

/* NOTE: Per assignment, create four functions for basic arithmetic
 * and an operate function that takes two operands and an operator
 * that calls those arithmetic functions.
 */

/**
 * @throws {DivideByZeroError}
 */
export function operate(num1, num2, operatorString) {
  let result = null;

  switch (operatorString) {
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
}

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

/**
 * @throws {DivideByZeroError}
 */
function divide(num1, num2) {
  if (num2 === 0 || isNaN(num2)) {
    throw new DivByZeroError("Cannot divide by zero!");
  }

  return num1 / num2;
}
