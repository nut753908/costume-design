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

Every time you operate the control panel, its current state is saved in a state array. To revert to the previous state, press Ctrl+z (Cmd+z on Mac). To advance to the next state, press Shift+Ctrl+z or Ctrl+y (Shift+Cmd+z or Cmd+y on Mac).

The control panel contains the following items.

| Name                    | Description |
| ----------------------- | ----------- |
| common                  | Shareable items. |
| --THREE.Scene           | A scene in which to place 3D objects.<br>Link: https://threejs.org/docs/#Scene |
| ----background          | The background color of the scene. |
| --THREE.AxesHelper      | Axes helper with XYZ axes.<br>Link: https://threejs.org/docs/#AxesHelper |
| ----visible             | Whether to show the axes helper. |
| ----size                | The length of each line for the axes helper.<br>Step: 0.01 |
| --THREE.Material        | The appearance of 3D objects.<br>Link: https://threejs.org/docs/#Material |
| ----points              | The appearance of point objects. This is used for control points.<br>Link: https://threejs.org/docs/#PointsMaterial |
| ------color             | Point color. |
| ------size              | Point size in pixels.<br>Min: 0, Max: 10, Step: 0.01 |
| ------opacity           | Point opacity.<br>Min: 0, Max: 1, Step: 0.01 |
| ----line                | The appearance of line objects. This is used for control points and curves.<br>Link: https://threejs.org/docs/#LineBasicMaterial |
| ------color             | Line color. |
| ------opacity           | Line opacity.<br>Min: 0, Max: 1, Step: 0.01 |
| ----tube_(u=uniforms)   | [WIP] Use [ShaderMaterial](https://threejs.org/docs/#ShaderMaterial). |
| ------wireframe         |             |
| ------u.checkShape      |             |
| ------u.light.x         |             |
| ------u.light.y         |             |
| ------u.light.z         |             |
| ------u.threshold       |             |
| ------u.baseColor       |             |
| ------u.shaderColor     |             |
| TubeGroup               |             |
| --visible               |             |
| ----tube                |             |
| ----axis                |             |
| ----cross               |             |
| ----scaleC              |             |
| ----xScaleC             |             |
| ----yScaleC             |             |
| ----xCurvatureC         |             |
| ----yCurvatureC         |             |
| ----tiltC               |             |
| Tube                    |             |
| --axis                  |             |
| ----addCpToFirst        |             |
| ----addCpToLast         |             |
| ----interpolateCp       |             |
| ----removeCp            |             |
| ----interoplateCp_index |             |
| ----removeCp_index      |             |
| ----cp[0,1,...]         |             |
| ------middle.x          |             |
| ------middle.y          |             |
| ------middle.z          |             |
| ------left.x            |             |
| ------left.y            |             |
| ------left.z            |             |
| ------right.x           |             |
| ------right.y           |             |
| ------right.z           |             |
| ------isSyncRadius      |             |
| ------isSyncAngle       |             |
| ------local             |             |
| --------left.radius     |             |
| --------left.Ax         |             |
| --------left.Ay         |             |
| --------left.Az         |             |
| --------right.radius    |             |
| --------right.Ax        |             |
| --------right.Ay        |             |
| --------right.Az        |             |
| --cross                 |             |
| ----addCpToFirst        |             |
| ----addCpToLast         |             |
| ----interpolateCp       |             |
| ----removeCp            |             |
| ----interoplateCp_index |             |
| ----removeCp_index      |             |
| ----cp[0,1,...]         |             |
| ------middle.x          |             |
| ------middle.y          |             |
| ------left.x            |             |
| ------left.y            |             |
| ------right.x           |             |
| ------right.y           |             |
| ------isSyncRadius      |             |
| ------isSyncAngle       |             |
| ------local             |             |
| --------left.radius     |             |
| --------left.angle      |             |
| --------right.radius    |             |
| --------right.angle     |             |
| --axisSegments          |             |
| --crossSegments         |             |
| --scaleN                |             |
| --xScaleN               |             |
| --yScaleN               |             |
| --xCurvatureN           |             |
| --yCurvatureN           |             |
| --tiltN                 |             |
| --scaleC                |             |
| --xScaleC               |             |
| --yScaleC               |             |
| --xCurvatureC           |             |
| --yCurvatureC           |             |
| --curvatureOrder        |             |
