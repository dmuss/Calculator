import { operate } from "./math.js";

const MAX_DISPLAY_DIGITS = 12;
const DEFAULT_DISPLAY_STR = "0";

export class Calculator {
  static #displayStr = DEFAULT_DISPLAY_STR;
  static #memoStr = "";
  static #firstOperand = null;
  static #secondOperand = null;
  static #opStr = null;

  static get displayStr() {
    return this.#displayStr;
  }

  static get memoStr() {
    return this.#memoStr;
  }

  static get opStr() {
    return this.#opStr;
  }

  static backspace() {
    if (this.#displayStr.length <= 1) {
      this.clearDisplay();
    } else {
      this.#displayStr = this.#displayStr.substring(
        0,
        this.#displayStr.length - 1,
      );
    }
  }

  static clearDisplay() {
    this.#displayStr = DEFAULT_DISPLAY_STR;
  }

  static negateDisplay() {
    if (this.#displayStr.startsWith("-")) {
      this.#displayStr = this.#displayStr.substring(1);
    } else {
      if (this.#displayStr !== "0") {
        this.#displayStr = "-" + this.#displayStr;
      }
    }
  }

  static pushDisplay(char) {
    if (
      (char === "." && this.#displayStr.includes(".")) ||
      this.#displayStr.length >= MAX_DISPLAY_DIGITS
    ) {
      return;
    } else {
      this.#displayStr += char;

      // Trim leading zeros on integers.
      if (this.#displayStr.length > 1 && this.#displayStr.startsWith("0")) {
        this.#displayStr = this.#displayStr.substring(1);
      }
    }
  }

  static setOperator(char) {
    // If the first operand is not set, set it, update the memo string, and
    // clear the display to default.
    if (!this.#firstOperand) {
      this.#firstOperand = Number.parseFloat(this.#displayStr);

      this.#setOpStrAndUpdateMemoStr(char);

      this.clearDisplay();
    }
    // If the second operand isn't set and the display contains a number,
    // calculate the result of the operation and use that result as the
    // first operand of a new operation.
    else if (!this.#secondOperand && this.#displayStr !== DEFAULT_DISPLAY_STR) {
      this.#secondOperand = Number.parseFloat(this.#displayStr);

      this.#firstOperand = operate(
        this.#firstOperand,
        this.#secondOperand,
        this.#opStr,
      );

      this.#secondOperand = null;

      this.#setOpStrAndUpdateMemoStr(char);

      this.clearDisplay();
    }
    // Otherwise, update the operator using the current first operand.
    else {
      this.#setOpStrAndUpdateMemoStr(char);
    }
  }

  static equals() {
    // Cannot evaluate an operation without the first operand.
    if (!this.#firstOperand) {
      return;
    } else {
      this.#secondOperand = Number.parseFloat(this.#displayStr);

      let result = operate(
        this.#firstOperand,
        this.#secondOperand,
        this.#opStr,
      );
      this.#firstOperand = result;
      this.#reset(result.toString());
    }
  }

  static allClear() {
    this.#reset();
  }

  static #setOpStrAndUpdateMemoStr(char) {
    this.#opStr = char;
    this.#memoStr = `${this.#firstOperand} ${this.#opStr}`;
  }

  static #reset(newDisplayStr = DEFAULT_DISPLAY_STR) {
    this.#displayStr = this.#fitToDisplay(newDisplayStr);
    this.#memoStr = "";

    this.#firstOperand = null;
    this.#secondOperand = null;
    this.#opStr = null;
  }

  static #fitToDisplay(newDisplayStr) {
    if (newDisplayStr.length > MAX_DISPLAY_DIGITS) {
      newDisplayStr = Number.parseFloat(newDisplayStr)
        .toExponential()
        .toString();

      const [significandStr, expStr] = newDisplayStr.split("e+");

      // Keep space for "e" by subtracting an additional 1.
      const maxSignificandLen = MAX_DISPLAY_DIGITS - expStr.length - 1;

      // Though not mathematically accurate, trim digits from the right side of
      // the significand string and recompose the display string with the
      // exponent.
      newDisplayStr =
        significandStr.substring(0, maxSignificandLen) + "e" + expStr;
    }

    return newDisplayStr;
  }
}
