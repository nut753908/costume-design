import { extrudePositions, flipNormals } from "src/cross-section/ara/extrude";
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
    const spy = vi.spyOn(console, "error");
    spy.mockImplementationOnce((v) => {
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

    // Import from test/cross-section/intersection/intersection-loops.test.ts.
    test("plane(flat) example", () => {
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
    test("cube example", () => {
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
  test("plane(flat) example", () => {
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

  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("cube example", () => {
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
