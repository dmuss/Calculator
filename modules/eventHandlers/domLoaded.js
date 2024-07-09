import * as Page from "../page/page.js";
import * as Calc from "../calculator/calculator.js";

export function handleDOMContentLoaded() {
  Page.setThemeFromLocalStorageOrDefault();
  Page.updateCalcDisplay(Calc.getDisplayString(), Calc.getMemoString());
}
