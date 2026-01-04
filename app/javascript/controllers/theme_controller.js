import { Controller } from "@hotwired/stimulus"

// data-controller="theme"
// data-action="theme#toggle"
export default class extends Controller {
  connect() {
    this.applyInitialTheme()
  }

  toggle() {
    const next = this.isDark() ? "light" : "dark"
    this.setTheme(next)
  }

  applyInitialTheme() {
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") {
      this.setTheme(stored)
      return
    }

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    this.setTheme(prefersDark ? "dark" : "light")
  }

  setTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }

  isDark() {
    return document.documentElement.classList.contains("dark")
  }
}

