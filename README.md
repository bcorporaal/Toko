<p align="center"><img src="/assets/images/toko_header.png" alt="Toko logo"></p>

# Toko: expanding p5.js with handy features

Some useful duct tape to expand p5.js for creative coding with Tweakpane, chroma.js, color palettes, p5 SVG, and more. Very much a work in progress.

> [!NOTE]
> This framework continues to evolve. Be prepared for breaking changes in every update.

## Features

- Easy capturing options for images and video
- Switching between canvas sizes
- Larger canvas sizes are scaled to fit on the screen
- Tweakpane integration to easily change sketch parameters
- Large collection of color palettes
- Easy selection and usage of (custom) color palettes
- Saving and loading (through drag and drop on the canvas) of sketch parameters
- Seeded random number generator class to create random but repeatable results
- Addition noise and random functions like OpenSimplex and Poisson-Disk distributions
- Grid generation and modification

## Usage

There is no documentation yet, so see `toko/source` for details. Also, the examples folder includes sketches using various features.

## Ideas (that may or may not get implemented in the future)

### General

- Where possible use p5 functionality for saving images and video
- Add more post-processing options
- Streamline ui settings

### Grid

- Add set functions to move / scale the grid
- Add options to bias other than 0.5
- remove / hide specific cells from the grid

### Color

- Add cosine palettes again
- Define a core set of palettes across collections
- Add duotone palettes

## Contributing

Feedback and pull requests are welcome. Best ways to contribute:

- Star it on GitHub - if you use it and like it please star it
- Open [issues/tickets](https://github.com/bcorporaal/toko/issues)
- Submit fixes and/or improvements with [Pull Requests](https://github.com/bcorporaal/toko/pulls)

## Contact

If you have any questions or comments you can contact me via [email](mailto:toko@reefscape.net).

## Credits

Toko includes code from the following:<br>
[Chromotome color palettes](https://github.com/kgolid/chromotome) by Kjetil Midtgarden Golid. MIT License.<br>
[D3 color palettes](https://github.com/d3/d3) by Mike Bostock and others. ISC License.<br>
[Lospec color palettes](https://lospec.com/palette-list) by various contributers.<br>
[SimplexNoiseJos](https://github.com/blindman67/SimplexNoiseJS) by Mark Spronck for OpenSimplex Noise. Unlicense.<br>

Toko makes use of the following:<br>
[Tweakpane](https://cocopon.github.io/tweakpane/) by Hiroki Kokubun for controls. MIT License.<br>
[CCapture.js](https://github.com/spite/ccapture.js) by Jaume Sanchez for video capture. MIT License.<br>
[Chroma.js](https://github.com/gka/chroma.js) by Gregor Aisch for color manipulations. Apache License.<br>
[p5.js-svg](https://github.com/zenozeng/p5.js-svg) by Zeno Zeng for SVG support. MIT License.<br>

## License

Copyright (c) 2024 Bob Corporaal<br>
Licensed under the MIT license.
