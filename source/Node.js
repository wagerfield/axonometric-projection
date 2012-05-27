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
     * The z depth of the Node in the Scene.
     * @type {Number}
     */
    this._zDepth = 0;

    /**
     * The z index of the Node in the Scene.
     * @type {Number}
     */
    this._zIndex = 0;

    /**
     * The projected x coordinate of the Node.
     * @type {Number}
     */
    this._px = 0;

    /**
     * The projected y coordinate of the Node.
     * @type {Number}
     */
    this._py = 0;

    /**
     * The x position of the Node vertex in the Scene.
     * @type {Number}
     */
    this._vx = 0;

    /**
     * The y position of the Node vertex in the Scene.
     * @type {Number}
     */
    this._vy = 0;

    /**
     * The z position of the Node vertex in the Scene.
     * @type {Number}
     */
    this._vz = 0;

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

    /**
     * The Scene that the Node is in.
     * @type {AP.Scene}
     */
    this._scene = null;

    /**
     * Parent Node.
     * @type {Object}
     */
    this._parent = null;

    /**
     * List of child Nodes.
     * @type {Array}
     */
    this._children = [];
};

AP.Node.prototype = {

    /**
     * Resets the Node properties.
     * @this {AP.Node}
     */
    reset: function() {

        this.px = 0;
        this.py = 0;

        this._vx = 0;
        this._vy = 0;
        this._vz = 0;

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

        this._zDepth = 0;

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

        if (!~this._children.indexOf(node) && node.type === this.type) {
            this._children.push(node);
            node._parent = this;

            // Store a reference to the Node's Scene.
            var scene = this._scene;

            // Recursively set the Scene on each Nodes children.
            var setScene = function(node) {
                node._scene = scene;
                for (var i = 0, l = node._children.length; i < l; i++) {
                    setScene(node._children[i]);
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

        if (~this._children.indexOf(node)) {
            this._children.splice(this._children.indexOf(node), 1);
            node._parent = null;

            // Recursively void the Scene on each Node's children.
            var voidScene = function(node) {
                node._scene = null;
                for (var i = 0, l = node._children.length; i < l; i++) {
                    voidScene(node._children[i]);
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
            var parent = this._parent,
                chain = [this, parent],
                error = parent === null,
                node = null;

            // Iterate up through the display chain and store them.
            while (!error && parent.type !== AP.Scene.prototype.type) {
                parent = parent._parent;
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

            if (this._parent.type === this.type) {
                AP.Matrix.clone(this._parent._matrix, this._matrix);
            }

            // Apply the transformations of this Node to its Matrix.
            AP.Matrix.translate(this._matrix, this._ms1, this.x, this.y, this.z);
            AP.Quaternion.toMatrix(this._ms1, this._quaternion);
            AP.Matrix.multiply(this._matrix, this._ms1);
            AP.Matrix.scale(this._matrix, this._ms1, this.scaleX, this.scaleY, this.scaleZ);
        }

        // reset
        this._px = this._py = this._zDepth = 0;

        // vertex
        this._vx = this._matrix[12];
        this._vy = this._matrix[13];
        this._vz = this._matrix[14];

        // x offset
        this._px += this._vx * this._scene._cosRotation;
        this._py += this._vx * this._scene._sinRotation;

        // y offset
        this._px -= this._vz * this._scene._sinRotation;
        this._py += this._vz * this._scene._cosRotation;

        // pitch offset
        this._py *= this._scene._pitchRatio;

        // z offset
        this._py -= this._vy * this._scene._yRatio;

        // z depth
        this._zDepth += this._vx * this._scene._sinRotation;
        this._zDepth += this._vz * this._scene._cosRotation;
        this._zDepth *= this._scene._yRatio;
        this._zDepth += this._vy * this._scene._pitchRatio;

        // origin offset
        this._px += this._scene.origin.x;
        this._py += this._scene.origin.y;
    }
};

Object.defineProperties(AP.Node.prototype, {

    /**
     * Object type.
     * @type {String}
     */
    'type': {
        value: 'node'
    },

    /**
     * The Scene that the Node is in.
     * @type {AP.Scene}
     */
    'scene': {
        enumerable: true,
        get: function() {
            return this._scene;
        }
    },

    /**
     * Parent Node.
     * @type {Object}
     */
    'parent': {
        enumerable: true,
        get: function() {
            return this._parent;
        }
    },

    /**
     * List of child Nodes.
     * @type {Array}
     */
    'children': {
        enumerable: true,
        get: function() {
            return this._children;
        }
    },

    /**
     * The projected x coordinate of the Node.
     * @type {Number}
     */
    'px': {
        enumerable: true,
        get: function() {
            return this._px;
        }
    },

    /**
     * The projected y coordinate of the Node.
     * @type {Number}
     */
    'py': {
        enumerable: true,
        get: function() {
            return this._py;
        }
    },

    /**
     * The x position of the Node vertex in the Scene.
     * @type {Number}
     */
    'vx': {
        enumerable: true,
        get: function() {
            return this._vx;
        }
    },

    /**
     * The y position of the Node vertex in the Scene.
     * @type {Number}
     */
    'vy': {
        enumerable: true,
        get: function() {
            return this._vy;
        }
    },

    /**
     * The z position of the Node vertex in the Scene.
     * @type {Number}
     */
    'vz': {
        enumerable: true,
        get: function() {
            return this._vz;
        }
    },

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
            if (this.localRotation) {
                AP.Quaternion.fromEuler(this._qs1, value - this._rotationX, 0, 0);
                AP.Quaternion.clone(this._quaternion, this._qs2);
                AP.Quaternion.multiply(this._quaternion, this._qs1, this._qs2);
            } else {
                AP.Quaternion.fromEuler(this._quaternion, value, this._rotationY, this._rotationZ);
            }
            this._rotationX = value;
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
            if (this.localRotation) {
                AP.Quaternion.fromEuler(this._qs1, 0, value - this._rotationY, 0);
                AP.Quaternion.clone(this._quaternion, this._qs2);
                AP.Quaternion.multiply(this._quaternion, this._qs1, this._qs2);
            } else {
                AP.Quaternion.fromEuler(this._quaternion, this._rotationX, value, this._rotationZ);
            }
            this._rotationY = value;
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
            if (this.localRotation) {
                AP.Quaternion.fromEuler(this._qs1, 0, 0, value - this._rotationZ);
                AP.Quaternion.clone(this._quaternion, this._qs2);
                AP.Quaternion.multiply(this._quaternion, this._qs1, this._qs2);
            } else {
                AP.Quaternion.fromEuler(this._quaternion, this._rotationX, this._rotationY, value);
            }
            this._rotationZ = value;
        }
    },

    /**
     * The z index of the Node in the Scene.
     * @type {Number}
     */
    'zIndex': {
        enumerable: true,
        get: function() {
            return this._zIndex;
        }
    }
});