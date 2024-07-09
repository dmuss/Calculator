import * as Page from "./modules/page/page.js";

document.addEventListener("DOMContentLoaded", () => {
  Page.setThemeFromLocalStorageOrDefault();
  Page.updateCalcDisplay();
});

document.addEventListener("keydown", Page.handleKeyDown);
document.addEventListener("keyup", Page.handleKeyUp);

const calc = document.querySelector("#calculator");
calc.addEventListener("click", Page.handleMouseInput);
