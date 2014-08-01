/**
 * @class Creates a Node to be used in a Scene.
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
     * Priority value for z sorting when zDepth is equal to another Node.
     * @type {Number}
     */
    this.zPriority = 0;

    /**
     * Value that is added to the z depth of the Node when sorting Nodes in a Scene.
     * @type {Number}
     */
    this.zOffset = 0;

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
     * Whether or not the Node should rotate about its local coordinate space relative to its current rotation.
     * @type {Boolean}
     */
    this.localRotation = false;



    /**
     * The x rotation of the Node in degrees.
     * @type {Number}
     */
    this.__rotationX = 0;

    /**
     * The y rotation of the Node in degrees.
     * @type {Number}
     */
    this.__rotationY = 0;

    /**
     * The z rotation of the Node in degrees.
     * @type {Number}
     */
    this.__rotationZ = 0;

    /**
     * The 3D Matrix for the Node.
     * @type {AP.Matrix}
     */
    this.__matrix = AP.Matrix.create();

    /**
     * A Quaternion for rotation.
     * @type {AP.Quaternion}
     */
    this.__quaternion = AP.Quaternion.create();

    /**
     * A slave Matrix for transformation calculations.
     * @type {AP.Matrix}
     */
    this.__ms1 = AP.Matrix.create();

    /**
     * A slave Quaternion for rotation calculations.
     * @type {AP.Quaternion}
     */
    this.__qs1 = AP.Quaternion.create();

    /**
     * A slave Quaternion for rotation calculations.
     * @type {AP.Quaternion}
     */
    this.__qs2 = AP.Quaternion.create();
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

        this.__rotationX = 0;
        this.__rotationY = 0;
        this.__rotationZ = 0;

        this.zDepth = 0;

        AP.Matrix.identity(this.__matrix);
        AP.Quaternion.identity(this.__quaternion);
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

            var dx = x - this.__rotationX,
                dy = y - this.__rotationY,
                dz = z - this.__rotationZ;

            AP.Quaternion.fromEuler(this.__qs1, dx, dy, dz);
            AP.Quaternion.clone(this.__quaternion, this.__qs2);
            AP.Quaternion.multiply(this.__quaternion, this.__qs1, this.__qs2);

        } else {

            AP.Quaternion.fromEuler(this.__quaternion, x, y, z);
        }

        this.__rotationX = x;
        this.__rotationY = y;
        this.__rotationZ = z;
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
        AP.Matrix.identity(this.__matrix);

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
                AP.Matrix.translate(this.__matrix, this.__ms1, node.x, node.y, node.z);
                AP.Quaternion.toMatrix(this.__ms1, node.__quaternion);
                AP.Matrix.multiply(this.__matrix, this.__ms1);
                AP.Matrix.scale(this.__matrix, this.__ms1, node.scaleX, node.scaleY, node.scaleZ);
            }

        } else {

            if (this.parent.type === this.type) {
                AP.Matrix.clone(this.parent.__matrix, this.__matrix);
            }

            // Apply the transformations of this Node to its Matrix.
            AP.Matrix.translate(this.__matrix, this.__ms1, this.x, this.y, this.z);
            AP.Quaternion.toMatrix(this.__ms1, this.__quaternion);
            AP.Matrix.multiply(this.__matrix, this.__ms1);
            AP.Matrix.scale(this.__matrix, this.__ms1, this.scaleX, this.scaleY, this.scaleZ);
        }

        // reset
        this.px = this.py = this.zDepth = 0;

        // vertex
        this.vx = this.__matrix[12];
        this.vy = this.__matrix[13];
        this.vz = this.__matrix[14];

        // x offset
        this.px += this.vx * this.scene.__cosRotation;
        this.py += this.vx * this.scene.__sinRotation;

        // y offset
        this.px -= this.vz * this.scene.__sinRotation;
        this.py += this.vz * this.scene.__cosRotation;

        // pitch offset
        this.py *= this.scene.__pitchRatio;

        // z offset
        this.py -= this.vy * this.scene.__yRatio;

        // z depth
        this.zDepth += this.vx * this.scene.__sinRotation;
        this.zDepth += this.vz * this.scene.__cosRotation;
        this.zDepth *= this.scene.__yRatio;
        this.zDepth += this.vy * this.scene.__pitchRatio;
        this.zDepth += this.zOffset;

        // origin offset
        this.px += this.scene.origin.x;
        this.py += this.scene.origin.y;
    }
};

/**
 * The x rotation of the Node in degrees.
 * @type {Number}
 */
Object.defineProperty(AP.Node.prototype, 'rotationX', {
    set: function(value) {
        this.rotate(value, this.__rotationY, this.__rotationZ);
    },
    get: function() {
        return this.__rotationX;
    }
});

/**
 * The y rotation of the Node in degrees.
 * @type {Number}
 */
Object.defineProperty(AP.Node.prototype, 'rotationY', {
    set: function(value) {
        this.rotate(this.__rotationX, value, this.__rotationZ);
    },
    get: function() {
        return this.__rotationY;
    }
});

/**
 * The z rotation of the Node in degrees.
 * @type {Number}
 */
Object.defineProperty(AP.Node.prototype, 'rotationZ', {
    set: function(value) {
        this.rotate(this.__rotationX, this.__rotationY, value);
    },
    get: function() {
        return this.__rotationZ;
    }
});
