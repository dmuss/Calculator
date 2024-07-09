/* TODO:: Current keyboard handling doesn't properly reject and keydown
 * events for shared hotkeys:
 * - Decimal keys: While display rejects multiple decimal points, if an
 * equation is completed, can use the other to enter a decimal point on
 * the new value.
 * - Equals keys: If user holds the equals key, calculator will calculate
 * result. User is able to use another equals hotkey to make another
 * calculation.
 *
 * In practice, these scenarios are unlikely and not overly disruptive in
 * normal use.
 */

import * as Calc from "../calculator/calculator.js";
import * as Page from "../page/page.js";

let keyMap = new Map([
  ["backspace", { buttonId: "#back-btn", down: false }],
  ["delete", { buttonId: "#clear-btn", down: false }],
  ["escape", { buttonId: "#all-clear-btn", down: false }],
  ["enter", { buttonId: "#equals-btn", down: false }],
  ["=", { buttonId: "#equals-btn", down: false }],
  [".", { buttonId: "#decimal-btn", down: false }],
  [",", { buttonId: "#decimal-btn", down: false }],
  ["+", { buttonId: "#add-btn", down: false }],
  ["-", { buttonId: "#sub-btn", down: false }],
  ["*", { buttonId: "#mul-btn", down: false }],
  ["/", { buttonId: "#div-btn", down: false }],
  ["0", { buttonId: "#zero-btn", down: false }],
  ["1", { buttonId: "#one-btn", down: false }],
  ["2", { buttonId: "#two-btn", down: false }],
  ["3", { buttonId: "#three-btn", down: false }],
  ["4", { buttonId: "#four-btn", down: false }],
  ["5", { buttonId: "#five-btn", down: false }],
  ["6", { buttonId: "#six-btn", down: false }],
  ["7", { buttonId: "#seven-btn", down: false }],
  ["8", { buttonId: "#eight-btn", down: false }],
  ["9", { buttonId: "#nine-btn", down: false }],
  ["t", { buttonId: "#theme-btn", down: false }],
  ["s", { buttonId: "#sign-btn", down: false }],
]);

export function handleKeyDown(event) {
  // Handle alphabetic hotkeys regardless of case.
  const key = event.key.toLowerCase();

  if (!Page.isErrorModalOpen() && keyMap.has(key)) {
    try {
      // Default hotkeys share keys with some browser behaviour. Disable the
      // browser behaviour.
      event.preventDefault();

      let keyMapValue = keyMap.get(key);

      // Prevent processing held keydown events and set key as down.
      if (keyMapValue.down) {
        return;
      }
      keyMapValue.down = true;

      Calc.keyPressed(key);

      updatePageKeyDown(key);
    } catch (err) {
      Page.showErrorModalWithText(err.message);
    } finally {
      Page.updateCalcDisplay(Calc.getDisplayString(), Calc.getMemoString());
    }
  }
}

export function handleKeyUp(event) {
  // Handle alphabetic hotkeys regardless of case.
  const key = event.key.toLowerCase();

  if (keyMap.has(key)) {
    keyMap.get(key).down = false;

    // Do not release a button on the page if a shared hotkey is released by
    // the user while holding another.
    if (
      (isKeyDecimalKey(key) && isADecimalKeyDown(key)) ||
      (isKeyEqualsKey(key) && isAnEqualsKeyDown(key))
    ) {
      return;
    }

    // The two specific cases here naively handle when a key requiring
    // the `Shift` modifier is released after `Shift` has already been released.
    // It functions properly on any keyboard layout where the keys share a
    // physical key (QWERTY, DVORAK, COLEMAK), but not other common layouts
    // such as AZERTY and QWERTZ.
    // TODO: Handle this across keyboard layouts?
    switch (event.code) {
      case "Digit8":
        Page.releaseButtonById(keyMap.get("*").buttonId);
        Page.releaseButtonById(keyMap.get("8").buttonId);
        break;
      case "Equal":
        Page.releaseButtonById(keyMap.get("+").buttonId);
        Page.releaseButtonById(keyMap.get("=").buttonId);
        break;
      default:
        Page.releaseButtonById(keyMap.get(key).buttonId);
        break;
    }
  }
}

function updatePageKeyDown(key) {
  Page.pressButtonById(keyMap.get(key).buttonId);

  if (key === "t") {
    Page.toggleTheme();
  }

  if (["=", "enter", "escape"].includes(key)) {
    Page.removeHighlightFromOperatorButtons();
  }

  if (["+", "-", "*", "/"].includes(key)) {
    Page.highlightOperatorButton(key);
  }
}

function isKeyDecimalKey(key) {
  return key === "." || key === ",";
}

function isADecimalKeyDown() {
  return keyMap.get(".").down || keyMap.get(",").down;
}

function isKeyEqualsKey(key) {
  return key === "=" || key === "enter";
}

function isAnEqualsKeyDown() {
  return keyMap.get("=").down || keyMap.get("enter").down;
}
