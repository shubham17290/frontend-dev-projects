/**
 * =========================================
 * DEVFORGE — TASK 4 & 5 (UPGRADED)
 * API Integration & Theme Controller
 * =========================================
 */

// 1. Encapsulation: Wrap everything in an IIFE to prevent global namespace pollution
(function () {
  "use strict";

  // =========================================
  // CONFIGURATION & STATE
  // =========================================
  const API_URL = "https://jsonplaceholder.typicode.com/posts";
  const INITIAL_LIMIT = 6;
  const LOAD_MORE_COUNT = 6;

  let displayedResources = INITIAL_LIMIT;
  let resources = [];
  let currentColorIndex = 0;

  const backgroundColors = [
    "#f8fafc",
    "#e0f2fe",
    "#ecfdf5",
    "#fef3c7",
    "#fce7f3",
    "#ede9fe"
  ];

  // =========================================
  // DOM ELEMENTS (Cached for performance)
  // =========================================
  const elements = {
    resourceContainer: document.getElementById("resourceContainer"),
    apiStatus: document.getElementById("apiStatus"),
    loadMoreBtn: document.getElementById("loadMoreButton"),
    interactionBtn: document.getElementById("interactionButton"),
    themeBtn: document.getElementById("themeButton"),
    interactionMsg: document.getElementById("interactionMessage")
  };

  // =========================================
  // TASK 5: API INTEGRATION
  // =========================================

  /**
   * Fetches data from the API and handles loading/error states.
   */
  async function fetchResources() {
    if (!elements.resourceContainer || !elements.apiStatus) return;

    try {
      // Trigger the CSS Pulse Animation
      elements.apiStatus.textContent =
        "Loading developer resources from API...";
      elements.apiStatus.classList.add("loading");
      elements.apiStatus.classList.remove("hidden");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      resources = await response.json();
      renderResources();

      // Handle Success State
      elements.apiStatus.classList.remove("loading");
      elements.apiStatus.textContent = `Successfully loaded ${resources.length} resources.`;

      // Clean up UI by fading out the status banner after 3 seconds
      setTimeout(() => {
        elements.apiStatus.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("API request failed:", error);

      // Handle Error State
      elements.apiStatus.classList.remove("loading");
      elements.apiStatus.textContent =
        "Unable to load resources at the moment.";

      // Use an <li> for the error to maintain the <ul> structural integrity
      elements.resourceContainer.innerHTML = `
                <li class="error-message">
                    <strong>Something went wrong.</strong><br>
                    Please check your internet connection and try again.
                </li>
            `;

      if (elements.loadMoreBtn) elements.loadMoreBtn.style.display = "none";
    }
  }

  /**
   * Renders the resources using a DocumentFragment for maximum performance.
   */
  function renderResources() {
    elements.resourceContainer.innerHTML = "";

    // UPGRADE: Use DocumentFragment. This builds the HTML in memory first,
    // triggering only ONE browser repaint instead of reflowing on every loop.
    const fragment = document.createDocumentFragment();

    const resourcesToDisplay = resources.slice(0, displayedResources);

    resourcesToDisplay.forEach((resource, index) => {
      // UPGRADE: Create an <li> to match the upgraded HTML <ul> structure
      const card = document.createElement("li");
      card.className = "resource-card";

      card.innerHTML = `
                <p class="resource-number">
                    RESOURCE ${String(index + 1).padStart(2, "0")}
                </p>
                <h3>
                    ${escapeHTML(resource.title)}
                </h3>
                <p>
                    ${escapeHTML(resource.body)}
                </p>
            `;

      fragment.appendChild(card);
    });

    // Append everything at once
    elements.resourceContainer.appendChild(fragment);
    updateLoadMoreButton();
  }

  /**
   * Toggles visibility of the Load More button
   */
  function updateLoadMoreButton() {
    if (!elements.loadMoreBtn) return;

    if (displayedResources >= resources.length) {
      elements.loadMoreBtn.style.display = "none";
    } else {
      elements.loadMoreBtn.style.display = "inline-flex";
    }
  }

  /**
   * Basic XSS protection for injecting API text into HTML
   */
  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================================
  // TASK 4: INTERACTIVE BACKGROUND
  // =========================================

  /**
   * Cycles to the next theme color and updates the CSS custom property.
   */
  function cycleTheme() {
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    const newColor = backgroundColors[currentColorIndex];

    // UPGRADE: Update the CSS variable globally instead of hardcoding body style
    document.documentElement.style.setProperty("--clr-bg-body", newColor);

    if (elements.interactionMsg) {
      elements.interactionMsg.textContent = "Background changed successfully!";
    }
  }

  // =========================================
  // EVENT LISTENERS & INITIALIZATION
  // =========================================

  // Defensive checking ensures listeners only attach if elements exist on page
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.addEventListener("click", () => {
      displayedResources += LOAD_MORE_COUNT;
      renderResources();
    });
  }

  if (elements.interactionBtn) {
    elements.interactionBtn.addEventListener("click", cycleTheme);
  }

  if (elements.themeBtn) {
    elements.themeBtn.addEventListener("click", cycleTheme);
  }

  // Start Application
  fetchResources();
})();
