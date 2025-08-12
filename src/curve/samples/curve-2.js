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
 * @param {number} aspect - The aspect ratio = (x length) / (y length).
 * @returns {Curve2}
 */
function createGentlyCurve2(yStart = 1, yEnd = 2, aspect = 3) {
  const yL = Math.abs(yStart - yEnd); // The y length.
  const xL = aspect * yL; // The x length.
  return new Curve2([
    new ControlPoint2(
      new THREE.Vector2(0, yStart),
      new THREE.Vector2(-yL, yStart),
      new THREE.Vector2(yL, yStart)
    ),
    new ControlPoint2(
      new THREE.Vector2(xL, yEnd),
      new THREE.Vector2(-yL + xL, yEnd),
      new THREE.Vector2(yL + xL, yEnd)
    ),
  ]);
}
export const gentlyRisingCurve2 = createGentlyCurve2();
export const gentlyDescendingCurve2 = createGentlyCurve2(2, 1);
export const gentlyRisingCurve2InRadians = createGentlyCurve2(0, Math.PI);
export const gentlyDescendingCurve2InRadians = createGentlyCurve2(Math.PI, 0);

/**
 * Create a constant Curve2.
 *
 * @param {number} y - The y value.
 * @param {number} xL - The x length.
 * @returns {Curve2}
 */
function createConstantCurve2(y = 1, xL = 3) {
  const hL = Math.floor(xL / 3); // The handle length.
  return new Curve2([
    new ControlPoint2(
      new THREE.Vector2(0, y),
      new THREE.Vector2(-hL, y),
      new THREE.Vector2(hL, y)
    ),
    new ControlPoint2(
      new THREE.Vector2(xL, y),
      new THREE.Vector2(xL - hL, y),
      new THREE.Vector2(xL + hL, y)
    ),
  ]);
}
export const constant1Curve2 = createConstantCurve2();
export const constant0Curve2 = createConstantCurve2(0);
