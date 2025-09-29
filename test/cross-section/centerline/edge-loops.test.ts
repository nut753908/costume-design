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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10, 0],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
      [13, 23, 20, 10],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([10, 11, 12, 13], true),
      new EdgeLoop([1, 0, 3, 2], true),
      new EdgeLoop([20, 21, 22, 23], true),
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10, 0],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([10, 11, 12, 13], true),
      new EdgeLoop([1, 0, 3, 2], true),
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
      [20, 30, 31, 21],
      [21, 31, 32, 22],
      [22, 32, 33, 23],
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10, 0],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
      [13, 23, 20, 10],
      [20, 30, 31, 21],
      [21, 31, 32, 22],
      [22, 32, 33, 23],
      [23, 33, 30, 20],
      [30, 0, 1, 31],
      [31, 1, 2, 32],
      [32, 2, 3, 33],
      [33, 3, 0, 30],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([0, 10, 20, 30], true),
      new EdgeLoop([10, 11, 12, 13], true),
      new EdgeLoop([11, 1, 31, 21], true),
      new EdgeLoop([1, 0, 3, 2], true),
      new EdgeLoop([12, 2, 32, 22], true),
      new EdgeLoop([13, 3, 33, 23], true),
      new EdgeLoop([20, 21, 22, 23], true),
      new EdgeLoop([30, 31, 32, 33], true),
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10, 0],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([10, 11, 12, 13], true),
      new EdgeLoop([1, 0, 3, 2], true),
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10, 0],
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
      [13, 23, 10], // interpolate with triangles
    ];
    const expected: EdgeLoop[] = [
      new EdgeLoop([10, 11, 12, 13], true),
      new EdgeLoop([1, 0, 3, 2], true),
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
      [0, 10, 11, 1],
      [1, 11, 12, 2],
      [2, 12, 13, 3],
      [3, 13, 10], // interpolate with triangles
      [10, 20, 21, 11],
      [11, 21, 22, 12],
      [12, 22, 23, 13],
      [13, 23, 10], // interpolate with triangles
    ];
    const expected: EdgeLoop[] = [];
    expect(createAllEdgeLoops(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

test("createEdgeLoopsMap()", () => {
  const els = [
    new EdgeLoop([10, 11, 12, 13], true),
    new EdgeLoop([1, 0, 3, 2], false),
    new EdgeLoop([0, 1, 22], false),
  ];
  const expected = {
    "10,11": [els[0]],
    "11,10": [els[0]],
    "11,12": [els[0]],
    "12,11": [els[0]],
    "12,13": [els[0]],
    "13,12": [els[0]],
    "13,10": [els[0]],
    "10,13": [els[0]],
    "1,0": [els[1], els[2]],
    "0,1": [els[1], els[2]],
    "0,3": [els[1]],
    "3,0": [els[1]],
    "3,2": [els[1]],
    "2,3": [els[1]],
    "1,22": [els[2]],
    "22,1": [els[2]],
  };
  expect(createEdgeLoopsMap(els)).toEqual(expected);
});
