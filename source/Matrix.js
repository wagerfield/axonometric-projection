/**
 * @class 4x4 Matrix for Axonometric Projection Node transformations.
 * @author Matthew Wagerfield
 * @see http://twitter.com/mwagerfield
 *
 * Concepts and math inspired by and copied from gl-matrix.
 * @see https://github.com/toji/gl-matrix
 */
AP.Matrix = {

    /**
     * Creates a new Matrix array and sets it to an identity.
     * @this {AP.Matrix}
     *
     * @return {Float32Array|Array} 4x4 Matrix.
     */
    create: function() {

        var matrix = new AP.Array(16);

        this.identity(matrix);

        return matrix;
    },

    /**
     * Resets the Matrix components to identity values.
     * @this {AP.Matrix}
     *
     * @param {Float32Array|Array} target The Matrix to set the values of.
     *
     * @return {Float32Array|Array} The privded 'target' Matrix.
     */
    identity: function(target) {

        target[0]  = 1;
        target[1]  = 0;
        target[2]  = 0;
        target[3]  = 0;

        target[4]  = 0;
        target[5]  = 1;
        target[6]  = 0;
        target[7]  = 0;

        target[8]  = 0;
        target[9]  = 0;
        target[10] = 1;
        target[11] = 0;

        target[12] = 0;
        target[13] = 0;
        target[14] = 0;
        target[15] = 1;

        return target;
    },

    /**
     * Clones a master Matrix to a slave and returns the slave.
     * @this {AP.Matrix}
     *
     * @param {Float32Array|Array} source The Matrix to copy the values from.
     * @param {Float32Array|Array} target The Matrix to copy the values to.
     *
     * @return {Float32Array|Array} The target Matrix with the cloned values.
     */
    clone: function(source, target) {

        target[0]  = source[0];
        target[1]  = source[1];
        target[2]  = source[2];
        target[3]  = source[3];

        target[4]  = source[4];
        target[5]  = source[5];
        target[6]  = source[6];
        target[7]  = source[7];

        target[8]  = source[8];
        target[9]  = source[9];
        target[10] = source[10];
        target[11] = source[11];

        target[12] = source[12];
        target[13] = source[13];
        target[14] = source[14];
        target[15] = source[15];

        return target;
    },

    /**
     * Multiplies two Matrices together and returns the first one.
     * @this {AP.Matrix}
     *
     * @param {Float32Array|Array} a The first Matrix to multiply by.
     * @param {Float32Array|Array} b The second Matrix to multiply by.
     *
     * @return {Float32Array|Array} The first Matrix 'a' after 'b' has been applied to it.
     */
    multiply: function(a, b) {

        var a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3],
            a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7],
            a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = b[0],  b01 = b[1],  b02 = b[2],  b03 = b[3],
            b10 = b[4],  b11 = b[5],  b12 = b[6],  b13 = b[7],
            b20 = b[8],  b21 = b[9],  b22 = b[10], b23 = b[11],
            b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

        a[0]  = b00*a00 + b01*a10 + b02*a20 + b03*a30;
        a[1]  = b00*a01 + b01*a11 + b02*a21 + b03*a31;
        a[2]  = b00*a02 + b01*a12 + b02*a22 + b03*a32;
        a[3]  = b00*a03 + b01*a13 + b02*a23 + b03*a33;

        a[4]  = b10*a00 + b11*a10 + b12*a20 + b13*a30;
        a[5]  = b10*a01 + b11*a11 + b12*a21 + b13*a31;
        a[6]  = b10*a02 + b11*a12 + b12*a22 + b13*a32;
        a[7]  = b10*a03 + b11*a13 + b12*a23 + b13*a33;

        a[8]  = b20*a00 + b21*a10 + b22*a20 + b23*a30;
        a[9]  = b20*a01 + b21*a11 + b22*a21 + b23*a31;
        a[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
        a[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;

        a[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
        a[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
        a[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
        a[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;

        return a;
    },

    /**
     * Translates a Matrix in all axis.
     * @this {AP.Matrix}
     *
     * @param {Float32Array|Array} matrix The Matrix to translate.
     * @param {Float32Array|Array} slave A slave Matrix to manipulate.
     * @param {Number} x The value to translate the Matrix by along its x axis.
     * @param {Number} y The value to translate the Matrix by along its y axis.
     * @param {Number} z The value to translate the Matrix by along its z axis.
     *
     * @return {Float32Array|Array} The provided 'matrix' after translation.
     */
    translate: function(matrix, slave, x, y, z) {

        this.identity(slave);

        slave[12] = x;
        slave[13] = y;
        slave[14] = z;

        this.multiply(matrix, slave);

        return matrix;
    },

    /**
     * Scales a Matrix in all axis.
     * @this {AP.Matrix}
     *
     * @param {Float32Array|Array} matrix The Matrix to scale.
     * @param {Float32Array|Array} slave A slave Matrix to manipulate.
     * @param {Number} x The value to scale the Matrix by along its x axis.
     * @param {Number} y The value to scale the Matrix by along its y axis.
     * @param {Number} z The value to scale the Matrix by along its z axis.
     *
     * @return {Float32Array|Array} The provided 'matrix' after scaling.
     */
    scale: function(matrix, slave, x, y, z) {

        this.identity(slave);

        slave[0]  = x;
        slave[5]  = y;
        slave[10] = z;

        this.multiply(matrix, slave);

        return matrix;
    }
};