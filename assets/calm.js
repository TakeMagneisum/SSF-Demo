(function () {
  "use strict";

  const storageKey = "ssf-calm-view";

  function storedPreference() {
    try { return window.localStorage.getItem(storageKey) === "true"; }
    catch { return false; }
  }

  function remember(active) {
    try { window.localStorage.setItem(storageKey, String(active)); }
    catch { /* Calm View still works for the current page. */ }
  }

  function label(active) {
    const spanish = document.documentElement.lang === "es";
    if (spanish) return active ? "Vista tranquila: activada" : "Vista tranquila";
    return active ? "Calm View: On" : "Calm View";
  }

  function apply(active) {
    document.documentElement.dataset.calm = String(active);
    if (typeof Event === "function") document.dispatchEvent?.(new Event("ssf-calm-change"));
    document.querySelectorAll("[data-calm-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(active));
      button.textContent = label(active);
    });
  }

  function init() {
    const menu = document.querySelector(".menu-toggle");
    if (menu) {
      const nav = document.getElementById(menu.getAttribute("aria-controls"));
      const compact = window.matchMedia("(max-width: 1100px)");
      const containsTarget = target => menu.contains(target) || nav.contains(target);
      const setOpen = open => menu.setAttribute("aria-expanded", String(open));
      menu.addEventListener("click", () => setOpen(menu.getAttribute("aria-expanded") !== "true"));
      document.addEventListener("pointerdown", event => {
        if (!containsTarget(event.target)) setOpen(false);
      });
      document.addEventListener("focusin", event => {
        if (!containsTarget(event.target)) setOpen(false);
      });
      if (compact.addEventListener) compact.addEventListener("change", () => setOpen(false));
      else compact.addListener?.(() => setOpen(false));
      nav.addEventListener("click", event => { if (event.target.closest("a")) setOpen(false); });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          menu.focus();
        }
      });
      document.documentElement.classList.add("menu-ready");
    }
    let active = storedPreference();
    apply(active);
    window.addEventListener?.("pageshow", event => { if (event.persisted) { active = storedPreference(); apply(active); } });
    window.addEventListener?.("storage", event => { if (event.key === storageKey || event.key === null) { active = storedPreference(); apply(active); } });
    document.querySelectorAll("[data-calm-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        active = !active;
        remember(active);
        apply(active);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
