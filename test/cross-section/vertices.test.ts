import {
  createRemainingVerticesMap,
  findNextVertex,
} from "src/cross-section/vertices";
import { describe, expect, test } from "vitest";

describe("createRemainingVerticesMap()", () => {
  test("triangular pyramid example", () => {
    // See the triangular pyramid example in test/geometry/base.test.ts.
    const nPolygonIndices = [
      [0, 1, 2],
      [0, 1, 3],
      [1, 2, 3],
      [2, 0, 3],
    ];
    const expected = {
      "0,1": [[2], [3]],
      "1,0": [[2], [3]],
      "1,2": [[0], [3]],
      "2,1": [[0], [3]],
      "2,0": [[1], [3]],
      "0,2": [[1], [3]],
      "1,3": [[0], [2]],
      "3,1": [[0], [2]],
      "3,0": [[1], [2]],
      "0,3": [[1], [2]],
      "2,3": [[1], [0]],
      "3,2": [[1], [0]],
    };
    expect(createRemainingVerticesMap(nPolygonIndices)).toEqual(expected);
  });

  test("cube example", () => {
    // See the cube example in test/geometry/base.test.ts.
    const nPolygonIndices = [
      [0, 1, 2, 3],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7],
    ];
    const expected = {
      // To avoid formatting when saving in vscode, use Array(...) instead of [...].
      // biome-ignore-start lint/style/useArrayLiterals: To avoid formatting.
      "0,1": Array([2, 3], [5, 4]),
      "1,0": Array([2, 3], [5, 4]),
      "1,2": Array([3, 0], [6, 5]),
      "2,1": Array([3, 0], [6, 5]),
      "2,3": Array([0, 1], [7, 6]),
      "3,2": Array([0, 1], [7, 6]),
      "3,0": Array([1, 2], [4, 7]),
      "0,3": Array([1, 2], [4, 7]),
      "1,5": Array([4, 0], [2, 6]),
      "5,1": Array([4, 0], [2, 6]),
      "5,4": Array([0, 1], [6, 7]),
      "4,5": Array([0, 1], [6, 7]),
      "4,0": Array([1, 5], [7, 3]),
      "0,4": Array([1, 5], [7, 3]),
      "2,6": Array([5, 1], [3, 7]),
      "6,2": Array([5, 1], [3, 7]),
      "6,5": Array([1, 2], [7, 4]),
      "5,6": Array([1, 2], [7, 4]),
      "3,7": Array([6, 2], [0, 4]),
      "7,3": Array([6, 2], [0, 4]),
      "7,6": Array([2, 3], [4, 5]),
      "6,7": Array([2, 3], [4, 5]),
      "4,7": Array([3, 0], [5, 6]),
      "7,4": Array([3, 0], [5, 6]),
      // biome-ignore-end lint/style/useArrayLiterals: To avoid formatting.
    };
    expect(createRemainingVerticesMap(nPolygonIndices)).toEqual(expected);
  });

  test("plane example", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const expected = {
      // To avoid formatting when saving in vscode, use Array(...) instead of [...].
      // biome-ignore-start lint/style/useArrayLiterals: To avoid formatting.
      "0,1": Array([11, 10]),
      "1,0": Array([11, 10]),
      "1,11": Array([10, 0], [2, 12]),
      "11,1": Array([10, 0], [2, 12]),
      "11,10": Array([0, 1], [21, 20]),
      "10,11": Array([0, 1], [21, 20]),
      "10,0": Array([1, 11]),
      "0,10": Array([1, 11]),
      "1,2": Array([12, 11]),
      "2,1": Array([12, 11]),
      "2,12": Array([11, 1]),
      "12,2": Array([11, 1]),
      "12,11": Array([1, 2], [22, 21]),
      "11,12": Array([1, 2], [22, 21]),
      "11,21": Array([20, 10], [12, 22]),
      "21,11": Array([20, 10], [12, 22]),
      "21,20": Array([10, 11]),
      "20,21": Array([10, 11]),
      "20,10": Array([11, 21]),
      "10,20": Array([11, 21]),
      "12,22": Array([21, 11]),
      "22,12": Array([21, 11]),
      "22,21": Array([11, 12]),
      "21,22": Array([11, 12]),
      // biome-ignore-end lint/style/useArrayLiterals: To avoid formatting.
    };
    expect(createRemainingVerticesMap(nPolygonIndices)).toEqual(expected);
  });
});

describe("findNextVertex()", () => {
  test("find it once", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBe(12);
    expect(findNextVertex(map, 11, 12)).toBeNull();
  });

  test("find it twice", () => {
    /**
     * flat layout:
     *   20 21 22 23
     *   10 11 12 13
     *    0  1  2  3
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBe(12);
    expect(findNextVertex(map, 11, 12)).toBe(13);
    expect(findNextVertex(map, 12, 13)).toBeNull();
  });

  test("missing top left", () => {
    /**
     * flat layout:
     *      21 22
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing top left (interpolate with triangles)", () => {
    /**
     * flat layout:
     *      21 22
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing top right", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing top right (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing bottom left", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *       1  2
     */
    const nPolygonIndices = [
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing bottom left (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *       1  2
     */
    const nPolygonIndices = [
      [1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing bottom right", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing bottom right (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 12, 11],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing v1 (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22
     *      11 12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11],
      [1, 2, 12, 11],
      [11, 21, 20],
      [11, 12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("missing v2 (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10    12
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 10],
      [1, 2, 12],
      [10, 21, 20],
      [12, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });

  test("the two vertices are different", () => {
    /**
     * flat layout:
     *   20 21 22
     *   10 11 12(112)
     *    0  1  2
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [10, 11, 21, 20],
      [11, 112, 22, 21],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    expect(findNextVertex(map, 10, 11)).toBeNull();
  });
});
