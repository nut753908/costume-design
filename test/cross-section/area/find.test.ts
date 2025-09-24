import {
  findAdjacentFaces,
  findAdjacentFacesWithinArea,
  findFirstFaces,
} from "src/cross-section/ara/find";
import { Area } from "src/cross-section/area";
import {
  convertToLists,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoopPicker } from "src/cross-section/intersection/intersection-loop-picker";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("findAdjacentFacesWithinArea()", () => {
  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("plane(flat) example", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
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
      //
      [1, -0.5, 0], // added
      [0.5, -0.5, 0], // added
      [0, -0.5, 0], // added
      [-0.5, -0.5, 0], // added
      [-1, -0.5, 0], // added
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      // [0, 1, 4], // removed
      // [0, 4, 3], // removed
      // [1, 2, 5], // removed
      // [1, 5, 4], // removed
      [3, 4, 7],
      [3, 7, 6],
      [4, 5, 8],
      [4, 8, 7],
      //
      [5, 10, 9], // added
      [10, 2, 9], // added
      [10, 1, 2], // added
      [11, 1, 10], // added
      [4, 10, 5], // added
      [4, 11, 10], // added
      [4, 12, 11], // added
      [12, 1, 11], // added
      [12, 0, 1], // added
      [13, 0, 12], // added
      [3, 12, 4], // added
      [3, 13, 12], // added
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const area = new Area(Area.createPlaneToAllIls(positions, indices), {
      a: {
        plane: new FreePlane(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, -0.5, 0) // y: 0.5 -> -0.5
        ),
        ilp: new IntersectionLoopPicker([
          new IntersectionLoop(
            [
              new VertexIntersection(9, true),
              new VertexIntersection(10, true),
              new VertexIntersection(11, true),
              new VertexIntersection(12, true),
              new VertexIntersection(13, true),
            ],
            false
          ),
        ]),
      },
    });

    const foundVertices: number[] = [];
    const foundFaces: number[][] = [];
    const expectedFoundVertices: number[] = [
      9, 10, 11, 12, 13, 5, 4, 3, 7, 8, 6,
    ];
    const expectedFoundFaces: number[][] = [
      [5, 10, 9],
      [4, 5, 8],
      [3, 4, 7],
      [3, 7, 6],
      [4, 8, 7],
      [3, 12, 4],
      [3, 13, 12],
      [4, 10, 5],
      [4, 11, 10],
      [4, 12, 11],
    ];
    findAdjacentFacesWithinArea(
      area,
      foundVertices,
      foundFaces,
      indicesMap,
      positions
    );
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });

  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("cube example", () => {
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
      [1, 0.5, 0], // added
      [0.5, 0.5, 0], // added
      [0, 0.5, 0], // added
      [0, 0.5, 0.5], // added
      [0, 0.5, 1], // added
      [0.5, 0.5, 1], // added
      [1, 0.5, 1], // added
      [1, 0.5, 0.5], // added
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      [0, 1, 2],
      [0, 2, 3],
      // [0, 1, 5], // removed
      // [0, 5, 4], // removed
      // [1, 2, 6], // removed
      // [1, 6, 5], // removed
      // [2, 3, 7], // removed
      // [2, 7, 6], // removed
      // [3, 0, 4], // removed
      // [3, 4, 7], // removed
      [4, 5, 6],
      [4, 6, 7],
      //
      [5, 8, 9], // added
      [8, 1, 9], // added
      [1, 0, 9], // added
      [9, 0, 10], // added
      [5, 9, 4], // added
      [9, 10, 4], // added
      [4, 10, 11], // added
      [10, 0, 11], // added
      [0, 3, 11], // added
      [11, 3, 12], // added
      [4, 11, 7], // added
      [11, 12, 7], // added
      [7, 12, 13], // added
      [12, 3, 13], // added
      [3, 2, 13], // added
      [13, 2, 14], // added
      [7, 13, 6], // added
      [13, 14, 6], // added
      [6, 14, 15], // added
      [14, 2, 15], // added
      [2, 1, 15], // added
      [15, 1, 8], // added
      [6, 15, 5], // added
      [15, 8, 5], // added
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const area = new Area(Area.createPlaneToAllIls(positions, indices), {
      a: {
        plane: new FreePlane(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0.5, 0)
        ),
        ilp: new IntersectionLoopPicker([
          new IntersectionLoop(
            [
              new VertexIntersection(8, true),
              new VertexIntersection(9, true),
              new VertexIntersection(10, true),
              new VertexIntersection(11, true),
              new VertexIntersection(12, true),
              new VertexIntersection(13, true),
              new VertexIntersection(14, true),
              new VertexIntersection(15, true),
            ],
            true
          ),
        ]),
      },
    });

    const foundVertices: number[] = [];
    const foundFaces: number[][] = [];
    const expectedFoundVertices: number[] = [
      8, 9, 10, 11, 12, 13, 14, 15, 5, 4, 6, 7,
    ];
    const expectedFoundFaces: number[][] = [
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
    ];
    findAdjacentFacesWithinArea(
      area,
      foundVertices,
      foundFaces,
      indicesMap,
      positions
    );
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });

  // Import from test/cross-section/area/split.test.ts.
  describe("plane(flat) example2", () => {
    describe("two non-intersecting cross sections", () => {
      /**
       * flat layout:
       *   2(0, 1) 3(1, 1)
       *   0(0, 0) 1(1, 0)  ◤1 ◢0
       */
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        //
        [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [  1,0.5,0]
        [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0.5,0.5,0]
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [  0,0.5,0]
        //
        [1 + (1 - 1) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0.5 + (1 - 0.5) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0.5 + (0 - 0.5) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0 - 0) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        // [0, 1, 3], // removed
        // [0, 3, 2], // removed
        //
        // [3, 4, 5], // added -> removed
        [4, 1, 5], // added
        [1, 0, 5], // added
        [5, 0, 6], // added
        // [3, 5, 2], // added -> removed
        // [5, 6, 2], // added -> removed
        //
        [3, 7, 8], // added
        [7, 4, 8], // added
        [4, 5, 8], // added
        [8, 5, 9], // added
        [3, 9, 2], // added
        [3, 8, 9], // added
        [2, 9, 10], // added
        [9, 6, 10], // added
        [9, 5, 6], // added
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const indicesMap = createIndicesMap(nPolygonIndices);

      test("center row:↑, top row:↑", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          topRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [4, 5, 6, 7, 8, 9, 10, 3, 2];
        const expectedFoundFaces: number[][] = [
          [4, 5, 8],
          [9, 5, 6],
          [3, 7, 8],
          [3, 9, 2],
          [2, 9, 10],
          [3, 8, 9],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↑, top row:↓", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          topRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [4, 5, 6, 7, 8, 9, 10];
        const expectedFoundFaces: number[][] = [
          [4, 5, 8],
          [9, 5, 6],
          [7, 4, 8],
          [8, 5, 9],
          [9, 6, 10],
        ];
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↓, top row:↑", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          topRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [
          4, 5, 6, 7, 8, 9, 10, 1, 0, 3, 2,
        ];
        const expectedFoundFaces: number[][] = [
          [4, 1, 5],
          [1, 0, 5],
          [5, 0, 6],
          [3, 7, 8],
          [3, 9, 2],
          [2, 9, 10],
          [3, 8, 9],
        ];
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↓, top row:↓", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          topRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [4, 5, 6, 7, 8, 9, 10, 1, 0];
        const expectedFoundFaces: number[][] = [
          [4, 1, 5],
          [1, 0, 5],
          [5, 0, 6],
          [7, 4, 8],
          [8, 5, 9],
          [9, 6, 10],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });
    });

    describe("two intersecting cross sections", () => {
      /**
       * flat layout:
       *   2(0, 1) 3(1, 1)
       *   0(0, 0) 1(1, 0)  ◤1 ◢0
       */
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        //
        [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [1,0.5,0]
        [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0.5,0.5,0]
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0,0.5,0]
        //
        [0 + (1 - 0) * 0.25, 0 + (0 - 0) * 0.25, 0 + (0 - 0) * 0.25], // added
        [0 + (1 - 0) * 0.25, 0 + (1 - 0) * 0.25, 0 + (0 - 0) * 0.25], // added
        [0 + (0.5 - 0) * 0.5, 0.5 + (0.5 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0.5 - 0) * 0.5, 1 + (0.5 - 1) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (1 - 0) * 0.25, 1 + (1 - 1) * 0.25, 0 + (0 - 0) * 0.25], // added
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        // [0, 1, 3], // removed
        // [0, 3, 2], // removed
        //
        [3, 4, 5], // added
        [4, 1, 5], // added
        // [1, 0, 5], // added -> removed
        // [5, 0, 6], // added -> removed
        // [3, 5, 2], // added -> removed
        // [5, 6, 2], // added -> removed
        //
        [7, 0, 8], // added
        [1, 7, 5], // added
        [7, 8, 5], // added
        [5, 8, 9], // added
        [8, 6, 9], // added
        [8, 0, 6], // added
        [5, 9, 10], // added
        [9, 6, 10], // added
        [6, 2, 10], // added
        [10, 2, 11], // added
        [5, 11, 3], // added
        [5, 10, 11], // added
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const indicesMap = createIndicesMap(nPolygonIndices);

      test("center row:↑, left column:→", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          leftColumn: {
            plane: new FreePlane(
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                  new VertexIntersection(11, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [4, 5, 9, 6, 7, 8, 10, 11, 3]; // TODO: fix
        const expectedFoundFaces: number[][] = [
          [3, 4, 5],
          [5, 11, 3],
          [5, 9, 10],
          [9, 6, 10],
          [7, 8, 5],
          [5, 8, 9],
          [5, 10, 11],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↑, left column:←", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          leftColumn: {
            plane: new FreePlane(
              new THREE.Vector3(-1, 0, 0), // x: 1 -> -1
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                  new VertexIntersection(11, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [
          4, 5, 9, 6, 7, 8, 10, 11, 3, 0, 2,
        ];
        const expectedFoundFaces: number[][] = [
          [3, 4, 5],
          [5, 11, 3],
          [5, 9, 10],
          [9, 6, 10],
          [7, 0, 8],
          [8, 0, 6],
          [8, 6, 9],
          [10, 2, 11],
          [6, 2, 10],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↓, left column:→", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          leftColumn: {
            plane: new FreePlane(
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                  new VertexIntersection(11, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [4, 5, 9, 6, 7, 8, 10, 11, 1]; // TODO: fix
        const expectedFoundFaces: number[][] = [
          [4, 1, 5],
          [1, 7, 5],
          [5, 8, 9],
          [8, 6, 9],
          [7, 8, 5],
          [5, 9, 10],
          [5, 10, 11],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });

      test("center row:↓, left column:←", () => {
        const area = new Area(Area.createPlaneToAllIls(positions, indices), {
          centerRow: {
            plane: new FreePlane(
              new THREE.Vector3(0, -1, 0), // y: 1 -> -1
              new THREE.Vector3(0.5, 0.5, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(4, true),
                  new VertexIntersection(5, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(6, true),
                ],
                false
              ),
            ]),
          },
          leftColumn: {
            plane: new FreePlane(
              new THREE.Vector3(-1, 0, 0), // x: 1 -> -1
              new THREE.Vector3(0.25, 0.75, 0)
            ),
            ilp: new IntersectionLoopPicker([
              new IntersectionLoop(
                [
                  new VertexIntersection(7, true),
                  new VertexIntersection(8, true),
                  new VertexIntersection(9, true),
                  new VertexIntersection(10, true),
                  new VertexIntersection(11, true),
                ],
                false
              ),
            ]),
          },
        });

        const foundVertices: number[] = [];
        const foundFaces: number[][] = [];
        const expectedFoundVertices: number[] = [
          4, 5, 9, 6, 7, 8, 10, 11, 1, 0, 2,
        ];
        const expectedFoundFaces: number[][] = [
          [4, 1, 5],
          [1, 7, 5],
          [5, 8, 9],
          [8, 6, 9],
          [7, 0, 8],
          [8, 0, 6],
          [9, 6, 10],
          [10, 2, 11],
          [6, 2, 10],
        ]; // TODO: fix
        findAdjacentFacesWithinArea(
          area,
          foundVertices,
          foundFaces,
          indicesMap,
          positions
        );
        expect(foundVertices).toEqual(expectedFoundVertices);
        expect(foundFaces).toEqual(expectedFoundFaces);
      });
    });
  });
});

describe("findFirstFaces()", () => {
  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("plane(flat) example", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
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
      //
      [1, -0.5, 0], // added
      [0.5, -0.5, 0], // added
      [0, -0.5, 0], // added
      [-0.5, -0.5, 0], // added
      [-1, -0.5, 0], // added
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      // [0, 1, 4], // removed
      // [0, 4, 3], // removed
      // [1, 2, 5], // removed
      // [1, 5, 4], // removed
      [3, 4, 7],
      [3, 7, 6],
      [4, 5, 8],
      [4, 8, 7],
      //
      [5, 10, 9], // added
      [10, 2, 9], // added
      [10, 1, 2], // added
      [11, 1, 10], // added
      [4, 10, 5], // added
      [4, 11, 10], // added
      [4, 12, 11], // added
      [12, 1, 11], // added
      [12, 0, 1], // added
      [13, 0, 12], // added
      [3, 12, 4], // added
      [3, 13, 12], // added
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const plane = new FreePlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -0.5, 0) // y: 0.5 -> -0.5
    );
    const il = new IntersectionLoop(
      [
        new VertexIntersection(9, true),
        new VertexIntersection(10, true),
        new VertexIntersection(11, true),
        new VertexIntersection(12, true),
        new VertexIntersection(13, true),
      ],
      false
    );

    const foundVertices: number[] = [];
    const firstFaces: number[][] = [];
    const expectedFoundVertices: number[] = [9, 10, 11, 12, 13];
    const expectedFirstFaces: number[][] = [
      [5, 10, 9],
      [4, 11, 10],
      [4, 12, 11],
      [3, 13, 12],
    ];
    findFirstFaces(plane, il, foundVertices, firstFaces, indicesMap, positions);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(firstFaces).toEqual(expectedFirstFaces);
  });

  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("cube example", () => {
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
      [1, 0.5, 0], // added
      [0.5, 0.5, 0], // added
      [0, 0.5, 0], // added
      [0, 0.5, 0.5], // added
      [0, 0.5, 1], // added
      [0.5, 0.5, 1], // added
      [1, 0.5, 1], // added
      [1, 0.5, 0.5], // added
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      [0, 1, 2],
      [0, 2, 3],
      // [0, 1, 5], // removed
      // [0, 5, 4], // removed
      // [1, 2, 6], // removed
      // [1, 6, 5], // removed
      // [2, 3, 7], // removed
      // [2, 7, 6], // removed
      // [3, 0, 4], // removed
      // [3, 4, 7], // removed
      [4, 5, 6],
      [4, 6, 7],
      //
      [5, 8, 9], // added
      [8, 1, 9], // added
      [1, 0, 9], // added
      [9, 0, 10], // added
      [5, 9, 4], // added
      [9, 10, 4], // added
      [4, 10, 11], // added
      [10, 0, 11], // added
      [0, 3, 11], // added
      [11, 3, 12], // added
      [4, 11, 7], // added
      [11, 12, 7], // added
      [7, 12, 13], // added
      [12, 3, 13], // added
      [3, 2, 13], // added
      [13, 2, 14], // added
      [7, 13, 6], // added
      [13, 14, 6], // added
      [6, 14, 15], // added
      [14, 2, 15], // added
      [2, 1, 15], // added
      [15, 1, 8], // added
      [6, 15, 5], // added
      [15, 8, 5], // added
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const plane = new FreePlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0.5, 0)
    );
    const il = new IntersectionLoop(
      [
        new VertexIntersection(8, true),
        new VertexIntersection(9, true),
        new VertexIntersection(10, true),
        new VertexIntersection(11, true),
        new VertexIntersection(12, true),
        new VertexIntersection(13, true),
        new VertexIntersection(14, true),
        new VertexIntersection(15, true),
      ],
      true
    );

    const foundVertices: number[] = [];
    const firstFaces: number[][] = [];
    const expectedFoundVertices: number[] = [8, 9, 10, 11, 12, 13, 14, 15];
    const expectedFirstFaces: number[][] = [
      [5, 8, 9],
      [9, 10, 4],
      [4, 10, 11],
      [11, 12, 7],
      [7, 12, 13],
      [13, 14, 6],
      [6, 14, 15],
      [15, 8, 5],
    ];
    findFirstFaces(plane, il, foundVertices, firstFaces, indicesMap, positions);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(firstFaces).toEqual(expectedFirstFaces);
  });
});

describe("findAdjacentFaces()", () => {
  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("plane(flat) example", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
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
    const indicesMap = createIndicesMap(nPolygonIndices);

    const face = indicesMap["4,7"][0];
    expect(face).toEqual([3, 4, 7]);
    const foundVertices: number[] = [];
    const foundFaces: number[][] = [];
    const expectedFoundVertices: number[] = [3, 0, 1, 2, 5, 4, 8, 7, 6];
    const expectedFoundFaces: number[][] = [
      [3, 4, 7],
      [0, 4, 3],
      [0, 1, 4],
      [1, 2, 5],
      [1, 5, 4],
      [4, 5, 8],
      [4, 8, 7],
      [3, 7, 6],
    ];
    findAdjacentFaces(face, foundVertices, foundFaces, indicesMap);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });

  // Import from test/cross-section/intersection/intersection-loops.test.ts.
  test("cube example", () => {
    const indicesArray = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 1, 5],
      [0, 5, 4],
      [1, 2, 6],
      [1, 6, 5],
      [2, 3, 7],
      [2, 7, 6],
      [3, 0, 4],
      [3, 4, 7],
      [4, 5, 6],
      [4, 6, 7],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const face = indicesMap["0,1"][0];
    expect(face).toEqual([0, 1, 2]);
    const foundVertices: number[] = [];
    const foundFaces: number[][] = [];
    const expectedFoundVertices: number[] = [0, 2, 1, 5, 4, 3, 7, 6];
    const expectedFoundFaces: number[][] = [
      [0, 1, 2],
      [0, 2, 3],
      [1, 2, 6],
      [0, 1, 5],
      [0, 5, 4],
      [3, 0, 4],
      [2, 3, 7],
      [2, 7, 6],
      [1, 6, 5],
      [4, 5, 6],
      [4, 6, 7],
      [3, 4, 7],
    ];
    findAdjacentFaces(face, foundVertices, foundFaces, indicesMap);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });
});
