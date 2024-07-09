let currentTheme = localStorage.getItem("theme");

export function setThemeFromLocalStorageOrDefault() {
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

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme;
}
