class ThemeManager {
    constructor() {
        this.isDarkMode = this.loadTheme();
        this.listeners = [];
    }

    // Load theme from localStorage or system preference
    loadTheme() {
        const theme = localStorage.getItem("theme");
        if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            return true;
        }
        document.documentElement.classList.remove("dark");
        return false;
    }

    // Save theme to localStorage and apply changes
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

    // Toggle theme
    toggleTheme() {
        this.setTheme(!this.isDarkMode);
    }

    // Add a listener for theme changes
    addListener(listener) {
        this.listeners.push(listener);
    }

    // Remove a listener
    removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    // Notify all listeners of a theme change
    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.isDarkMode));
    }
}

// Export a singleton instance
const themeManager = new ThemeManager();
export default themeManager;