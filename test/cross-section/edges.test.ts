import { Edge } from "src/cross-section/edge";
import {
  createAllEdges,
  createEdgeMap,
  findNextEdge,
} from "src/cross-section/edges";
import { createRemainingVerticesMap } from "src/cross-section/vertices";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

test("createAllEdges()", () => {
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
  const expected = [
    new Edge(0, 1),
    new Edge(1, 11),
    new Edge(11, 10),
    new Edge(10, 0),
    new Edge(1, 2),
    new Edge(2, 12),
    new Edge(12, 11),
    new Edge(11, 21),
    new Edge(21, 20),
    new Edge(20, 10),
    new Edge(12, 22),
    new Edge(22, 21),
  ];
  expect(createAllEdges(nPolygonIndices)).toEqual(expected);
});

test("createEdgeMap()", () => {
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
  const edges = createAllEdges(nPolygonIndices);
  const expected = {
    "0,1": new Edge(0, 1),
    "1,0": new Edge(0, 1),
    "1,11": new Edge(1, 11),
    "11,1": new Edge(1, 11),
    "11,10": new Edge(11, 10),
    "10,11": new Edge(11, 10),
    "10,0": new Edge(10, 0),
    "0,10": new Edge(10, 0),
    "1,2": new Edge(1, 2),
    "2,1": new Edge(1, 2),
    "2,12": new Edge(2, 12),
    "12,2": new Edge(2, 12),
    "12,11": new Edge(12, 11),
    "11,12": new Edge(12, 11),
    "11,21": new Edge(11, 21),
    "21,11": new Edge(11, 21),
    "21,20": new Edge(21, 20),
    "20,21": new Edge(21, 20),
    "20,10": new Edge(20, 10),
    "10,20": new Edge(20, 10),
    "12,22": new Edge(12, 22),
    "22,12": new Edge(12, 22),
    "22,21": new Edge(22, 21),
    "21,22": new Edge(22, 21),
  };
  expect(createEdgeMap(edges)).toEqual(expected);
});

describe("findNextEdge()", () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, "error");
  });

  test("find it once", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21, 20],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3?.equals(new Edge(20, 21))).toBeTruthy();
    const e4 = findNextEdge(map, e2, e3);
    expect(e4).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("find it twice", () => {
    /**
     * flat layout:
     *   30 31
     *   20 21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21, 20],
      [20, 21, 31, 30],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3?.equals(new Edge(20, 21))).toBeTruthy();
    const e4 = findNextEdge(map, e2, e3);
    expect(e4?.equals(new Edge(30, 31))).toBeTruthy();
    const e5 = findNextEdge(map, e3, e4);
    expect(e5).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing top left", () => {
    /**
     * flat layout:
     *      21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [[0, 1, 11, 10]];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing top left (interpolate with triangles)", () => {
    /**
     * flat layout:
     *      21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21], // interpolate with triangles
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing middle left", () => {
    /**
     * flat layout:
     *   20 21
     *      11
     *    0  1
     */
    const nPolygonIndices: number[][] = [];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing middle left (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21
     *      11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11], // interpolate with triangles
      [11, 21, 20], // interpolate with triangles
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing bottom left", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11
     *       1
     */
    const nPolygonIndices = [[10, 11, 21, 20]];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3?.equals(new Edge(20, 21))).toBeTruthy();
    const e4 = findNextEdge(map, e2, e3);
    expect(e4).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("missing bottom left (interpolate with triangles)", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11
     *       1
     */
    const nPolygonIndices = [
      [1, 11, 10], // interpolate with triangles
      [10, 11, 21, 20],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("e1 is null", () => {
    /**
     * flat layout:
     *   20 21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21, 20],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = null;
    const e2 = new Edge(10, 11);
    const e3 = findNextEdge(map, e1, e2);
    expect(e3?.equals(new Edge(0, 1))).toBeTruthy(); // The one set earlier
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("e2 is null", () => {
    spy.mockImplementationOnce((v) => expect(v).toBe("e2 === null"));
    /**
     * flat layout:
     *   20 21
     *   10 11
     *    0  1
     */
    const nPolygonIndices = [
      [0, 1, 11, 10],
      [10, 11, 21, 20],
    ];
    const map = createRemainingVerticesMap(nPolygonIndices);
    const e1 = new Edge(0, 1);
    const e2 = null;
    const e3 = findNextEdge(map, e1, e2);
    expect(e3).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
