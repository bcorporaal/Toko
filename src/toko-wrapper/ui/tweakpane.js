import { libraryState } from '../core/state';
import {
  TABS_PARAMETERS,
  TABS_ADVANCED,
  TAB_ID_ADVANCED,
  TABS_CAPTURE,
  // TAB_ID_CAPTURE,
  TAB_ID_PARAMETERS,
  SIZES_LIST,
  SIZES,
  SAVE_SKETCH_BUTTON_LABEL,
  SAVE_SKETCH_AND_SETTINGS_BUTTON_LABEL,
  CAPTURE_FORMATS,
  CAPTURE_FRAMERATES,
  REFRESH_RECORD_BUTTON_LABEL,
  RECORD_BUTTON_LABEL,
  TWEAKPANE_CONTAINER,
  TWEAKPANE_HIDDEN_CLASS,
} from '../config/constants';
import { setCanvasSize } from '../canvas/canvas';
import { saveSketch, saveSketchAndSettings } from '../media/saveSketch';
import {
  updateCaptureDuration,
  updateCaptureFixedDuration,
  updateCaptureFrameRate,
  updateCaptureFormat,
  updateCaptureRefreshBefore,
  clickStartCapture,
  clickStopCapture,
  updateRecordButtonLabel,
} from '../media/capture';
import { addPaletteSelector, addBlendModeSelector } from './colorControls';
import { addRandomSeedControl } from './rngControls';
import { addEasingSelector } from './easingControls';
import { logDebug, logError } from '../util/logging';
import { LIBRARY_NAME } from '../config/constants.js';

// Global references to the main Tweakpane panel and tab container
let basePane, basePaneTab;

/**
 * Initializes the Tweakpane UI panel with tabs and controls based on configuration options
 * Sets up the main panel, registers plugins, and adds conditional tabs and controls
 * @returns {void}
 */
export function setUpTweakpane () {
  // Create the main Tweakpane panel if enabled
  if (libraryState.options.useParameterPanel) {
    basePane = new Tweakpane.Pane({
      container: document.getElementById(TWEAKPANE_CONTAINER),
      title: 'Sketch options',
    });
  }

  // Build array of tabs to add based on configuration
  const tabs = buildTabList();

  // Add all tabs to the panel
  basePaneTab = basePane.addTab({ pages: tabs });

  // Register required Tweakpane plugins
  registerTweakpanePlugins();

  // Store panel references in library state for external access
  setupTweakpaneReferences();

  // Add conditional controls (except buttons which go at the bottom)
  addConditionalControlsWithoutButtons();
  addEventHandlers();

  // Add buttons last to ensure they appear at the bottom
  addBottomButtons();

  // Initialize panel state
  initializePanelState();
}

/**
 * Builds the list of tabs to display based on configuration options
 * @returns {Array} Array of tab objects with titles
 */
function buildTabList () {
  const tabs = [{ title: TABS_PARAMETERS }];

  if (libraryState.options.showCanvasSizeOptions) {
    tabs.push({ title: TABS_ADVANCED });
  }

  if (libraryState.options.showCaptureOptions) {
    tabs.push({ title: TABS_CAPTURE });
  }

  return tabs;
}

/**
 * Registers Tweakpane plugins for enhanced functionality
 */
function registerTweakpanePlugins () {
  basePane.registerPlugin(TweakpaneEssentialsPlugin);
  basePane.registerPlugin(TweakpaneCamerakitPlugin);
}

/**
 * Sets up the tweakpane object in library state with all necessary references
 */
function setupTweakpaneReferences () {
  libraryState.tweakpane = {
    base: basePane,
    basePaneTab: basePaneTab,
    primaryTab: basePaneTab.pages[0],
    addPaletteSelector: addPaletteSelector,
    addBlendModeSelector: addBlendModeSelector,
    addRandomSeedControl: addRandomSeedControl,
    addEasingSelector: addEasingSelector,
  };
}

/**
 * Adds conditional controls based on configuration options (excluding buttons)
 * Buttons are added separately to ensure they appear at the bottom
 */
function addConditionalControlsWithoutButtons () {
  if (libraryState.options.showCanvasSizeOptions) {
    addSizeOptions();
  }

  if (libraryState.options.showCaptureOptions) {
    addCaptureOptions();
  }
}

/**
 * Adds buttons that should appear at the bottom of the interface
 */
function addBottomButtons () {
  if (libraryState.options.showSaveSketchButton) {
    addSaveSketchButton();
  }

  if (libraryState.options.showCaptureOptions) {
    addCaptureButtons();
  }
}

/**
 * Adds event handlers for panel interactions
 */
function addEventHandlers () {
  addRefreshHandler();
  addPaneToggle();

  // Call user-defined setup function if available
  if (typeof window.setupPanelControls === 'function') {
    logDebug(`${LIBRARY_NAME} - setupPanelControls`);
    window.setupPanelControls(libraryState.tweakpane);
  }
}

/**
 * Initializes the panel's initial state based on configuration
 */
function initializePanelState () {
  if (libraryState.options.hideParameterPanelOnStart) {
    togglePaneVisibility(false);
  }
}

/**
 * Adds keyboard shortcut (P key) to toggle panel visibility
 * @returns {void}
 */
export function addPaneToggle () {
  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'p') {
      togglePaneVisibility();
    }
  });
}

/**
 * Toggles the visibility of the Tweakpane panel
 * @param {boolean|null} makeVisible - Force visibility state (true=show, false=hide, null=toggle)
 * @returns {void}
 */
export function togglePaneVisibility (makeVisible = null) {
  const panelElement = document.getElementById(TWEAKPANE_CONTAINER);
  if (!panelElement) return;

  const isCurrentlyVisible = !panelElement.classList.contains(TWEAKPANE_HIDDEN_CLASS);

  if (makeVisible === true || (makeVisible === null && !isCurrentlyVisible)) {
    panelElement.classList.remove(TWEAKPANE_HIDDEN_CLASS);
  } else if (makeVisible === false || (makeVisible === null && isCurrentlyVisible)) {
    panelElement.classList.add(TWEAKPANE_HIDDEN_CLASS);
  }
}

/**
 * Adds a debounced refresh handler to the panel that updates parameters when controls change
 * Prevents excessive updates during rapid parameter changes
 * @returns {void}
 */
export function addRefreshHandler () {
  let refreshTimeout;

  const debouncedRefresh = () => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      if (typeof window.tokoWrapper === 'function' && window.tokoWrapper()) {
        window.tokoWrapper().updateParameters();
      } else {
        logError('tokoWrapper instance not available to update parameters');
      }
    }, libraryState.debounceDelay);
  };

  basePane.on('change', debouncedRefresh);
}

/**
 * Adds canvas size selection control to the advanced tab
 * Allows users to change canvas dimensions from predefined options
 * @returns {void}
 */
export function addSizeOptions () {
  if (!libraryState.options.showCanvasSizeOptions) return;

  // Extract name from canvas size object for the dropdown
  libraryState.options.canvasSizeName = libraryState.options.canvasSize.name;

  basePaneTab.pages[TAB_ID_ADVANCED].addBinding(libraryState.options, 'canvasSizeName', {
    options: SIZES_LIST,
    label: 'canvas size',
  }).on('change', event => {
    const selectedSize = SIZES.find(size => size.name === event.value);
    if (selectedSize) {
      setCanvasSize(selectedSize);
    }
  });
}

/**
 * Adds video capture controls to the capture tab (excluding buttons)
 * Buttons are added separately to ensure they appear at the bottom
 * @returns {void}
 */
export function addCaptureOptions () {
  // Find the actual capture tab index dynamically
  const captureTabIndex = basePaneTab.pages.findIndex(page => page.title === TABS_CAPTURE);

  if (captureTabIndex === -1) {
    console.error('ERROR: Capture tab not found in pages array');
    return;
  }

  const captureTab = basePaneTab.pages[captureTabIndex];

  // Add capture format and framerate controls
  addCaptureFormatControls(captureTab);

  // Add duration and refresh controls
  addCaptureDurationControls(captureTab);
}

/**
 * Adds capture buttons that should appear at the bottom
 * @returns {void}
 */
export function addCaptureButtons () {
  if (!libraryState.options.showCaptureOptions) return;

  // Find the actual capture tab index dynamically
  const captureTabIndex = basePaneTab.pages.findIndex(page => page.title === TABS_CAPTURE);
  if (captureTabIndex === -1) {
    console.error('ERROR: Capture tab not found in pages array for buttons');
    return;
  }

  const captureTab = basePaneTab.pages[captureTabIndex];
  const buttonTab = getButtonTab(captureTab);

  // Add record/stop buttons
  addCaptureButtonsToTab(buttonTab);

  // Initialize control states after buttons are created
  initializeCaptureControls();
}

/**
 * Determines which tab should contain the record/stop buttons
 * @param {Object} captureTab - The capture options tab
 * @returns {Object} The tab to add buttons to
 */
function getButtonTab (captureTab) {
  if (libraryState.options.captureOptions.recordButtonOnMainTab) {
    const primaryTab = libraryState.tweakpane.primaryTab;
    primaryTab.addBlade({ view: 'separator' });
    return primaryTab;
  }
  return captureTab;
}

/**
 * Adds format and framerate selection controls
 * @param {Object} tab - The tab to add controls to
 */
function addCaptureFormatControls (tab) {
  if (!tab) {
    console.error('ERROR: tab is null or undefined, cannot add controls');
    return;
  }

  tab
    .addBinding(libraryState.options.captureOptions, 'format', {
      label: 'video format',
      options: CAPTURE_FORMATS,
    })
    .on('change', updateCaptureFormat);

  tab
    .addBinding(libraryState.options.captureOptions, 'framerate', {
      label: 'video framerate',
      options: CAPTURE_FRAMERATES,
    })
    .on('change', updateCaptureFrameRate);

  tab.addBlade({ view: 'separator' });
}

/**
 * Adds duration and refresh controls
 * @param {Object} tab - The tab to add controls to
 */
function addCaptureDurationControls (tab) {
  tab
    .addBinding(libraryState.options.captureOptions, 'refreshBeforeCapture', {
      label: 'refresh first',
    })
    .on('change', updateCaptureRefreshBefore);

  tab.addBlade({ view: 'separator' });

  tab
    .addBinding(libraryState.options.captureOptions, 'fixedDuration', {
      label: 'fixed duration',
    })
    .on('change', updateCaptureFixedDuration);

  // Store reference to duration control for external access
  libraryState.options.captureOptions.captureDurationControl = tab
    .addBinding(libraryState.options.captureOptions, 'duration', {
      label: 'nr of frames',
      min: 0,
      max: 3000,
      step: 10,
    })
    .on('change', updateCaptureDuration);
}

/**
 * Adds record and stop buttons to the specified tab
 * @param {Object} tab - The tab to add buttons to
 */
function addCaptureButtonsToTab (tab) {
  if (!libraryState.options.captureOptions.recordButtonOnMainTab) {
    tab.addBlade({ view: 'separator' });
  }

  const buttonTitle = libraryState.options.captureOptions.refreshBeforeCapture
    ? REFRESH_RECORD_BUTTON_LABEL
    : RECORD_BUTTON_LABEL;

  libraryState.options.captureOptions.startCaptureButton = tab
    .addButton({ title: buttonTitle })
    .on('click', clickStartCapture);

  libraryState.options.captureOptions.stopCaptureButton = tab
    .addButton({ title: '⬛️ Stop recording' })
    .on('click', clickStopCapture);
}

/**
 * Initializes the initial state of capture controls
 */
function initializeCaptureControls () {
  updateCaptureFixedDuration({ value: libraryState.options.captureOptions.fixedDuration });
  updateRecordButtonLabel(libraryState.options.captureOptions.refreshBeforeCapture);
  libraryState.options.captureOptions.stopCaptureButton.hidden = true;
}

/**
 * Adds a save sketch button to the parameters tab
 * Button behavior changes based on whether settings should be saved with the sketch
 * @returns {void}
 */
export function addSaveSketchButton () {
  const parametersTab = basePaneTab.pages[TAB_ID_PARAMETERS];

  parametersTab.addBlade({ view: 'separator' });

  const buttonLabel = libraryState.options.saveSettingsWithSketch
    ? SAVE_SKETCH_AND_SETTINGS_BUTTON_LABEL
    : SAVE_SKETCH_BUTTON_LABEL;

  const buttonHandler = libraryState.options.saveSettingsWithSketch ? saveSketchAndSettings : saveSketch;

  parametersTab.addButton({ title: buttonLabel }).on('click', buttonHandler);
}
