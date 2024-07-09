import * as EventHandlers from "./modules/eventHandlers/eventHandlers.js";

document.addEventListener("DOMContentLoaded", EventHandlers.DOMLoaded);

document.addEventListener("keydown", EventHandlers.keyDown);
document.addEventListener("keyup", EventHandlers.keyUp);

const calc = document.querySelector("#calculator");
calc.addEventListener("click", EventHandlers.click);

//     () => { // TODO: Page.onDOMLoaded(event)
//   Page.setThemeFromLocalStorageOrDefault();
//   Page.updateCalcDisplay();
// });
//
// document.addEventListener("keydown", Page.handleKeyDown);
// document.addEventListener("keyup", Page.handleKeyUp);
//
// const calc = document.querySelector("#calculator");
// calc.addEventListener("click", Page.handleMouseInput);
