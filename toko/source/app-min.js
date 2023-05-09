//
//  Used to export the minified version with CodeKit
//  Should be identical to app.js
//
import Toko from './core/main';

import './color/color_external';
import './color/color_internal';

import './core/setup';
import './core/loop';
import './core/canvas';
import './core/util';
import './core/tweakpane';

import './math/math';
import './math/random';

import './geometry/grid';
import './geometry/gridCell';

import './output/output_util';
import './output/capture_video';
import './output/save_sketch';
import './output/save_settings';

import './input/receive_settings';

export default Toko;