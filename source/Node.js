/**
 * @class Creates a Node to be used in an Axonometric Scene.
 * @author Matthew Wagerfield
 * @see http://twitter.com/mwagerfield
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
     * @type {Object}
     */
    this.vx = 0;

    /**
     * The y position of the Node vertex in the Scene.
     * @type {Object}
     */
    this.vy = 0;

    /**
     * The z position of the Node vertex in the Scene.
     * @type {Object}
     */
    this.vz = 0;

    /**
     * The z index of the Node in the Scene.
     * @type {Number}
     */
    this.zIndex = 0;

    /**
     * Whether or not the Node should rotate about its local coordinate space relative to its current rotation.
     * @type {Boolean}
     */
    this.localRotation = false;

    /**
     * The x position of the Node.
     * @type {Number}
     */
    this._x = 0;

    /**
     * The y position of the Node.
     * @type {Number}
     */
    this._y = 0;

    /**
     * The z position of the Node.
     * @type {Number}
     */
    this._z = 0;

    /**
     * The x scale of the Node.
     * @type {Number}
     */
    this._scaleX = 1;

    /**
     * The y scale of the Node.
     * @type {Number}
     */
    this._scaleY = 1;

    /**
     * The z scale of the Node.
     * @type {Number}
     */
    this._scaleZ = 1;

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
     * Object type.
     * @type {String}
     */
    TYPE: 'node',

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

        this._x = 0;
        this._y = 0;
        this._z = 0;

        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this._zDepth = 0;
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

        this._x = x;
        this._y = y;
        this._z = z;
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

        this._scaleX = x;
        this._scaleY = y;
        this._scaleZ = z;
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

        if (!~this._children.indexOf(node) && node.TYPE === this.TYPE) {
            this._children.push(node);
            node._scene = this._scene;
            node._parent = this;
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
            node._scene = null;
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
            while (!error && parent.TYPE !== AP.Scene.prototype.TYPE) {
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
                AP.Matrix.translate(this._matrix, this._ms1, node._x, node._y, node._z);
                AP.Quaternion.toMatrix(this._ms1, node._quaternion);
                AP.Matrix.multiply(this._matrix, this._ms1);
                AP.Matrix.scale(this._matrix, this._ms1, node._scaleX, node._scaleY, node._scaleZ);
            }

        } else {

            if (this._parent.TYPE === this.TYPE) {
                AP.Matrix.clone(this._parent._matrix, this._matrix);
            }

            // Apply the transformations of this Node to its Matrix.
            AP.Matrix.translate(this._matrix, this._ms1, this._x, this._y, this._z);
            AP.Quaternion.toMatrix(this._ms1, this._quaternion);
            AP.Matrix.multiply(this._matrix, this._ms1);
            AP.Matrix.scale(this._matrix, this._ms1, this._scaleX, this._scaleY, this._scaleZ);
        }

        // reset
        this.px = this.py = this.zDepth = 0;

        // vertex
        this.vx = this._matrix[12];
        this.vy = this._matrix[13];
        this.vz = this._matrix[14];

        // x offset
        this.px += this.vx * this._scene._cosRotation;
        this.py += this.vx * this._scene._sinRotation;

        // y offset
        this.px -= this.vz * this._scene._sinRotation;
        this.py += this.vz * this._scene._cosRotation;

        // pitch offset
        this.py *= this._scene._pitchRatio;

        // z offset
        this.py -= this.vy * this._scene._yRatio;

        // z depth
        this._zDepth += this.vx * this._scene._sinRotation;
        this._zDepth += this.vz * this._scene._cosRotation;
        this._zDepth *= this._scene._yRatio;
        this._zDepth += this.vy * this._scene._pitchRatio;

        // origin offset
        this.px += this._scene.origin.x;
        this.py += this._scene.origin.y;
    }
};