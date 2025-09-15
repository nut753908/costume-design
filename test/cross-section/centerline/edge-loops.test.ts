import { EdgeLoop } from "src/cross-section/centerline/edge-loop";
import {
  createAllEdgeLoops,
  createEdgeLoopsMap,
} from "src/cross-section/centerline/edge-loops";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("createAllEdgeLoops()", () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, "error");
  });

  test("3 rows without loops", () => {
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
    const expected: EdgeLoop[] = [];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("3 rows with loops", () => {
    /**
     * flat layout:
     *   20 21 22 23 20
     *   10 11 12 13 10
     *    0  1  2  3  0
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 0, 10, 13],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
      [13, 10, 20, 23],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([11, 10, 13, 12], true),
      new EdgeLoop([0, 1, 2, 3], true),
      new EdgeLoop([21, 20, 23, 22], true),
    ];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("2 rows without loops", () => {
    /**
     * flat layout:
     *   10 11 12 13
     *    0  1  2  3
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
    ];
    const expected: EdgeLoop[] = [];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("2 rows with loops", () => {
    /**
     * flat layout:
     *   10 11 12 13 10
     *    0  1  2  3  0
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 0, 10, 13],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([0, 1, 2, 3], true),
      new EdgeLoop([11, 10, 13, 12], true),
    ];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("4 rows without loops and 4 columns without loops", () => {
    /**
     * flat layout:
     *   30 31 32 33
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
      [20, 21, 31, 30],
      [21, 22, 32, 31],
      [22, 23, 33, 32],
    ];
    const expected: EdgeLoop[] = [];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("4 rows with loops and 4 columns with loops", () => {
    /**
     * flat layout:
     *    0  1  2  3  0
     *   30 31 32 33 30
     *   20 21 22 23 20
     *   10 11 12 13 10
     *    0  1  2  3  0
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 0, 10, 13],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
      [13, 10, 20, 23],
      [20, 21, 31, 30],
      [21, 22, 32, 31],
      [22, 23, 33, 32],
      [23, 20, 30, 33],
      [30, 31, 1, 0],
      [31, 32, 2, 1],
      [32, 33, 3, 2],
      [33, 30, 0, 3],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([0, 1, 2, 3], true),
      new EdgeLoop([1, 11, 21, 31], true),
      new EdgeLoop([11, 10, 13, 12], true),
      new EdgeLoop([10, 0, 30, 20], true),
      new EdgeLoop([2, 12, 22, 32], true),
      new EdgeLoop([3, 13, 23, 33], true),
      new EdgeLoop([21, 20, 23, 22], true),
      new EdgeLoop([31, 30, 33, 32], true),
    ];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("1 row without loops and 2 rows with loops", () => {
    /**
     * flat layout:
     *   20 21 22 23
     *   10 11 12 13 10
     *    0  1  2  3  0
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 0, 10, 13],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([0, 1, 2, 3], true),
      new EdgeLoop([13, 12, 11, 10], true),
    ];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("1 row without loops and 2 rows with loops (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22 23
     *   10 11 12 13 10
     *    0  1  2  3  0
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 0, 10, 13],
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
      [13, 10, 23], // interpolate with triangles
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([0, 1, 2, 3], true),
      new EdgeLoop([13, 12, 11, 10], true),
    ];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("3 row without loops (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21 22 23
     *   10 11 12 13 10
     *    0  1  2  3
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [1, 2, 12, 11],
      [2, 3, 13, 12],
      [3, 10, 13], // interpolate with triangles
      [10, 11, 21, 20],
      [11, 12, 22, 21],
      [12, 13, 23, 22],
      [13, 10, 23], // interpolate with triangles
    ];
    const expected: EdgeLoop[] = [];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

test("createEdgeLoopsMap()", () => {
  const els = [
    new EdgeLoop([0, 1, 2, 3], false),
    new EdgeLoop([10, 11, 12, 13], true),
    new EdgeLoop([0, 1, 22], false),
  ];
  const expected = {
    "0,1": [els[0], els[2]],
    "1,0": [els[0], els[2]],
    "1,2": [els[0]],
    "2,1": [els[0]],
    "2,3": [els[0]],
    "3,2": [els[0]],
    "10,11": [els[1]],
    "11,10": [els[1]],
    "11,12": [els[1]],
    "12,11": [els[1]],
    "12,13": [els[1]],
    "13,12": [els[1]],
    "13,10": [els[1]],
    "10,13": [els[1]],
    "1,22": [els[2]],
    "22,1": [els[2]],
  };
  expect(createEdgeLoopsMap(els)).toEqual(expected);
});
