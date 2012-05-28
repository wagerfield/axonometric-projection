//============================================================
//
// Copyright (C) 2012 Matthew Wagerfield
//
// Twitter: https://twitter.com/mwagerfield
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

/**
 * @class Math utilities for Axonometric Projection.
 * @author Matthew Wagerfield
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
 * @class 4x4 Matrix for Axonometric Projection Node transformations.
 * @author Matthew Wagerfield
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

/**
 * @class Creates a Scene to for Nodes.
 * @author Matthew Wagerfield
 *
 * @param {Number} opt_pitch The pitch angle of the scene in degrees.
 * @param {Number} opt_rotation The rotation angle of the scene in degrees.
 */
AP.Scene = function(opt_pitch, opt_rotation) {

    /**
     * The origin of the Scene coordinate system.
     * @type {Object}
     */
    this.origin = {x:0, y:0};

    /**
     * List of child Nodes.
     * @type {Array}
     */
    this.children = [];

    /**
     * The rotation angle of the Scene in radians.
     * @type {Number}
     */
    this._rotationAngle = 0;

    /**
     * The sine value for the rotation.
     * @type {Number}
     */
    this._sinRotation = 0;

    /**
     * The cosine value for the rotation.
     * @type {Number}
     */
    this._cosRotation = 0;

    /**
     * The pitch angle of the Scene.
     * @type {Number}
     */
    this._pitchAngle = 0;

    /**
     * The pitch ratio of the Scene.
     * @type {Number}
     */
    this._pitchRatio = 0;

    /**
     * The y ratio of the Scene.
     * @type {Number}
     */
    this._yRatio = 0;

    /**
     * Set the initial pitch of the Scene.
     */
    this.pitch(typeof opt_pitch === 'number' ? opt_pitch : 35);

    /**
     * Set the initial rotation of the Scene.
     */
    this.rotate(typeof opt_rotation === 'number' ? opt_rotation : 45);
};

AP.Scene.prototype = {

    /**
     * Object type.
     * @type {String}
     */
    type: 'scene',

    /**
     * Sets the pitch of the Scene in degrees.
     * @this {AP.Scene}
     *
     * @param {Number} degrees The angle to pitch the Scene to.
     */
    pitch: function(degrees) {

        this._pitchAngle = AP.Math.degreesToRadians(degrees);
        this._pitchRatio = Math.sin(this._pitchAngle);
        this._yRatio = Math.cos(this._pitchAngle);
    },

    /**
     * Sets the rotation of the Scene in degrees.
     * @this {AP.Scene}
     *
     * @param {Number} degrees The angle to rotate the Scene to.
     */
    rotate: function(degrees) {

        this._rotationAngle = AP.Math.degreesToRadians(degrees);
        this._sinRotation = Math.sin(this._rotationAngle);
        this._cosRotation = Math.cos(this._rotationAngle);
    },

    /**
     * Sets the origin offset of the 2D coordinate system for the Scene.
     * @this {AP.Scene}
     *
     * @param {Number} x The x offset of the Scene origin.
     * @param {Number} y The y offset of the Scene origin.
     *
     * @return {Object} The origin of the Scene.
     */
    setOrigin: function(x, y) {

        this.origin.x = x;
        this.origin.y = y;

        return this.origin;
    },

    /**
     * Adds a Node to the Scene.
     * @this {AP.Scene}
     *
     * @param {AxonometricProjectionNode} node Node to add to the Scene.
     *
     * @return {AxonometricProjectionNode} The added Node.
     */
    addChild: function(node) {

        if (!~this.children.indexOf(node) && node.type === AP.Node.prototype.type) {
            this.children.push(node);
            node.parent = this;

            // Store a reference to this Scene.
            var scene = this;

            // Recursively set the Scene on each Node's children.
            var setScene = function(node) {
                node.scene = scene;
                for (var i = 0, l = node.children.length; i < l; i++) {
                    setScene(node.children[i]);
                }
            };

            // Set the scene on the passed Node.
            setScene(node);
        }

        return node;
    },

    /**
     * Removes a Node from the Scene.
     * @this {AP.Scene}
     *
     * @param {AxonometricProjectionNode} node Node to remove from the Scene.
     *
     * @return {AxonometricProjectionNode} The removed Node.
     */
    removeChild: function(node) {

        if (~this.children.indexOf(node)) {
            this.children.splice(this.children.indexOf(node), 1);
            node.parent = null;

            // Recursively void the Scene on each Node's children.
            var voidScene = function(node) {
                node.scene = null;
                for (var i = 0, l = node.children.length; i < l; i++) {
                    voidScene(node.children[i]);
                }
            };

            // Void the scene on the passed Node.
            voidScene(node);
        }

        return node;
    },

    /**
     * Iterates through all the Nodes in the Scene and updates their px and py coordinates.
     * @this {AP.Scene}
     */
    projectNodes: function() {

        // Recursively calls the project method on a Node and its children.
        var project = function(node) {
            node.project(false);
            for (var i = 0, l = node.children.length; i < l; i++) {
                project(node.children[i]);
            }
        };

        // Iterate through the Scene nodes and call the project function.
        for (var i = 0, l = this.children.length; i < l; i++) {
            project(this.children[i]);
        }
    },

    /**
     * Iterates through all the Nodes in the Scene and updates their zIndex property.
     * @this {AP.Scene}
     *
     * @return {Array} Sorted nodes.
     */
    sortNodes: function() {

        var i, l, nodes = [];

        // Recursively collect each Nodes children.
        var collect = function(node) {
            nodes.push(node);
            for (var i = 0, l = node.children.length; i < l; i++) {
                collect(node.children[i]);
            }
        };

        // Collect all the Nodes in the Scene.
        for (i = 0, l = this.children.length; i < l; i++) {
            collect(this.children[i]);
        }

        // Sorts the collected Nodes by their zDepth.
        var sortOnDepth = function(a, b) {
            if (a.zDepth < b.zDepth) {
                return -1;
            }
            if (a.zDepth > b.zDepth) {
                return 1;
            }
            if (a.zDepth === b.zDepth) {

                if (a.zPriority < b.zPriority) {
                    return -1;
                }
                if (a.zPriority > b.zPriority) {
                    return 1;
                }
                return 0;
            }
        };

        // Sort the nodes.
        nodes.sort(sortOnDepth);

        // Iterate through and update the zIndex property on each Node.
        for (i = 0, l = nodes.length; i < l; i++) {
            nodes[i].zIndex = i;
        }

        // Return the collected and z sorted nodes.
        return nodes;
    }
};

/**
 * @class Creates a Node to be used in an Axonometric Scene.
 * @author Matthew Wagerfield
 *
 * @param {String} opt_id Optional ID for the Node.
 */
AP.Node = function(opt_id) {

    /**
     * An ID for the Node.
     * @type {Object}
     */
    this.id = opt_id;

    /**
     * The Scene that the Node is in.
     * @type {AP.Scene}
     */
    this.scene = null;

    /**
     * Parent Node.
     * @type {Object}
     */
    this.parent = null;

    /**
     * List of child Nodes.
     * @type {Array}
     */
    this.children = [];

    /**
     * The projected x coordinate of the Node.
     * @type {Number}
     */
    this.px = 0;

    /**
     * The projected y coordinate of the Node.
     * @type {Number}
     */
    this.py = 0;

    /**
     * The x position of the Node vertex in the Scene.
     * @type {Number}
     */
    this.vx = 0;

    /**
     * The y position of the Node vertex in the Scene.
     * @type {Number}
     */
    this.vy = 0;

    /**
     * The z position of the Node vertex in the Scene.
     * @type {Number}
     */
    this.vz = 0;

    /**
     * The z depth of the Node in the Scene.
     * @type {Number}
     */
    this.zDepth = 0;

    /**
     * The z index of the Node in the Scene.
     * @type {Number}
     */
    this.zIndex = 0;

    /**
     * The x position of the Node.
     * @type {Number}
     */
    this.x = 0;

    /**
     * The y position of the Node.
     * @type {Number}
     */
    this.y = 0;

    /**
     * The z position of the Node.
     * @type {Number}
     */
    this.z = 0;

    /**
     * The x scale of the Node.
     * @type {Number}
     */
    this.scaleX = 1;

    /**
     * The y scale of the Node.
     * @type {Number}
     */
    this.scaleY = 1;

    /**
     * The z scale of the Node.
     * @type {Number}
     */
    this.scaleZ = 1;

    /**
     * Priority value for z sorting when zDepth is equal to another Node.
     * @type {Number}
     */
    this.zPriority = 0;

    /**
     * Whether or not the Node should rotate about its local coordinate space relative to its current rotation.
     * @type {Boolean}
     */
    this.localRotation = false;

    /**
     * The x rotation of the Node in degrees.
     * @type {Number}
     */
    this._rotationX = 0;

    /**
     * The y rotation of the Node in degrees.
     * @type {Number}
     */
    this._rotationY = 0;

    /**
     * The z rotation of the Node in degrees.
     * @type {Number}
     */
    this._rotationZ = 0;

    /**
     * The 3D Matrix for the Node.
     * @type {AP.Matrix}
     */
    this._matrix = AP.Matrix.create();

    /**
     * A Quaternion for rotation.
     * @type {AP.Quaternion}
     */
    this._quaternion = AP.Quaternion.create();

    /**
     * A slave Matrix for transformation calculations.
     * @type {AP.Matrix}
     */
    this._ms1 = AP.Matrix.create();

    /**
     * A slave Quaternion for rotation calculations.
     * @type {AP.Quaternion}
     */
    this._qs1 = AP.Quaternion.create();

    /**
     * A slave Quaternion for rotation calculations.
     * @type {AP.Quaternion}
     */
    this._qs2 = AP.Quaternion.create();
};

AP.Node.prototype = {

    /**
     * Object type.
     * @type {String}
     */
    type: 'node',

    /**
     * Resets the Node properties.
     * @this {AP.Node}
     */
    reset: function() {

        this.px = 0;
        this.py = 0;

        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        this.zIndex = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this.zDepth = 0;

        AP.Matrix.identity(this._matrix);
        AP.Quaternion.identity(this._quaternion);
    },

    /**
     * Translates the Node in all axis.
     * @this {AP.Node}
     *
     * @param {Number} x The amount to translate the Node by in x.
     * @param {Number} y The amount to translate the Node by in y.
     * @param {Number} z The amount to translate the Node by in z.
     */
    translate: function(x, y, z) {

        this.x = x;
        this.y = y;
        this.z = z;
    },

    /**
     * Rotates the Node in all axis.
     * @this {AP.Node}
     *
     * @param {Number} x The amount to scale the Node by along its x axis.
     * @param {Number} y The amount to scale the Node by along its y axis.
     * @param {Number} z The amount to scale the Node by along its z axis.
     */
    scale: function(x, y, z) {

        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;
    },

    /**
     * Rotates the Node in all axis.
     * @this {AP.Node}
     *
     * @param {Number} x The amount to rotate the Node in its x axis.
     * @param {Number} y The amount to rotate the Node in its y axis.
     * @param {Number} z The amount to rotate the Node in its z axis.
     */
    rotate: function(x, y, z) {

        if (this.localRotation) {

            var dx = x - this._rotationX,
                dy = y - this._rotationY,
                dz = z - this._rotationZ;

            AP.Quaternion.fromEuler(this._qs1, dx, dy, dz);
            AP.Quaternion.clone(this._quaternion, this._qs2);
            AP.Quaternion.multiply(this._quaternion, this._qs1, this._qs2);

        } else {

            AP.Quaternion.fromEuler(this._quaternion, x, y, z);
        }

        this._rotationX = x;
        this._rotationY = y;
        this._rotationZ = z;
    },

    /**
     * Adds a child Node.
     * @this {AP.Node}
     *
     * @param {AP.Node} node Node to add as a child.
     *
     * @return {AP.Node} The added Node.
     */
    addChild: function(node) {

        if (!~this.children.indexOf(node) && node.type === this.type) {
            this.children.push(node);
            node.parent = this;

            // Store a reference to the Node's Scene.
            var scene = this.scene;

            // Recursively set the Scene on each Nodes children.
            var setScene = function(node) {
                node.scene = scene;
                for (var i = 0, l = node.children.length; i < l; i++) {
                    setScene(node.children[i]);
                }
            };

            // Set the scene on the passed Node.
            setScene(node);
        }

        return node;
    },

    /**
     * Removes a child Node.
     * @this {AP.Node}
     *
     * @param {AP.Node} node Child Node to remove.
     *
     * @return {AP.Node} The removed Node.
     */
    removeChild: function(node) {

        if (~this.children.indexOf(node)) {
            this.children.splice(this.children.indexOf(node), 1);
            node.parent = null;

            // Recursively void the Scene on each Node's children.
            var voidScene = function(node) {
                node.scene = null;
                for (var i = 0, l = node.children.length; i < l; i++) {
                    voidScene(node.children[i]);
                }
            };

            // Void the scene on the passed Node.
            voidScene(node);
        }

        return node;
    },

    /**
     * Performs the projection math on the Node, updating its uv coordinates.
     * @this {AP.Node}
     *
     * @param {Boolean} bubble Whether or not the Node should bubble up through and calculate its parent matrices. Defaults to true.
     */
    project: function(bubble) {

        // Check and default the bubble parameter to false if not specified.
        bubble = typeof bubble === 'boolean' ? bubble : true;

        // Reset the matrix to identity values.
        AP.Matrix.identity(this._matrix);

        if (bubble) {

            // Build the Nodes display stack.
            var parent = this.parent,
                chain = [this, parent],
                error = parent === null,
                node = null;

            // Iterate up through the display chain and store them.
            while (!error && parent.type !== AP.Scene.prototype.type) {
                parent = parent.parent;
                error = parent === null;
                chain.push(parent);
            }

            // Check that the Node is in a Scene.
            if (error) throw "node has not been added to a scene.";

            // Loop through the Node chain and calculate the projection.
            for (var i = chain.length - 2; i >= 0; i--) {

                node = chain[i];

                // Apply the transformations of this Node to its Matrix.
                AP.Matrix.translate(this._matrix, this._ms1, node.x, node.y, node.z);
                AP.Quaternion.toMatrix(this._ms1, node._quaternion);
                AP.Matrix.multiply(this._matrix, this._ms1);
                AP.Matrix.scale(this._matrix, this._ms1, node.scaleX, node.scaleY, node.scaleZ);
            }

        } else {

            if (this.parent.type === this.type) {
                AP.Matrix.clone(this.parent._matrix, this._matrix);
            }

            // Apply the transformations of this Node to its Matrix.
            AP.Matrix.translate(this._matrix, this._ms1, this.x, this.y, this.z);
            AP.Quaternion.toMatrix(this._ms1, this._quaternion);
            AP.Matrix.multiply(this._matrix, this._ms1);
            AP.Matrix.scale(this._matrix, this._ms1, this.scaleX, this.scaleY, this.scaleZ);
        }

        // reset
        this.px = this.py = this.zDepth = 0;

        // vertex
        this.vx = this._matrix[12];
        this.vy = this._matrix[13];
        this.vz = this._matrix[14];

        // x offset
        this.px += this.vx * this.scene._cosRotation;
        this.py += this.vx * this.scene._sinRotation;

        // y offset
        this.px -= this.vz * this.scene._sinRotation;
        this.py += this.vz * this.scene._cosRotation;

        // pitch offset
        this.py *= this.scene._pitchRatio;

        // z offset
        this.py -= this.vy * this.scene._yRatio;

        // z depth
        this.zDepth += this.vx * this.scene._sinRotation;
        this.zDepth += this.vz * this.scene._cosRotation;
        this.zDepth *= this.scene._yRatio;
        this.zDepth += this.vy * this.scene._pitchRatio;

        // origin offset
        this.px += this.scene.origin.x;
        this.py += this.scene.origin.y;
    }
};

Object.defineProperties(AP.Node.prototype, {

    /**
     * The x rotation of the Node in degrees.
     * @type {Number}
     */
    'rotationX': {
        enumerable: true,
        get: function() {
            return this._rotationX;
        },
        set: function(value) {
            this.rotate(value, this._rotationY, this._rotationZ);
        }
    },

    /**
     * The y rotation of the Node in degrees.
     * @type {Number}
     */
    'rotationY': {
        enumerable: true,
        get: function() {
            return this._rotationY;
        },
        set: function(value) {
            this.rotate(this._rotationX, value, this._rotationZ);
        }
    },

    /**
     * The z rotation of the Node in degrees.
     * @type {Number}
     */
    'rotationZ': {
        enumerable: true,
        get: function() {
            return this._rotationZ;
        },
        set: function(value) {
            this.rotate(this._rotationX, this._rotationY, value);
        }
    }
});