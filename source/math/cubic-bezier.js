import Toko from '../core/main';

//
//  based on https://github.com/thednp/bezier-easing/
//  by thednp
//

Toko.CubicBezier = (function () {
  'use strict';
  var C = Object.defineProperty;
  var x = (n, i, e) => (i in n ? C(n, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (n[i] = e));
  var h = (n, i, e) => x(n, typeof i != 'symbol' ? i + '' : i, e);
  class n {
    constructor (e, l, t, s, c) {
      h(this, 'cx');
      h(this, 'bx');
      h(this, 'ax');
      h(this, 'cy');
      h(this, 'by');
      h(this, 'ay');
      const r = e || 0,
        a = l || 0,
        u = t || 1,
        p = s || 1,
        v = o => typeof o == 'number',
        y = [e, l, t, s].every(v),
        m = c || (y ? `cubic-bezier(${[r, a, u, p].join(',')})` : 'linear');
      (this.cx = 3 * r),
        (this.bx = 3 * (u - r) - this.cx),
        (this.ax = 1 - this.cx - this.bx),
        (this.cy = 3 * a),
        (this.by = 3 * (p - a) - this.cy),
        (this.ay = 1 - this.cy - this.by);
      const b = o => this.sampleCurveY(this.solveCurveX(o));
      return Object.defineProperty(b, 'name', { writable: !0 }), (b.name = m), b;
    }
    sampleCurveX (e) {
      return ((this.ax * e + this.bx) * e + this.cx) * e;
    }
    sampleCurveY (e) {
      return ((this.ay * e + this.by) * e + this.cy) * e;
    }
    sampleCurveDerivativeX (e) {
      return (3 * this.ax * e + 2 * this.bx) * e + this.cx;
    }
    solveCurveX (e) {
      if (e <= 0) return 0;
      if (e >= 1) return 1;
      let t = e,
        s = 0,
        c = 0;
      for (let u = 0; u < 8; u += 1) {
        if (((s = this.sampleCurveX(t) - e), Math.abs(s) < 1e-6)) return t;
        c = this.sampleCurveDerivativeX(t);
        if (Math.abs(c) < 1e-6) break;
        t -= s / c;
      }
      let r = 0,
        a = 1;
      for (t = e; r < a; ) {
        if (((s = this.sampleCurveX(t)), Math.abs(s - e) < 1e-6)) return t;
        e > s ? (r = t) : (a = t), (t = (a - r) * 0.5 + r);
      }
      return t;
    }
  }
  return n;
})();
