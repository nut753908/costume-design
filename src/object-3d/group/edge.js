import * as THREE from "three";

import { Edge } from "../../cross-section/edge.js";
import { EdgeLoop } from "../../cross-section/edge-loop.js";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack.js";

/**
 * @param {Edge|EdgeLoop|EdgeLoopStack} edge - An edge / An edge loop / An edge loop stack
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createEdgeGroup(edge, positions, ms) {
  const group = new THREE.Group();

  const geometry = new THREE.BufferGeometry().setFromPoints(
    edge instanceof EdgeLoopStack
      ? edge.getPoints(positions).flat()
      : edge.getPoints(positions)
  );

  group.add(new THREE.Line(geometry, ms.edge.line));

  return group;
}
