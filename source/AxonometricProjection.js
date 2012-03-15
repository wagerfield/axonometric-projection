/**
 * @class Projects a 3D point in an axonometric scene onto a plane and returns a 2D point.
 * @author matthew@wagerfield.com (Matthew Wagerfield)
 * @constructor
 *
 * @param {Number} pitch The pitch angle of the scene in degrees.
 * @param {Number} rotation The rotation angle of the scene in degrees.
 */
var AxonometricProjection = function(pitch, rotation) {

    /**
     * The origin offset of the world coordinate system.
     * @type {Object}
     */
    this._origin = {x: 0, y: 0};

    /**
     * The rotation angle of the scene in radians.
     * @type {Number}
     */
    this._rotationAngle = 0;

    /**
     * The pitch angle of the scene in radians.
     * @type {Number}
     */
    this._pitchAngle = 0;

    /**
     * The pitch ratio of the scene.
     * @type {Number}
     */
    this._pitchRatio = 0;

    /**
     * The z ratio of the scene.
     * @type {Number}
     */
    this._zRatio = 0;

    /**
     * Set the pitch of the scene.
     */
    this.pitch((pitch !== null && pitch !== undefined) ? pitch : 35);

    /**
     * Set the rotation of the scene.
     */
    this.rotate((rotation !== null && rotation !== undefined) ? rotation : 45);
};

AxonometricProjection.prototype = {

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
     * @this {AxonometricProjection}
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
     * @this {AxonometricProjection}
     *
     * @param {Number} radians Angle in radians to convert.
     *
     * @return {Number} Converted angle in degrees.
     */
    radiansToDegrees: function(radians) {
      
        return radians * this.RTD;
    },

    /**
     * Sets the origin offset of the world coordinate system.
     * @this {AxonometricProjection}
     *
     * @param {Number} x The x offset of the coordinate system.
     * @param {Number} y The y offset of the coordinate system.
     *
     * @return {Object} The origin of the world coordinate system.
     */
    origin: function(x, y) {

        if (x !== null && x !== undefined) {
         
            this._origin.x = x;
        }
        if (y !== null && y !== undefined) {

            this._origin.y = y;
        }

        return this._origin;
    },

    /**
     * Sets the pitch of the scene in degrees.
     * @this {AxonometricProjection}
     *
     * @param {Number} degrees The angle to pitch the scene to.
     *
     * @return {Number} The pitch of the scene in degrees.
     */
    pitch: function(degrees) {

        if (degrees !== null && degrees !== undefined) {
            
            var sine = Math.sin(this.degreesToRadians(degrees)),
                sign = sine / (sine ? Math.abs(sine) : 1),
                modulo = Math.abs(degrees) % 180 - 90,
                slope = (modulo > 0 ? 90 - modulo : 90 + modulo),
                angle = slope * sign,
                radians = this.degreesToRadians(angle);

            this._pitchAngle = angle;
            this._pitchRatio = Math.sin(radians);
            this._zRatio = Math.cos(radians);
        }

        return this._pitchAngle;
    },

    /**
     * Sets the rotation of the scene in degrees.
     * @this {AxonometricProjection}
     *
     * @param {Number} degrees The angle to rotate the scene to.
     *
     * @return {Number} The rotation of the scene in radians.
     */
    rotate: function(degrees) {

        if (degrees !== null && degrees !== undefined) {

            this._rotationAngle = this.degreesToRadians(-degrees);
        }

        return this._rotationAngle;
    },

    /**
     * Calculates and returns the rotation of the scene in degrees.
     * @this {AxonometricProjection}
     *
     * @return {Number} The rotation of the scene in degrees.
     */
    rotation: function() {

        return this.radiansToDegrees(this._rotationAngle);
    },

    /**
     * Projects a 3D point onto a plane and returnd the 2D point coordinate.
     * @this {AxonometricProjection}
     *
     * @param {Number} x The x position of the point.
     * @param {Number} y The y position of the point.
     * @param {Number} z The z position of the point.
     *
     * @return {Object} 2D point coordinate.
     */
    project: function(x, y, z) {

        var point = {x: 0, y: 0};

        // x offset
        point.x += x * Math.cos(this._rotationAngle);
        point.y += x * Math.sin(this._rotationAngle);

        // y offset
        point.x -= y * Math.sin(this._rotationAngle);
        point.y += y * Math.cos(this._rotationAngle);

        // pitch offset
        point.y *= this._pitchRatio;

        // z offset
        point.y -= z * this._zRatio;

        // origin offset
        point.x += this._origin.x;
        point.y += this._origin.y;

        return point;
    }
};

// Assign AP to AxonometricProjection for convenience.
var AP = AxonometricProjection;



//============================================================
//
// Copyright (c) 2012 Matthew Wagerfield
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