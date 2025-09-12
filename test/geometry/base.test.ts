import { correctNPolygonIndices } from "src/geometry/base";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("correctNPolygonIndices()", () => {
  // example: cube
  const nPolygonPositions = [
    [0, 0, 0], // index: 0
    [1, 0, 0], // index: 1
    [1, 0, 1], // index: 2
    [0, 0, 1], // index: 3
    [0, 1, 0], // index: 4
    [1, 1, 0], // index: 5
    [1, 1, 1], // index: 6
    [0, 1, 1], // index: 7
    [0, 2, 0], // index: 8
    [1, 2, 0], // index: 9
    [1, 2, 1], // index: 10
    [0, 2, 1], // index: 11
  ];
  const nPolygonIndices = [
    [0, 1, 2, 3],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
    [4, 5, 6, 7],
    [4, 5, 9, 8],
    [5, 6, 10, 9],
    [6, 7, 11, 10],
    [7, 4, 8, 11],
    [8, 9, 10, 11],
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
      // index: 8,9,10,11 ... Does not exist.
    ].flat();
    const positions = new THREE.Float32BufferAttribute(array, 3);
    const expected = [
      [0, 1, 2, 3],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7],
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
      [0, 1, -1], // index: 7
      [1, 1, -1], // index: 6
      [1, 0, -1], // index: 5
      [0, 0, -1], // index: 4
      [0, 1, 0], // index: 3
      [1, 1, 0], // index: 2
      [1, 0, 0], // index: 1
      [0, 0, 0], // index: 0
      // index: 8,9,10,11 ... Does not exist.
    ].flat();
    const positions = new THREE.Float32BufferAttribute(array, 3);
    const expected = [
      [7, 6, 5, 4],
      [7, 6, 2, 3],
      [6, 5, 1, 2],
      [5, 4, 0, 1],
      [4, 7, 3, 0],
      [3, 2, 1, 0],
      // Anything that doesn't exist will be deleted.
    ];
    expect(
      correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices)
    ).toEqual(expected);
  });
});
