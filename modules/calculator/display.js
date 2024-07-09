import { DisplayParseError } from "./errors.js";

const MAX_DISPLAY_DIGITS = 12;
const DEFAULT_DISPLAY = "0";

let displayString = DEFAULT_DISPLAY;
let memoString = "";

export function getDefault() {
  return DEFAULT_DISPLAY;
}

export function getDisplay() {
  return displayString;
}

export function getMemo() {
  return memoString;
}

export function setMemo(string) {
  memoString = string;
}

export function backspace() {
  if (displayString.length <= 1) {
    clear();
  } else {
    displayString = displayString.substring(0, displayString.length - 1);
  }
}

export function clear() {
  displayString = DEFAULT_DISPLAY;
}

export function reset(newDisplayString = DEFAULT_DISPLAY) {
  displayString = fit(newDisplayString);
  memoString = "";
}

export function changeSign() {
  if (displayString !== DEFAULT_DISPLAY) {
    if (displayString.startsWith("-")) {
      displayString = displayString.substring(1);
    } else {
      displayString = "-" + displayString;
    }
  }
}

export function push(char) {
  if (
    (char === "." && displayString.includes(".")) ||
    displayString.length >= MAX_DISPLAY_DIGITS
  ) {
    return;
  }

  if (displayString === DEFAULT_DISPLAY) {
    if (char === "0") {
      return;
    }

    if (char >= "1" && char <= "9") {
      displayString = char;
      return;
    }
  }

  displayString += char;
}

/**
 * @throws {DisplayParseError} - Thrown if the parsed display is not a number.
 */
export function parse() {
  const parsedDisplay = parseFloat(displayString);

  if (isNaN(parsedDisplay)) {
    throw new DisplayParseError(
      `Entered value "${displayString}" is not a valid number!`,
    );
  }

  return parsedDisplay;
}

export function fit(string) {
  // NOTE: This likely fails to catch all potential edge cases, but should
  // work fine for the purposes of this assignment.

  if (string.length <= MAX_DISPLAY_DIGITS) {
    return string;
  }

  // If the string is already in E notation and too long, fit it to the display.
  if (string.includes("e")) {
    return fitENotationStringToDisplay(string);
  }

  // If the string does not contain a decimal, it represents an integer too
  // long to fit the display.
  if (!string.includes(".")) {
    const eNotationString = parseFloat(string).toExponential().toString();
    return fitENotationStringToDisplay(eNotationString);
  }

  // Otherwise, the string represents a value with a decimal point that is too
  // long to fit the display.
  const decimalIndex = string.indexOf(".");

  if (decimalIndex > MAX_DISPLAY_DIGITS) {
    // Integer portion won't fit display. Round the string to the nearest
    // integer, convert it to E notation and fit that to the display.
    const roundedInteger = Math.round(parseFloat(string));
    const eNotationString = parseFloat(roundedInteger)
      .toExponential()
      .toString();
    return fitENotationStringToDisplay(eNotationString);
  } else {
    // Decimal places run past end of display, round to number of decimal
    // places that will fit.
    const numDecimalPlacesToFit = MAX_DISPLAY_DIGITS - (decimalIndex + 1);
    return parseFloat(string).toFixed(numDecimalPlacesToFit);
  }
}

function fitENotationStringToDisplay(string) {
  if (string.length < MAX_DISPLAY_DIGITS) {
    return string;
  }
  const [significandString, exponentString] = string.split("e");

  const numDecimalPlacesToFit =
    MAX_DISPLAY_DIGITS -
    exponentString.length -
    // Ensure there is space for the decimal point and "e".
    (significandString.indexOf(".") + 1) -
    1;

  return (
    parseFloat(significandString).toFixed(numDecimalPlacesToFit) +
    "e" +
    exponentString
  );
}
