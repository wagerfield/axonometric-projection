#Axonometric Projection

If you haven't seen the demo, you probably should. You can find it [here](http://matthewwagerfield.github.com/Axonometric-Projection/).

##What is it?

A simple, lightweight 2.5D [axonometric](http://en.wikipedia.org/wiki/Axonometric_projection) projection engine consisting of just 2 components - a **Scene**: `var myScene = new AP.Scene();` & **Nodes**: `var myNode = new AP.Node();`.

* A **Node** can be added as a **child** to a **Scene**: `myScene.addChild(myNode);`, or to another **Node**: `myParentNode.addChild(myChildNode);`.
* A **Scene** can be both **rotated**: `myScene.rotate(45);` and **pitched**: `myScene.pitch(35);`. This would give you an isometric scene.
* A **Node** can be **translated**: `myNode.translate(50, 200, 0);`, **rotated**: `myNode.rotate(45, 90, 0);` and **scaled**: `myNode.scale(0.5, 2, 1);`. Each of these **9 transformtion** properties can also be set directly on the **Node** such that: `myNode.x = 100; myNode.scaleY = 2; myNode.rotationZ = 45;`.
* **Nodes** can also be configured to rotate about their **local** coordinate space by setting: `myNode.localRotation = true;`. This is useful for *walking* or *flying* Nodes around a **Scene**.
* Nested **Nodes** inherit their **parent's transformations**.
* **Nodes** are projected from their **3D Scene coordinate** to a **2D Screen coordinate** by calling either: `myScene.projectNodes();` - which recursively loops through and calls `.project();` on all the **Nodes** in the **Scene**, or `myNode.project();` - which calculates the projected coordinates for just that **Node**.
* Once projected, you can use the **Node's** **.px** and **.py** properties to position your **element**: `myElement.style.left = myNode.px + 'px';` or draw a line to a **canvas**: `myCanvasContext.drawLine(myNode.px, myNode.py);`.
* **Nodes** can also be sorted by **z-depth**: `myScene.sortNodes();`, so you can easily set a DOM element’s **z-index** from a calculated property: `myElement.style.zIndex = myNode.zIndex;`. In special cases, you may want to take control over the **z-order** of **Nodes** that have **equal z-depths**. To accomplish this, **Nodes** have a **z-priority** property that can be assigned like so: `myForegroundNode.zPriority = 1; myBackgroundNode.zPriority = 0;`. This configuration would result in **myForegroundNode** always having a higher **zIndex** than **myBackgroundNode** when their **zDepths** are **equal**.

##Example:

```javascript
// Create instance variables.
var canvas = document.getElementById('canvas');
var canvasWidth = parseInt(canvas.attributes.width.value, 10);
var canvasHeight = parseInt(canvas.attributes.height.value, 10);
var context = canvas.getContext('2d');
var scene = new AP.Scene();
var nodeA = new AP.Node();
var nodeB = new AP.Node();

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

For a more complex example of what can be done, check out the demo [here](http://matthewwagerfield.github.com/Axonometric-Projection/), and the source [here](https://github.com/MatthewWagerfield/Axonometric-Projection/tree/gh-pages/).

##Author:

Matthew Wagerfield: [@mwagerfield](https://twitter.com/#!/mwagerfield)

##License

Licensed under [MIT](http://www.opensource.org/licenses/mit-license.php). Enjoy.