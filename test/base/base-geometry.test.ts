import { correctNPolygonIndices, mergeIndices } from "src/base/base-geometry";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("correctNPolygonIndices()", () => {
  describe("triangular pyramid example", () => {
    const nPolygonPositions = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [0, 0, 1], // index: 2
      [0, 1, 0], // index: 3
    ];
    const nPolygonIndices = [
      [0, 1, 2],
      [0, 3, 1],
      [1, 3, 2],
      [2, 3, 0],
    ];

    test("if the order of positions is the same", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [0, 0, 0], // index: 0
        [1, 0, 0], // index: 1
        [0, 1, 0], // index: 2
        [0, 0, -1], // index: 3
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [0, 1, 2],
        [0, 3, 1],
        [1, 3, 2],
        [2, 3, 0],
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });

    test("if the order of positions is reversed", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [0, 0, -1], // index: 3
        [0, 1, 0], // index: 2
        [1, 0, 0], // index: 1
        [0, 0, 0], // index: 0
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [3, 2, 1],
        [3, 0, 2],
        [2, 0, 1],
        [1, 0, 3],
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });
  });

  describe("cube example", () => {
    const nPolygonPositions = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [1, 0, 1], // index: 2
      [0, 0, 1], // index: 3
      [0, 1, 0], // index: 4
      [1, 1, 0], // index: 5
      [1, 1, 1], // index: 6
      [0, 1, 1], // index: 7
    ];
    const nPolygonIndices = [
      [0, 1, 2, 3],
      [0, 4, 5, 1],
      [1, 5, 6, 2],
      [2, 6, 7, 3],
      [3, 7, 4, 0],
      [7, 6, 5, 4],
    ];

    test("if the order of positions is the same", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [0, 0, 0], // index: 0
        [1, 0, 0], // index: 1
        [1, 1, 0], // index: 2
        [0, 1, 0], // index: 3
        [0, 0, -1], // index: 4
        [1, 0, -1], // index: 5
        [1, 1, -1], // index: 6
        [0, 1, -1], // index: 7
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [0, 1, 2, 3],
        [0, 4, 5, 1],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [3, 7, 4, 0],
        [7, 6, 5, 4],
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });

    test("if the order of positions is reversed", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [0, 1, -1], // index: 7
        [1, 1, -1], // index: 6
        [1, 0, -1], // index: 5
        [0, 0, -1], // index: 4
        [0, 1, 0], // index: 3
        [1, 1, 0], // index: 2
        [1, 0, 0], // index: 1
        [0, 0, 0], // index: 0
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [7, 6, 5, 4],
        [7, 3, 2, 6],
        [6, 2, 1, 5],
        [5, 1, 0, 4],
        [4, 0, 3, 7],
        [0, 1, 2, 3],
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });
  });

  describe("plane example", () => {
    /**
     * flat layout:
     *  (9)(10)
     *   6   7   8
     *   3   4   5
     *   0   1   2
     */
    const nPolygonPositions = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [2, 0, 0], // index: 2
      [0, 1, 0], // index: 3
      [1, 1, 0], // index: 4
      [2, 1, 0], // index: 5
      [0, 2, 0], // index: 6
      [1, 2, 0], // index: 7
      [2, 2, 0], // index: 8
      [0, 3, 0], // index: 9 (unknown)
      [1, 3, 0], // index: 10 (unknown)
    ];
    const nPolygonIndices = [
      [0, 3, 4, 1],
      [1, 4, 5, 2],
      [3, 6, 7, 4],
      [4, 7, 8, 5],
      [6, 9, 10, 7], // (unknown)
    ];

    test("if the order of positions is the same", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [0, 0, 0], // index: 0
        [1, 0, 0], // index: 1
        [2, 0, 0], // index: 2
        [0, 0, -1], // index: 3
        [1, 0, -1], // index: 4
        [2, 0, -1], // index: 5
        [0, 0, -2], // index: 6
        [1, 0, -2], // index: 7
        [2, 0, -2], // index: 8
        // index: 9,10 ... Does not exist.
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [0, 3, 4, 1],
        [1, 4, 5, 2],
        [3, 6, 7, 4],
        [4, 7, 8, 5],
        // Anything that doesn't exist will be deleted.
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });

    test("if the order of positions is reversed", () => {
      // Blender -> Three.js
      // (x,y,z) -> (x,z,-y)
      const array = [
        [2, 0, -2], // index: 8
        [1, 0, -2], // index: 7
        [0, 0, -2], // index: 6
        [2, 0, -1], // index: 5
        [1, 0, -1], // index: 4
        [0, 0, -1], // index: 3
        [2, 0, 0], // index: 2
        [1, 0, 0], // index: 1
        [0, 0, 0], // index: 0
        // index: 9,10 ... Does not exist.
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);
      const expected = [
        [8, 5, 4, 7],
        [7, 4, 3, 6],
        [5, 2, 1, 4],
        [4, 1, 0, 3],
        // Anything that doesn't exist will be deleted.
      ];
      expect(
        correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
      ).toEqual(expected);
    });
  });
});

describe("mergeIndices()", () => {
  test("split by vertical centerline (ascending order)", () => {
    /**
     * flat layout:
     *   4  5(,6) 7
     *   0  1(,2) 3
     */
    const arrayP = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [1, 0, 0], // index: 2
      [2, 0, 0], // index: 3
      [0, 1, 0], // index: 4
      [1, 1, 0], // index: 5
      [1, 1, 0], // index: 6
      [2, 1, 0], // index: 7
    ].flat();
    const positions = new THREE.Float32BufferAttribute(arrayP, 3);
    const arrayI = [
      [0, 4, 5],
      [0, 5, 1],
      [2, 6, 7],
      [2, 7, 3],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(arrayI, 1);
    const arrayI2 = [
      [0, 4, 5],
      [0, 5, 1],
      [1, 5, 7],
      [1, 7, 3],
    ].flat();
    const indices2 = new THREE.Uint16BufferAttribute(arrayI2, 1);
    expect(mergeIndices(positions, indices)).toEqual(indices2);
  });

  test("split by vertical centerline (descending order)", () => {
    /**
     * flat layout:
     *   4  6(,5) 7
     *   0  2(,1) 3
     */
    const arrayP = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [1, 0, 0], // index: 2
      [2, 0, 0], // index: 3
      [0, 1, 0], // index: 4
      [1, 1, 0], // index: 5
      [1, 1, 0], // index: 6
      [2, 1, 0], // index: 7
    ].flat();
    const positions = new THREE.Float32BufferAttribute(arrayP, 3);
    const arrayI = [
      [0, 4, 6],
      [0, 2, 6],
      [1, 5, 7],
      [1, 7, 3],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(arrayI, 1);
    const arrayI2 = [
      [0, 4, 5],
      [0, 1, 5],
      [1, 5, 7],
      [1, 7, 3],
    ].flat();
    const indices2 = new THREE.Uint16BufferAttribute(arrayI2, 1);
    expect(mergeIndices(positions, indices)).toEqual(indices2);
  });

  test("different center points (ascending order)", () => {
    /**
     * flat layout:
     *   11  12             13
     *    3   4(,5,6,7,8,9) 10
     *    0   1              2
     */
    const arrayP = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [2, 0, 0], // index: 2
      [0, 1, 0], // index: 3
      [1, 1, 0], // index: 4
      [1, 1, 0], // index: 5
      [1, 1, 0], // index: 6
      [1, 1, 0], // index: 7
      [1, 1, 0], // index: 8
      [1, 1, 0], // index: 9
      [2, 1, 0], // index: 10
      [0, 2, 0], // index: 11
      [1, 2, 0], // index: 12
      [2, 2, 0], // index: 13
    ].flat();
    const positions = new THREE.Float32BufferAttribute(arrayP, 3);
    const arrayI = [
      [0, 3, 4],
      [0, 5, 1],
      [1, 6, 10],
      [1, 10, 2],
      [3, 11, 12],
      [3, 12, 7],
      [8, 12, 13],
      [9, 13, 10],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(arrayI, 1);
    const arrayI2 = [
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 10],
      [1, 10, 2],
      [3, 11, 12],
      [3, 12, 4],
      [4, 12, 13],
      [4, 13, 10],
    ].flat();
    const indices2 = new THREE.Uint16BufferAttribute(arrayI2, 1);
    expect(mergeIndices(positions, indices)).toEqual(indices2);
  });

  test("different center points (descending order)", () => {
    /**
     * flat layout:
     *   11  12             13
     *    3   9(,8,7,6,5,4) 10
     *    0   1              2
     */
    const arrayP = [
      [0, 0, 0], // index: 0
      [1, 0, 0], // index: 1
      [2, 0, 0], // index: 2
      [0, 1, 0], // index: 3
      [1, 1, 0], // index: 4
      [1, 1, 0], // index: 5
      [1, 1, 0], // index: 6
      [1, 1, 0], // index: 7
      [1, 1, 0], // index: 8
      [1, 1, 0], // index: 9
      [2, 1, 0], // index: 10
      [0, 2, 0], // index: 11
      [1, 2, 0], // index: 12
      [2, 2, 0], // index: 13
    ].flat();
    const positions = new THREE.Float32BufferAttribute(arrayP, 3);
    const arrayI = [
      [0, 3, 9],
      [0, 8, 1],
      [1, 7, 10],
      [1, 10, 2],
      [3, 11, 12],
      [3, 12, 6],
      [5, 12, 13],
      [4, 13, 10],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(arrayI, 1);
    const arrayI2 = [
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 10],
      [1, 10, 2],
      [3, 11, 12],
      [3, 12, 4],
      [4, 12, 13],
      [4, 13, 10],
    ].flat();
    const indices2 = new THREE.Uint16BufferAttribute(arrayI2, 1);
    expect(mergeIndices(positions, indices)).toEqual(indices2);
  });
});
