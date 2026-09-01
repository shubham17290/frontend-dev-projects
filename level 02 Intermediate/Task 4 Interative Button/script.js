/**
 * =========================================
 * DEVFORGE — TASK 4 (UPGRADED)
 * Interactive Background & Theme Controller
 * =========================================
 */

// 1. Encapsulation: Wrap everything in an IIFE (Immediately Invoked Function Expression)
// This prevents variables from leaking into the global window object.
(function () {
  // 2. DOM Elements (Cached once for performance)
  const interactionButton = document.getElementById("interactionButton");
  const themeButton = document.getElementById("themeButton");
  const interactionMessage = document.getElementById("interactionMessage");

  // 3. State & Configuration
  const backgroundColors = [
    "#f8fafc", // Slate 50 (Default)
    "#e0f2fe", // Sky 100
    "#ecfdf5", // Emerald 50
    "#fef3c7", // Amber 50
    "#fce7f3", // Fuchsia 50
    "#ede9fe" // Violet 50
  ];

  let currentColorIndex = 0;

  // 4. Core Logic (Applying the DRY Principle - Don't Repeat Yourself)
  /**
   * Cycles to the next theme color and updates the UI.
   * @param {string} customMessage - The success message to display
   */
  function cycleTheme(customMessage) {
    // Calculate the next index, looping back to 0 when it hits the end
    currentColorIndex = (currentColorIndex + 1) % backgroundColors.length;
    const newColor = backgroundColors[currentColorIndex];

    // CRITICAL UPGRADE: Update the CSS Custom Property on the :root element
    // This ensures every component using var(--clr-bg-body) updates instantly.
    document.documentElement.style.setProperty("--clr-bg-body", newColor);

    // Safely update the DOM message if the element exists
    if (interactionMessage) {
      interactionMessage.textContent = customMessage;
    }

    // Developer feedback using modern Template Literals
    console.log(`Theme updated! Current background: ${newColor}`);
  }

  // 5. Event Listeners (Defensive Programming)
  // Always check if the button exists on the current page before attaching a listener to prevent null errors.
  if (interactionButton) {
    interactionButton.addEventListener("click", () => {
      cycleTheme("Background changed successfully via Interaction block!");
    });
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      cycleTheme("DevForge theme updated successfully from the Hero!");
    });
  }
})();
