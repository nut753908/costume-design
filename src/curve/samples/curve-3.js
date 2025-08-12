import * as THREE from "three";

import { Curve3 } from "../curve-3.js";
import { ControlPoint3 } from "../control-point-3.js";

export const screwShapedCurve3 = new Curve3([
  new ControlPoint3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 0)
  ),
  new ControlPoint3(
    new THREE.Vector3(2, 0, 2),
    new THREE.Vector3(2, 0, 1),
    new THREE.Vector3(2, 0, 3)
  ),
  new ControlPoint3(
    new THREE.Vector3(2, 2, 4),
    new THREE.Vector3(2, 1, 4),
    new THREE.Vector3(2, 3, 4)
  ),
  new ControlPoint3(
    new THREE.Vector3(4, 4, 4),
    new THREE.Vector3(3, 4, 4),
    new THREE.Vector3(5, 4, 4)
  ),
]);

export const constant0Curve3 = new Curve3([
  new ControlPoint3(
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0, 0.75, 0),
    new THREE.Vector3(0, 0.25, 0)
  ),
  new ControlPoint3(
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0, -0.25, 0),
    new THREE.Vector3(0, -0.75, 0)
  ),
]);
