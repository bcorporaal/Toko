<p align="center"><img src="/assets/images/toko_header.png" alt="Toko header"></p>

# Toko: expanding p5.js with handy features

Toko is a framework to enhance p5.js for creative coding with Tweakpane, chroma.js, random number generation, color palettes, grids, and more. Very much a work in progress.

For examples of generative art created with Toko see [Late Night Noodles on Instagram](https://www.instagram.com/_late_night_noodles_/).

> [!NOTE]
> This framework continues to evolve. Be prepared for breaking changes in every update.

## Features

- Easy capturing options for images and video using p5.capture
- Create and save SVG images
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
- Open [issues or tickets](https://github.com/bcorporaal/toko/issues)
- Submit fixes or improvements with [Pull Requests](https://github.com/bcorporaal/toko/pulls)

## Contact

If you have any questions or comments you can also contact me via [email](mailto:toko@reefscape.net).

## Credits

Many thanks to all the creator whose code or work is in some way of influence to Toko.

Toko includes color palettes from the following:<br>
[Chromotome](https://github.com/kgolid/chromotome) by Kjetil Midtgarden Golid. MIT License.<br>
[D3](https://github.com/d3/d3) by Mike Bostock and others. ISC License.<br>
[Feathers](https://github.com/shandiya/feathers) by Shandiya Balasubramaniam. MIT License.<br>
[Lospec](https://lospec.com/palette-list) by various contributers. Unknown license.<br>
[Metbrewer](https://github.com/BlakeRMills/MetBrewer) by Blake Robert Mills. CC0-1.0 License.<br>
[MoMAColors](https://github.com/BlakeRMills/MoMAColors) by Blake Robert Mills. MIT License.<br>
[WesAnderson](https://github.com/karthik/wesanderson) by Karthik Ram & [Wes Anderson palettes](https://wesandersonpalettes.tumblr.com/). Unknown License.<br>

Toko includes code from the following:<br>
[SimplexNoiseJS](https://github.com/blindman67/SimplexNoiseJS) by Mark Spronck for OpenSimplex Noise. Unlicense.<br>
[Quadtree](https://github.com/CodingTrain/QuadTree) by Daniel Shiffman / Coding Train for quadtree. MIT License.<br>

Toko makes use of the following:<br>
[Tweakpane](https://cocopon.github.io/tweakpane/) by Hiroki Kokubun for controls. MIT License.<br>
[p5.capture](https://github.com/tapioca24/p5.capture) by tapioca24 for video capture. MIT License.<br>
[Chroma.js](https://github.com/gka/chroma.js) by Gregor Aisch for color manipulations. Apache License.<br>
[Spectral.js](https://github.com/rvanwijnen/spectral.js) by Roland van Wijnen for color mixing. MIT License.<br>
[p5.js-svg](https://github.com/zenozeng/p5.js-svg) by Zeno Zeng for SVG support. MIT License.<br>

## License

Copyright (c) 2024 Bob Corporaal<br>
Licensed under the MIT license.
