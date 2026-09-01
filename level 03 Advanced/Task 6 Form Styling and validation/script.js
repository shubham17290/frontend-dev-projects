/**
 * =========================================
 * DEVFORGE — TASK 4, 5, & 6 (UPGRADED)
 * API Integration, Theme Controller, & Form Validation
 * =========================================
 */

// 1. Encapsulation: Wrap in an IIFE to prevent global variable leakage
(function () {
  "use strict";

  // =========================================
  // CONFIGURATION & STATE
  // =========================================

  // API Config
  const API_URL = "https://jsonplaceholder.typicode.com/posts";
  const INITIAL_LIMIT = 6;
  const LOAD_MORE_COUNT = 6;

  let displayedResources = INITIAL_LIMIT;
  let resources = [];

  // Theme Config
  const backgroundColors = [
    "#f8fafc",
    "#e0f2fe",
    "#ecfdf5",
    "#fef3c7",
    "#fce7f3",
    "#ede9fe"
  ];
  let currentColorIndex = 0;

  // =========================================
  // DOM ELEMENTS (Cached for performance)
  // =========================================
  const elements = {
    // API Elements
    resourceContainer: document.getElementById("resourceContainer"),
    apiStatus: document.getElementById("apiStatus"),
    loadMoreBtn: document.getElementById("loadMoreButton"),

    // Interaction Elements
    interactionBtn: document.getElementById("interactionButton"),
    themeBtn: document.getElementById("themeButton"),
    interactionMsg: document.getElementById("interactionMessage"),

    // Form Elements
    contactForm: document.getElementById("contactForm"),
    formStatus: document.getElementById("formStatus"),
    inputs: {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message")
    },
    errors: {
      name: document.getElementById("nameError"),
      email: document.getElementById("emailError"),
      subject: document.getElementById("subjectError"),
      message: document.getElementById("messageError")
    }
  };

  // =========================================
  // TASK 5: API INTEGRATION
  // =========================================

  async function fetchResources() {
    if (!elements.resourceContainer || !elements.apiStatus) return;

    try {
      // Setup loading state (using CSS classes for animation)
      elements.apiStatus.textContent =
        "Loading developer resources from API...";
      elements.apiStatus.classList.add("loading");
      elements.apiStatus.classList.remove("hidden");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      resources = await response.json();
      renderResources();

      // Success state
      elements.apiStatus.classList.remove("loading");
      elements.apiStatus.textContent = `Successfully loaded ${resources.length} resources from the API.`;

      // Auto-hide the success banner after 3 seconds
      setTimeout(() => {
        elements.apiStatus.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("API request failed:", error);

      // Error state
      elements.apiStatus.classList.remove("loading");
      elements.apiStatus.textContent =
        "Unable to load resources at the moment.";

      elements.resourceContainer.innerHTML = `
                <li class="error-message">
                    <strong>Something went wrong.</strong><br>
                    Please check your internet connection and try again.
                </li>
            `;

      if (elements.loadMoreBtn) elements.loadMoreBtn.classList.add("hidden");
    }
  }

  function renderResources() {
    elements.resourceContainer.innerHTML = "";

    // UPGRADE: Use DocumentFragment to batch DOM inserts (High Performance)
    const fragment = document.createDocumentFragment();
    const resourcesToDisplay = resources.slice(0, displayedResources);

    resourcesToDisplay.forEach((resource, index) => {
      // UPGRADE: Create an <li> to match the semantic HTML setup
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

    elements.resourceContainer.appendChild(fragment);
    updateLoadMoreButton();
  }

  function updateLoadMoreButton() {
    if (!elements.loadMoreBtn) return;

    // Use the CSS .hidden utility class instead of inline styles
    if (displayedResources >= resources.length) {
      elements.loadMoreBtn.classList.add("hidden");
    } else {
      elements.loadMoreBtn.classList.remove("hidden");
    }
  }

  // Basic XSS Protection
  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================================
  // TASK 4: BACKGROUND INTERACTION
  // =========================================

  function cycleTheme() {
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    const newColor = backgroundColors[currentColorIndex];

    // UPGRADE: Update the CSS variable to sync the whole design system
    document.documentElement.style.setProperty("--clr-bg-body", newColor);

    if (elements.interactionMsg) {
      elements.interactionMsg.textContent = "Background changed successfully!";
    }
  }

  // =========================================
  // TASK 6: FORM VALIDATION
  // =========================================

  /**
   * UPGRADE: Unified Validation Helper
   * Handles DOM classes AND highly critical Accessibility attributes.
   */
  function setFieldState(
    inputElement,
    errorElement,
    isValid,
    errorMessage = ""
  ) {
    if (isValid) {
      inputElement.classList.remove("invalid");
      inputElement.classList.add("valid");
      inputElement.setAttribute("aria-invalid", "false");
      errorElement.textContent = "";
    } else {
      inputElement.classList.add("invalid");
      inputElement.classList.remove("valid");
      inputElement.setAttribute("aria-invalid", "true");
      errorElement.textContent = errorMessage;
    }
    return isValid;
  }

  /**
   * UPGRADE: Resets a field to its neutral state as soon as the user starts typing,
   * preventing them from being yelled at while actively trying to fix the error.
   */
  function clearFieldState(inputElement, errorElement) {
    inputElement.classList.remove("invalid", "valid");
    inputElement.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  }

  // --- Specific Field Validators --- //

  function validateName() {
    const val = elements.inputs.name.value.trim();
    if (val === "")
      return setFieldState(
        elements.inputs.name,
        elements.errors.name,
        false,
        "Please enter your full name."
      );
    if (val.length < 2)
      return setFieldState(
        elements.inputs.name,
        elements.errors.name,
        false,
        "Name must contain at least 2 characters."
      );
    return setFieldState(elements.inputs.name, elements.errors.name, true);
  }

  function validateEmail() {
    const val = elements.inputs.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === "")
      return setFieldState(
        elements.inputs.email,
        elements.errors.email,
        false,
        "Please enter your email address."
      );
    if (!emailPattern.test(val))
      return setFieldState(
        elements.inputs.email,
        elements.errors.email,
        false,
        "Please enter a valid email address."
      );
    return setFieldState(elements.inputs.email, elements.errors.email, true);
  }

  function validateSubject() {
    const val = elements.inputs.subject.value.trim();
    if (val === "")
      return setFieldState(
        elements.inputs.subject,
        elements.errors.subject,
        false,
        "Please enter a subject."
      );
    if (val.length < 3)
      return setFieldState(
        elements.inputs.subject,
        elements.errors.subject,
        false,
        "Subject must contain at least 3 characters."
      );
    return setFieldState(
      elements.inputs.subject,
      elements.errors.subject,
      true
    );
  }

  function validateMessage() {
    const val = elements.inputs.message.value.trim();
    if (val === "")
      return setFieldState(
        elements.inputs.message,
        elements.errors.message,
        false,
        "Please enter your message."
      );
    if (val.length < 10)
      return setFieldState(
        elements.inputs.message,
        elements.errors.message,
        false,
        "Message must contain at least 10 characters."
      );
    return setFieldState(
      elements.inputs.message,
      elements.errors.message,
      true
    );
  }

  // --- Form Submission Handler --- //

  function handleFormSubmit(event) {
    event.preventDefault();

    // Validate all fields (Assigning to variables ensures all functions run and show errors)
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    const formIsValid =
      isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!formIsValid) {
      elements.formStatus.className = "form-status error";
      elements.formStatus.textContent =
        "Please correct the highlighted fields before submitting.";
      return;
    }

    // Success State
    elements.formStatus.className = "form-status success";
    elements.formStatus.textContent =
      "Your message has been validated successfully!";

    // Reset the form and clear all visual/accessibility states
    elements.contactForm.reset();

    Object.values(elements.inputs).forEach((input) => {
      input.classList.remove("valid", "invalid");
      input.setAttribute("aria-invalid", "false");
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      elements.formStatus.className = "form-status";
      elements.formStatus.textContent = "";
    }, 5000);
  }

  // =========================================
  // EVENT LISTENERS & INITIALIZATION
  // =========================================

  function init() {
    // API Listeners
    if (elements.loadMoreBtn) {
      elements.loadMoreBtn.addEventListener("click", () => {
        displayedResources += LOAD_MORE_COUNT;
        renderResources();
      });
    }

    // Theme Listeners
    if (elements.interactionBtn)
      elements.interactionBtn.addEventListener("click", cycleTheme);
    if (elements.themeBtn)
      elements.themeBtn.addEventListener("click", cycleTheme);

    // Form Listeners
    if (elements.contactForm) {
      // Validate on blur (when user leaves the field)
      elements.inputs.name.addEventListener("blur", validateName);
      elements.inputs.email.addEventListener("blur", validateEmail);
      elements.inputs.subject.addEventListener("blur", validateSubject);
      elements.inputs.message.addEventListener("blur", validateMessage);

      // Clear errors on input (while user is actively typing to fix the error)
      elements.inputs.name.addEventListener("input", () =>
        clearFieldState(elements.inputs.name, elements.errors.name)
      );
      elements.inputs.email.addEventListener("input", () =>
        clearFieldState(elements.inputs.email, elements.errors.email)
      );
      elements.inputs.subject.addEventListener("input", () =>
        clearFieldState(elements.inputs.subject, elements.errors.subject)
      );
      elements.inputs.message.addEventListener("input", () =>
        clearFieldState(elements.inputs.message, elements.errors.message)
      );

      elements.contactForm.addEventListener("submit", handleFormSubmit);
    }

    // Start API Fetch
    fetchResources();
  }

  // Run Initialization
  init();
})();
