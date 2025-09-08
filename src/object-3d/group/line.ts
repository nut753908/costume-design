import * as THREE from "three";

import { Edge } from "../../cross-section/edge";
import { EdgeLoop } from "../../cross-section/edge-loop";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack";

/**
 * @param positions - The results of geometry.getAttribute("position").
 * @param ms - The materials.
 * @param name - The group name.
 */
export function createLineGroup(
  line:
    | Edge
    | EdgeLoop
    | EdgeLoopStack
    | THREE.CurvePath<THREE.Vector3>
    | THREE.CatmullRomCurve3,
  positions: THREE.BufferAttribute,
  ms: { [k1: string]: { [k2: string]: THREE.Material } },
  name: string,
): THREE.Group {
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
