import { createAllEdges } from "src/cross-section/centerline/edges";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  convertToTriangularPolygonIndices,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import { createAllIntersectionLoops } from "src/cross-section/intersection/intersection-loops";
import { createAllIntersections } from "src/cross-section/intersection/intersections";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("createAllIntersectionLoops()", () => {
  describe("three triangular pyramid example", () => {
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
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(1, 3, 0.5),
        new EdgeIntersection(0, 3, 0.5),
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
        [
          new EdgeIntersection(1, 3, 0.5, true),
          new EdgeIntersection(0, 3, 0.5, true),
          new EdgeIntersection(2, 3, 0.5, true),
        ],
        [
          new EdgeIntersection(5, 7, 0.5, true),
          new EdgeIntersection(6, 7, 0.5, true),
          new VertexIntersection(4, true),
        ],
        [
          new EdgeIntersection(9, 11, 0.5, true),
          new VertexIntersection(8, true),
          new VertexIntersection(10, true),
        ],
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
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
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(1, 5, 0.5),
        new EdgeIntersection(0, 5, 0.5),
        new EdgeIntersection(0, 4, 0.5),
        new EdgeIntersection(2, 6, 0.5),
        new EdgeIntersection(1, 6, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(2, 7, 0.5),
        new EdgeIntersection(3, 4, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
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
        [
          new EdgeIntersection(1, 5, 0.5, true),
          new EdgeIntersection(0, 5, 0.5, true),
          new EdgeIntersection(0, 4, 0.5, true),
          new EdgeIntersection(3, 4, 0.5, true),
          new EdgeIntersection(3, 7, 0.5, true),
          new EdgeIntersection(2, 7, 0.5, true),
          new EdgeIntersection(2, 6, 0.5, true),
          new EdgeIntersection(1, 6, 0.5, true),
        ],
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
    });
  });

  describe("plane example", () => {
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
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
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
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
       */
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(4, 7, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(3, 6, 0.5),
        new EdgeIntersection(5, 8, 0.5),
        new EdgeIntersection(4, 8, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
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
        [
          new EdgeIntersection(5, 8, 0.5, true),
          new EdgeIntersection(4, 8, 0.5, true),
          new EdgeIntersection(4, 7, 0.5, true),
          new EdgeIntersection(3, 7, 0.5, true),
          new EdgeIntersection(3, 6, 0.5, true),
        ],
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
    });
  });
});
