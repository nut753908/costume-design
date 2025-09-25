import {
  extrudePositions,
  findBoundaries,
  flipNormals,
} from "src/cross-section/area/extrude";
import { EdgeLoop } from "src/cross-section/centerline/edge-loop";
import { createAllEdges } from "src/cross-section/centerline/edges";
import {
  convertToLists,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import * as THREE from "three";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("extrudePositions()", () => {
  test("if (positions.array.length !== normals.array.length)", () => {
    const spy = vi.spyOn(console, "error").mockImplementationOnce((v) => {
      expect(v).toBe(`\
positions.array.length !== normals.array.length
- positions: {"itemSize":3,"type":"Float32Array","array":[0,0,0],"normalized":false}
- normals: {"itemSize":3,"type":"Float32Array","array":[0,0,1,0,0,1],"normalized":false}
`);
    });
    const positions = new THREE.Float32BufferAttribute([0, 0, 0], 3);
    const normals = new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1], 3);
    const displacement = 0.001;
    extrudePositions(positions, normals, displacement);

    const expectedPositions = new THREE.Float32BufferAttribute([0, 0, 0], 3);
    expect(positions).toEqual(expectedPositions);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe("else", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    // Import from test/cross-section/area/find.test.ts.
    test("example of a plane (flat)", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)
       *   0(-1,-1) 1(0,-1) 2(1,-1)
       */
      const positionsArray = [
        [-1, -1, 0],
        [0, -1, 0],
        [1, -1, 0],
        [-1, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
        [-1, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const normalsArray = Array(9).fill([0, 0, 1]).flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const displacement = 0.001;
      extrudePositions(positions, normals, displacement);

      const expectedPositionsArray = [
        [-1, -1, displacement],
        [0, -1, displacement],
        [1, -1, displacement],
        [-1, 0, displacement],
        [0, 0, displacement],
        [1, 0, displacement],
        [-1, 1, displacement],
        [0, 1, displacement],
        [1, 1, displacement],
      ].flat();
      const expectedPositions = new THREE.Float32BufferAttribute(
        expectedPositionsArray,
        3
      );
      expect(positions).toEqual(expectedPositions);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    // Import from test/cross-section/area/find.test.ts.
    test("example of an upper half cube (bottomless)", () => {
      const SQRT1_3 = Math.sqrt(1 / 3);
      const SQRT1_2 = Math.SQRT1_2;

      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
        [0, 1, 0],
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
        //
        [1, 0.5, 0],
        [0.5, 0.5, 0],
        [0, 0.5, 0],
        [0, 0.5, 0.5],
        [0, 0.5, 1],
        [0.5, 0.5, 1],
        [1, 0.5, 1],
        [1, 0.5, 0.5],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const normalsArray = [
        [-SQRT1_3, -SQRT1_3, -SQRT1_3],
        [SQRT1_3, -SQRT1_3, -SQRT1_3],
        [SQRT1_3, -SQRT1_3, SQRT1_3],
        [-SQRT1_3, -SQRT1_3, SQRT1_3],
        [-SQRT1_3, SQRT1_3, -SQRT1_3],
        [SQRT1_3, SQRT1_3, -SQRT1_3],
        [SQRT1_3, SQRT1_3, SQRT1_3],
        [-SQRT1_3, SQRT1_3, SQRT1_3],
        //
        [SQRT1_2, 0, -SQRT1_2],
        [0, 0, -1],
        [-SQRT1_2, 0, -SQRT1_2],
        [-1, 0, 0],
        [-SQRT1_2, 0, SQRT1_2],
        [0, 0, 1],
        [SQRT1_2, 0, SQRT1_2],
        [1, 0, 0],
      ].flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const displacement = 0.001;
      extrudePositions(positions, normals, displacement);

      const expectedPositionsArray = [
        [
          0 - SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
        ],
        [
          1 + SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
        ],
        [
          1 + SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
        ],
        [
          0 - SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
        ],
        [
          0 - SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
        ],
        [
          1 + SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
          0 - SQRT1_3 * displacement,
        ],
        [
          1 + SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
        ],
        [
          0 - SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
          1 + SQRT1_3 * displacement,
        ],
        //
        [1 + SQRT1_2 * displacement, 0.5, 0 - SQRT1_2 * displacement],
        [0.5, 0.5, 0 - displacement],
        [0 - SQRT1_2 * displacement, 0.5, 0 - SQRT1_2 * displacement],
        [0 - displacement, 0.5, 0.5],
        [0 - SQRT1_2 * displacement, 0.5, 1 + SQRT1_2 * displacement],
        [0.5, 0.5, 1 + displacement],
        [1 + SQRT1_2 * displacement, 0.5, 1 + SQRT1_2 * displacement],
        [1 + displacement, 0.5, 0.5],
      ].flat();
      const expectedPositions = new THREE.Float32BufferAttribute(
        expectedPositionsArray,
        3
      );
      expect(positions).toEqual(expectedPositions);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});

describe("flipNormals()", () => {
  // Import from test/cross-section/area/find.test.ts.
  test("example of a plane (flat)", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)
     *   0(-1,-1) 1(0,-1) 2(1,-1)
     */
    const normalsArray = Array(9).fill([0, 0, 1]).flat();
    const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
    flipNormals(normals);

    const expectedNormalsArray = Array(9).fill([-0, -0, -1]).flat();
    const expectedNormals = new THREE.Float32BufferAttribute(
      expectedNormalsArray,
      3
    );
    expect(normals).toEqual(expectedNormals);
  });

  // Import from test/cross-section/area/find.test.ts.
  test("example of an upper half cube (bottomless)", () => {
    const SQRT1_3 = Math.sqrt(1 / 3);
    const SQRT1_2 = Math.SQRT1_2;

    const normalsArray = [
      [-SQRT1_3, -SQRT1_3, -SQRT1_3],
      [SQRT1_3, -SQRT1_3, -SQRT1_3],
      [SQRT1_3, -SQRT1_3, SQRT1_3],
      [-SQRT1_3, -SQRT1_3, SQRT1_3],
      [-SQRT1_3, SQRT1_3, -SQRT1_3],
      [SQRT1_3, SQRT1_3, -SQRT1_3],
      [SQRT1_3, SQRT1_3, SQRT1_3],
      [-SQRT1_3, SQRT1_3, SQRT1_3],
      //
      [SQRT1_2, 0, -SQRT1_2],
      [0, 0, -1],
      [-SQRT1_2, 0, -SQRT1_2],
      [-1, 0, 0],
      [-SQRT1_2, 0, SQRT1_2],
      [0, 0, 1],
      [SQRT1_2, 0, SQRT1_2],
      [1, 0, 0],
    ].flat();
    const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
    flipNormals(normals);

    const expectedNormalsArray = [
      [SQRT1_3, SQRT1_3, SQRT1_3],
      [-SQRT1_3, SQRT1_3, SQRT1_3],
      [-SQRT1_3, SQRT1_3, -SQRT1_3],
      [SQRT1_3, SQRT1_3, -SQRT1_3],
      [SQRT1_3, -SQRT1_3, SQRT1_3],
      [-SQRT1_3, -SQRT1_3, SQRT1_3],
      [-SQRT1_3, -SQRT1_3, -SQRT1_3],
      [SQRT1_3, -SQRT1_3, -SQRT1_3],
      //
      [-SQRT1_2, -0, SQRT1_2],
      [-0, -0, 1],
      [SQRT1_2, -0, SQRT1_2],
      [1, -0, -0],
      [SQRT1_2, -0, -SQRT1_2],
      [-0, -0, -1],
      [-SQRT1_2, -0, -SQRT1_2],
      [-1, -0, -0],
    ].flat();
    const expectedNormals = new THREE.Float32BufferAttribute(
      expectedNormalsArray,
      3
    );
    expect(normals).toEqual(expectedNormals);
  });
});

describe("findBoundaries()", () => {
  // NOTE: This testing is expensive to perform.
  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("if (count > 1000)", () => {
    const spy = vi
      .spyOn(console, "error")
      .mockImplementationOnce((v) => {
        expect(v).toBe("whileLoop: count > 1000");
      })
      .mockImplementationOnce((v) => {
        expect(v).toBe("next edge not found");
      });
    /**
     * top view flat layout:
     *                 4+4i(0,0,1)
     *   1+4i(-1,0,0)     0(0,0,1) 3+4i(1,0,0) ◢2 ◣3
     *                2+4i(0,0,-1)             ◥0 ◤1
     */
    const indicesArray = Array(250)
      .fill(0)
      .flatMap((_, i) => [
        [0, 1 + 4 * i, 2 + 4 * i],
        [0, 2 + 4 * i, 3 + 4 * i],
        [0, 3 + 4 * i, 4 + 4 * i],
        [0, 4 + 4 * i, 5 + 4 * i],
      ])
      .flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const allEdges = createAllEdges(nPolygonIndices);
    const indicesMap = createIndicesMap(nPolygonIndices);
    const expected: EdgeLoop[] = [
      new EdgeLoop([...Array(1001).keys()], false),
      new EdgeLoop([1001], false),
    ];
    expect(findBoundaries(allEdges, indicesMap)).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  describe("else", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    // Import from test/cross-section/area/find.test.ts.
    test("example of a plane (flat)", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)
       *   0(-1,-1) 1(0,-1) 2(1,-1)
       */
      const indicesArray = [
        [0, 1, 4],
        [0, 4, 3],
        [1, 2, 5],
        [1, 5, 4],
        [3, 4, 7],
        [3, 7, 6],
        [4, 5, 8],
        [4, 8, 7],
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const allEdges = createAllEdges(nPolygonIndices);
      const indicesMap = createIndicesMap(nPolygonIndices);
      const expected: EdgeLoop[] = [
        new EdgeLoop([0, 1, 2, 5, 8, 7, 6, 3], true),
      ];
      expect(findBoundaries(allEdges, indicesMap)).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    // Import from test/cross-section/area/find.test.ts.
    test("example of an upper half cube (bottomless)", () => {
      const indicesArray = [
        [5, 8, 9],
        [4, 5, 6],
        [4, 6, 7],
        [7, 13, 6],
        [4, 11, 7],
        [11, 12, 7],
        [7, 12, 13],
        [13, 14, 6],
        [6, 14, 15],
        [6, 15, 5],
        [5, 9, 4],
        [9, 10, 4],
        [4, 10, 11],
        [15, 8, 5],
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const allEdges = createAllEdges(nPolygonIndices);
      const indicesMap = createIndicesMap(nPolygonIndices);
      const expected: EdgeLoop[] = [
        new EdgeLoop([8, 9, 10, 11, 12, 13, 14, 15], true),
      ];
      expect(findBoundaries(allEdges, indicesMap)).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("example of a triangular prism (no top or bottom)", () => {
      const indicesArray = [
        [0, 1, 4],
        [0, 4, 3],
        [1, 2, 5],
        [1, 5, 4],
        [2, 0, 3],
        [2, 3, 5],
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const allEdges = createAllEdges(nPolygonIndices);
      const indicesMap = createIndicesMap(nPolygonIndices);
      const expected: EdgeLoop[] = [
        new EdgeLoop([0, 1, 2], true),
        new EdgeLoop([4, 3, 5], true),
      ];
      expect(findBoundaries(allEdges, indicesMap)).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
