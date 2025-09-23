import {
  convertToLists,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import * as THREE from "three";
import { expect, test } from "vitest";

test("convertToLists()", () => {
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
  expect(convertToLists(indices, 3)).toEqual(expected);
});

test("createIndicesMap()", () => {
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
  const nPolygonIndices = convertToLists(indices, 3);
  const expected = {
    // To avoid formatting when saving in vscode, use Array(...) instead of [...].
    // biome-ignore-start lint/style/useArrayLiterals: To avoid formatting.
    "0": Array([0, 1, 4], [0, 4, 3]),
    "0,1": Array([0, 1, 4]),
    "1,0": Array([0, 1, 4]),
    "1": Array([0, 1, 4], [1, 2, 5], [1, 5, 4]),
    "1,4": Array([0, 1, 4], [1, 5, 4]),
    "4,1": Array([0, 1, 4], [1, 5, 4]),
    "4": Array(
      [0, 1, 4],
      [0, 4, 3],
      [1, 5, 4],
      [3, 4, 7],
      [4, 5, 8],
      [4, 8, 7]
    ),
    "4,0": Array([0, 1, 4], [0, 4, 3]),
    "0,4": Array([0, 1, 4], [0, 4, 3]),
    "4,3": Array([0, 4, 3], [3, 4, 7]),
    "3,4": Array([0, 4, 3], [3, 4, 7]),
    "3": Array([0, 4, 3], [3, 4, 7], [3, 7, 6]),
    "3,0": Array([0, 4, 3]),
    "0,3": Array([0, 4, 3]),
    "1,2": Array([1, 2, 5]),
    "2,1": Array([1, 2, 5]),
    "2": Array([1, 2, 5]),
    "2,5": Array([1, 2, 5]),
    "5,2": Array([1, 2, 5]),
    "5": Array([1, 2, 5], [1, 5, 4], [4, 5, 8]),
    "5,1": Array([1, 2, 5], [1, 5, 4]),
    "1,5": Array([1, 2, 5], [1, 5, 4]),
    "5,4": Array([1, 5, 4], [4, 5, 8]),
    "4,5": Array([1, 5, 4], [4, 5, 8]),
    "4,7": Array([3, 4, 7], [4, 8, 7]),
    "7,4": Array([3, 4, 7], [4, 8, 7]),
    "7": Array([3, 4, 7], [3, 7, 6], [4, 8, 7]),
    "7,3": Array([3, 4, 7], [3, 7, 6]),
    "3,7": Array([3, 4, 7], [3, 7, 6]),
    "7,6": Array([3, 7, 6]),
    "6,7": Array([3, 7, 6]),
    "6": Array([3, 7, 6]),
    "6,3": Array([3, 7, 6]),
    "3,6": Array([3, 7, 6]),
    "5,8": Array([4, 5, 8]),
    "8,5": Array([4, 5, 8]),
    "8": Array([4, 5, 8], [4, 8, 7]),
    "8,4": Array([4, 5, 8], [4, 8, 7]),
    "4,8": Array([4, 5, 8], [4, 8, 7]),
    "8,7": Array([4, 8, 7]),
    "7,8": Array([4, 8, 7]),
    // biome-ignore-end lint/style/useArrayLiterals: To avoid formatting.
  };
  expect(createIndicesMap(nPolygonIndices)).toEqual(expected);
});
