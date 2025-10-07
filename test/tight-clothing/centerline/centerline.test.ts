import { createLinePath } from "src/tight-clothing/centerline/centerline";
import * as THREE from "three";
import { expect, test } from "vitest";

test("createLinePath()", () => {
  const points = [
    new THREE.Vector3(1, 2, 3),
    new THREE.Vector3(4, 5, 6),
    new THREE.Vector3(7, 8, 9),
  ];
  const linePath = createLinePath(points);
  expect(linePath.curves.length).toBe(2);
  expect(linePath.curves[0].type).toBe("LineCurve3");
  expect((linePath.curves[0] as THREE.LineCurve3).v1).toEqual(points[0]);
  expect((linePath.curves[0] as THREE.LineCurve3).v2).toEqual(points[1]);
  expect(linePath.curves[1].type).toBe("LineCurve3");
  expect((linePath.curves[1] as THREE.LineCurve3).v1).toEqual(points[1]);
  expect((linePath.curves[1] as THREE.LineCurve3).v2).toEqual(points[2]);
});
