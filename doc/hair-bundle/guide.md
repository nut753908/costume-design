[English](guide.md) | [日本語](guide.jp.md)

# Guide to the hair bundle web page

The hair bundle web page consists of three parts: Scene, Viewport gizmo, and Control panel.

## Scene

<img src="scene.png" alt="scene.png" width="192">

[Scene](https://threejs.org/docs/#Scene) is where 3D objects are placed. By default, a light brown cylinder and [AxesHelper](https://threejs.org/docs/#AxesHelper) are placed in the scene. The scene is rendered through [OrthographicCamera](https://threejs.org/docs/#OrthographicCamera). The camera's field of view is adjusted to match the window size. You can control the camera as follows:

- Drag the left mouse button to rotate around the pivot point. The camera always points towards the pivot point. By default, the pivot point is the origin.
- Drag the right mouse button to move parallel to the screen.
- Roll the mouse wheel to zoom in/out.

These camera controls come from [OrbitControls](https://threejs.org/docs/#OrbitControls).

## Viewport gizmo

<img src="viewport-gizmo.png" alt="viewport-gizmo.png" width="80">

The viewport gizmo is a library called [THREE Viewport Gizmo](https://fennec-hub.github.io/three-viewport-gizmo/). The viewport gizmo displays the XYZ directions. Clicking on the X,Y,Z circles or the blank -X,-Y,-Z circles will rotate the camera in that direction, just like dragging the left mouse button in the scene. 

## Control panel

<img src="control-panel.png" alt="control-panel.png" width="55">

The control panel is a library called [lil-gui](https://lil-gui.georgealways.com/). The control panel consists of folders and controllers. A folder can contain folders and controllers. Clicking a folder opens or closes it, showing or hiding its contents. A controller can be a dropdown, checkbox, text field, number field, color field, or button.

Number fields can also be modified by dragging the left mouse button or by pressing the up or down arrow keys when the field has focus. While making changes using these methods, holding down the Shift key increases the value step size, and holding down the Alt key decreases the value step size.

This web page contains the operation history of the control panel. To undo your last action, press Ctrl+z (Cmd+z on Mac). To redo an action you have undone, press Shift+Ctrl+z or Ctrl+y (Shift+Cmd+z or Cmd+y on Mac).

