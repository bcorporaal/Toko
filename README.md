<p align="center"><img src="/assets/images/toko_header.png" alt="Toko logo"></p>

# Toko: expanding p5.js with handy features
Some useful duct tape to expand p5.js for creative coding with Tweakpane, chroma.js, color palettes, p5 SVG, and more. Very much a work in progress.


## Features
- Easy capturing options for images and video
- Switching between canvas sizes
- Larger canvas sizes are scaled to fit on the screen
- Tweakpane integration to easily change sketch parameters
- Large collection of color palettes
- Easy selection and usage of (custom) color palettes
- Saving and loading (through drag and drop on the canvas) of sketch parameters

## Usage
There is no documentation yet, so see `toko/source` for details. Also, the examples folder includes sketches using various features.


## Ideas (that may or may not get implemented in the future)

### General

- Make sure all random functions in Toko can be seeded
- Where possible use p5 functionality for saving images and video
- Try to create something resembling code standards and consistency
- Add more examples
- Add post-processing options like grain and noise
- Add easy gradients for shapes

### Grid

- Add set functions to move / scale the grid
- Add options to bias other than 0.5
- remove / hide specific cells from the grid

### Color

- Make interpolation an option when generating for easier toggling in the sketch and add interpolatedScale
- Add option to include all collections in palette selection
- Generate contrast colors based on entire palette
- Update color palettes
- Add meta data to each collection so not every palette needs all info
- Change 'type:' into 'collection:'
- Make use of stroke and background color if available
- Ensure that contrast colors are in a reliable sequence; first dark then light
- Add cosine palettes again


## Contributing

Feedback and pull requests are welcome. Best ways to contribute:
* Star it on GitHub - if you use it and like it please star it
* Open [issues/tickets](https://github.com/bcorporaal/toko/issues)
* Submit fixes and/or improvements with [Pull Requests](https://github.com/bcorporaal/toko/pulls)

## Contact

If you have any questions or comments you can contact me via [email](mailto:dev@reefscape.net).

## Credits

Toko includes code from the following:<br>
[Chromotome color palettes](https://github.com/kgolid/chromotome) by Kjetil Midtgarden Golid. MIT License.<br>
[D3 color palettes](https://github.com/d3/d3) by Mike Bostock and others. ISC License.<br>
[Fira Code font files](https://github.com/tonsky/FiraCode) by Nikita Prokopov. OFL-1.1 License.<br>

Makes use of the following:<br>
[Tweakpane](https://cocopon.github.io/tweakpane/) by Hiroki Kokubun for controls. MIT License.<br>
[CCapture.js](https://github.com/spite/ccapture.js) by Jaume Sanchez for video capture. MIT License.<br>
[Chroma.js](https://github.com/gka/chroma.js) by Gregor Aisch for color manipulations. Apache License.<br>
[p5.js-svg](https://github.com/zenozeng/p5.js-svg) by Zeno Zeng for SVG support. MIT License.<br>


## License

Copyright (c) 2023 Bob Corporaal<br>
Licensed under the MIT license.
