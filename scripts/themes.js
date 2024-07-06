export function trySetThemeFromLocalStorage() {
  if (currentTheme) {
    setTheme(currentTheme);
  } else {
    setTheme("light");
  }
}

export function toggleTheme() {
  if (currentTheme === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

let currentTheme = localStorage.getItem("theme");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme;
};
