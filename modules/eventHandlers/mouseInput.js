import * as Calc from "../calculator/calculator.js";
import * as Page from "../page/page.js";

export function handleMouseInput(event) {
  try {
    const target = event.target;

    if (target.id === "theme-btn") {
      Page.toggleTheme();
    }

    if (target.id === "equals-btn") {
      Calc.keyPressed("=");
      Page.removeHighlightFromOperatorButtons();
    }

    const targetClasses = target.classList;

    if (targetClasses.contains("operator-btn")) {
      const pressedOperatorButton = target.textContent;

      Calc.keyPressed(pressedOperatorButton);
      Page.highlightOperatorButton(pressedOperatorButton);
    }

    // Input buttons are buttons that affect the current displayed value.
    if (targetClasses.contains("input-btn")) {
      switch (target.id) {
        case "clear-btn":
          Calc.keyPressed("delete");
          break;
        case "all-clear-btn":
          Calc.keyPressed("escape");
          Page.removeHighlightFromOperatorButtons();
          break;
        case "back-btn":
          Calc.keyPressed("backspace");
          break;
        case "sign-btn":
          Calc.keyPressed("s");
          break;
        default:
          Calc.keyPressed(target.textContent);
          break;
      }
    }
  } catch (err) {
    Page.showErrorModalWithText(err.message);
  } finally {
    Page.updateCalcDisplay(Calc.getDisplayString(), Calc.getMemoString());
  }
}
