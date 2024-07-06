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
      if (this.#firstOperand !== null) {
        this.#setOpStrAndUpdateMemoStr(char);
      }

      this.#secondOperand = null;

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
    const parsedDisplay = parseFloat(this.#displayStr);

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
    // NOTE: This likely fails to catch all potential edge cases, but should
    // work fine for the purposes of this assignment.
    if (newDisplayStr.length <= MAX_DISPLAY_DIGITS) {
      return newDisplayStr;
    }

    // If the current display string is already in E notation, fit it to
    // the display.
    if (newDisplayStr.includes("e")) {
      return this.#fitENotationStrToDisplay(newDisplayStr);
    }

    // If the display string does not contain a decimal, we have an integer
    // that is too large.
    if (!newDisplayStr.includes(".")) {
      return this.#convertToENotationStrAndFitToDisplay(newDisplayStr);
    }

    // Otherwise, we have a string representing a value with a decimal
    // place that is too long to fit in the display.
    const decimalIdx = newDisplayStr.indexOf(".");

    if (decimalIdx > MAX_DISPLAY_DIGITS) {
      // The integer portion of the value represented is too large to fit
      // in the display.
      let roundedStr = Math.round(parseFloat(newDisplayStr)).toString();
      return this.#convertToENotationStrAndFitToDisplay(roundedStr);
    } else {
      // The integer portion of the represented value will fit on the display,
      // round to number of decimal places that fill fit.
      const maxDecimalPlaces = MAX_DISPLAY_DIGITS - (decimalIdx + 1);
      return parseFloat(newDisplayStr).toFixed(maxDecimalPlaces);
    }
  }

  static #convertToENotationStrAndFitToDisplay(str) {
    let result = parseFloat(str).toExponential().toString();

    if (result.length <= MAX_DISPLAY_DIGITS) {
      return result;
    } else {
      return this.#fitENotationStrToDisplay(result);
    }
  }

  static #fitENotationStrToDisplay(str) {
    const splitIdx = str.indexOf("e");
    const significandStr = str.substring(0, splitIdx);
    const expStr = str.substring(splitIdx);

    let maxDecimalPlaces =
      MAX_DISPLAY_DIGITS -
      expStr.length -
      (significandStr.indexOf(".") + 1) -
      1;

    return parseFloat(significandStr).toFixed(maxDecimalPlaces) + expStr;
  }
}
