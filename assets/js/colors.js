/**
 * Color palettes page rendering logic
 * Dynamically renders all Toko color palettes grouped by collection
 */

(function () {
  'use strict';

  /**
   * Wait for toko to be initialized and ready
   * @returns {Promise} Resolves when toko is available
   */
  function waitForToko () {
    return new Promise((resolve) => {
      function check () {
        if (typeof toko !== 'undefined' && typeof toko.getAllPalettes === 'function') {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      }
      check();
    });
  }

  /**
   * Group palettes by their type property
   * @param {Array} palettes - Array of palette objects
   * @returns {Object} Object with collection names as keys and palette arrays as values
   */
  function groupPalettesByType (palettes) {
    const grouped = {};
    palettes.forEach((palette) => {
      const type = palette.type || 'other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(palette);
    });
    return grouped;
  }

  /**
   * Copy text to clipboard and show brief feedback
   * @param {string} text - Text to copy
   * @param {HTMLElement} element - Element to show feedback on
   */
  function copyToClipboard (text, element) {
    navigator.clipboard.writeText(text).then(function () {
      // Brief visual feedback
      const originalTitle = element.title;
      element.title = 'Copied!';
      setTimeout(function () {
        element.title = originalTitle;
      }, 1000);
    });
  }

  /**
   * Create a color swatch element
   * @param {string} color - Hex color value
   * @returns {HTMLElement} Div element styled as a color swatch
   */
  function createSwatch (color) {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.style.cursor = 'pointer';
    swatch.title = color;
    swatch.addEventListener('click', function () {
      copyToClipboard(color, swatch);
    });
    return swatch;
  }

  /**
   * Create a palette card element
   * @param {Object} palette - Palette object with name, colors, etc.
   * @returns {HTMLElement} Div element representing the palette card
   */
  function createPaletteCard (palette) {
    const card = document.createElement('div');
    card.className = 'palette-card';

    // Get background and draw colors using Toko's actual color scale calculations
    // Using getColorScale with palette name to include predefined background/stroke if available
    const colorScale = toko.getColorScale(palette.name, {});
    const bgColor = colorScale.backgroundColor();
    const textColor = colorScale.drawColor();

    // In dark mode, swap background and draw colors
    const darkMode = isDarkMode();
    const cardBgColor = darkMode ? textColor : bgColor;
    const cardTextColor = darkMode ? bgColor : textColor;

    // Apply colors to card
    card.style.backgroundColor = cardBgColor;
    card.style.color = cardTextColor;

    // Color swatches container
    const colorsContainer = document.createElement('div');
    colorsContainer.className = 'palette-colors';

    palette.colors.forEach((color) => {
      colorsContainer.appendChild(createSwatch(color));
    });

    card.appendChild(colorsContainer);

    // Palette name with color count (at the bottom)
    // Add * for primary palettes
    const name = document.createElement('div');
    name.className = 'palette-name';
    const primaryMarker = palette.isPrimary ? '*' : '';
    name.textContent = palette.name + primaryMarker + ' (' + palette.colors.length + ')';
    card.appendChild(name);

    return card;
  }

  /**
   * Create a collection section with all its palettes
   * @param {string} collectionName - Name of the collection
   * @param {Array} palettes - Array of palette objects in this collection
   * @returns {HTMLElement} Section element with collection heading and palette grid
   */
  function createCollectionSection (collectionName, palettes) {
    const section = document.createElement('div');
    section.className = 'collection-section';

    // Count total and primary palettes
    const totalCount = palettes.length;
    const primaryCount = palettes.filter(p => p.isPrimary).length;

    // Collection heading with total / primary count
    const heading = document.createElement('h2');
    heading.textContent = collectionName + ' (' + totalCount + ' / ' + primaryCount + ')';
    section.appendChild(heading);

    // Palette grid
    const grid = document.createElement('div');
    grid.className = 'palette-grid';

    palettes.forEach((palette) => {
      grid.appendChild(createPaletteCard(palette));
    });

    section.appendChild(grid);

    return section;
  }

  /**
   * Check if primary-only filter is active
   * @returns {boolean} True if showing only primary palettes
   */
  function isPrimaryOnly () {
    return localStorage.getItem('toko-colors-filter') === 'primary';
  }

  /**
   * Render all palettes to the page
   */
  function renderPalettes () {
    const container = document.getElementById('palette-content');
    if (!container) {
      console.error('Palette container not found');
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Get all palettes and filter if needed
    let palettes = toko.getAllPalettes();
    const allPalettes = palettes;
    const primaryOnly = isPrimaryOnly();

    if (primaryOnly) {
      palettes = palettes.filter(p => p.isPrimary);
    }

    const collections = toko.getCollections();
    const grouped = groupPalettesByType(palettes);

    // Create sections for each collection in order
    collections.forEach((collectionName) => {
      if (grouped[collectionName] && grouped[collectionName].length > 0) {
        container.appendChild(createCollectionSection(collectionName, grouped[collectionName]));
      }
    });

    // Handle any palettes with types not in collections
    Object.keys(grouped).forEach((type) => {
      if (!collections.includes(type)) {
        container.appendChild(createCollectionSection(type, grouped[type]));
      }
    });

    // Add total count with primary count
    const totalCountEl = document.getElementById('palette-count');
    if (totalCountEl) {
      const primaryTotal = allPalettes.filter(p => p.isPrimary).length;
      if (primaryOnly) {
        totalCountEl.textContent = primaryTotal + ' primary* palettes in ' + collections.length + ' collections';
      } else {
        totalCountEl.textContent = allPalettes.length + ' palettes (' + primaryTotal + ' primary*) in ' + collections.length + ' collections';
      }
    }
  }

  /**
   * Check if dark mode is currently active
   * @returns {boolean} True if dark mode is active
   */
  function isDarkMode () {
    return document.body.classList.contains('dark-mode');
  }

  /**
   * Update the filter toggle display
   */
  function updateFilterToggle () {
    const toggle = document.getElementById('filter-toggle');
    if (!toggle) return;

    const primaryOnly = isPrimaryOnly();

    toggle.innerHTML = '';

    if (primaryOnly) {
      // Primary only: All is link, Primary is bold
      const allLink = document.createElement('a');
      allLink.href = '#';
      allLink.className = 'palette-toggle-other';
      allLink.textContent = 'All';
      allLink.addEventListener('click', function (e) {
        e.preventDefault();
        setFilter('all');
      });

      const separator = document.createTextNode(' / ');

      const primaryText = document.createElement('span');
      primaryText.className = 'palette-toggle-current';
      primaryText.textContent = 'Primary';

      toggle.appendChild(allLink);
      toggle.appendChild(separator);
      toggle.appendChild(primaryText);
    } else {
      // All palettes: All is bold, Primary is link
      const allText = document.createElement('span');
      allText.className = 'palette-toggle-current';
      allText.textContent = 'All';

      const separator = document.createTextNode(' / ');

      const primaryLink = document.createElement('a');
      primaryLink.href = '#';
      primaryLink.className = 'palette-toggle-other';
      primaryLink.textContent = 'Primary';
      primaryLink.addEventListener('click', function (e) {
        e.preventDefault();
        setFilter('primary');
      });

      toggle.appendChild(allText);
      toggle.appendChild(separator);
      toggle.appendChild(primaryLink);
    }
  }

  /**
   * Set the filter mode
   * @param {string} filter - 'all' or 'primary'
   */
  function setFilter (filter) {
    localStorage.setItem('toko-colors-filter', filter);
    updateFilterToggle();
    renderPalettes();
  }

  /**
   * Update the mode toggle display
   */
  function updateModeToggle () {
    const toggle = document.getElementById('mode-toggle');
    if (!toggle) return;

    const darkMode = isDarkMode();

    toggle.innerHTML = '';

    if (darkMode) {
      // Dark mode active: Light is link, Dark is bold
      const lightLink = document.createElement('a');
      lightLink.href = '#';
      lightLink.className = 'palette-toggle-other';
      lightLink.textContent = 'Light';
      lightLink.addEventListener('click', function (e) {
        e.preventDefault();
        setMode('light');
      });

      const separator = document.createTextNode(' / ');

      const darkText = document.createElement('span');
      darkText.className = 'palette-toggle-current';
      darkText.textContent = 'Dark';

      toggle.appendChild(lightLink);
      toggle.appendChild(separator);
      toggle.appendChild(darkText);
    } else {
      // Light mode active: Light is bold, Dark is link
      const lightText = document.createElement('span');
      lightText.className = 'palette-toggle-current';
      lightText.textContent = 'Light';

      const separator = document.createTextNode(' / ');

      const darkLink = document.createElement('a');
      darkLink.href = '#';
      darkLink.className = 'palette-toggle-other';
      darkLink.textContent = 'Dark';
      darkLink.addEventListener('click', function (e) {
        e.preventDefault();
        setMode('dark');
      });

      toggle.appendChild(lightText);
      toggle.appendChild(separator);
      toggle.appendChild(darkLink);
    }
  }

  /**
   * Set the color mode
   * @param {string} mode - 'light' or 'dark'
   */
  function setMode (mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
      localStorage.setItem('toko-colors-mode', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('toko-colors-mode', 'light');
    }
    updateModeToggle();
    renderPalettes();
  }

  /**
   * Initialize both toggles
   */
  function initToggles () {
    // Check for saved mode preference
    const savedMode = localStorage.getItem('toko-colors-mode');
    if (savedMode === 'dark') {
      document.body.classList.add('dark-mode');
    }
    updateModeToggle();
    updateFilterToggle();
  }

  /**
   * Initialize the page
   */
  function init () {
    initToggles();
    waitForToko().then(() => {
      renderPalettes();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
