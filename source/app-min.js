//
//  Used to export the minified version with CodeKit
//  Should be identical to app.js
//
import Toko from './core/main';

import './color/color_external';
import './color/color_internal';

import './core/setup';
import './core/canvas';
import './core/util';
import './core/tweakpane';

import './math/math';
import './math/random';
import './math/rng';
import './math/openSimplex';
import './math/quadTree';
import './math/easing';
import './math/cubic-bezier';

import './geometry/grid';
import './geometry/gridCell';

import './graphics/transform';
import './graphics/effects';
import './graphics/grain';
import './graphics/shapes';
import './graphics/pixels';

import './output/output_util';
import './output/capture_video';
import './output/save_sketch';
import './output/save_settings';

import './input/receive_file';

export default Toko;
