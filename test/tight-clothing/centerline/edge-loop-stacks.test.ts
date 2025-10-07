import { EdgeLoopStack } from "src/tight-clothing/centerline/edge-loop-stack";
import { createAllEdgeLoopStacks } from "src/tight-clothing/centerline/edge-loop-stacks";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("createAllEdgeLoopStacks()", () => {
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
    const expected: EdgeLoopStack[] = [];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [
      new EdgeLoopStack(
        [
          [20, 21, 22, 23],
          [10, 11, 12, 13],
          [1, 0, 3, 2],
        ],
        false
      ),
    ];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [
      new EdgeLoopStack(
        [
          [10, 11, 12, 13],
          [1, 0, 3, 2],
        ],
        false
      ),
    ];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [
      new EdgeLoopStack(
        [
          [0, 10, 20, 30],
          [11, 1, 31, 21],
          [12, 2, 32, 22],
          [13, 3, 33, 23],
        ],
        true
      ),
      new EdgeLoopStack(
        [
          [10, 11, 12, 13],
          [1, 0, 3, 2],
          [30, 31, 32, 33],
          [20, 21, 22, 23],
        ],
        true
      ),
    ];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [
      new EdgeLoopStack(
        [
          [10, 11, 12, 13],
          [1, 0, 3, 2],
        ],
        false
      ),
    ];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [
      new EdgeLoopStack(
        [
          [10, 11, 12, 13],
          [1, 0, 3, 2],
        ],
        false
      ),
    ];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
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
    const expected: EdgeLoopStack[] = [];
    expect(createAllEdgeLoopStacks(nPolygonIndices)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
