/**
 * Defines the Axonometric Projection Engine namespace for all the awesomeness to exist upon.
 * @author Matthew Wagerfield
 */
var APE = APE || {};

/**
 * Returns the type of Array that is avaialble.
 * @type {Float32Array|Array}
 */
APE.Array = typeof Float32Array === 'function' ? Float32Array : Array;
