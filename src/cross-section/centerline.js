import * as THREE from "three";

import { createAllEdgeLoopStacks } from "./edge-loop-stacks";
import { getCentroids } from "./points";
import { objectMap } from "../math/utils";

/**
 * Create the base centerlines.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The base n polygon indices.
 * @param {THREE.BufferAttribute} positions - The results of the base geometry.getAttribute("position").
 * @returns {{[k:string]:THREE.CatmullRomCurve3}} The base centerlines.
 */
export function createBaseCenterlines(nPolygonIndices, positions) {
  const stacks = createAllEdgeLoopStacks(nPolygonIndices);
  if (stacks.length !== 56) return [];
  const list = stacks.map((s) => getCentroids(s.getPoints(positions)));
  const obj = {
    torso: list[0].concat(list[7].toReversed()).slice(0, -1),
    leftArm: list[5].toReversed().concat(list[2]).slice(0, -1),
    leftThumb: list[18].concat(list[46].toReversed()).slice(0, -1),
    leftIndexFinger: list[14],
    leftMiddleFinger: list[12],
    leftRingFinger: list[16],
    leftLittleFinger: list[17],
    leftLeg: list[6].toReversed().slice(1, -1),
    leftFoot: list[10],
    rightArm: list[27].concat(list[26]).slice(0, -1),
    rightThumb: list[38].toReversed().concat(list[53]).slice(0, -1),
    rightIndexFinger: list[34].toReversed(),
    rightMiddleFinger: list[32].toReversed(),
    rightRingFinger: list[36].toReversed(),
    rightLittleFinger: list[37].toReversed(),
    rightLeg: list[28].slice(1, -1),
    rightFoot: list[30].toReversed(),
  };
  obj.torso.unshift(
    new THREE.Vector3()
      .lerpVectors(obj.torso[1], obj.torso[0], 2)
      .multiplyScalar(6)
      .add(obj.leftLeg.slice(-1)[0])
      .add(obj.rightLeg.slice(-1)[0])
      .divideScalar(8)
  );
  // return objectMap(obj, createLinePath);
  return objectMap(obj, (v) => new THREE.CatmullRomCurve3(v));
}

/**
 * Create a line path.
 *
 * @param {Array<THREE.Vector3>} points - The points.
 * @returns {THREE.CurvePath} A line path.
 */
function createLinePath(points) {
  const linePath = new THREE.CurvePath();
  for (let i = 0, l = points.length - 1; i < l; i++) {
    const line = new THREE.LineCurve3(points[i], points[i + 1]);
    linePath.add(line);
  }
  return linePath;
}
