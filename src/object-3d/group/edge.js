import * as THREE from "three";

import { Edge } from "../../cross-section/edge.js";
import { EdgeLoop } from "../../cross-section/edge-loop.js";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack.js";

/**
 * @param {Edge|EdgeLoop|EdgeLoopStack|THREE.CurvePath|THREE.CatmullRomCurve3} edge - An edge / An edge loop / An edge loop stack / A line path / A spline curve
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createEdgeGroup(edge, positions, ms) {
  const group = new THREE.Group();

  let points = null;
  if (edge instanceof Edge) {
    points = edge.getPoints(positions);
  } else if (edge instanceof EdgeLoop) {
    points = edge.getPoints(positions);
  } else if (edge instanceof EdgeLoopStack) {
    points = edge.getPoints(positions).flat();
  } else if (edge instanceof THREE.CurvePath) {
    points = edge.getPoints();
  } else if (edge instanceof THREE.CatmullRomCurve3) {
    points = edge.getPoints(5 * edge.points.length);
  } else {
    console.error(`\
points === null
- edge: ${JSON.stringify(edge)}
`);
    return group;
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // group.add(new THREE.Points(geometry, ms.edge.points));
  group.add(new THREE.Line(geometry, ms.edge.line));

  return group;
}
