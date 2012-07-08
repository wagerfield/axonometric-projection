/**
 * @class Math utilities.
 * @author Matthew Wagerfield
 */
APE.Math = {

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
     * @this {APE.Math}
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
     * @this {APE.Math}
     *
     * @param {Number} radians Angle in radians to convert.
     *
     * @return {Number} Converted angle in degrees.
     */
    radiansToDegrees: function(radians) {

        return radians * this.RTD;
    }
};
