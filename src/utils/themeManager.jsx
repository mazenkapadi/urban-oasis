class ThemeManager {
    constructor() {
        this.isDarkMode = this.loadTheme();
        this.listeners = [];
    }

    loadTheme() {
        const theme = localStorage.getItem("theme");
        if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            return true;
        }
        document.documentElement.classList.remove("dark");
        return false;
    }

    setTheme(isDark) {
        this.isDarkMode = isDark;
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        this.notifyListeners();
    }

    toggleTheme() {
        this.setTheme(!this.isDarkMode);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.isDarkMode));
    }
}

const themeManager = new ThemeManager();
export default themeManager;