import {
  convertToLists,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("convertToLists()", () => {
  test("indices", () => {
    /**
     * flat layout:
     *   6 7 8
     *   3 4 5
     *   0 1 2
     */
    const array = [
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 5],
      [1, 5, 2],
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(array, 1);
    const expected = [
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 5],
      [1, 5, 2],
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
    ];
    expect(convertToLists(indices, 3)).toEqual(expected);
  });

  test("positions", () => {
    /**
     * flat layout:
     *   6 7 8
     *   3 4 5
     *   0 1 2
     */
    const array = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [2, 1, 0],
      [0, 2, 0],
      [1, 2, 0],
      [2, 2, 0],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(array, 3);
    const expected = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [2, 1, 0],
      [0, 2, 0],
      [1, 2, 0],
      [2, 2, 0],
    ];
    expect(convertToLists(positions, 3)).toEqual(expected);
  });

  test("uvs", () => {
    /**
     * flat layout:
     *   6 7 8
     *   3 4 5
     *   0 1 2
     */
    const array = [
      [0, 0],
      [0.5, 0],
      [1, 0],
      [0, 0.5],
      [0.5, 0.5],
      [1, 0.5],
      [0, 1],
      [0.5, 1],
      [1, 1],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(array, 3);
    const expected = [
      [0, 0],
      [0.5, 0],
      [1, 0],
      [0, 0.5],
      [0.5, 0.5],
      [1, 0.5],
      [0, 1],
      [0.5, 1],
      [1, 1],
    ];
    expect(convertToLists(positions, 2)).toEqual(expected);
  });
});

test("createIndicesMap()", () => {
  /**
   * flat layout:
   *   6 7 8
   *   3 4 5
   *   0 1 2
   */
  const array = [
    [0, 3, 4],
    [0, 4, 1],
    [1, 4, 5],
    [1, 5, 2],
    [3, 6, 7],
    [3, 7, 4],
    [4, 7, 8],
    [4, 8, 5],
  ].flat();
  const indices = new THREE.Uint16BufferAttribute(array, 1);
  const nPolygonIndices = convertToLists(indices, 3);
  const expected = {
    // To avoid formatting when saving in vscode, use Array(...) instead of [...].
    // biome-ignore-start lint/style/useArrayLiterals: To avoid formatting.
    "0": Array([0, 3, 4], [0, 4, 1]),
    "0,1": Array([0, 4, 1]),
    "1,0": Array([0, 4, 1]),
    "1": Array([0, 4, 1], [1, 4, 5], [1, 5, 2]),
    "1,4": Array([0, 4, 1], [1, 4, 5]),
    "4,1": Array([0, 4, 1], [1, 4, 5]),
    "4": Array(
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 5],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5]
    ),
    "4,0": Array([0, 3, 4], [0, 4, 1]),
    "0,4": Array([0, 3, 4], [0, 4, 1]),
    "4,3": Array([0, 3, 4], [3, 7, 4]),
    "3,4": Array([0, 3, 4], [3, 7, 4]),
    "3": Array([0, 3, 4], [3, 6, 7], [3, 7, 4]),
    "3,0": Array([0, 3, 4]),
    "0,3": Array([0, 3, 4]),
    "1,2": Array([1, 5, 2]),
    "2,1": Array([1, 5, 2]),
    "2": Array([1, 5, 2]),
    "2,5": Array([1, 5, 2]),
    "5,2": Array([1, 5, 2]),
    "5": Array([1, 4, 5], [1, 5, 2], [4, 8, 5]),
    "5,1": Array([1, 4, 5], [1, 5, 2]),
    "1,5": Array([1, 4, 5], [1, 5, 2]),
    "5,4": Array([1, 4, 5], [4, 8, 5]),
    "4,5": Array([1, 4, 5], [4, 8, 5]),
    "4,7": Array([3, 7, 4], [4, 7, 8]),
    "7,4": Array([3, 7, 4], [4, 7, 8]),
    "7": Array([3, 6, 7], [3, 7, 4], [4, 7, 8]),
    "7,3": Array([3, 6, 7], [3, 7, 4]),
    "3,7": Array([3, 6, 7], [3, 7, 4]),
    "7,6": Array([3, 6, 7]),
    "6,7": Array([3, 6, 7]),
    "6": Array([3, 6, 7]),
    "6,3": Array([3, 6, 7]),
    "3,6": Array([3, 6, 7]),
    "5,8": Array([4, 8, 5]),
    "8,5": Array([4, 8, 5]),
    "8": Array([4, 7, 8], [4, 8, 5]),
    "8,4": Array([4, 7, 8], [4, 8, 5]),
    "4,8": Array([4, 7, 8], [4, 8, 5]),
    "8,7": Array([4, 7, 8]),
    "7,8": Array([4, 7, 8]),
    // biome-ignore-end lint/style/useArrayLiterals: To avoid formatting.
  };
  expect(createIndicesMap(nPolygonIndices)).toEqual(expected);
});
