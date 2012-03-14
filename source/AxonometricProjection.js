/**
 * @class Projects a 3D point in an axonometric scene onto a plane and returns a 2D point.
 * @author matthew@wagerfield.com (Matthew Wagerfield)
 * @constructor
 *
 * @param {Number} pitch The pitch angle of the scene in degrees.
 * @param {Number} rotation The rotation angle of the scene in degrees.
 */
AxonometricProjection = function(pitch, rotation) {

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
     * Converts degrees to radians.
     * @this {AxonometricProjection}
     *
     * @param {Number} degrees Angle in degrees to convert.
     *
     * @return {Number} Converted angle in radians.
     */
    degreesToRadians: function(degrees) {
      
        return degrees * Math.PI / 180;
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
      
        return radians * 180 / Math.PI;
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
            
            var sine = Math.sin(this.degreesToRadians(degrees));
            var sign = sine / (sine ? Math.abs(sine) : 1);
            var modulo = Math.abs(degrees) % 180 - 90;
            var slope = (modulo > 0 ? 90 - modulo : 90 + modulo);
            var angle = slope * sign;
            var radians = this.degreesToRadians(angle);

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
AP = AxonometricProjection;