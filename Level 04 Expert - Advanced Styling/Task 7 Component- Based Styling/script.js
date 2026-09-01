/**
 * =========================================================
 * DEVFORGE — TASK 07
 * Bootstrap 5 Component-Based Script Integration
 * =========================================================
 */

// 1. Encapsulate everything in an IIFE to protect the global namespace
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
    // API
    resourceContainer: document.getElementById("resourceContainer"),
    apiStatus: document.getElementById("apiStatus"),
    loadMoreBtn: document.getElementById("loadMoreButton"),

    // Interaction
    interactionBtn: document.getElementById("interactionButton"),
    themeBtn: document.getElementById("themeButton"),
    interactionMsg: document.getElementById("interactionMessage"),

    // Form
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
  // TASK 5 — API INTEGRATION
  // =========================================

  function setApiStatus(message, type) {
    if (!elements.apiStatus) return;

    const iconMap = {
      info: "bi-cloud-arrow-down",
      success: "bi-check-circle",
      danger: "bi-exclamation-triangle"
    };

    // Leverage Bootstrap Alert classes
    elements.apiStatus.className = `alert alert-${type} d-flex align-items-center gap-2 mt-4 shadow-sm`;
    elements.apiStatus.innerHTML = `
            <i class="bi ${iconMap[type]} fs-5"></i>
            <span>${escapeHTML(message)}</span>
        `;
  }

  async function fetchResources() {
    if (!elements.resourceContainer) return;

    setApiStatus("Loading developer resources...", "info");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      resources = await response.json();
      renderResources();

      setApiStatus(
        `Successfully loaded ${resources.length} resources from the API.`,
        "success"
      );

      // Auto-hide the success alert after 3 seconds using Bootstrap's d-none
      setTimeout(() => {
        elements.apiStatus.classList.add("d-none");
      }, 3000);
    } catch (error) {
      console.error("API request failed:", error);

      // Render an accessible error card matching the Bootstrap grid
      elements.resourceContainer.innerHTML = `
                <li class="col-12 list-unstyled">
                    <div class="alert alert-danger d-flex align-items-center gap-3 shadow-sm border-0">
                        <i class="bi bi-exclamation-triangle fs-3"></i>
                        <div>
                            <strong class="d-block mb-1">Unable to load developer resources.</strong>
                            Please check your internet connection and try again.
                        </div>
                    </div>
                </li>
            `;

      setApiStatus("API request failed.", "danger");
      if (elements.loadMoreBtn) elements.loadMoreBtn.classList.add("d-none");
    }
  }

  function renderResources() {
    elements.resourceContainer.innerHTML = "";

    // UPGRADE: Use DocumentFragment for batched DOM insertion (High Performance)
    const fragment = document.createDocumentFragment();
    const visibleResources = resources.slice(0, displayedResources);

    visibleResources.forEach((resource, index) => {
      // Match the Bootstrap semantic <ul> grid structure established in HTML
      const column = document.createElement("li");
      column.className = "col-md-6 col-lg-4 list-unstyled";

      column.innerHTML = `
                <article class="card h-100 border-0 shadow-sm transition-hover">
                    <div class="card-body p-4 d-flex flex-column">
                        <p class="text-primary fw-bold small tracking-wide mb-3">
                            <i class="bi bi-file-earmark-code me-1"></i>
                            RESOURCE ${String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 class="h5 fw-bold text-dark text-capitalize mb-3">
                            ${escapeHTML(resource.title)}
                        </h3>
                        <p class="text-secondary mb-0 flex-grow-1">
                            ${escapeHTML(resource.body)}
                        </p>
                    </div>
                </article>
            `;

      fragment.appendChild(column);
    });

    elements.resourceContainer.appendChild(fragment);
    updateLoadMoreButton();
  }

  function updateLoadMoreButton() {
    if (!elements.loadMoreBtn) return;
    // Native Bootstrap utility class for hiding elements
    if (displayedResources >= resources.length) {
      elements.loadMoreBtn.classList.add("d-none");
    } else {
      elements.loadMoreBtn.classList.remove("d-none");
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================================
  // TASK 4 — BACKGROUND INTERACTION
  // =========================================

  function cycleTheme() {
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    const newColor = backgroundColors[currentColorIndex];

    // UPGRADE: Target the CSS Variable defined in your SCSS file to keep
    // the entire design system synchronized, rather than overriding inline body styles.
    document.documentElement.style.setProperty("--devforge-surface", newColor);

    if (elements.interactionMsg) {
      elements.interactionMsg.textContent = "Background changed successfully!";
    }
  }

  // =========================================
  // TASK 6 — CLIENT-SIDE FORM VALIDATION
  // =========================================

  /**
   * UPGRADE: Unified state handler utilizing Bootstrap's native '.is-invalid'
   * and '.is-valid' classes, while syncing A11y attributes.
   */
  function setFieldState(input, errorElement, isValid, message = "") {
    if (isValid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      input.setAttribute("aria-invalid", "false");
      errorElement.textContent = "";
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      errorElement.textContent = message;
    }
    return isValid;
  }

  /**
   * UX UPGRADE: Clears validation states the moment a user starts typing to fix an error.
   */
  function clearFieldState(input, errorElement) {
    input.classList.remove("is-valid", "is-invalid");
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  }

  function validateName() {
    const val = elements.inputs.name.value.trim();
    if (!val)
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
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val)
      return setFieldState(
        elements.inputs.email,
        elements.errors.email,
        false,
        "Please enter your email address."
      );
    if (!pattern.test(val))
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
    if (!val)
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
    if (!val)
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

  function handleFormSubmit(event) {
    event.preventDefault();

    // Assigning to variables forces all validation functions to run, highlighting every empty field
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (!(isNameValid && isEmailValid && isSubjectValid && isMessageValid)) {
      elements.formStatus.className = "alert alert-danger mt-3";
      elements.formStatus.innerHTML = `
                <i class="bi bi-exclamation-circle me-2"></i>
                Please correct the highlighted fields before submitting.
            `;
      elements.formStatus.classList.remove("d-none");
      return;
    }

    // Success State
    elements.formStatus.className = "alert alert-success mt-3";
    elements.formStatus.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            Your message has been validated successfully!
        `;
    elements.formStatus.classList.remove("d-none");

    // Clean up DOM and States
    elements.contactForm.reset();
    Object.values(elements.inputs).forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
      input.setAttribute("aria-invalid", "false");
    });

    // Hide success banner after 5 seconds
    setTimeout(() => {
      elements.formStatus.classList.add("d-none");
    }, 5000);
  }

  // =========================================
  // INITIALIZATION & EVENT LISTENERS
  // =========================================

  function init() {
    if (elements.loadMoreBtn) {
      elements.loadMoreBtn.addEventListener("click", () => {
        displayedResources += LOAD_MORE_COUNT;
        renderResources();
      });
    }

    if (elements.interactionBtn)
      elements.interactionBtn.addEventListener("click", cycleTheme);
    if (elements.themeBtn)
      elements.themeBtn.addEventListener("click", cycleTheme);

    if (elements.contactForm) {
      // Validate on blur (leaving the field)
      elements.inputs.name.addEventListener("blur", validateName);
      elements.inputs.email.addEventListener("blur", validateEmail);
      elements.inputs.subject.addEventListener("blur", validateSubject);
      elements.inputs.message.addEventListener("blur", validateMessage);

      // Clear errors on input (typing to fix the error)
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

    // Kick off the application
    fetchResources();
  }

  init();
})();
