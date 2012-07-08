#Axonometric Projection Engine

A simple, lightweight 2.5D [Axonometric](wiki) Projection Engine (**APE**). A demo of **APE** in action can be found [here](demo).

* **APE** consists of just 2 components - **Scene** & **Nodes**:

		var myScene = new AP.Scene();
		var myNode = new AP.Node();

* A **Node** can be added as a **child** to a **Scene**, or to another **Node**: 

		myScene.addChild(myNode);
		myParentNode.addChild(myChildNode);

* A **Scene** can be both **rotated** & **pitched**:
		
		myScene.rotate(45);
		myScene.pitch(35);

* A **Node** can be **translated**, **rotated** & **scaled**:

		// Transformation methods
		myNode.translate(50, 200, 0);
		myNode.rotate(45, 90, 0);
		myNode.scale(0.5, 2, 1);

		// Transformation properties		
		myNode.x = 100;
		myNode.y = 200;
		myNode.z = 300;
		myNode.scaleX = 2;
		myNode.scaleY = 2;
		myNode.scaleZ = 2;
		myNode.rotationX = 45;
		myNode.rotationY = 15;
		myNode.rotationZ = 145;

* Nested **Nodes** inherit their **parent's transformations**.
* **Nodes** can also be configured to rotate about their **local** coordinate space. This property is useful for *walking* or *flying* Nodes around a **Scene**:
		
		myNode.localRotation = true;

* **Nodes** are projected from their **3D Scene** coordinate to a **2D Screen** coordinate by calling:
		
		// Project a single Node instance
		myNode.project();

		// Recursively loop through all Nodes in a Scene, calling project() on each of them
		myScene.projectNodes();
		
* Once projected, you can use the **Node's** **.px** and **.py** properties:
		
		// Position a DOM element
		myElement.style.left = myNode.px + 'px';
		myElement.style.top = myNode.py + 'px';
		
		Draw a line to a canvas
		myCanvasContext.drawLine(myNode.px, myNode.py);

* **Nodes** can also be sorted by **z-depth**:

		myScene.sortNodes();
		
* This method calculates and incrementally sets the zIndex property on every **Node** in a **Scene** so that you can easily set a DOM element’s **z-index** property:

		myElement.style.zIndex = myNode.zIndex;

* In special cases, you may want to take control over the **z-order** of **Nodes** that have **equal z-depths**. To accomplish this, **Nodes** have a **z-priority** property that can be assigned like so:

		myForegroundNode.zPriority = 1;
		myBackgroundNode.zPriority = 0;

* This configuration would result in **myForegroundNode** always having a higher **zIndex** than **myBackgroundNode** when their **zDepths** are **equal**.
* Furthermore, you can also manipulate the calculated **zDepth** property of each **Node** by specifying a value for the **z-offset** property:

		myNode.zOffset = 100;

* This would add an additional *100 units* to the calculated **z-depth** value, *pushing* the **Node** up the stack when sorting **Nodes** in the **Scene**.

##Example:

```javascript
// Create instance variables.
var canvas = document.getElementById('canvas');
var canvasWidth = parseInt(canvas.attributes.width.value, 10);
var canvasHeight = parseInt(canvas.attributes.height.value, 10);
var context = canvas.getContext('2d');
var scene = new APE.Scene();
var nodeA = new APE.Node();
var nodeB = new APE.Node();

// Configure the scene.
scene.setOrigin(canvasWidth/2, canvasHeight/2);
scene.rotate(45);
scene.pitch(30);

// Configure the display hierarchy.
scene.addChild(nodeA);
nodeA.addChild(nodeB);

// Transform the nodes.
nodeA.x = 50;
nodeA.rotate(20, 45, 0);
nodeB.translate(0, 100, 50);
nodeB.scaleY = 2;

// Project the nodes in the scene.
scene.projectNodes();

// Draw the result to the canvas.
context.moveTo(scene.origin.x, scene.origin.y);
context.lineTo(nodeA.px, nodeA.py);
context.lineTo(nodeB.px, nodeB.py);
context.stroke();
```

For a more complex example of what can be done, check out the demo [here](demo).

##Author:

Matthew Wagerfield: [@mwagerfield](twitter)

##License

Licensed under [MIT](mit). Enjoy.

[demo]: http://matthewwagerfield.github.com/ape/
[wiki]: http://en.wikipedia.org/wiki/Axonometric_projection
[twitter]: http://twitter.com/mwagerfield
[mit]: http://www.opensource.org/licenses/mit-license.php