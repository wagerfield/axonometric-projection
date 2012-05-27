/**
 * Defines the Axonometric Projection namespace for all the awesomeness to exist upon.
 * @author Matthew Wagerfield
 */
var AP = AP || {};

/**
 * Returns the type of Array that is avaialble.
 * @type {Float32Array|Array}
 */
AP.Array = typeof Float32Array === 'function' ? Float32Array : Array;