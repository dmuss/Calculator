const calcDisplayTextElem = document.querySelector("#display-text");
const calcMemoElem = document.querySelector("#display-memo");

export function updateCalcDisplay(displayString, memoString) {
  calcDisplayTextElem.textContent = displayString;
  calcMemoElem.textContent = memoString;
}

