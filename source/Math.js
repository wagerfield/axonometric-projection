//Axonometric Projection Namespace
var AP = AP || {};

/**
 * @class Math utilities for Axonometric Projection.
 * @author Matthew Wagerfield
 * @see http://twitter.com/mwagerfield
 */
AP.Math = {

    /**
     * Cache PI / 360 for calculating a Quaternion from an Euler angle.
     * @type {Number}
     */
    ETQ: Math.PI / 360,

    /**
     * Cache PI / 180 for calculating degrees to radians.
     * @type {Number}
     */
    DTR: Math.PI / 180,

    /**
     * Cache 180 / PI for calculating radians to degrees.
     * @type {Number}
     */
    RTD: 180 / Math.PI,

    /**
     * Converts degrees to radians.
     * @this {AP.Math}
     *
     * @param {Number} degrees Angle in degrees to convert.
     *
     * @return {Number} Converted angle in radians.
     */
    degreesToRadians: function(degrees) {

        return degrees * this.DTR;
    },

    /**
     * Converts radians to degrees.
     * @this {AP.Math}
     *
     * @param {Number} radians Angle in radians to convert.
     *
     * @return {Number} Converted angle in degrees.
     */
    radiansToDegrees: function(radians) {

        return radians * this.RTD;
    }
};

/**
 * Returns the type of Array that is avaialble.
 * @type {Float32Array|Array}
 */
AP.Array = typeof Float32Array === 'function' ? Float32Array : Array;



//============================================================
//
// Copyright (C) 2012 Matthew Wagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================