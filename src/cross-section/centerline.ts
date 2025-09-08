import * as THREE from "three";

import { createAllEdgeLoopStacks } from "./edge-loop-stacks";
import { getCentroids } from "./points";
import { objectMap } from "../main/utils";

/**
 * Create the base centerlines.
 *
 * @param nPolygonIndices - The base n polygon indices.
 * @param positions - The results of the base geometry.getAttribute("position").
 * @return  The base centerlines.
 */
export function createBaseCenterlines(
  nPolygonIndices: number[][],
  positions: THREE.BufferAttribute
): { [k: string]: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3 } {
  const stacks = createAllEdgeLoopStacks(nPolygonIndices);
  if (stacks.length !== 56) return {};
  const list: THREE.Vector3[][] = stacks.map((s) =>
    getCentroids(s.getPoints(positions))
  );
  // These index references can be found in the comments of "./edge-loop-stacks.ts".
  const obj: { [k: string]: THREE.Vector3[] } = {
    torso: list[0].concat(list[7].toReversed()).slice(0, -1),
    leftArm: list[5].toReversed().concat(list[2]).slice(0, -1),
    leftThumb: list[18].concat(list[46].toReversed()).slice(0, -1),
    leftIndexFinger: list[14],
    leftMiddleFinger: list[12],
    leftRingFinger: list[16],
    leftLittleFinger: list[17],
    leftLeg: list[6].toReversed().slice(1, -1),
    leftFoot: list[10].toReversed(),
    rightArm: list[27].concat(list[26]).slice(0, -1),
    rightThumb: list[38].toReversed().concat(list[53]).slice(0, -1),
    rightIndexFinger: list[34].toReversed(),
    rightMiddleFinger: list[32].toReversed(),
    rightRingFinger: list[36].toReversed(),
    rightLittleFinger: list[37].toReversed(),
    rightLeg: list[28].slice(1, -1),
    rightFoot: list[30],
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
 * @param points - The points.
 * @return  A line path.
 */
function createLinePath(
  points: THREE.Vector3[]
): THREE.CurvePath<THREE.Vector3> {
  const linePath = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0, l = points.length - 1; i < l; i++) {
    const line = new THREE.LineCurve3(points[i], points[i + 1]);
    linePath.add(line);
  }
  return linePath;
}
