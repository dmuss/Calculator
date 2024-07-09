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
      Page.highlightOperatorButtonOrClear();
    }

    const targetClasses = target.classList;

    if (targetClasses.contains("op-btn")) {
      const pressedOperatorButton = target.textContent;

      Calc.keyPressed(pressedOperatorButton);
      Page.highlightOperatorButtonOrClear(pressedOperatorButton);
    }

    if (targetClasses.contains("input-btn")) {
      switch (target.id) {
        case "clear-btn":
          Calc.keyPressed("delete");
          break;
        case "all-clear-btn":
          Calc.keyPressed("escape");
          Page.highlightOperatorButtonOrClear();
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
    if (err instanceof Calc.DisplayParseError) {
      Page.highlightOperatorButtonOrClear(Calc.getOperatorString());
    }

    Page.showErrorModalWithText(err.message);
  } finally {
    Page.updateCalcDisplay(Calc.getDisplayString(), Calc.getMemoString());
  }
}
