(function () {
  "use strict";

  const area = window.SSF_CURRENT_AREA || {};
  const resources = Array.isArray(area.resources)
    ? area.resources
    : (Array.isArray(window.SSF_RESOURCES) ? window.SSF_RESOURCES : []);
  const routing = area.routing || {};
  const grid = document.querySelector("#resource-grid");
  const count = document.querySelector("#results-count");
  const filterList = document.querySelector("#filter-list");
  const clearButton = document.querySelector("#clear-filters");
  const searchForm = document.querySelector("#help-search");
  const queryInput = document.querySelector("#help-query");
  const answerPanel = document.querySelector("#guide-answer");
  const answerTitle = document.querySelector("#answer-title");
  const answerText = document.querySelector("#answer-text");
  const answerDirection = document.querySelector("#answer-direction");
  const viewResults = document.querySelector("#view-results");
  const resetGuide = document.querySelector("#reset-guide");
  const summaryPanel = document.querySelector("#phase5-filter-summary");
  const controls = document.querySelector("#phase5-controls");
  const layoutButton = document.querySelector("#phase5-layout");
  const activeCategories = new Set();
  const expanded = new Set();
  let mode = "browse";
  let currentCards = [];
  const prepBase = /\/(?:assets|find-help)\/find-help\.html$/.test(window.location.pathname) ? "../" : "";
  const printButton = document.querySelector("#print-directory");

  if (!grid || !count) return;
  if (!window.SSF_CURRENT_AREA) {
    if (queryInput) queryInput.disabled = true;
    document.querySelectorAll("[data-query], .filter-chip").forEach(button => { button.disabled = true; });
    count.textContent = "Guide data could not load. Choose a local guide from the map list. For immediate danger, contact emergency services where you are.";
    return;
  }

  const categoryLabels = {
    all: "all topics",
    reentry: "reentry support", migration: "immigration support", local: "local service navigation",
    food: "food",
    housing: "housing and utilities",
    health: "health",
    "mental-health": "mental health",
    safety: "safety",
    work: "work",
    education: "education",
    family: "family and daily life",
    animals: "animal assistance",
    recovery: "recovery support",
    veterans: "military and veteran support",
    tax: "tax help",
    legal: "legal help",
    volunteer: "volunteer opportunities",
    transportation: "transportation",
    weather: "weather and preparedness"
  };

  const categoryAliases = {
    jobs: "work",
    job: "work",
    crisis: "mental-health",
    mental: "mental-health",
    animal: "animals",
    pets: "animals",
    pet: "animals",
    volunteering: "volunteer",
    donate: "volunteer",
    veteran: "veterans",
    taxes: "tax",
    transit: "transportation",
    weather: "weather",
    comida: "food",
    alimentos: "food",
    vivienda: "housing",
    alquiler: "housing",
    arriendo: "housing",
    salud: "health",
    trabajo: "work",
    empleo: "work",
    escuela: "education",
    educacion: "education",
    mascota: "animals",
    mascotas: "animals",
    legal: "legal",
    transporte: "transportation"
  };

  const stopWords = new Set([
    "about", "after", "also", "and", "are", "can", "care", "could", "for", "from", "get",
    "have", "help", "here", "how", "into", "need", "please", "some", "that", "the",
    "their", "there", "they", "this", "what", "where", "with", "would", "your",
    "cannot", "cant", "afford", "unable", "someone", "about", "looking", "really", "algo", "ayuda", "como", "con", "cual", "cuando", "donde", "esta", "estoy", "hay",
    "las", "los", "mas", "necesito", "para", "pero", "por", "que", "quiero", "sin", "una", "uno"
  ]);

  const intentPatterns = {
    food: ["food", "groceries", "meal", "pantry", "comida", "alimentos", "despensa", "mercado"],
    housing: ["rent", "eviction", "shelter", "homeless", "housing", "utility", "alquiler", "arriendo", "desalojo", "refugio", "vivienda", "sin hogar", "servicios basicos"],
    health: ["doctor", "clinic", "medical", "dental", "dentist", "vaccine", "health", "medico", "clinica", "salud", "dentista", "vacuna"],
    "mental-health": ["mental health", "anxiety", "depression", "panic", "thoughts feel too fast", "thoughts are too fast", "hard to tell what is real", "hearing things", "salud mental", "ansiedad", "depresion", "panico", "pensamientos van muy rapido", "dificil saber que es real", "escucho cosas"],
    safety: ["domestic violence", "abuse", "unsafe", "stalking", "violencia domestica", "abuso", "no estoy a salvo", "acoso"],
    work: ["job", "work", "resume", "training", "empleo", "trabajo", "curriculum", "capacitacion"],
    education: ["school", "class", "ged", "literacy", "iep", "special education", "escuela", "clase", "alfabetizacion", "educacion especial"],
    family: ["child care", "caregiver", "senior", "disability", "iep", "special education", "parent training", "early intervention", "developmental delay", "down syndrome", "autism", "cuidado infantil", "cuidador", "adulto mayor", "discapacidad", "educacion especial", "capacitacion para padres", "intervencion temprana", "retraso del desarrollo", "sindrome de down", "autismo"],
    animals: ["pet", "dog", "cat", "animal", "mascota", "perro", "gato"],
    recovery: ["addiction", "substance", "alcohol", "drug", "recovery", "adiccion", "sustancias", "drogas", "recuperacion"],
    veterans: ["veteran", "military", "veterano", "militar"],
    tax: ["tax", "taxes", "impuesto", "impuestos"],
    legal: ["lawyer", "legal", "court", "tenant", "abogado", "tribunal", "inquilino"],
    transportation: ["bus", "ride", "transportation", "paratransit", "autobus", "viaje", "transporte"],
    weather: ["weather", "storm", "hurricane", "alert", "clima", "tormenta", "huracan", "alerta"],
    volunteer: ["volunteer", "give back", "voluntario", "voluntariado"]
  };

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsTerm(text, term) {
    return (" " + text + " ").includes(" " + term + " ");
  }

  function inferredCategories(query) {
    const normalized = normalize(query);
    return Object.entries(intentPatterns)
      .filter(([category, patterns]) => [...patterns, ...(window.SSF_SEARCH_VOCABULARY?.[category] || [])].some((pattern) => containsTerm(normalized, normalize(pattern))))
      .map(([category]) => category);
  }

  function sortResources(list) {
    return [...list].sort((a, b) => {
      const priority = (a.priority ?? 99) - (b.priority ?? 99);
      if (priority !== 0) return priority;
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function makeLink(label, href, className, external) {
    const link = makeElement("a", className, label);
    link.href = href;
    if (external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function resourceCard(resource) {
    const card = makeElement("article", "resource-card" + (resource.featured ? " featured" : "") + (resource.urgent ? " urgent-resource" : ""));
    card.dataset.resourceId = resource.id;
    const sourceRow = makeElement("div", "resource-source");
    sourceRow.append(makeElement("span", "source-badge", resource.source), makeElement("span", "source-scope", resource.scope));
    const heading = makeElement("h3", "", resource.title);
    const topics = makeElement("p", "phase5-topics", resource.categories.map(c => categoryLabels[c] || c).join(" · "));
    const summary = makeElement("p", "resource-summary", resource.summary);
    // The canonical next field can contain eligibility, urgent instructions and critical limits.
    // Never shorten or hide it in a closed disclosure.
    const next = makeElement("p", "resource-next");
    next.append(makeElement("strong", "", "Next step: "), document.createTextNode(resource.next));
    const contact = makeElement("div", "resource-detail");
    if (resource.phoneDisplay || resource.phone) {
      const line = makeElement("p");
      line.append(makeElement("strong", "", "Contact: "), document.createTextNode(resource.phoneDisplay || resource.phone));
      contact.append(line);
    }
    if (resource.address) {
      const line = makeElement("p");
      line.append(makeElement("strong", "", "Location: "), document.createTextNode(resource.address));
      contact.append(line);
    }
    const actions = makeElement("div", "resource-actions");
    // If the stored dial string is explicitly the text number, show sourced contact text,
    // not a voice call button. Do not derive a different dialing target from display text.
    const display = resource.phoneDisplay || "";
    const textOnly = /(?:^|[·;])\s*(?:text|sms)\b/i.test(display) && display.split(/[·;]/).some(part => /^\s*(?:text|sms)\b/i.test(part) && part.replace(/\D/g, "") === String(resource.phone).replace(/\D/g, ""));
    if (resource.phone && !textOnly) {
      const call = makeLink("Call", "tel:" + resource.phone, "primary", false);
      call.setAttribute("aria-label", "Call " + resource.title + ": " + resource.phone);
      actions.append(call);
    }
    actions.append(makeLink(resource.source.toLowerCase().includes("official") ? "Official website ↗" : "Visit website ↗", resource.url, resource.phone && !textOnly ? "" : "primary", true));
    const details = makeElement("details", "phase5-resource-details");
    details.open = expanded.has(resource.id);
    const disclosure = makeElement("summary", "", "More details and preparation");
    disclosure.setAttribute("aria-label", "More details and preparation: " + resource.title);
    details.append(disclosure);
    const checked = makeElement("p", "resource-check", "Guide source checked " + (area.reviewed || "date not supplied") + " · Confirm current hours, requirements, and availability.");
    if (resource.publicIntakeSource && resource.address) {
      const directions = new URL("https://www.google.com/maps/dir/");
      directions.search = new URLSearchParams({ api: "1", destination: resource.address, travelmode: "transit" });
      details.append(makeLink("Transit directions (Google Maps)", directions.href, "", true));
    }
    const prep = makeElement("div", "phase5-prep-links");
    prep.append(makeLink("Before you call or visit", prepBase + "before-you-call.html#start-conversation"), makeLink("Before you travel", prepBase + "before-you-travel.html#trip-checklist"));
    details.append(prep);
    const reportText = ["Resource: " + resource.title, "Guide: " + (area.label || "Reviewed guide"), "Page type: local resource directory", "Issue: ", "Official source (optional): "].join("\n");
    details.append(makeLink("Report an issue", "mailto:feedback@singlestepforward.com?subject=" + encodeURIComponent("SSF resource correction") + "&body=" + encodeURIComponent(reportText), "report-resource", false));
    details.addEventListener("toggle", () => { if (!currentCards.some(item => item.details === details)) return; if (details.open) expanded.add(resource.id); else expanded.delete(resource.id); });
    card.append(heading, sourceRow, topics);
    if (resource.urgent) card.append(makeElement("p", "phase5-urgent-label", "Urgent support"));
    card.append(summary, next, contact, actions, checked, details);
    card.append(makeElement("p", "phase6-print-url", "Website: " + resource.url));
    if (window.SSFHandout) card.append(window.SSFHandout.choice(area, resource));
    currentCards.push({resource, details, disclosure});
    return card;
  }

  function render(list, message, preserveOrder) {
    // Capture current state synchronously; native toggle events can be queued.
    for (const {resource, details} of currentCards) {
      if (details.open) expanded.add(resource.id); else expanded.delete(resource.id);
    }
    currentCards = [];
    grid.replaceChildren();
    const sorted = preserveOrder ? [...list] : sortResources(list);
    if (!sorted.length) {
      const empty = makeElement("div", "no-results");
      empty.append(makeElement("h3", "", "No close match yet."), makeElement("p", "", "Try fewer words, remove a topic or browse all resources. No match does not mean no help exists."));
      const reset = makeElement("button", "button", "Browse all resources"); reset.type = "button";
      reset.addEventListener("click", () => { removeInitialNeed(); clearSearch(); filterList?.querySelector('[data-filter="all"]')?.focus(); });
      empty.append(reset);
      grid.append(empty);
      count.textContent = message || "0 directory matches";
    } else {
      const fragment = document.createDocumentFragment();
      sorted.forEach(resource => fragment.append(resourceCard(resource)));
      grid.append(fragment);
      count.textContent = message || sorted.length + " source-checked resources";
    }
    if (controls) controls.hidden = !sorted.length;
  }

  function updateFilterButtons() {
    document.querySelectorAll(".filter-chip").forEach(button => {
      button.setAttribute("aria-pressed", String(mode === "browse" && (button.dataset.filter === "all" ? activeCategories.size === 0 : activeCategories.has(button.dataset.filter))));
    });
  }

  function updateSummary() {
    updateFilterButtons();
    if (clearButton) clearButton.hidden = mode === "browse" && activeCategories.size === 0;
    if (!summaryPanel) return;
    summaryPanel.replaceChildren();
    if (mode !== "browse") {
      summaryPanel.append(makeElement("p", "", mode === "urgent" ? "Urgent results — topic filters are not applied." : "Situation search active. Your words are not included in this summary."));
      return;
    }
    if (!activeCategories.size) { summaryPanel.append(makeElement("p", "", "Showing all topics.")); return; }
    summaryPanel.append(makeElement("p", "", "Showing resources matching any selected topic:"));
    for (const category of activeCategories) {
      const remove = makeElement("button", "phase5-remove", "Remove " + categoryLabels[category]);
      remove.type = "button";
      remove.addEventListener("click", () => { removeInitialNeed(); activeCategories.delete(category); browse(false); (filterList?.querySelector('[data-filter="' + category + '"]') || filterList?.querySelector('[data-filter="all"]'))?.focus(); });
      summaryPanel.append(remove);
    }
  }

  function browse(shouldScroll) {
    mode = "browse";
    const filtered = activeCategories.size ? resources.filter(resource => resource.categories.some(c => activeCategories.has(c))) : resources;
    answerPanel.hidden = true;
    answerPanel.classList.remove("urgent-answer");
    render(filtered, filtered.length + " source-checked resources");
    updateSummary();
    if (shouldScroll) document.querySelector("#all-resources").scrollIntoView({ behavior: "auto", block: "start" });
  }
  function clearSearch() {
    if (queryInput) queryInput.value = "";
    activeCategories.clear();
    browse(false);
  }
  // Existing public ?need= deep links remain readable. New local filters and private text are not serialized.
  function removeInitialNeed() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("need")) return;
    url.searchParams.delete("need");
    try { window.history.replaceState(window.history.state, "", url); } catch { /* Local file preview. */ }
  }

  const urgentIntent = typeof window.SSF_URGENT_INTENT === "function" ? window.SSF_URGENT_INTENT : null;

  function scoreResource(resource, rawQuery) {
    const query = normalize(rawQuery);
    if (!query) return 0;

    const title = normalize(resource.title);
    const categoryText = normalize(resource.categories.join(" "));
    const keywords = resource.keywords.map(normalize);
    const haystack = normalize([
      resource.title,
      resource.categories.join(" "),
      resource.keywords.join(" "),
      resource.summary,
      resource.next
    ].join(" "));

    let score = 0;
    if (containsTerm(title, query)) score += 20;
    if (containsTerm(categoryText, query)) score += 12;

    keywords.forEach((keyword) => {
      if (containsTerm(query, keyword)) score += keyword.includes(" ") ? 12 : 7;
    });

    inferredCategories(query).forEach((category) => {
      if (resource.categories.includes(category)) score += 15;
    });

    const words = query
      .split(" ")
      .filter((word) => word.length > 2 && !stopWords.has(word));
    const haystackWords = new Set(haystack.split(" "));

    function hasWordVariant(word) {
      if (haystackWords.has(word) || haystackWords.has(`${word}s`)) return true;
      return word.endsWith("s") && word.length > 3 && haystackWords.has(word.slice(0, -1));
    }

    words.forEach((word) => {
      if (containsTerm(title, word)) score += 5;
      else if (containsTerm(categoryText, word)) score += 4;
      else if (hasWordVariant(word)) score += 6;
    });

    return score;
  }

  function showAnswer(title, text, urgent, resultCount) {
    answerTitle.textContent = title;
    answerText.textContent = text;
    if (answerDirection) {
      const countLabel = Number.isInteger(resultCount) && resultCount > 0
        ? `${resultCount} matching ${resultCount === 1 ? "resource is" : "resources are"}`
        : "The recommended resources are";
      answerDirection.textContent = resultCount === 0 ? "No matching listings are shown. Use the guidance above or browse other topics." : `${countLabel} directly below this message.`;
    }
    if (viewResults) {
      viewResults.hidden = resultCount === 0;
      viewResults.innerHTML = Number.isInteger(resultCount) && resultCount > 0
        ? `View ${resultCount} ${resultCount === 1 ? "resource" : "resources"} <span aria-hidden="true">↓</span>`
        : `View recommended resources <span aria-hidden="true">↓</span>`;
    }
    answerPanel.hidden = false;
    answerPanel.classList.toggle("urgent-answer", Boolean(urgent));
  }

  function resourcesInRouteOrder(ids) {
    const byId = new Map(resources.map((resource) => [resource.id, resource]));
    return (ids || []).map((id) => byId.get(id)).filter(Boolean);
  }

  function search(query) {
    if (!urgentIntent) return; // Never run ordinary situation matching without the safety classifier.
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      queryInput.focus();
      if (mode === "urgent") return;
      showAnswer("Tell me a little more.", "A few ordinary words are enough—for example, “food this week” or “behind on rent.”", false, 0);
      return;
    }

    activeCategories.clear();
    mode = "search";
    removeInitialNeed();

    const urgency = urgentIntent(cleanQuery);
    if (urgency) mode = "urgent";
    updateSummary();
    const usJurisdiction = ["US", "PR"].includes(area.country);
    const emergencyInfo = area.emergency;
    const localEmergency = emergencyInfo ? emergencyInfo.callLabel : usJurisdiction ? "Call 911" : "Contact local emergency services";
    if (urgency === "emergency") {
      const emergencyResults = resourcesInRouteOrder(routing.emergency || (usJurisdiction ? ["988-lifeline"] : []));
      render(emergencyResults, "Urgent support options", true);
      showAnswer(
        `${localEmergency} now for an immediate or life-threatening emergency.`,
        emergencyInfo ? `${emergencyInfo.description} Do not wait for a website response.` : "Do not wait for a website response. If safe, move away from danger. " + localEmergency + ".",
        true,
        emergencyResults.length
      );
    } else if (urgency === "suicide") {
      const crisisResults = resourcesInRouteOrder(routing.suicide || (usJurisdiction ? ["988-lifeline"] : []));
      render(crisisResults, "Immediate crisis support", true);
      showAnswer(
        emergencyInfo ? `Please ${emergencyInfo.crisisLabel.toLowerCase()} now.` : usJurisdiction ? "Please call or text 988 now." : "Contact crisis support where you are.",
        emergencyInfo ? `${emergencyInfo.crisisDescription} For immediate physical danger, ${emergencyInfo.callLabel.toLowerCase()}.` : "If someone is in immediate physical danger, " + localEmergency.toLowerCase() + ".",
        true,
        crisisResults.length
      );
    } else if (urgency === "violence") {
      const safetyResults = resourcesInRouteOrder(routing.violence || (usJurisdiction ? ["988-lifeline"] : []));
      render(safetyResults, "Confidential safety options", true);
      showAnswer(
        "Your safety comes first.",
        routing.violenceText || localEmergency + " for immediate danger. Use a safe device if possible when contacting a confidential support service.",
        true,
        safetyResults.length
      );
    } else {
      const scored = resources
        .map((resource) => ({ resource: resource, score: scoreResource(resource, cleanQuery) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || (a.resource.priority ?? 99) - (b.resource.priority ?? 99))
        .map((item) => item.resource);

      if (scored.length) {
        render(scored, scored.length + " directory term matches", true);
        showAnswer(
          "Here are a few good places to start.",
          "Your words matched directory terms. These are possible starting points, not an eligibility or availability decision. Confirm details with the provider.",
          false,
          scored.length
        );
      } else {
        const startingPoints = resources.filter((resource) =>
          (routing.fallback || []).includes(resource.id)
        );
        render(startingPoints, "0 close matches · " + startingPoints.length + " broader starting points");
        showAnswer(
          "I’m not seeing a close match yet.",
          routing.fallbackText || "Try fewer words, browse a topic, or ask a local referral service about other options.",
          false,
          startingPoints.length
        );
      }
    }

    answerPanel.scrollIntoView({ behavior: "auto", block: "center" });
    answerPanel.focus({preventScroll: true});
  }

  if (!resources.length) {
    render([], "Directory unavailable");
    return;
  }

  if (area.ledgerEdition && filterList) {
    const available = new Set(resources.flatMap(resource => resource.categories));
    for (const button of filterList.querySelectorAll("[data-filter]")) {
      if (button.dataset.filter !== "all" && !available.has(button.dataset.filter)) button.remove();
    }
    for (const category of available) {
      if (filterList.querySelector('[data-filter="' + category + '"]')) continue;
      const button = makeElement("button", "filter-chip", categoryLabels[category] || category);
      button.type = "button";
      button.dataset.filter = category;
      button.setAttribute("aria-pressed", "false");
      filterList.append(button);
    }
  }
  filterList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    if (queryInput) queryInput.value = "";
    removeInitialNeed();
    if (mode !== "browse" || button.dataset.filter === "all") activeCategories.clear();
    if (button.dataset.filter !== "all") {
      const category = button.dataset.filter;
      if (activeCategories.has(category)) activeCategories.delete(category);
      else activeCategories.add(category);
    }
    browse(false);
  });

  clearButton?.addEventListener("click", () => {
    removeInitialNeed(); clearSearch(); filterList?.querySelector('[data-filter="all"]')?.focus();
  });

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    search(queryInput.value);
  });

  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      queryInput.value = button.dataset.query || "";
      search(queryInput.value);
    });
  });

  resetGuide?.addEventListener("click", () => {
    removeInitialNeed(); clearSearch();
    document.querySelector("#guide").scrollIntoView({ behavior: "auto", block: "start" });
    queryInput.focus({ preventScroll: true });
  });

  viewResults?.addEventListener("click", () => {
    document.querySelector("#all-resources").scrollIntoView({ behavior: "auto", block: "start" });
    document.querySelector("#directory-title")?.focus({preventScroll:true});
  });

  document.querySelector("#phase5-expand")?.addEventListener("click", () => {
    for (const {resource, details} of currentCards) { expanded.add(resource.id); details.open = true; }
  });
  document.querySelector("#phase5-collapse")?.addEventListener("click", () => {
    for (const {resource, details} of currentCards) { expanded.delete(resource.id); details.open = false; }
  });
  layoutButton?.addEventListener("click", () => {
    const list = layoutButton.getAttribute("aria-pressed") !== "true";
    layoutButton.setAttribute("aria-pressed", String(list));
    grid.classList.toggle("phase5-list", list);
  });
  if (urgentIntent) {
    searchForm?.querySelector('button[type="submit"]')?.removeAttribute("disabled");
    document.querySelectorAll("[data-query]").forEach(button => { button.disabled = false; });
  } else {
    if (queryInput) queryInput.disabled = true;
    document.querySelectorAll("[data-query]").forEach(button => { button.disabled = true; });
    const warning = document.querySelector("#situation-unavailable");
    if (warning) warning.hidden = false;
  }
  printButton?.addEventListener("click", () => window.print());

  const params = new URLSearchParams(window.location.search);
  const rawNeed = params.get("need") || "";
  const requested = Object.hasOwn(categoryLabels, rawNeed) ? rawNeed : normalize(rawNeed);
  const initialCategory = Object.hasOwn(categoryAliases, requested) ? categoryAliases[requested] : requested;
  if (Object.hasOwn(categoryLabels, initialCategory) && initialCategory !== "all") activeCategories.add(initialCategory);
  browse(false);
})();
