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
      console.log(`add: ${num1} + ${num2} = ` + add(num1, num2));
      return add(num1, num2);
    case "-":
      console.log(`sub: ${num1} - ${num2} = ` + subtract(num1, num2));
      return subtract(num1, num2);
    case "*":
      console.log(`mul: ${num1} * ${num2} = ` + multiply(num1, num2));
      return multiply(num1, num2);
    case "/":
      console.log(`div: ${num1} / ${num2} = ` + divide(num1, num2));
      return divide(num1, num2);
    default:
      console.log("Incorrect operator");
  }
};

const isNumber = (num) => {
  return typeof num === "number" && !isNaN(num);
};

NUM1 = 2;
NUM2 = 2;

OP = "+";
operate(NUM1, NUM2, OP);
OP = "-";
operate(NUM1, NUM2, OP);
OP = "*";
operate(NUM1, NUM2, OP);
OP = "/";
operate(NUM1, NUM2, OP);
operate(NUM1, 0, OP);
OP = "ERROR";
operate(NUM1, NUM2, OP);

operate(OP, OP, OP);
