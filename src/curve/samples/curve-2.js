import * as THREE from "three";

import { Curve2 } from "../curve-2.js";
import { ControlPoint2 } from "../control-point-2.js";

/**
 * Use Curve2 to create a circle.
 *
 * @param {number} radius
 * @returns {Curve2}
 */
function createCircleCurve2(radius = 1) {
  const K = (4 * (Math.sqrt(2) - 1)) / 3;
  const mulKR = K * radius; // Multiple K by the radius.
  return new Curve2([
    new ControlPoint2(
      new THREE.Vector2(0, -radius),
      new THREE.Vector2(-mulKR, -radius),
      new THREE.Vector2(mulKR, -radius)
    ),
    new ControlPoint2(
      new THREE.Vector2(radius, 0),
      new THREE.Vector2(radius, -mulKR),
      new THREE.Vector2(radius, mulKR)
    ),
    new ControlPoint2(
      new THREE.Vector2(0, radius),
      new THREE.Vector2(mulKR, radius),
      new THREE.Vector2(-mulKR, radius)
    ),
    new ControlPoint2(
      new THREE.Vector2(-radius, 0),
      new THREE.Vector2(-radius, mulKR),
      new THREE.Vector2(-radius, -mulKR)
    ),
    new ControlPoint2(
      new THREE.Vector2(0, -radius),
      new THREE.Vector2(-mulKR, -radius),
      new THREE.Vector2(mulKR, -radius)
    ),
  ]);
}
export const circleCurve2 = createCircleCurve2();
export const smallCircleCurve2 = createCircleCurve2(0.5);

/**
 * Create a slowly varying Curve2.
 *
 * @param {number} yStart - The starting y value.
 * @param {number} yEnd - The ending y value.
 * @param {number} aspect - The aspect ratio = (x height) / (y height).
 * @returns {Curve2}
 */
function createGentlyCurve2(yStart = 1, yEnd = 2, aspect = 3) {
  const hL = Math.abs(yStart - yEnd); // The handle length.
  const xL = aspect * hL; // The x length.
  return new Curve2([
    new ControlPoint2(
      new THREE.Vector2(0, yStart),
      new THREE.Vector2(-hL, yStart),
      new THREE.Vector2(hL, yStart)
    ),
    new ControlPoint2(
      new THREE.Vector2(xL, yEnd),
      new THREE.Vector2(-hL + xL, yEnd),
      new THREE.Vector2(hL + xL, yEnd)
    ),
  ]);
}
export const gentlyRisingCurve2 = createGentlyCurve2();
export const gentlyDescendingCurve2 = createGentlyCurve2(2, 1);
export const gentlyRisingCurve2InRadian = createGentlyCurve2(0, Math.PI);
export const gentlyDescendingCurve2InRadian = createGentlyCurve2(Math.PI, 0);
