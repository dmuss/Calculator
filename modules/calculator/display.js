import { DisplayParseError } from "./errors.js";

const MAX_DISPLAY_DIGITS = 12;
const DEFAULT_DISPLAY = "0";

export let displayString = DEFAULT_DISPLAY;
export let memoString = "";

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
  if (displayString.startsWith("-")) {
    displayString = displayString.substring(1);
  } else {
    displayString = "-" + displayString;
  }
}

// Appends the provided character to `displayStr`, if possible.
// If the character cannot be appended, function does nothing.
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

export function parse() {
  const parsedDisplay = parseFloat(displayString);

  if (isNaN(parsedDisplay)) {
    throw new DisplayParseError("Entered an invalid number!", displayString);
  }

  return parsedDisplay;
}

// NOTE: This likely fails to catch all potential edge cases, but should
// work fine for the purposes of this assignment.
export function fit(string) {
  if (string.length <= MAX_DISPLAY_DIGITS) {
    return string;
  }

  // If the string is already in E notation and too long, fit it to the display.
  if (string.includes("e")) {
    return fitENotationStringToDisplay(string);
  }

  // If the string does not contain a decimal, it represents an integer too
  // long to fit the display. Convert it to E notation and fit that to the
  // display.
  if (!string.includes(".")) {
    return convertToAndFitENotationStringToDisplay(string);
  }

  // Otherwise, the string represents a value with a decimal point that is too
  // long to fit the display.
  const decimalIndex = string.indexOf(".");

  if (decimalIndex > MAX_DISPLAY_DIGITS) {
    // Integer portion won't fit display. Round the string to the nearest
    // integer, convert it to E notation and fit that to the display.
    const roundedString = Math.round(parseFloat(string)).toString();
    return convertToAndFitENotationStringToDisplay(roundedString);
  } else {
    // Decimal places run past end of display, round to number of decimal
    // places that will fit.
    const numDecimalPlacesToFit = MAX_DISPLAY_DIGITS - (decimalIndex + 1);
    return parseFloat(string).toFixed(numDecimalPlacesToFit);
  }
}

function fitENotationStringToDisplay(string) {
  const [significandString, exponentString] = string.split("e");

  const numDecimalPlacesToFit =
    MAX_DISPLAY_DIGITS -
    exponentString.length -
    (significandString.indexOf(".") + 1);

  return (
    parseFloat(significandString).toFixed(numDecimalPlacesToFit) +
    exponentString
  );
}

function convertToAndFitENotationStringToDisplay(string) {
  const eNotationString = parseFloat(string).toExponential().toString();
  return fitENotationStringToDisplay(eNotationString);
}
