[English](guide.md) | [日本語](guide.jp.md)

# Guide to the tight clothing web page

The tight clothing web page consists of three parts: Scene, Viewport gizmo, and Control panel.

## Scene

<img src="scene.png" alt="scene.png" width="192">

[Scene](https://threejs.org/docs/#Scene) is where 3D objects are placed. By default, a three-headed human body and [AxesHelper](https://threejs.org/docs/#AxesHelper) are placed in the scene. The scene is rendered through [OrthographicCamera](https://threejs.org/docs/#OrthographicCamera). The camera's field of view is adjusted to match the window size. You can control the camera as follows:

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

Every time you operate the control panel, its current state is saved in a state array. To revert to the previous state, press Ctrl+z (Cmd+z on Mac). To advance to the next state, press Shift+Ctrl+z or Ctrl+y (Shift+Cmd+z or Cmd+y on Mac).

The control panel contains the following items.

| Name                                          | Description |
| --------------------------------------------- | ----------- |
| common                                        | Shareable items. |
| --THREE.Scene                                 | A scene in which to place 3D objects.<br>Link: https://threejs.org/docs/#Scene |
| ----background                                | The background color of the scene. |
| --THREE.AxesHelper                            | Axes helper with XYZ axes.<br>Link: https://threejs.org/docs/#AxesHelper |
| ----visible                                   | Whether to display the axes helper. |
| ----size                                      | The length of each line for the axes helper.<br>Step: 0.01 |
| --PlaneHelper                                 |             |
| ----visible                                   |             |
| ----size                                      |             |
| ----color                                     |             |
| --THREE.ArrowHelper                           |             |
| ----visible                                   |             |
| ----length                                    |             |
| ----color                                     |             |
| --THREE.Material                              | The appearance of 3D objects.<br>Link: https://threejs.org/docs/#Material |
| ----body (u=uniforms)                         | The appearance of human body object. This is an original mesh toon material created from a shader material.<br>Link: https://threejs.org/docs/#ShaderMaterial |
| ------wireframe                               | Whether to change the body display to wireframe. |
| ------u.checkShape                            | Whether to change the body display to see the body shape. As the face turns from front to back, the color changes from white to black. |
| ------u.light.x                               | The x-coordinate of the light source for the body.<br>Step: 0.1 |
| ------u.light.y                               | The y-coordinate of the light source for the body.<br>Step: 0.1 |
| ------u.light.z                               | The z-coordinate of the light source for the body.<br>Step: 0.1 |
| ------u.threshold                             | The shade threshold for the body. The larger this value, the larger the area filled with the shade color.<br>Min: 0, Max: 1, Step: 0.01 |
| ------u.baseColor                             | The base color for the body. |
| ------u.shadeColor                            | The shade color for the body. |
| ----area (u=uniforms)                         | The appearance of tight clothing area object. This is an original mesh toon material created from a shader material. The folder structure is the same as "body (u=uniforms)" above.<br>Link: https://threejs.org/docs/#ShaderMaterial |
| PlaneManager                                  |             |
| --addFreePlane                                |             |
| --addVerticalPlane                            |             |
| --removePlane                                 |             |
| --addVerticalPlane curveKey                   |             |
| --removePlane curveKey                        |             |
| --plane[0] {FreePlane}                        |             |
| ----normal                                    |             |
| ------x                                       |             |
| ------y                                       |             |
| ------z                                       |             |
| ----point                                     |             |
| ------x                                       |             |
| ------y                                       |             |
| ------z                                       |             |
| ----inverted                                  |             |
| --plane[1] torso {VerticalPlane}              |             |
| ----u                                         |             |
| ----inverted                                  |             |
| Area                                          |             |
| --thickness                                   |             |
| --intersection loops[0] {FreePlane}           |             |
| ----option                                    |             |
| ----indices                                   |             |
| ------0                                       |             |
| --intersection loops[1] torso {VerticalPlane} |             |
