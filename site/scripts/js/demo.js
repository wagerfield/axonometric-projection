/**
 * @class Axonometric Projection Demo.
 * @author Matthew Wagerfield
 * @see http://twitter.com/mwagerfield
 */
var Demo = (function() {

    var container = document.getElementById('container');
    var origin = document.getElementById('origin');
    var controls = document.getElementById('controls');
    var canvas = document.getElementById('canvas');
    var nodes = document.getElementById('nodes');
    var nodeItems = nodes.children;
    var context = canvas.getContext('2d');
    var gui = new dat.GUI({autoPlace: false});
    var originNode = new AP.Node('origin');
    var helperNode = new AP.Node('helper');
    var scene = new AP.Scene();
    var request = null;

    //----------------------------------------
    // Layout
    //----------------------------------------

    var layout = {
        width: 0,
        height: 0,
        origin: {
            x: 0,
            y: 0
        }
    };

    //----------------------------------------
    // Store
    //----------------------------------------

    var store = {
        rotation: 0,
        pitch: 0,
        downX: 0,
        downY: 0,
        deltaX: 0,
        deltaY: 0,
        dragging: false,
        raf: {
            enabled: false,
            keys: {}
        }
    };

    //----------------------------------------
    // Grid
    //----------------------------------------

    var grid = {
        UNIT: 30,
        COUNT: 20,
        SIZE: null,
        OFFSET: null,
        MAJOR: 10,
        MINOR: 2,
        origin: new AP.Node('grid')
    };

    //----------------------------------------
    // Cube
    //----------------------------------------

    var cube = {
        SIZE: 480,
        CORNER: 120,
        origin: new AP.Node('cube'),
        corners: [
            new AP.Node('0'),
            new AP.Node('1'),
            new AP.Node('2'),
            new AP.Node('3'),
            new AP.Node('4'),
            new AP.Node('5'),
            new AP.Node('6'),
            new AP.Node('7')
        ]
    };

    //----------------------------------------
    // Tyre
    //----------------------------------------

    var tyre = {
        RINGS: 20,
        SEGMENTS: 20,
        RING_STEP: 0,
        SEGMENT_STEP: 0,
        START_ANGLE: 0,
        origin: new AP.Node('sphere'),
        pivot: new AP.Node('pivot'),
        arm: new AP.Node('arm'),
        offset: new AP.Node('offset'),
        twistStep: 0,
        pinchStep: 0,
        innerStep: 0,
        outerStep: 0,
        offsetStep: 0,
        xStep: 0,
        yStep: 0,
        zStep: 0
    };

    //----------------------------------------
    // Properties
    //----------------------------------------

    var properties = {
        elements: {
            opacity: 0.75
        },
        scene: {
            tumble: false,
            rotation: 30,
            pitch: 30,
            scale: 1
        },
        cube: {
            localRotation: false,
            x: 0,
            y: cube.SIZE/2,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1
        },
        tyre: {
            tumble: false,
            warp: false,
            resolution: 2,
            twist: 5,
            pinch: 0.8,
            offset: 0.8,
            innerRadius: 60,
            outerRadius: 180
        }
    };

    //----------------------------------------
    // GUI, Controllers & Folders
    //----------------------------------------

    var folders = {
        elements: gui.addFolder('Elements'),
        scene: gui.addFolder('Scene'),
        container: gui.addFolder('Container'),
        tyre: gui.addFolder('Tyre')
    };

    var controllers = {
        elements: {
            opacity: folders.elements.add(properties.elements, 'opacity', 0, 1)
        },
        scene: {
            tumble: folders.scene.add(properties.scene, 'tumble'),
            pitch: folders.scene.add(properties.scene, 'pitch', -180, 180),
            rotation: folders.scene.add(properties.scene, 'rotation', -180, 180),
            scale: folders.scene.add(properties.scene, 'scale', 0.5, 2.0)
        },
        container: {
            localRotation: folders.container.add(properties.cube, 'localRotation', false),
            x: folders.container.add(properties.cube, 'x', -300, 300),
            y: folders.container.add(properties.cube, 'y', -300, 300),
            z: folders.container.add(properties.cube, 'z', -300, 300),
            rotationX: folders.container.add(properties.cube, 'rotationX', -180, 180),
            rotationY: folders.container.add(properties.cube, 'rotationY', -180, 180),
            rotationZ: folders.container.add(properties.cube, 'rotationZ', -180, 180),
            scaleX: folders.container.add(properties.cube, 'scaleX', 0.5, 2.0),
            scaleY: folders.container.add(properties.cube, 'scaleY', 0.5, 2.0),
            scaleZ: folders.container.add(properties.cube, 'scaleZ', 0.5, 2.0)
        },
        tyre: {
            tumble: folders.tyre.add(properties.tyre, 'tumble', false),
            warp: folders.tyre.add(properties.tyre, 'warp', false),
            resolution: folders.tyre.add(properties.tyre, 'resolution', {Low: 1, Medium: 2, High: 3}),
            twist: folders.tyre.add(properties.tyre, 'twist', -10, 10),
            pinch: folders.tyre.add(properties.tyre, 'pinch', 0, 1),
            offset: folders.tyre.add(properties.tyre, 'offset', -200, 200),
            innerRadius: folders.tyre.add(properties.tyre, 'innerRadius', 0, 120),
            outerRadius: folders.tyre.add(properties.tyre, 'outerRadius', 160, 240)
        }
    };

    //----------------------------------------
    // Callbacks
    //----------------------------------------

    var callbacks = {

        onWindowResize: function(event) {

            resize();
        },

        onMouseDown: function(event) {

            store.dragging = true;
            store.downX = event.pageX;
            store.downY = event.pageY;
            store.pitch = properties.scene.pitch;
            store.rotation = properties.scene.rotation;

            container.classList.add('dragging');
            canvas.classList.add('dragging');

            window.addEventListener('mousemove', callbacks.onMouseMove);
            window.addEventListener('mouseup', callbacks.onMouseUp);
        },

        onMouseMove: function(event) {

            store.deltaX = event.pageX - store.downX;
            store.deltaY = event.pageY - store.downY;

            properties.scene.pitch = store.pitch + store.deltaY * 0.5;
            properties.scene.rotation = store.rotation - store.deltaX * 0.5;

            if (!store.raf.enabled) update();
        },

        onMouseUp: function(event) {

            window.removeEventListener('mousemove', callbacks.onMouseMove);
            window.removeEventListener('mouseup', callbacks.onMouseUp);

            container.classList.remove('dragging');
            canvas.classList.remove('dragging');

            store.dragging = false;

            if (!store.raf.enabled) update();
        },

        onElementsChange: function(value) {

            nodes.style.opacity = properties.elements.opacity;
        },

        onSceneChange: function(value) {

            originNode.scale(
                properties.scene.scale,
                properties.scene.scale,
                properties.scene.scale);

            if (!store.raf.enabled) update();

            raf('scene-tumble', properties.scene.tumble);
        },

        onTyreChange: function(value) {

            updateTyre();
            
            if (!store.raf.enabled) update();

            raf('tyre-tumble', properties.tyre.tumble);
            raf('tyre-warp', properties.tyre.warp);
        },

        onCubeChange: function(value) {

            cube.origin.localRotation = properties.cube.localRotation;

            cube.origin.translate(
                properties.cube.x,
                properties.cube.y,
                properties.cube.z);

            cube.origin.scale(
                properties.cube.scaleX,
                properties.cube.scaleY,
                properties.cube.scaleZ);

            cube.origin.rotate(
                properties.cube.rotationX,
                properties.cube.rotationY,
                properties.cube.rotationZ);

            if (!store.raf.enabled) update();
        },

        onCubeFinishChange: function(value) {

            if (cube.origin.localRotation) {

                properties.cube.rotationX = cube.origin._rotationX = 0;
                properties.cube.rotationY = cube.origin._rotationY = 0;
                properties.cube.rotationZ = cube.origin._rotationZ = 0;

                controllers.container.rotationX.updateDisplay();
                controllers.container.rotationY.updateDisplay();
                controllers.container.rotationZ.updateDisplay();
            }
        }
    };

    /**
     * Updates the scene dimensions to the window bounds.
     * @this {demo}
     */
    function resize() {
        
        layout.width = window.innerWidth - 240;
        layout.height = window.innerHeight;
        layout.origin.x = Math.round(layout.width * 0.50);
        layout.origin.y = Math.round(layout.height * 0.7);
        
        canvas.attributes.width.value = layout.width;
        canvas.attributes.height.value = layout.height;

        scene.setOrigin(layout.origin.x, layout.origin.y);

        update();
    }

    /**
     * Enables or disables requestAnimationFrame for a given key.
     * @this {demo}
     *
     * @param {String} key The key to set the value against.
     * @param {Boolean} value Whether or not to enable requestAnimationFrame.
     */
    function raf(key, value) {
        
        var enable = false;
       
        store.raf.keys[key] = value;
        for (var i in store.raf.keys) {
            if (store.raf.keys[i]) {
                enable = true;
                break;
            }
        }

        if (store.raf.enabled !== enable) {
            store.raf.enabled = enable;
            if (enable) {
                request = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(request);
            }
        }
    }

    /**
     * Updates the scene components.
     * @this {demo}
     */
    function update() {

        // If enabled, continue to call requestAnimationFrame.
        if (store.raf.enabled) {
            request = requestAnimationFrame(update);
        }

        // Step the pitch and rotation if the GUI tumble checkbox is checked.
        if (properties.scene.tumble && !store.dragging) {
            properties.scene.rotation += 0.4;
            properties.scene.pitch += 0.8;
        }

        // Step the tyre rotation values if the tumble checkbox is checked.
        if (properties.tyre.tumble) {
            tyre.xStep += 1.0;
            tyre.yStep += 1.0;
            tyre.zStep -= 0.5;
            tyre.origin.rotate(tyre.xStep, tyre.yStep, tyre.zStep);
        }

        // Step the tyre manipulation values if the warp checkbox is checked.
        if (properties.tyre.warp) {
            tyre.twistStep += 0.02;
            tyre.pinchStep += 0.03;
            tyre.offsetStep += 0.04;
            tyre.innerStep += 0.03;
            tyre.outerStep += 0.04;
            properties.tyre.twist = Math.sin(tyre.twistStep) * 10;
            properties.tyre.pinch = 0.5 + Math.sin(tyre.pinchStep) * 0.5;
            properties.tyre.offset = Math.sin(tyre.offsetStep) * 200;
            properties.tyre.innerRadius = (0.5 + Math.cos(tyre.innerStep) * 0.5) * 120;
            properties.tyre.outerRadius = 160 + (0.5 + Math.sin(tyre.outerStep) * 0.5) * 80;
            controllers.tyre.twist.updateDisplay();
            controllers.tyre.pinch.updateDisplay();
            controllers.tyre.offset.updateDisplay();
            controllers.tyre.innerRadius.updateDisplay();
            controllers.tyre.outerRadius.updateDisplay();
            updateTyre();
        }

        // Clamp the rotation and pitch values for the GUI sliders.
        properties.scene.rotation = clamp(properties.scene.rotation, -180, 180);
        properties.scene.pitch = clamp(properties.scene.pitch, -180, 180);

        // Update the GUI sliders.
        if (properties.scene.tumble || store.dragging) {
            controllers.scene.rotation.updateDisplay();
            controllers.scene.pitch.updateDisplay();
        }

        // Update the Scene.
        scene.rotate(properties.scene.rotation);
        scene.pitch(properties.scene.pitch);
        scene.projectNodes();
        scene.sortNodes();

        // Update the DOM elements.
        origin.style.left = originNode.px + 'px';
        origin.style.top = originNode.py + 'px';
        origin.style.zIndex = originNode.zIndex;

        for (var i = 0, l = nodeItems.length; i < l; i++) {
            nodeItems[i].style.left = Math.round(cube.corners[i].px) + 'px';
            nodeItems[i].style.top = Math.round(cube.corners[i].py) + 'px';
            nodeItems[i].style.zIndex = cube.corners[i].zIndex;
        }

        // Draw the scene!
        draw();
    }

    /**
     * Draws scene models to the canvas.
     * @this {demo}
     */
    function draw() {

        clear();
        drawGrid();
        drawTyre();
        drawCube();
    }

    /**
     * Clears the canvas.
     * @this {demo}
     */
    function clear() {

        context.clearRect(0, 0, layout.width, layout.height);
    }

    /**
     * Draws the grid.
     * @this {demo}
     */
    function drawGrid() {

        var i = 0,
            isMinor = false,
            isMajor = false,
            lineWidth = null,
            strokeStyle = null;

        // Reset and add the helper Node to the Grid.
        grid.origin.addChild(helperNode);
        helperNode.reset();

        for (i = 0; i <= grid.COUNT; i++) {

            isMajor = i % grid.MAJOR === 0 && i !== 0 && i !== grid.COUNT;
            isMinor = i % grid.MINOR === 0;

            context.beginPath();

            if (isMajor) {
                drawGridLine(helperNode, grid.OFFSET + i * grid.UNIT, 0, 60);
                strokeStyle = '#444';
                lineWidth = 1;
            } else if (isMinor) {
                drawGridLine(helperNode, grid.OFFSET + i * grid.UNIT, 10, 15);
                strokeStyle = '#555';
                lineWidth = 0.5;
            } else {
                drawGridLine(helperNode, grid.OFFSET + i * grid.UNIT, 10, 30);
                strokeStyle = '#888';
                lineWidth = 0.5;
            }

            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.stroke();
        }

        // Remove the helper Node from the Grid.
        grid.origin.removeChild(helperNode);
    }

    /**
     * Draws a grid line.
     * @this {demo}
     */
    function drawGridLine(node, offset, gap, length) {

        var a,b,i,o;

        for (i = 0; i < 2; i++) {

            o = i === 0;
            a = offset;

            b = grid.OFFSET - gap - length;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.moveTo(node.px, node.py);

            b = grid.OFFSET - gap;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.lineTo(node.px, node.py);

            b = grid.OFFSET;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.moveTo(node.px, node.py);

            b = grid.OFFSET + grid.SIZE;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.lineTo(node.px, node.py);

            b = grid.OFFSET + grid.SIZE + gap;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.moveTo(node.px, node.py);

            b = grid.OFFSET + grid.SIZE + gap + length;
            node.translate(o?a:b, 0, o?b:a);
            node.project();
            context.lineTo(node.px, node.py);
        }
    }

    /**
     * Updates the Tyre values.
     * @this {demo}
     */
    function updateTyre() {

        var delta = properties.tyre.outerRadius - properties.tyre.innerRadius,
            half = delta * 0.5,
            armX = properties.tyre.innerRadius + half * properties.tyre.pinch,
            offsetX = delta - half * properties.tyre.pinch,
            warp = properties.tyre.offset * 0.4,
            total = 180 + 180 * properties.tyre.pinch;

        switch (properties.tyre.resolution) {
            case '1':
                tyre.RINGS = 10;
                tyre.SEGMENTS = 10;
                break;
            case '2':
                tyre.RINGS = 20;
                tyre.SEGMENTS = 20;
                break;
            case '3':
                tyre.RINGS = 40;
                tyre.SEGMENTS = 40;
                break;
        }

        tyre.SEGMENT_STEP = 360 / tyre.SEGMENTS;
        tyre.RING_STEP = total / tyre.RINGS;
        tyre.START_ANGLE = total / 2 + warp;
        tyre.arm.translate(armX, 0, 0);
        tyre.offset.translate(offsetX, warp, warp);
        tyre.pivot.translate(0, properties.tyre.offset, 0);
    }

    /**
     * Draws the tyre.
     * @this {demo}
     */
    function drawTyre() {

        var i,j;

        // Draw segments.
        context.beginPath();
        for (i = 0; i < tyre.SEGMENTS; i++) {
            for (j = 0; j <= tyre.RINGS; j++) {
                tyre.pivot.rotate(0, i * tyre.SEGMENT_STEP + j * properties.tyre.twist, 0);
                tyre.arm.rotate(0, 0, tyre.START_ANGLE - tyre.RING_STEP * j);
                tyre.offset.project();
                if (j === 0) context.moveTo(tyre.offset.px, tyre.offset.py);
                else context.lineTo(tyre.offset.px, tyre.offset.py);
            }
        }
        context.strokeStyle = '#ff8095';
        context.lineJoin = 'round';
        context.lineWidth = 1.5;
        context.stroke();

        // Draw rings.
        context.beginPath();
        for (i = 0; i <= tyre.RINGS; i++) {
            for (j = 0; j <= tyre.SEGMENTS; j++) {
                tyre.pivot.rotate(0, j * tyre.SEGMENT_STEP + i * properties.tyre.twist, 0);
                tyre.arm.rotate(0, 0, tyre.START_ANGLE - tyre.RING_STEP * i);
                tyre.offset.project();
                if (j === 0) context.moveTo(tyre.offset.px, tyre.offset.py);
                else context.lineTo(tyre.offset.px, tyre.offset.py);
            }
        }
        context.strokeStyle = '#b38fa7';
        context.lineJoin = 'round';
        context.lineWidth = 1.5;
        context.stroke();
    }

    /**
     * Draws the cube.
     * @this {demo}
     */
    function drawCube() {

        for (var i in cube.corners) {
            cube.corners[i].addChild(helperNode);
            drawCorner(cube.corners[i], helperNode);
            cube.corners[i].removeChild(helperNode);
        }
    }

    /**
     * Draws a corner of the cube.
     * @this {demo}
     *
     * @param {AP.Node} c The corner to draw.
     * @param {AP.Node} h A helper Node.
     */
    function drawCorner(c, h) {

        h.reset();

        context.beginPath();

        h.translate(cube.CORNER, 0, 0);
        h.project();
        context.moveTo(c.px, c.py);
        context.lineTo(h.px, h.py);

        h.translate(0, cube.CORNER, 0);
        h.project();
        context.moveTo(c.px, c.py);
        context.lineTo(h.px, h.py);

        h.translate(0, 0, cube.CORNER);
        h.project();
        context.moveTo(c.px, c.py);
        context.lineTo(h.px, h.py);

        context.strokeStyle = "#fff";
        context.lineCap = 'butt';
        context.lineWidth = 1;
        context.stroke();
    }

    /**
     * Clamps a value within the specified range.
     * @this {demo}
     *
     * @param {Number} value The current value to process.
     * @param {Number} lowerLimit The lower limit value.
     * @param {Number} upperLimit The upper limit value.
     *
     * @return {Number} The clamped value.
     */
    function clamp(value, lowerLimit, upperLimit) {

        var range = Math.abs(lowerLimit) + Math.abs(upperLimit);

        value = value % range;
        if (value > upperLimit) value -= range;
        else if (value < lowerLimit) value += range;

        return value;
    }

    /**
     * Initialised the demo.
     * @this {demo}
     */
    function initialise() {

        var i,j;

        // Configure the Scene.
        scene.rotate(properties.scene.rotation);
        scene.pitch(properties.scene.pitch);

        // Configure the Grid constants.
        grid.SIZE = grid.UNIT * grid.COUNT;
        grid.OFFSET = grid.SIZE * -0.5;

        // Dimensions.
        var O = cube.SIZE / 2;
        var F = 180;
        var H = 90;

        // Configure the Cube.
        cube.origin.translate(0, O, 0);
        cube.corners[0].translate(-O,-O,-O );
        cube.corners[1].translate( O,-O,-O );
        cube.corners[1].rotate   ( 0, H, 0 );
        cube.corners[2].translate( O,-O, O );
        cube.corners[2].rotate   ( 0, F, 0 );
        cube.corners[3].translate(-O,-O, O );
        cube.corners[3].rotate   ( 0,-H, 0 );
        cube.corners[4].translate(-O, O,-O );
        cube.corners[4].rotate   ( F,-H, 0 );
        cube.corners[5].translate( O, O,-O );
        cube.corners[5].rotate   ( 0, 0, F );
        cube.corners[6].translate( O, O, O );
        cube.corners[6].rotate   ( F, H, 0 );
        cube.corners[7].translate(-O, O, O );
        cube.corners[7].rotate   ( F, 0, 0 );

        // Configure the Tyre.
        tyre.origin.scale(1, 1.25, 1);
        tyre.origin.localRotation = true;

        // Configure the display hierarchy.
        scene.addChild(originNode);
        originNode.addChild(grid.origin);
        originNode.addChild(cube.origin);
        for (i in cube.corners) cube.origin.addChild(cube.corners[i]);
        cube.origin.addChild(tyre.origin);
        tyre.origin.addChild(tyre.pivot);
        tyre.pivot.addChild(tyre.arm);
        tyre.arm.addChild(tyre.offset);

        // Configure the DOM Nodes.
        nodes.style.opacity = properties.elements.opacity;

        // Configure the GUI.
        controls.appendChild(gui.domElement);

        // Update the GUI controllers.
        for (i in gui.__folders) {
            for (j in gui.__folders[i].__controllers) {
                gui.__folders[i].__controllers[j].updateDisplay();
            }
        }

        // Add callbacks to the Elements controller.
        controllers.elements.opacity.onChange(callbacks.onElementsChange);

        // Add callbacks to the Scene controller.
        controllers.scene.tumble.onChange(callbacks.onSceneChange);
        controllers.scene.rotation.onChange(callbacks.onSceneChange);
        controllers.scene.pitch.onChange(callbacks.onSceneChange);
        controllers.scene.scale.onChange(callbacks.onSceneChange);

        // Add callbacks to the Container controller.
        controllers.container.localRotation.onChange(callbacks.onCubeChange);
        controllers.container.localRotation.onFinishChange(callbacks.onCubeFinishChange);
        controllers.container.x.onChange(callbacks.onCubeChange);
        controllers.container.y.onChange(callbacks.onCubeChange);
        controllers.container.z.onChange(callbacks.onCubeChange);
        controllers.container.rotationX.onChange(callbacks.onCubeChange);
        controllers.container.rotationX.onFinishChange(callbacks.onCubeFinishChange);
        controllers.container.rotationY.onChange(callbacks.onCubeChange);
        controllers.container.rotationY.onFinishChange(callbacks.onCubeFinishChange);
        controllers.container.rotationZ.onChange(callbacks.onCubeChange);
        controllers.container.rotationZ.onFinishChange(callbacks.onCubeFinishChange);
        controllers.container.scaleX.onChange(callbacks.onCubeChange);
        controllers.container.scaleY.onChange(callbacks.onCubeChange);
        controllers.container.scaleZ.onChange(callbacks.onCubeChange);

        // Add callbacks to the Tyre controller.
        controllers.tyre.tumble.onChange(callbacks.onTyreChange);
        controllers.tyre.warp.onChange(callbacks.onTyreChange);
        controllers.tyre.resolution.onChange(callbacks.onTyreChange);
        controllers.tyre.twist.onChange(callbacks.onTyreChange);
        controllers.tyre.pinch.onChange(callbacks.onTyreChange);
        controllers.tyre.offset.onChange(callbacks.onTyreChange);
        controllers.tyre.innerRadius.onChange(callbacks.onTyreChange);
        controllers.tyre.outerRadius.onChange(callbacks.onTyreChange);

        // Configure the GUI folder states.
        folders.elements.open();
        folders.scene.open();
        folders.container.open();
        folders.tyre.open();

        // Add event listeners.
        window.addEventListener('resize', callbacks.onWindowResize);
        canvas.addEventListener('mousedown', callbacks.onMouseDown);

        updateTyre();
        resize();
    }

    // Return the API
    return {
        initialise: initialise
    };

})();

// Initialise the Demo.
Demo.initialise();
