import { convertToTriangularPolygonIndices } from "src/cross-section/intersection/indices";
import * as THREE from "three";
import { expect, test } from "vitest";

test("convertToTriangularPolygonIndices()", () => {
  /**
   * flat layout:
   *   6 7 8
   *   3 4 5
   *   0 1 2
   */
  const array = [
    [0, 1, 4],
    [0, 4, 3],
    [1, 2, 5],
    [1, 5, 4],
    [3, 4, 7],
    [3, 7, 6],
    [4, 5, 8],
    [4, 8, 7],
  ].flat();
  const indices = new THREE.Uint16BufferAttribute(array, 1);
  const expected = [
    [0, 1, 4],
    [0, 4, 3],
    [1, 2, 5],
    [1, 5, 4],
    [3, 4, 7],
    [3, 7, 6],
    [4, 5, 8],
    [4, 8, 7],
  ];
  expect(convertToTriangularPolygonIndices(indices)).toEqual(expected);
});
