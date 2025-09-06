import * as THREE from "three";

import { Edge } from "../../cross-section/edge.js";
import { EdgeLoop } from "../../cross-section/edge-loop.js";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack.js";

/**
 * @param {Edge|EdgeLoop|EdgeLoopStack|THREE.CurvePath|THREE.CatmullRomCurve3} line
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @param {string} name - The group name.
 * @return {THREE.Group}
 */
export function createLineGroup(line, positions, ms, name) {
  const group = new THREE.Group();
  group.name = name;

  let points = null;
  if (line instanceof Edge) {
    points = line.getPoints(positions);
  } else if (line instanceof EdgeLoop) {
    points = line.getPoints(positions);
  } else if (line instanceof EdgeLoopStack) {
    points = line.getPoints(positions).flat();
  } else if (line instanceof THREE.CurvePath) {
    points = line.getPoints();
  } else if (line instanceof THREE.CatmullRomCurve3) {
    points = line.getPoints(5 * line.points.length);
  } else {
    console.error(`\
points === null
- line: ${JSON.stringify(line)}
`);
    return group;
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // group.add(new THREE.Points(geometry, ms.line.points));
  group.add(new THREE.Line(geometry, ms.line.line));

  return group;
}
