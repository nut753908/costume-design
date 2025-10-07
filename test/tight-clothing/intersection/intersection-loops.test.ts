import { createAllEdges } from "src/tight-clothing/centerline/edges";
import { EdgeIntersection } from "src/tight-clothing/intersection/edge-intersection";
import {
  convertToLists,
  createIndicesMap,
} from "src/tight-clothing/intersection/indices";
import { IntersectionLoop } from "src/tight-clothing/intersection/intersection-loop";
import {
  createAllIntersectionLoops,
  sortIntersectionLoops,
} from "src/tight-clothing/intersection/intersection-loops";
import { createAllIntersections } from "src/tight-clothing/intersection/intersections";
import { VertexIntersection } from "src/tight-clothing/intersection/vertex-intersection";
import { FreePlane } from "src/tight-clothing/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test, vi } from "vitest";

describe("createAllIntersectionLoops()", () => {
  describe("three triangular pyramids example", () => {
    const positionsArray = [
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
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      [0, 1, 2],
      [0, 3, 1],
      [1, 3, 2],
      [2, 3, 0],
      //
      [4, 5, 6],
      [4, 7, 5],
      [5, 7, 6],
      [6, 7, 4],
      //
      [8, 9, 10],
      [8, 11, 9],
      [9, 11, 10],
      [10, 11, 8],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const nPolygonIndices = convertToLists(indices, 3);
    const allEdges = createAllEdges(nPolygonIndices);
    const indicesMap = createIndicesMap(nPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(0, 3, 0.5),
        new EdgeIntersection(1, 3, 0.5),
        new EdgeIntersection(2, 3, 0.5),
        new EdgeIntersection(5, 7, 0.5),
        new EdgeIntersection(6, 7, 0.5),
        new EdgeIntersection(9, 11, 0.5),
        new VertexIntersection(4),
        new VertexIntersection(8),
        new VertexIntersection(10),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
        new IntersectionLoop(
          [
            new EdgeIntersection(0, 3, 0.5, true),
            new EdgeIntersection(1, 3, 0.5, true),
            new EdgeIntersection(2, 3, 0.5, true),
          ],
          true
        ),
        new IntersectionLoop(
          [
            new EdgeIntersection(5, 7, 0.5, true),
            new EdgeIntersection(6, 7, 0.5, true),
            new VertexIntersection(4, true),
          ],
          true
        ),
        new IntersectionLoop(
          [
            new EdgeIntersection(9, 11, 0.5, true),
            new VertexIntersection(8, true),
            new VertexIntersection(10, true),
          ],
          true
        ),
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("cube example", () => {
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
    const allEdges = createAllEdges(nPolygonIndices);
    const indicesMap = createIndicesMap(nPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(0, 4, 0.5),
        new EdgeIntersection(0, 5, 0.5),
        new EdgeIntersection(1, 5, 0.5),
        new EdgeIntersection(1, 6, 0.5),
        new EdgeIntersection(2, 6, 0.5),
        new EdgeIntersection(2, 7, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(3, 4, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
        new IntersectionLoop(
          [
            new EdgeIntersection(0, 4, 0.5, true),
            new EdgeIntersection(0, 5, 0.5, true),
            new EdgeIntersection(1, 5, 0.5, true),
            new EdgeIntersection(1, 6, 0.5, true),
            new EdgeIntersection(2, 6, 0.5, true),
            new EdgeIntersection(2, 7, 0.5, true),
            new EdgeIntersection(3, 7, 0.5, true),
            new EdgeIntersection(3, 4, 0.5, true),
          ],
          true
        ),
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("plane example", () => {
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
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
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
    const allEdges = createAllEdges(nPolygonIndices);
    const indicesMap = createIndicesMap(nPolygonIndices);

    test("all intersections", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
       */
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(3, 6, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(4, 7, 0.5),
        new EdgeIntersection(4, 8, 0.5),
        new EdgeIntersection(5, 8, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
       */
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
        new IntersectionLoop(
          [
            new EdgeIntersection(3, 6, 0.5, true),
            new EdgeIntersection(3, 7, 0.5, true),
            new EdgeIntersection(4, 7, 0.5, true),
            new EdgeIntersection(4, 8, 0.5, true),
            new EdgeIntersection(5, 8, 0.5, true),
          ],
          false
        ),
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  // NOTE: This testing is expensive to perform.
  test("whileLoop: count > 1000", () => {
    const spy = vi
      .spyOn(console, "error")
      .mockImplementationOnce((v) => expect(v).toBe("whileLoop: count > 1000"))
      .mockImplementationOnce((v) => expect(v).toBe("whileLoop: count > 1000"));
    /**
     * top view flat layout:
     *                 4+4i(0,0,1)
     *   1+4i(-1,0,0)     0(0,0,1) 3+4i(1,0,0) ◢2 ◣3
     *                2+4i(0,0,-1)             ◥0 ◤1
     */
    const positionsArray = [[0, 1, 0]]
      .concat(
        Array(250)
          .fill([
            [0, 0, -1],
            [-1, 0, 0],
            [1, 0, 0],
            [0, 0, 1],
          ])
          .flat(),
        [-1, 0, 0]
      )
      .flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
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

    const plane = new FreePlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0.5, 0)
    );
    const allIntersections = createAllIntersections(plane, allEdges, positions);
    const expected = [
      new IntersectionLoop(
        Array(1001)
          .fill(0)
          .map((_, i) => new EdgeIntersection(1 + i, 0, 0.5, true)),
        false
      ),
    ];
    expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
      expected
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe("sortIntersectionLoops()", () => {
  test("check order", () => {
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

    const intersectionLoops = [
      new IntersectionLoop([new VertexIntersection(0)]),
      new IntersectionLoop([new VertexIntersection(1)]),
      new IntersectionLoop([new VertexIntersection(2)]),
      new IntersectionLoop([new VertexIntersection(3)]),
      new IntersectionLoop([new VertexIntersection(4)]),
      new IntersectionLoop([new VertexIntersection(5)]),
      new IntersectionLoop([new VertexIntersection(6)]),
      new IntersectionLoop([new VertexIntersection(7)]),
    ];
    const expected = [
      new IntersectionLoop([new VertexIntersection(0)]),
      new IntersectionLoop([new VertexIntersection(4)]),
      new IntersectionLoop([new VertexIntersection(3)]),
      new IntersectionLoop([new VertexIntersection(7)]),
      new IntersectionLoop([new VertexIntersection(1)]),
      new IntersectionLoop([new VertexIntersection(5)]),
      new IntersectionLoop([new VertexIntersection(2)]),
      new IntersectionLoop([new VertexIntersection(6)]),
    ];
    expect(sortIntersectionLoops(intersectionLoops, positions)).toEqual(
      expected
    );
  });
});
