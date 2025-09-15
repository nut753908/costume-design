import { getCentroids, getPoint } from "src/cross-section/centerline/points";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("getPoint()", () => {
  test.each([
    [[0, 1, 2, 3, 4, 5], 0, new THREE.Vector3(0, 1, 2)],
    [[0, 1, 2, 3, 4, 5], 1, new THREE.Vector3(3, 4, 5)],
  ])("array:%j, index:%i, expected:%j", (array, index, expected) => {
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(getPoint(positions, index)).toEqual(expected);
  });
});

test("getCentroids()", () => {
  const points = [
    [
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      new THREE.Vector3(10, 11, 12),
    ],
    [
      new THREE.Vector3(13, 14, 15),
      new THREE.Vector3(16, 17, 18),
      new THREE.Vector3(19, 20, 21),
      new THREE.Vector3(22, 23, 24),
    ],
  ];
  const expected = [
    new THREE.Vector3(5.5, 6.5, 7.5),
    new THREE.Vector3(17.5, 18.5, 19.5),
  ];
  expect(getCentroids(points)).toEqual(expected);
});
