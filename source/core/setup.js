import '../core/constants';
import Toko from './main';

Toko.prototype.setup = function (inputOptions) {
  console.log('Toko - setup');

  // todo: fix the fps graph. Currently it increases when using the tweakpane controls
  this.capturer = {};
  this.captureOptions = {};

  this.paletteSelectorData = {}; // array of double dropdowns to select a palette from a collection

  this.receivingFileNow = false;

  //
  // merge incoming options with the defaults
  //
  this.options = Object.assign({}, this.DEFAULT_OPTIONS, inputOptions);

  if (this.options.acceptDroppedSettings) {
    p5Canvas.drop(this.receiveSettings.bind(this));
  }

  if (this.options.seedString != '') {
    Toko.reset(this.options.seedString);
  }

  if (this.options.useParameterPanel) {
    this.basePane = new Tweakpane.Pane({
      title: 'Sketch options',
    });

    var tabs = [{ title: this.TABS_PARAMETERS }];
    if (this.options.showAdvancedOptions) {
      tabs.push({ title: this.TABS_ADVANCED });
      this.TAB_ID_ADVANCED = tabs.length - 1;
    }

    if (this.options.captureFrames) {
      tabs.push({ title: this.TABS_CAPTURE });
      this.TAB_ID_CAPTURE = tabs.length - 1;
    }
    if (this.options.logFPS) {
      tabs.push({ title: this.TABS_FPS });
      this.TAB_ID_FPS = tabs.length - 1;
    }

    this.basePaneTab = this.basePane.addTab({ pages: tabs });

    //
    // register the tweakpane plugins
    //
    this.basePane.registerPlugin(TweakpaneEssentialsPlugin);
    this.basePane.registerPlugin(TweakpaneCamerakitPlugin);

    //
    // create references for use in the sketch
    //
    this.pane = {};
    this.pane.tab = this.basePaneTab.pages[0];
    this.pane.events = this.basePane;
    //
    // use (p) to show or hide the panel
    //
    document.onkeydown = function (event) {
      switch (event.key.toLocaleLowerCase()) {
        case 'p':
          var e = document.getElementsByClassName('tp-dfwv')[0];
          if (e.style.display == 'block') e.style.display = 'none';
          else e.style.display = 'block';

          break;
      }
    };

    //
    // add any additional canvas sizes that were passed along
    //
    let n = this.options.additionalCanvasSizes.length;
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        this.addCanvasSize(this.options.additionalCanvasSizes[i]);
      }
    }

    //
    // add advanced options
    //
    if (this.options.showAdvancedOptions) {
      this.options.canvasSizeName = this.options.canvasSize.name; // use this to take the name out of the object
      this.basePaneTab.pages[this.TAB_ID_ADVANCED]
        .addBinding(this.options, 'canvasSizeName', {
          options: this.SIZES_LIST,
          label: 'canvas size',
        })
        .on('change', ev => {
          let s = this.SIZES.filter(p => p.name === ev.value)[0];
          this.setCanvasSize(s);
        });
    }
  }
  //
  // set the label and document title
  //
  document.getElementById('sketch-title').innerText = this.options.title;
  document.title = this.options.title;

  this.setCanvasSize(this.SIZES.filter(p => p.name === this.options.canvasSize.name)[0]);
};

Toko.prototype.endSetup = function () {
  console.log('Toko - endSetup');

  //
  // store the current canvas size as the default
  //
  this.SIZE_DEFAULT.width = width;
  this.SIZE_DEFAULT.height = height;

  if (this.options.logFPS) {
    this.pt = { fps: 0, graph: 0 };

    var f = this.basePaneTab.pages[this.TAB_ID_FPS];

    f.addBinding(this.pt, 'fps', { interval: 200, readonly: true });

    f.addBinding(this.pt, 'graph', {
      view: 'graph',
      interval: 100,
      min: 0,
      max: 120,
      readonly: true,
    });
  }

  if (this.options.useParameterPanel) {
    if (this.options.showSaveSketchButton && !this.options.saveSettingsWithSketch) {
      this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addBlade({
        view: 'separator',
      });
      this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addButton({ title: 'Save sketch' }).on('click', value => {
        this.saveSketch();
      });
    } else if (this.options.showSaveSketchButton && this.options.saveSettingsWithSketch) {
      this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addBlade({
        view: 'separator',
      });
      this.basePaneTab.pages[this.TAB_ID_PARAMETERS]
        .addButton({ title: 'Save sketch & settings' })
        .on('click', value => {
          this.saveSketchAndSettings();
        });
    }
    if (this.options.hideParameterPanel) {
      var e = document.getElementsByClassName('tp-dfwv')[0];
      e.style.display = 'none';
    }
  }

  if (this.options.captureFrames) {
    this.captureOptions.format = this.options.captureFormat;
    this.createCapturePanel(this.TAB_ID_CAPTURE);
  }
};
