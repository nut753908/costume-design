import { Area } from "src/cross-section/area/area";
import {
  findAdjacentFaces,
  findAdjacentFacesWithinArea,
  findFirstFaces,
  findGeometryWithinArea,
  limitGeometryExtent,
} from "src/cross-section/area/find";
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

describe("findGeometryWithinArea()", () => {
  test("example of a plane (flat)", () => {
    /**
     * flat layout:
     *   2(0, 1) 3(1, 1)
     *   0(0, 0) 1(1, 0)  ◤0 ◢1
     */
    const indicesArray = [
      // [0, 2, 3], // removed
      // [0, 3, 1], // removed
      //
      [4, 0, 5], // added
      [2, 5, 3], // added
      [2, 4, 5], // added
      [3, 5, 6], // added
      [5, 1, 6], // added
      [5, 0, 1], // added
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const positionsArray = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      //
      [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const n0 = new THREE.Vector3(-1, -1, 0).normalize();
    const n1 = new THREE.Vector3(1, -1, 0).normalize();
    const n2 = new THREE.Vector3(-1, 1, 0).normalize();
    const n3 = new THREE.Vector3(1, 1, 0).normalize();
    const normalsArray = [
      n0.toArray(),
      n1.toArray(),
      n2.toArray(),
      n3.toArray(),
      //
      new THREE.Vector3(
        n0.x + (n2.x - n0.x) * 0.5,
        n0.y + (n2.y - n0.y) * 0.5,
        n0.z + (n2.z - n0.z) * 0.5
      )
        .normalize()
        .toArray(), // added
      new THREE.Vector3(
        n0.x + (n3.x - n0.x) * 0.5,
        n0.y + (n3.y - n0.y) * 0.5,
        n0.z + (n3.z - n0.z) * 0.5
      )
        .normalize()
        .toArray(), // added
      new THREE.Vector3(
        n1.x + (n3.x - n1.x) * 0.5,
        n1.y + (n3.y - n1.y) * 0.5,
        n1.z + (n3.z - n1.z) * 0.5
      )
        .normalize()
        .toArray(), // added
    ].flat();
    const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
    const uvsArray = [
      [0, 0],
      [0.1, 0],
      [0, 0.1],
      [0.1, 0.1],
      //
      [0 + (0 - 0) * 0.5, 0 + (0.1 - 0) * 0.5], // added [0,0.05]
      [0 + (0.1 - 0) * 0.5, 0 + (0.1 - 0) * 0.5], // added [0.05,0.05]
      [0.1 + (0.1 - 0.1) * 0.5, 0 + (0.1 - 0) * 0.5], // added [0.1,0.05]
    ].flat();
    const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", positions);
    geometry.setAttribute("normal", normals);
    geometry.setAttribute("uv", uvs);

    const css: Area["crossSections"] = {
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
    };
    const area = new Area(Area.createPlaneToAllIls(positions, indices), css);
    const actualGeometry = findGeometryWithinArea(geometry, area);

    const expectedIndicesArray = [
      [3, 0, 1],
      [3, 1, 4],
      [4, 1, 2],
    ].flat();
    const expectedIndices = new THREE.Uint16BufferAttribute(
      expectedIndicesArray,
      1
    );
    const expectedPositionsArray = [
      [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5],
      [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5],
      [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5],
      [0, 1, 0],
      [1, 1, 0],
    ].flat();
    const expectedPositions = new THREE.Float32BufferAttribute(
      expectedPositionsArray,
      3
    );
    const expectedNormalsArray = [
      new THREE.Vector3(
        n0.x + (n2.x - n0.x) * 0.5,
        n0.y + (n2.y - n0.y) * 0.5,
        n0.z + (n2.z - n0.z) * 0.5
      )
        .normalize()
        .toArray(),
      new THREE.Vector3(
        n0.x + (n3.x - n0.x) * 0.5,
        n0.y + (n3.y - n0.y) * 0.5,
        n0.z + (n3.z - n0.z) * 0.5
      )
        .normalize()
        .toArray(),
      new THREE.Vector3(
        n1.x + (n3.x - n1.x) * 0.5,
        n1.y + (n3.y - n1.y) * 0.5,
        n1.z + (n3.z - n1.z) * 0.5
      )
        .normalize()
        .toArray(),
      n2.toArray(),
      n3.toArray(),
    ].flat();
    const expectedNormals = new THREE.Float32BufferAttribute(
      expectedNormalsArray,
      3
    );
    const expectedUvsArray = [
      [0 + (0 - 0) * 0.5, 0 + (0.1 - 0) * 0.5],
      [0 + (0.1 - 0) * 0.5, 0 + (0.1 - 0) * 0.5],
      [0.1 + (0.1 - 0.1) * 0.5, 0 + (0.1 - 0) * 0.5],
      [0, 0.1],
      [0.1, 0.1],
    ].flat();
    const expectedUvs = new THREE.Float32BufferAttribute(expectedUvsArray, 2);
    const expectedGeometry = new THREE.BufferGeometry();
    expectedGeometry.setIndex(expectedIndices);
    expectedGeometry.setAttribute("position", expectedPositions);
    expectedGeometry.setAttribute("normal", expectedNormals);
    expectedGeometry.setAttribute("uv", expectedUvs);

    actualGeometry.uuid = expectedGeometry.uuid;
    expect(actualGeometry).toEqual(expectedGeometry);
  });
});

describe("findAdjacentFacesWithinArea()", () => {
  test("example of a plane (flat)", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
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
      // [0, 3, 4], // removed
      // [0, 4, 1], // removed
      // [1, 4, 5], // removed
      // [1, 5, 2], // removed
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
      //
      [9, 0, 10], // added
      [3, 10, 4], // added
      [3, 9, 10], // added
      [4, 10, 11], // added
      [10, 1, 11], // added
      [10, 0, 1], // added
      [11, 1, 12], // added
      [4, 12, 5], // added
      [4, 11, 12], // added
      [5, 12, 13], // added
      [12, 2, 13], // added
      [12, 1, 2], // added
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
      9, 10, 11, 12, 13, 3, 6, 7, 4, 8, 5,
    ];
    const expectedFoundFaces: number[][] = [
      [3, 9, 10],
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
      [4, 12, 5],
      [5, 12, 13],
      [3, 10, 4],
      [4, 10, 11],
      [4, 11, 12],
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
      // [0, 4, 5], // removed
      // [0, 5, 1], // removed
      // [1, 5, 6], // removed
      // [1, 6, 2], // removed
      // [2, 6, 7], // removed
      // [2, 7, 3], // removed
      // [3, 7, 4], // removed
      // [3, 4, 0], // removed
      [7, 6, 5],
      [7, 5, 4],
      //
      [8, 0, 9], // added
      [4, 9, 5], // added
      [4, 8, 9], // added
      [5, 9, 10], // added
      [9, 1, 10], // added
      [9, 0, 1], // added
      [10, 1, 11], // added
      [5, 11, 6], // added
      [5, 10, 11], // added
      [6, 11, 12], // added
      [11, 2, 12], // added
      [11, 1, 2], // added
      [12, 2, 13], // added
      [6, 13, 7], // added
      [6, 12, 13], // added
      [7, 13, 14], // added
      [13, 3, 14], // added
      [13, 2, 3], // added
      [14, 3, 15], // added
      [7, 15, 4], // added
      [7, 14, 15], // added
      [4, 15, 8], // added
      [15, 0, 8], // added
      [15, 3, 0], // added
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
      8, 9, 10, 11, 12, 13, 14, 15, 4, 7, 6, 5,
    ];
    const expectedFoundFaces: number[][] = [
      [4, 8, 9],
      [7, 5, 4],
      [7, 6, 5],
      [5, 11, 6],
      [4, 9, 5],
      [5, 9, 10],
      [5, 10, 11],
      [6, 11, 12],
      [6, 13, 7],
      [6, 12, 13],
      [7, 13, 14],
      [7, 15, 4],
      [7, 14, 15],
      [4, 15, 8],
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

  describe("example of a plane (flat)2", () => {
    describe("two non-intersecting cross sections", () => {
      /**
       * flat layout:
       *   2(0, 1) 3(1, 1)
       *   0(0, 0) 1(1, 0)  ◤0 ◢1
       */
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        //
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [  0,0.5,0]
        [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0.5,0.5,0]
        [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [  1,0.5,0]
        //
        [0 + (0 - 0) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0.5 + (0 - 0.5) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0.5 + (1 - 0.5) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [1 + (1 - 1) * 0.5, 0.5 + (1 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        // [0, 2, 3], // removed
        // [0, 3, 1], // removed
        //
        [4, 0, 5], // added
        // [2, 5, 3], // added -> removed
        // [2, 4, 5], // added -> removed
        // [3, 5, 6], // added -> removed
        [5, 1, 6], // added
        [5, 0, 1], // added
        //
        [2, 7, 8], // added
        [7, 4, 8], // added
        [4, 5, 8], // added
        [8, 5, 9], // added
        [2, 9, 3], // added
        [2, 8, 9], // added
        [3, 9, 10], // added
        [9, 6, 10], // added
        [9, 5, 6], // added
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const nPolygonIndices = convertToLists(indices, 3);
      const indicesMap = createIndicesMap(nPolygonIndices);

      test("center row:↑, upper row:↑", () => {
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
          upperRow: {
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
        const expectedFoundVertices: number[] = [4, 5, 6, 7, 8, 9, 10, 2, 3];
        const expectedFoundFaces: number[][] = [
          [7, 4, 8],
          [4, 5, 8],
          [8, 5, 9],
          [9, 5, 6],
          [9, 6, 10],
          [2, 7, 8],
          [2, 9, 3],
          [3, 9, 10],
          [2, 8, 9],
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

      test("center row:↑, upper row:↓", () => {
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
          upperRow: {
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
          [7, 4, 8],
          [4, 5, 8],
          [8, 5, 9],
          [9, 5, 6],
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

      test("center row:↓, upper row:↑", () => {
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
          upperRow: {
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
          4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3,
        ];
        const expectedFoundFaces: number[][] = [
          [4, 0, 5],
          [5, 0, 1],
          [5, 1, 6],
          [2, 7, 8],
          [2, 9, 3],
          [3, 9, 10],
          [2, 8, 9],
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

      test("center row:↓, upper row:↓", () => {
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
          upperRow: {
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
        const expectedFoundVertices: number[] = [4, 5, 6, 7, 8, 9, 10, 0, 1];
        const expectedFoundFaces: number[][] = [
          [4, 0, 5],
          [5, 0, 1],
          [5, 1, 6],
          [7, 4, 8],
          [4, 5, 8],
          [8, 5, 9],
          [9, 6, 10],
          [9, 5, 6],
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
    });

    describe("two intersecting cross sections", () => {
      /**
       * flat layout:
       *   2(0, 1) 3(1, 1)
       *   0(0, 0) 1(1, 0)  ◤0 ◢1
       */
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        //
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0,0.5,0]
        [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [0.5,0.5,0]
        [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added [1,0.5,0]
        //
        [0 + (1 - 0) * 0.25, 0 + (0 - 0) * 0.25, 0 + (0 - 0) * 0.25], // added
        [0 + (1 - 0) * 0.25, 0 + (1 - 0) * 0.25, 0 + (0 - 0) * 0.25], // added
        [0 + (0.5 - 0) * 0.5, 0.5 + (0.5 - 0.5) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0.5 - 0) * 0.5, 1 + (0.5 - 1) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (1 - 0) * 0.25, 1 + (1 - 1) * 0.25, 0 + (0 - 0) * 0.25], // added
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        // [0, 2, 3], // removed
        // [0, 3, 1], // removed
        //
        // [4, 0, 5], // added -> removed
        // [2, 5, 3], // added -> removed
        // [2, 4, 5], // added -> removed
        [3, 5, 6], // added
        [5, 1, 6], // added
        // [5, 0, 1], // added -> removed
        //
        [7, 0, 8], // added
        [1, 7, 5], // added
        [7, 8, 5], // added
        [5, 8, 9], // added
        [8, 4, 9], // added
        [8, 0, 4], // added
        [5, 9, 10], // added
        [9, 4, 10], // added
        [4, 2, 10], // added
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
        const expectedFoundVertices: number[] = [
          4, 5, 9, 6, 7, 8, 10, 11, 2, 3, 1,
        ];
        const expectedFoundFaces: number[][] = [
          [9, 4, 10],
          [4, 2, 10],
          [10, 2, 11],
          [3, 5, 6],
          [5, 11, 3],
          [5, 9, 10],
          [5, 10, 11],
          [1, 7, 5],
          [5, 1, 6],
          [7, 8, 5],
          [5, 8, 9],
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
          4, 5, 9, 6, 7, 8, 10, 11, 2, 3, 0,
        ];
        const expectedFoundFaces: number[][] = [
          [9, 4, 10],
          [4, 2, 10],
          [10, 2, 11],
          [3, 5, 6],
          [5, 11, 3],
          [5, 9, 10],
          [5, 10, 11],
          [7, 0, 8],
          [8, 0, 4],
          [8, 4, 9],
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
        const expectedFoundVertices: number[] = [
          4, 5, 9, 6, 7, 8, 10, 11, 0, 1, 3,
        ];
        const expectedFoundFaces: number[][] = [
          [8, 4, 9],
          [8, 0, 4],
          [7, 0, 8],
          [5, 1, 6],
          [1, 7, 5],
          [7, 8, 5],
          [5, 8, 9],
          [5, 9, 10],
          [5, 10, 11],
          [5, 11, 3],
          [3, 5, 6],
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
          4, 5, 9, 6, 7, 8, 10, 11, 0, 1, 2,
        ];
        const expectedFoundFaces: number[][] = [
          [8, 4, 9],
          [8, 0, 4],
          [7, 0, 8],
          [5, 1, 6],
          [1, 7, 5],
          [7, 8, 5],
          [5, 8, 9],
          [9, 4, 10],
          [4, 2, 10],
          [10, 2, 11],
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
    });
  });
});

describe("findFirstFaces()", () => {
  test("example of a plane (flat)", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
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
      // [0, 3, 4], // removed
      // [0, 4, 1], // removed
      // [1, 4, 5], // removed
      // [1, 5, 2], // removed
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
      //
      [9, 0, 10], // added
      [3, 10, 4], // added
      [3, 9, 10], // added
      [4, 10, 11], // added
      [10, 1, 11], // added
      [10, 0, 1], // added
      [11, 1, 12], // added
      [4, 12, 5], // added
      [4, 11, 12], // added
      [5, 12, 13], // added
      [12, 2, 13], // added
      [12, 1, 2], // added
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
      [3, 9, 10],
      [3, 10, 4],
      [4, 10, 11],
      [4, 11, 12],
      [4, 12, 5],
      [5, 12, 13],
    ];
    findFirstFaces(plane, il, foundVertices, firstFaces, indicesMap, positions);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(firstFaces).toEqual(expectedFirstFaces);
  });

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
      // [0, 4, 5], // removed
      // [0, 5, 1], // removed
      // [1, 5, 6], // removed
      // [1, 6, 2], // removed
      // [2, 6, 7], // removed
      // [2, 7, 3], // removed
      // [3, 7, 4], // removed
      // [3, 4, 0], // removed
      [7, 6, 5],
      [7, 5, 4],
      //
      [8, 0, 9], // added
      [4, 9, 5], // added
      [4, 8, 9], // added
      [5, 9, 10], // added
      [9, 1, 10], // added
      [9, 0, 1], // added
      [10, 1, 11], // added
      [5, 11, 6], // added
      [5, 10, 11], // added
      [6, 11, 12], // added
      [11, 2, 12], // added
      [11, 1, 2], // added
      [12, 2, 13], // added
      [6, 13, 7], // added
      [6, 12, 13], // added
      [7, 13, 14], // added
      [13, 3, 14], // added
      [13, 2, 3], // added
      [14, 3, 15], // added
      [7, 15, 4], // added
      [7, 14, 15], // added
      [4, 15, 8], // added
      [15, 0, 8], // added
      [15, 3, 0], // added
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
      [4, 8, 9],
      [4, 15, 8],
      [4, 9, 5],
      [5, 9, 10],
      [5, 10, 11],
      [5, 11, 6],
      [6, 11, 12],
      [6, 12, 13],
      [6, 13, 7],
      [7, 13, 14],
      [7, 14, 15],
      [7, 15, 4],
    ];
    findFirstFaces(plane, il, foundVertices, firstFaces, indicesMap, positions);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(firstFaces).toEqual(expectedFirstFaces);
  });
});

describe("findAdjacentFaces()", () => {
  test("example of a plane (flat)", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
     */
    const indicesArray = [
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 5],
      [1, 5, 2],
      [3, 6, 7],
      [3, 7, 4],
      [4, 7, 8],
      [4, 8, 5],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const indicesMap = createIndicesMap(nPolygonIndices);

    const face = indicesMap["7,4"][0];
    expect(face).toEqual([3, 7, 4]);
    const foundVertices: number[] = [];
    const foundFaces: number[][] = [];
    const expectedFoundVertices: number[] = [3, 0, 4, 1, 5, 8, 7, 6, 2];
    const expectedFoundFaces: number[][] = [
      [3, 7, 4],
      [0, 3, 4],
      [0, 4, 1],
      [1, 4, 5],
      [1, 5, 2],
      [4, 8, 5],
      [4, 7, 8],
      [3, 6, 7],
    ];
    findAdjacentFaces(face, foundVertices, foundFaces, indicesMap);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });

  test("cube example", () => {
    const indicesArray = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 4, 5],
      [0, 5, 1],
      [1, 5, 6],
      [1, 6, 2],
      [2, 6, 7],
      [2, 7, 3],
      [3, 7, 4],
      [3, 4, 0],
      [7, 6, 5],
      [7, 5, 4],
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
      [1, 6, 2],
      [0, 5, 1],
      [0, 4, 5],
      [3, 7, 4],
      [2, 7, 3],
      [2, 6, 7],
      [1, 5, 6],
      [7, 6, 5],
      [7, 5, 4],
      [3, 4, 0],
    ];
    findAdjacentFaces(face, foundVertices, foundFaces, indicesMap);
    expect(foundVertices).toEqual(expectedFoundVertices);
    expect(foundFaces).toEqual(expectedFoundFaces);
  });
});

describe("limitGeometryExtent()", () => {
  test("cube example (no top or bottom)", () => {
    const indicesArray = [
      [0, 4, 5],
      [0, 5, 1],
      [1, 5, 6],
      [1, 6, 2],
      [2, 6, 7],
      [2, 7, 3],
      [3, 7, 4],
      [3, 4, 0],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const positionsArray = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
      [0, 1, 0],
      [1, 1, 0],
      [1, 1, 1],
      [0, 1, 1],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const normalsArray = [
      new THREE.Vector3(-1, -1, -1).normalize().toArray(),
      new THREE.Vector3(1, -1, -1).normalize().toArray(),
      new THREE.Vector3(1, -1, 1).normalize().toArray(),
      new THREE.Vector3(-1, -1, 1).normalize().toArray(),
      new THREE.Vector3(-1, 1, -1).normalize().toArray(),
      new THREE.Vector3(1, 1, -1).normalize().toArray(),
      new THREE.Vector3(1, 1, 1).normalize().toArray(),
      new THREE.Vector3(-1, 1, 1).normalize().toArray(),
    ].flat();
    const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
    const uvsArray = [
      [0, 0],
      [0.1, 0],
      [0.2, 0],
      [0.3, 0],
      [0, 0.1],
      [0.1, 0.1],
      [0.2, 0.1],
      [0.3, 0.1],
    ].flat();
    const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", positions);
    geometry.setAttribute("normal", normals);
    geometry.setAttribute("uv", uvs);

    const foundVertices = [1, 2, 5, 6];
    const foundFaces = [
      [1, 5, 6],
      [1, 6, 2],
    ];
    const actualGeometry = limitGeometryExtent(
      foundVertices,
      foundFaces,
      geometry
    );

    /**
     * v -> map[v]
     * -----------
     * 1 ->   0
     * 2 ->   1
     * 5 ->   2
     * 6 ->   3
     */
    const expectedIndicesArray = [
      [0, 2, 3],
      [0, 3, 1],
    ].flat();
    const expectedIndices = new THREE.Uint16BufferAttribute(
      expectedIndicesArray,
      1
    );
    const expectedPositionsArray = [
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1],
    ].flat();
    const expectedPositions = new THREE.Float32BufferAttribute(
      expectedPositionsArray,
      3
    );
    const expectedNormalsArray = [
      new THREE.Vector3(1, -1, -1).normalize().toArray(),
      new THREE.Vector3(1, -1, 1).normalize().toArray(),
      new THREE.Vector3(1, 1, -1).normalize().toArray(),
      new THREE.Vector3(1, 1, 1).normalize().toArray(),
    ].flat();
    const expectedNormals = new THREE.Float32BufferAttribute(
      expectedNormalsArray,
      3
    );
    const expectedUvsArray = [
      [0.1, 0],
      [0.2, 0],
      [0.1, 0.1],
      [0.2, 0.1],
    ].flat();
    const expectedUvs = new THREE.Float32BufferAttribute(expectedUvsArray, 2);
    const expectedGeometry = new THREE.BufferGeometry();
    expectedGeometry.setIndex(expectedIndices);
    expectedGeometry.setAttribute("position", expectedPositions);
    expectedGeometry.setAttribute("normal", expectedNormals);
    expectedGeometry.setAttribute("uv", expectedUvs);

    actualGeometry.uuid = expectedGeometry.uuid;
    expect(actualGeometry).toEqual(expectedGeometry);
  });
});
