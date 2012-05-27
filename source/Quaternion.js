/**
 * @class Quaternion utility for the rotation of an Axonometric Projection Node.
 * @author Matthew Wagerfield
 *
 * Math taken from Quaternions: How by Eric Brown.
 * @see http://physicsforgames.blogspot.se/2010/02/quaternions.html
 */
AP.Quaternion = {

    /**
     * Creates a new Quaternion array.
     * @this {AP.Quaternion}
     *
     * @return {Float32Array|Array} Quaternion.
     */
    create: function() {

        var quaternion = new AP.Array(4);

        this.identity(quaternion);

        return quaternion;
    },

    /**
     * Resets the Quaternion components to identity values.
     * @this {AP.Quaternion}
     *
     * @param {Float32Array|Array} target The Quaternion to set the values of.
     *
     * @return {Float32Array|Array} The privded 'target' Quaternion.
     */
    identity: function(target) {

        target[0] = 0;
        target[1] = 0;
        target[2] = 0;
        target[3] = 1;

        return target;
    },

    /**
     * Clones a master Quaternion to a slave Quaternion and returns the slave.
     * @this {AP.Quaternion}
     *
     * @param {Float32Array|Array} source The Quaternion to copy the values from.
     * @param {Float32Array|Array} target The Quaternion to clone the values to.
     *
     * @return {Float32Array|Array} The Quaternion with the cloned values.
     */
    clone: function(source, target) {

        target[0] = source[0];
        target[1] = source[1];
        target[2] = source[2];
        target[3] = source[3];

        return target;
    },

    /**
     * Multiplies two Quaternions together and returns the resultant Quaternion.
     * @this {AP.Quaternion}
     *
     * @param {Float32Array|Array} target The Quaternion to apply the output to.
     * @param {Float32Array|Array} a The first Quaternion to multiply by.
     * @param {Float32Array|Array} b The second Quaternion to multiply by.
     *
     * @return {Float32Array|Array} The target Quaternion with the multiplied values.
     */
    multiply: function(target, a, b) {

        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
            b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];

        target[0] = a3*b0 + a0*b3 + a1*b2 - a2*b1;
        target[1] = a3*b1 - a0*b2 + a1*b3 + a2*b0;
        target[2] = a3*b2 + a0*b1 - a1*b0 + a2*b3;
        target[3] = a3*b3 - a0*b0 - a1*b1 - a2*b2;

        return target;
    },

    /**
     * Configures a provided Quaternion from an Euler angle.
     * @this {AP.Quaternion}
     *
     * @param {Float32Array|Array} target The Quaternion to apply the calculated values to.
     * @param {Float32Array|Array} x The x rotation in radians.
     * @param {Float32Array|Array} y The y rotation in radians.
     * @param {Float32Array|Array} z The z rotation in radians.
     *
     * @return {Float32Array|Array} The generated Quaternion.
     */
    fromEuler: function(target, x, y, z) {

        var ax = x*AP.Math.ETQ,
            ay = y*AP.Math.ETQ,
            az = z*AP.Math.ETQ,

            cx = Math.cos( ax ),
            sx = Math.sin( ax ),
            cy = Math.cos( ay ),
            sy = Math.sin( ay ),
            cz = Math.cos(-az ),
            sz = Math.sin(-az ),

            cycz = cy*cz,
            sysz = sy*sz;

        target[0] = cycz*sx + sysz*cx;
        target[1] = sy*cz*cx + cy*sz*sx;
        target[2] = cy*sz*cx - sy*cz*sx;
        target[3] = cycz*cx - sysz*sx;

        return target;
    },

    /**
     * Sets the value of a Matrix from a Quaternion.
     * @this {AP.Quaternion}
     *
     * @param {Float32Array|Array} matrix The Matrix to apply the values to.
     * @param {Float32Array|Array} q The Quaternion to convert.
     *
     * @return {Float32Array|Array} The calculated Matrix.
     */
    toMatrix: function(matrix, q) {

        AP.Matrix.identity(matrix);

        var xs = q[0]*q[0],
            ys = q[1]*q[1],
            zs = q[2]*q[2],
            ws = q[3]*q[3],

            x2 = q[0]*2.0,
            y2 = q[1]*2.0,
            w2 = q[3]*2.0,

            xy = q[1]*x2,
            xz = q[2]*x2,
            yz = q[2]*y2,
            wx = q[0]*w2,
            wy = q[1]*w2,
            wz = q[2]*w2;

        matrix[0]  = ws + xs - ys - zs;
        matrix[1]  = xy - wz;
        matrix[2]  = xz + wy;

        matrix[4]  = xy + wz;
        matrix[5]  = ws - xs + ys - zs;
        matrix[6]  = yz - wx;

        matrix[8]  = xz - wy;
        matrix[9]  = yz + wx;
        matrix[10] = ws - xs - ys + zs;

        return matrix;
    }
};