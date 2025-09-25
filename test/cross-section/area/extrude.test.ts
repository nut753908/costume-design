import {
  concatGeometries,
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
  describe("else", () => {
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

describe("concatGeometries()", () => {
  // This example is imported from test/cross-section/area/cut.test.ts.
  test("three triangular pyramids example", () => {
    const indices1Array = [
      [0, 1, 2],
      [0, 1, 3],
      [1, 2, 3],
      [2, 0, 3],
    ].flat();
    const indices1 = new THREE.Uint16BufferAttribute(indices1Array, 1);
    const positions1Array = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
    ].flat();
    const positions1 = new THREE.Float32BufferAttribute(positions1Array, 3);
    const normals1Array = [
      new THREE.Vector3(-1, -1, -1).normalize().toArray(),
      new THREE.Vector3(3, -1, -1).normalize().toArray(),
      new THREE.Vector3(-1, -1, 3).normalize().toArray(),
      new THREE.Vector3(-1, 3, -1).normalize().toArray(),
    ].flat();
    const normals1 = new THREE.Float32BufferAttribute(normals1Array, 3);
    const uvs1Array = [
      [0.1, 0],
      [0.2, 0.2],
      [0, 0.2],
      [0.1, 0.1],
    ].flat();
    const uvs1 = new THREE.Float32BufferAttribute(uvs1Array, 2);
    const geometry1 = new THREE.BufferGeometry();
    geometry1.setIndex(indices1);
    geometry1.setAttribute("position", positions1);
    geometry1.setAttribute("normal", normals1);
    geometry1.setAttribute("uv", uvs1);

    const indices2Array = [
      [0, 1, 2],
      [0, 1, 3],
      [1, 2, 3],
      [2, 0, 3],
    ].flat();
    const indices2 = new THREE.Uint16BufferAttribute(indices2Array, 1);
    const positions2Array = [
      [2, 0.5, 0.5],
      [3, 0, 0],
      [3, 0, 1],
      [3, 1, 0.5],
    ].flat();
    const positions2 = new THREE.Float32BufferAttribute(positions2Array, 3);
    const normals2Array = [
      new THREE.Vector3(-6, 1, 0).normalize().toArray(),
      new THREE.Vector3(2, -3, -4).normalize().toArray(),
      new THREE.Vector3(2, -3, 4).normalize().toArray(),
      new THREE.Vector3(2, 5, 0).normalize().toArray(),
    ].flat();
    const normals2 = new THREE.Float32BufferAttribute(normals2Array, 3);
    const uvs2Array = [
      [0.4, 0],
      [0.5, 0.2],
      [0.3, 0.2],
      [0.4, 0.1],
    ].flat();
    const uvs2 = new THREE.Float32BufferAttribute(uvs2Array, 2);
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setIndex(indices2);
    geometry2.setAttribute("position", positions2);
    geometry2.setAttribute("normal", normals2);
    geometry2.setAttribute("uv", uvs2);

    const indices3Array = [
      [0, 1, 2],
      [0, 1, 3],
      [1, 2, 3],
      [2, 0, 3],
    ].flat();
    const indices3 = new THREE.Uint16BufferAttribute(indices3Array, 1);
    const positions3Array = [
      [4, 0.5, 0],
      [5, 0, 0.5],
      [4, 0.5, 1],
      [5, 1, 0.5],
    ].flat();
    const positions3 = new THREE.Float32BufferAttribute(positions3Array, 3);
    const normals3Array = [
      new THREE.Vector3(-1, 0, -1).normalize().toArray(),
      new THREE.Vector3(1, -1, 0).normalize().toArray(),
      new THREE.Vector3(-1, 0, 1).normalize().toArray(),
      new THREE.Vector3(1, 1, 0).normalize().toArray(),
    ].flat();
    const normals3 = new THREE.Float32BufferAttribute(normals3Array, 3);
    const uvs3Array = [
      [0.7, 0],
      [0.8, 0.2],
      [0.6, 0.2],
      [0.7, 0.1],
    ].flat();
    const uvs3 = new THREE.Float32BufferAttribute(uvs3Array, 2);
    const geometry3 = new THREE.BufferGeometry();
    geometry3.setIndex(indices3);
    geometry3.setAttribute("position", positions3);
    geometry3.setAttribute("normal", normals3);
    geometry3.setAttribute("uv", uvs3);

    const expectedIndicesArray = [
      [0, 1, 2],
      [0, 1, 3],
      [1, 2, 3],
      [2, 0, 3],
      //
      [4, 5, 6],
      [4, 5, 7],
      [5, 6, 7],
      [6, 4, 7],
      //
      [8, 9, 10],
      [8, 9, 11],
      [9, 10, 11],
      [10, 8, 11],
    ].flat();
    const expectedIndices = new THREE.Uint16BufferAttribute(
      expectedIndicesArray,
      1
    );
    const expectedPositionsArray = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      //
      [2, 0.5, 0.5],
      [3, 0, 0],
      [3, 0, 1],
      [3, 1, 0.5],
      //
      [4, 0.5, 0],
      [5, 0, 0.5],
      [4, 0.5, 1],
      [5, 1, 0.5],
    ].flat();
    const expectedPositions = new THREE.Float32BufferAttribute(
      expectedPositionsArray,
      3
    );
    const expectedNormalsArray = [
      new THREE.Vector3(-1, -1, -1).normalize().toArray(),
      new THREE.Vector3(3, -1, -1).normalize().toArray(),
      new THREE.Vector3(-1, -1, 3).normalize().toArray(),
      new THREE.Vector3(-1, 3, -1).normalize().toArray(),
      //
      new THREE.Vector3(-6, 1, 0)
        .normalize()
        .toArray(),
      new THREE.Vector3(2, -3, -4).normalize().toArray(),
      new THREE.Vector3(2, -3, 4).normalize().toArray(),
      new THREE.Vector3(2, 5, 0).normalize().toArray(),
      //
      new THREE.Vector3(-1, 0, -1)
        .normalize()
        .toArray(),
      new THREE.Vector3(1, -1, 0).normalize().toArray(),
      new THREE.Vector3(-1, 0, 1).normalize().toArray(),
      new THREE.Vector3(1, 1, 0).normalize().toArray(),
    ].flat();
    const expectedNormals = new THREE.Float32BufferAttribute(
      expectedNormalsArray,
      3
    );
    const expectedUvsArray = [
      [0.1, 0],
      [0.2, 0.2],
      [0, 0.2],
      [0.1, 0.1],
      //
      [0.4, 0],
      [0.5, 0.2],
      [0.3, 0.2],
      [0.4, 0.1],
      //
      [0.7, 0],
      [0.8, 0.2],
      [0.6, 0.2],
      [0.7, 0.1],
    ].flat();
    const expectedUvs = new THREE.Float32BufferAttribute(expectedUvsArray, 2);
    const expectedGeometry = new THREE.BufferGeometry();
    expectedGeometry.setIndex(expectedIndices);
    expectedGeometry.setAttribute("position", expectedPositions);
    expectedGeometry.setAttribute("normal", expectedNormals);
    expectedGeometry.setAttribute("uv", expectedUvs);

    const actualGeometry = concatGeometries([geometry1, geometry2, geometry3]);
    actualGeometry.uuid = expectedGeometry.uuid;
    expect(actualGeometry).toEqual(expectedGeometry);
  });
});
