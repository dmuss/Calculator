const calculatorDisplayTextElement = document.querySelector("#display-text");
const calculatorMemoTextElement = document.querySelector("#display-memo");

export function updateCalcDisplay(displayString, memoString) {
  calculatorDisplayTextElement.textContent = displayString;
  calculatorMemoTextElement.textContent = memoString;
}
