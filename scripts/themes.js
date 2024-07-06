let currentTheme = localStorage.getItem("theme");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme;
}

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
