[English](tutorial.md) | [日本語](tutorial.jp.md)

# Tutorial

This tutorial will show you how to create a simple hair bundle on the hair bundle web page.

## Steps

First, open [the hair bundle web page](https://nut753908.github.io/costume-design/hair-bundle.html) in a new tab or new window. You will see a screen like this:

![0.png](0.png)

<br>

Check the "common > THREE.Material > tube (u=uniforms) > wireframe" checkbox to enable the wireframe display for the tube.

![1-1.png](1-1.png)

<br>

Set the value of "Tube > axisSegments" to 40 to increase the number of faces along the tube axis. Next, set the value of "Tube > crossSegments" to 20 to increase the number of faces in the tube cross-section.

![1-2.png](1-2.png)

<br>

Set the value of "Tube > xScaleN" to 0.2 to reduce the x-scale of the tube cross-section. In reality, the z-scale of the tube cross-section appears to be reduced. Next, set the value of "Tube > yScaleN" to 0.02 to reduce the y-scale of the tube cross-section. In reality, the x-scale of the tube cross-section appears to be reduced.

![1-3.png](1-3.png)

<br>

Set the value of "Tube > yCurvatureN" to -4 to curve the tube cross-section in the -y direction. In reality, the tube cross-section appears to curve in the -x direction.

![1-4.png](1-4.png)

<br>

Uncheck the "common > THREE.Material > tube (u=uniforms) > wireframe" checkbox to disable the wireframe display for the tube.

![1-5.png](1-5.png)

<br>

Check the "TubeGroup > visible > scaleC" checkbox to display the scale curve for the tube cross-section. Roll the mouse wheel to zoom out so that the entire scale curve is visible.

![2-1.png](2-1.png)

<br>

Select the "Tube > scaleC > interpolateCp" button to add an interpolated control point between the two control points.

![2-2.png](2-2.png)

<br>

Check the "Tube > scaleC > cp0 > isSyncRadius" checkbox. Then, set the value of "Tube > scaleC > cp0 > middle.y" to 0, set the value of "Tube > scaleC > cp0 > local > left.radius" to 0.75, and set the value of "Tube > scaleC > cp0 > local > left.angle" to 270. As a result, the tube cross-section gradually tapers from the center toward the top.

![2-3.png](2-3.png)

<br>

Set the value of "Tube > scaleC > cp1 > local > left.radius" to 0.75 for a more gradual taper.

![2-4.png](2-4.png)

<br>

Check the "Tube > scaleC > cp2 > isSyncRadius" checkbox. Then, set the value of "Tube > scaleC > cp2 > middle.y" to 0, set the value of "Tube > scaleC > cp2 > local > left.radius" to 0.75, and set the value of "Tube > scaleC > cp2 > local > left.angle" to 90. As a result, the tube cross-section gradually tapers from the center toward the bottom.

![2-5.png](2-5.png)

<br>

Roll the mouse wheel to return to the default zoom level. Uncheck the "TubeGroup > visible > scaleC" checkbox to hide the scale curve for the tube cross-section. Check the "TubeGroup > visible > axis" checkbox to display the tube axis curve.

![3-1.png](3-1.png)

<br>

Set the value of "Tube > axis > cp0 > local > left.radius" to 0.5 and set the value of "Tube > axis > cp0 > local > left.Az" to 180. As a result, the tube bulges from the top toward the right.

![3-2.png](3-2.png)

<br>

Set the value of "Tube > axis > cp1 > local > left.radius" to 0.3 to smoothly connect the curve to the bottom.

![3-3.png](3-3.png)

<br>

Uncheck the "TubeGroup > visible > axis" checkbox to hide the tube axis curve. Now your simple hair bundle is complete.

![4-1.png](4-1.png)

<br>

View from the +x direction:

![4-2.png](4-2.png)
