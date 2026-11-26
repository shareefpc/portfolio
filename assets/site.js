"use strict";

const contactActions = document.querySelector("#contact-actions");
const contact = window.portfolioContact ?? {};

function profileUrl(value) {
  if (typeof value !== "string" || !/^https:\/\//i.test(value.trim())) return "";
  try {
    return new URL(value.trim()).href;
  } catch {
    return "";
  }
}

const email = typeof contact.email === "string" ? contact.email.trim() : "";
const contactUrls = {
  email: /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) ? "mailto:" + email : "",
  github: profileUrl(contact.github),
  linkedin: profileUrl(contact.linkedin),
  instagram: profileUrl(contact.instagram)
};

for (const link of document.querySelectorAll("[data-contact-link]")) {
  const url = contactUrls[link.dataset.contactLink];
  if (!url) continue;
  link.href = url;
  if (link.dataset.contactLink !== "email") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  link.removeAttribute("aria-disabled");
  link.removeAttribute("title");
}

if (contactActions) {
  const brief = contactActions.querySelector("[download]");
  for (const [key, label] of [["email", "Email me"], ["github", "GitHub"], ["linkedin", "LinkedIn"], ["instagram", "Instagram"]]) {
    const url = contactUrls[key];
    if (!url) continue;
    const link = document.createElement("a");
    link.className = key === "email" ? "button button-primary" : "button";
    link.textContent = label;
    link.href = url;
    brief.before(link);
  }
  if (contactUrls.email) brief.classList.remove("button-primary");
}

const compactLayout = matchMedia("(max-width: 820px)");
const moreToggle = document.querySelector("#more-toggle");
const moreDialog = document.querySelector("#more-dialog");
const moreLinks = Array.from(document.querySelectorAll('#more-dialog a[href^="#"]'));
const sidebarLinks = Array.from(document.querySelectorAll('#sidebar .nav-link[href^="#"]'));
const navLinks = [...sidebarLinks, ...document.querySelectorAll(".mobile-tab[href]"), ...moreLinks];
const navSections = sidebarLinks.map((link) => document.querySelector(link.hash));

function closeOnBackdrop(dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

if (moreToggle && typeof moreDialog?.showModal === "function") {
  document.body.classList.add("enhanced");
  moreToggle.addEventListener("click", () => moreDialog.showModal());
  moreDialog.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) moreDialog.close();
  });
  closeOnBackdrop(moreDialog);
  compactLayout.addEventListener("change", () => {
    if (!compactLayout.matches && moreDialog.open) moreDialog.close();
  });
}

function updateNavigation() {
  const headerHeight = compactLayout.matches ? document.querySelector(".mobile-header").offsetHeight : 0;
  const limit = headerHeight + (compactLayout.matches ? 56 : 114);
  let current = navSections[0];
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= limit) current = section;
  }
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) {
    const target = navSections.find((section) => location.hash === "#" + section.id);
    const top = target?.getBoundingClientRect().top;
    current = top >= limit && top < window.innerHeight ? target : navSections.at(-1);
  }
  const currentHash = "#" + current.id;
  for (const link of navLinks) {
    if (link.hash === currentHash) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  if (moreLinks.some((link) => link.hash === currentHash)) moreToggle.setAttribute("aria-current", "true");
  else moreToggle.removeAttribute("aria-current");
}

if (navLinks.length) {
  updateNavigation();
  addEventListener("scroll", updateNavigation, { passive: true });
  addEventListener("resize", updateNavigation);
  addEventListener("hashchange", updateNavigation);
}

const dialog = document.querySelector("#search-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");
const searchEntries = Array.from(document.querySelectorAll("[data-search-title]"), (element) => ({
  title: element.dataset.searchTitle,
  context: element.dataset.searchContext,
  url: element.getAttribute("href") || "#" + element.id
}));

function renderSearch() {
  const query = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = searchEntries.filter(({ title, context }) => {
    const content = (title + " " + context).toLowerCase();
    return query.every((term) => content.includes(term));
  });
  searchStatus.textContent = results.length ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "No matching projects or sections.";
  searchResults.replaceChildren();
  for (const entry of results) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const title = document.createElement("span");
    const context = document.createElement("small");
    link.href = entry.url;
    title.textContent = entry.title;
    context.textContent = entry.context;
    link.append(title, context);
    item.append(link);
    searchResults.append(item);
  }
}

function openSearch() {
  if (!dialog || dialog.open) return;
  if (moreDialog?.open) moreDialog.close();
  searchInput.value = "";
  renderSearch();
  dialog.showModal();
  searchInput.focus();
}

if (dialog && typeof dialog.showModal === "function") {
  const apple = /Mac|iPhone|iPad/.test(navigator.platform);
  for (const button of document.querySelectorAll("[data-open-search]")) {
    button.hidden = false;
    button.setAttribute("aria-keyshortcuts", apple ? "Meta+K" : "Control+K");
    button.addEventListener("click", openSearch);
  }
  searchInput.addEventListener("input", renderSearch);
  searchInput.addEventListener("keydown", (event) => {
    const first = searchResults.querySelector("a");
    if (first && event.key === "ArrowDown") {
      event.preventDefault();
      first.focus();
    }
  });
  searchResults.addEventListener("click", (event) => {
    if (event.target.closest("a")) dialog.close();
  });
  closeOnBackdrop(dialog);
}

addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.repeat) return;
  if (typeof dialog?.showModal === "function" && (event.ctrlKey || event.metaKey) && !event.altKey &&
      !event.shiftKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
});
