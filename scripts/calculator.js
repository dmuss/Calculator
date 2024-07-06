import { operate } from "./math.js";
import { DivByZeroError, DisplayParseError } from "./errors.js";

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
    try {
      const parsedDisplay = this.#parseDisplay();

      if (this.#firstOperand === null) {
        this.#firstOperand = parsedDisplay;
      } else if (this.#displayStr != DEFAULT_DISPLAY_STR) {
        this.#secondOperand = parsedDisplay;

        // Similar to approximating the result when the user presses equals,
        // approximate the result of the equation to prevent the memo string
        // from overflowing.
        let operationResultStr = operate(
          this.#firstOperand,
          this.#secondOperand,
          this.#opStr,
        ).toString();

        operationResultStr = this.#fitToDisplay(operationResultStr);

        this.#firstOperand = parseFloat(operationResultStr);

        this.#secondOperand = null;
      }

      this.#setOpStrAndUpdateMemoStr(char);
      this.clearDisplay();
    } catch (err) {
      // TODO: Can this be cleaner?
      this.#secondOperand = null;

      if (this.#firstOperand !== null) {
        this.#setOpStrAndUpdateMemoStr(char);
      }

      this.clearDisplay();
      throw err;
    }
  }

  static equals() {
    try {
      if (this.#firstOperand === null) {
        return;
      }

      const parsedDisplay = this.#parseDisplay();

      this.#secondOperand = parsedDisplay;

      let result = operate(
        this.#firstOperand,
        this.#secondOperand,
        this.#opStr,
      );

      this.#firstOperand = result;

      this.#reset(result.toString());
    } catch (err) {
      if (err instanceof DivByZeroError) {
        this.clearDisplay();
      }

      if (err instanceof RangeError) {
        this.allClear();
      }

      throw err;
    }
  }

  static allClear() {
    this.#reset();
  }

  static #parseDisplay() {
    const parsedDisplay = Number.parseFloat(this.#displayStr);

    if (isNaN(parsedDisplay)) {
      throw new DisplayParseError(
        "Entered an invalid number!",
        this.#displayStr,
      );
    } else {
      return parsedDisplay;
    }
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

      const splitIdx = newDisplayStr.indexOf("e");
      const significandStr = newDisplayStr.substring(0, splitIdx);
      const expStr = newDisplayStr.substring(splitIdx);

      // Though not mathematically accurate, trim digits from the right side of
      // the significand string and recompose the display string with the
      // exponent.
      newDisplayStr =
        significandStr.substring(0, MAX_DISPLAY_DIGITS - expStr.length) +
        expStr;
    }

    return newDisplayStr;
  }
}
