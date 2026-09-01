"use strict";

/*
=========================================================
 DEVFORGE — TASK 08

 Sass handles:
 - Variables
 - Nesting
 - Mixins
 - Functions
 - Responsive styling

 JavaScript handles:
 - API integration
 - Dynamic content
 - Interaction
 - Form validation
=========================================================
*/

// =======================================================
// API CONFIGURATION
// =======================================================

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const INITIAL_LIMIT = 6;

const LOAD_MORE_COUNT = 6;

let displayedResources = INITIAL_LIMIT;

let resources = [];

// =======================================================
// DOM REFERENCES
// =======================================================

const resourceContainer = document.getElementById("resourceContainer");

const apiStatus = document.getElementById("apiStatus");

const loadMoreButton = document.getElementById("loadMoreButton");

// =======================================================
// API STATUS
// =======================================================

function setApiStatus(message, type = "info") {
  const icons = {
    info: "bi-cloud-arrow-down",

    success: "bi-check-circle",

    danger: "bi-exclamation-triangle"
  };

  apiStatus.className = `alert alert-${type}`;

  apiStatus.innerHTML = `
        <i class="bi ${icons[type]} me-2"></i>
        ${escapeHTML(message)}
    `;
}

// =======================================================
// FETCH RESOURCES
// =======================================================

async function fetchResources() {
  setApiStatus("Loading developer resources...", "info");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    resources = await response.json();

    renderResources();

    setApiStatus(
      `${resources.length} developer resources loaded successfully.`,
      "success"
    );
  } catch (error) {
    console.error("API error:", error);

    resourceContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Unable to load resources. Please try again.
                </div>
            </div>
        `;

    setApiStatus("Unable to retrieve resources.", "danger");
  }
}

// =======================================================
// RENDER RESOURCES
// =======================================================

function renderResources() {
  resourceContainer.innerHTML = "";

  const visibleResources = resources.slice(0, displayedResources);

  visibleResources.forEach((resource, index) => {
    const column = document.createElement("div");

    column.className = "col-md-6 col-lg-4";

    column.innerHTML = `
                <article class="card resource-card">
                    <div class="card-body">

                        <p class="resource-number">
                            RESOURCE ${String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 class="resource-title card-title">
                            ${escapeHTML(resource.title)}
                        </h3>

                        <p class="resource-body card-text mt-3">
                            ${escapeHTML(resource.body)}
                        </p>

                    </div>
                </article>
            `;

    resourceContainer.appendChild(column);
  });

  updateLoadMoreButton();
}

// =======================================================
// LOAD MORE
// =======================================================

loadMoreButton.addEventListener("click", () => {
  displayedResources += LOAD_MORE_COUNT;

  renderResources();
});

// =======================================================
// LOAD MORE BUTTON STATE
// =======================================================

function updateLoadMoreButton() {
  if (displayedResources >= resources.length) {
    loadMoreButton.classList.add("d-none");
  } else {
    loadMoreButton.classList.remove("d-none");
  }
}

// =======================================================
// SECURITY HELPER
// =======================================================

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}

// =======================================================
// BACKGROUND INTERACTION
// =======================================================

const interactionButton = document.getElementById("interactionButton");

const themeButton = document.getElementById("themeButton");

const interactionMessage = document.getElementById("interactionMessage");

const backgroundColors = [
  "#f8fafc",

  "#e0f2fe",

  "#ecfdf5",

  "#fef3c7",

  "#fce7f3",

  "#ede9fe"
];

let currentColorIndex = 0;

function changeBackground() {
  currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;

  document.body.style.backgroundColor = backgroundColors[currentColorIndex];

  interactionMessage.textContent = "Background changed successfully.";
}

interactionButton.addEventListener("click", changeBackground);

themeButton.addEventListener("click", changeBackground);

// =======================================================
// FORM REFERENCES
// =======================================================

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const subjectInput = document.getElementById("subject");

const messageInput = document.getElementById("message");

const formStatus = document.getElementById("formStatus");

// =======================================================
// FIELD ERROR
// =======================================================

function setFieldError(input, errorId, message) {
  const error = document.getElementById(errorId);

  input.classList.remove("is-valid");

  input.classList.add("is-invalid");

  error.textContent = message;
}

// =======================================================
// FIELD VALID
// =======================================================

function setFieldValid(input, errorId) {
  const error = document.getElementById(errorId);

  input.classList.remove("is-invalid");

  input.classList.add("is-valid");

  error.textContent = "";
}

// =======================================================
// NAME VALIDATION
// =======================================================

function validateName() {
  const value = nameInput.value.trim();

  if (!value) {
    setFieldError(nameInput, "nameError", "Please enter your full name.");

    return false;
  }

  if (value.length < 2) {
    setFieldError(
      nameInput,
      "nameError",
      "Name must contain at least 2 characters."
    );

    return false;
  }

  setFieldValid(nameInput, "nameError");

  return true;
}

// =======================================================
// EMAIL VALIDATION
// =======================================================

function validateEmail() {
  const value = emailInput.value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    setFieldError(emailInput, "emailError", "Please enter your email address.");

    return false;
  }

  if (!emailPattern.test(value)) {
    setFieldError(
      emailInput,
      "emailError",
      "Please enter a valid email address."
    );

    return false;
  }

  setFieldValid(emailInput, "emailError");

  return true;
}

// =======================================================
// SUBJECT VALIDATION
// =======================================================

function validateSubject() {
  const value = subjectInput.value.trim();

  if (!value) {
    setFieldError(subjectInput, "subjectError", "Please enter a subject.");

    return false;
  }

  if (value.length < 3) {
    setFieldError(
      subjectInput,
      "subjectError",
      "Subject must contain at least 3 characters."
    );

    return false;
  }

  setFieldValid(subjectInput, "subjectError");

  return true;
}

// =======================================================
// MESSAGE VALIDATION
// =======================================================

function validateMessage() {
  const value = messageInput.value.trim();

  if (!value) {
    setFieldError(messageInput, "messageError", "Please enter your message.");

    return false;
  }

  if (value.length < 10) {
    setFieldError(
      messageInput,
      "messageError",
      "Message must contain at least 10 characters."
    );

    return false;
  }

  setFieldValid(messageInput, "messageError");

  return true;
}

// =======================================================
// REAL-TIME VALIDATION
// =======================================================

nameInput.addEventListener("blur", validateName);

emailInput.addEventListener("blur", validateEmail);

subjectInput.addEventListener("blur", validateSubject);

messageInput.addEventListener("blur", validateMessage);

// =======================================================
// FORM SUBMISSION
// =======================================================

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const validName = validateName();

  const validEmail = validateEmail();

  const validSubject = validateSubject();

  const validMessage = validateMessage();

  const isValid = validName && validEmail && validSubject && validMessage;

  if (!isValid) {
    formStatus.className = "alert alert-danger";

    formStatus.innerHTML = `
                <i class="bi bi-exclamation-circle me-2"></i>
                Please correct the highlighted fields.
            `;

    return;
  }

  formStatus.className = "alert alert-success";

  formStatus.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            Your message has been validated successfully!
        `;

  contactForm.reset();

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
  });
});

// =======================================================
// APPLICATION START
// =======================================================

fetchResources();
