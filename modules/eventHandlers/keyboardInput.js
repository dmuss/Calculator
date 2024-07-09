/*  NOTE: The current keyboard input handling will not properly display
 *  "pressed" and "unpressed" buttons on the page where there are multiple
 *  hotkeys for that button (e.g., if you press and hold `.`, then press and
 *  release `,` while still holding `.`, the page will render the decimal
 *  button "unpressed" as it handled a `keyup` event for one of the hotkeys.
 *  ----------------------------------------------------------------------------
 *  In practice, this really shouldn't be much of an issue as only the equals
 *  and decimal buttons share a hotkey, and:
 *   - the equals button is unlikely to be held and resets the calculator; and,
 *   - while the decimal button will always display as "." in the display,
 *     the multiple hotkeys support regional differences in how decimals
 *     are represented and it is unlikely a user would press and hold both
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
    event.preventDefault();

    let keyMapValue = keyMap.get(key);

    // Prevent processing held keydown events.
    if (keyMapValue.down) {
      return;
    } else {
      keyMapValue.down = true;
    }

    Page.pressButtonById(keyMapValue.buttonId);

    try {
      if (key === "t") {
        Page.toggleTheme();
      }

      Calc.keyPressed(key);

      if (["=", "enter", "escape"].includes(key)) {
        Page.removeHighlightFromOperatorButton();
      }

      if (["+", "-", "*", "/"].includes(key)) {
        Page.highlightOperatorButton(key);
      }
    } catch (err) {
      if (err instanceof Calc.DisplayParseError) {
        Page.highlightOperatorButton(Calc.getOperatorString());
      }

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

    // The two specific cases here naively handles the case where a key requiring
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
