import * as THREE from "three";

import { Curve2 } from "../curve-2.js";
import { ControlPoint2 } from "../control-point-2.js";

export const semicircleCurve2 = new Curve2([
  new ControlPoint2(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(-1, 0),
    new THREE.Vector2(1, 0)
  ),
  new ControlPoint2(
    new THREE.Vector2(2, 2),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2, 3)
  ),
  new ControlPoint2(
    new THREE.Vector2(0, 4),
    new THREE.Vector2(1, 4),
    new THREE.Vector2(-1, 4)
  ),
]);

export const gentlyRisingCurve2 = new Curve2([
  new ControlPoint2(
    new THREE.Vector2(0, 1),
    new THREE.Vector2(-1, 1),
    new THREE.Vector2(1, 1)
  ),
  new ControlPoint2(
    new THREE.Vector2(3, 2),
    new THREE.Vector2(2, 2),
    new THREE.Vector2(4, 2)
  ),
]);

export const gentlyDescendingCurve2 = new Curve2([
  new ControlPoint2(
    new THREE.Vector2(0, 2),
    new THREE.Vector2(-1, 2),
    new THREE.Vector2(1, 2)
  ),
  new ControlPoint2(
    new THREE.Vector2(3, 1),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(4, 1)
  ),
]);
