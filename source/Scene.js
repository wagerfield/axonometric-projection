/**
 * @class Creates a Scene for Nodes to exist within.
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
    this.__rotationAngle = 0;

    /**
     * The sine value for the rotation.
     * @type {Number}
     */
    this.__sinRotation = 0;

    /**
     * The cosine value for the rotation.
     * @type {Number}
     */
    this.__cosRotation = 0;

    /**
     * The pitch angle of the Scene.
     * @type {Number}
     */
    this.__pitchAngle = 0;

    /**
     * The pitch ratio of the Scene.
     * @type {Number}
     */
    this.__pitchRatio = 0;

    /**
     * The y ratio of the Scene.
     * @type {Number}
     */
    this.__yRatio = 0;

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

        this.__pitchAngle = AP.Math.degreesToRadians(degrees);
        this.__pitchRatio = Math.sin(this.__pitchAngle);
        this.__yRatio = Math.cos(this.__pitchAngle);
    },

    /**
     * Sets the rotation of the Scene in degrees.
     * @this {AP.Scene}
     *
     * @param {Number} degrees The angle to rotate the Scene to.
     */
    rotate: function(degrees) {

        this.__rotationAngle = AP.Math.degreesToRadians(degrees);
        this.__sinRotation = Math.sin(this.__rotationAngle);
        this.__cosRotation = Math.cos(this.__rotationAngle);
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
