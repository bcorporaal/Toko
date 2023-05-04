# Toko: expanding p5.js

** Work in progress **

Some handy duct tape to expand p5.js with Tweakpane, chroma.js, color palettes, p5 SVG, and more.

Features:
- Easy capturing options for images and video
- Switching between canvas sizes
- Larger canvas sizes are scaled to fit on the screen
- Tweakpane integration
- Large collection of color palettes
- Easy selection and usage of (custom) color palettes
- Saving and loading (through drag and drop on the canvas) of sketch parameters

No documentation yet, so see toko/source for details. Also, the examples folder includes sketches using various features.

To do (in no particular order):

## General
- [ ] Make sure all random functions in Toko can be seeded
- [ ] Where possible use p5 functionality for saving images and video
- [ ] Try to create something resembling code standards and consistency
- [ ] Add more examples
- [ ] Restructure folders and repository

## Grid
- [x] Add grid generators
- [ ] Add set functions to move / scale the grid
- [ ] Add options to bias other than 0.5
- [ ] remove / hide specific cells from the grid

## Color
- [ ] Add option to include all collections in palette selection
- [ ] Generate contrast colors based on entire palette
- [ ] Update color palettes
- [ ] Add gradients for shapes
- [ ] add meta data to each collection so not every palette needs all info
- [ ] change 'type:' into 'collection:'
- [ ] Make use of stroke and background color if available
- [ ] Ensure that contrast colors are in a reliable sequence; first dark then light
- [ ] Add cosine palettes again


