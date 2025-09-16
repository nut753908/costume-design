import { createAllEdges } from "src/cross-section/centerline/edges";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { convertToTriangularPolygonIndices } from "src/cross-section/intersection/indices";
import { createAllIntersections } from "src/cross-section/intersection/intersections";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("createAllIntersections()", () => {
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

  test("normal:[0,1,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const plane = new FreePlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0)
    );
    const expected = [
      new VertexIntersection(3),
      new VertexIntersection(4),
      new VertexIntersection(5),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });

  test("normal:[0,1,0], point:[0,0.5,0]", () => {
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

  test("normal:[1,0,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0)
    );
    const expected = [
      new VertexIntersection(1),
      new VertexIntersection(4),
      new VertexIntersection(7),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });

  test("normal:[1,0,0], point:[0.5,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0.5, 0, 0)
    );
    const expected = [
      new EdgeIntersection(1, 2, 0.5),
      new EdgeIntersection(1, 5, 0.5),
      new EdgeIntersection(4, 5, 0.5),
      new EdgeIntersection(4, 8, 0.5),
      new EdgeIntersection(7, 8, 0.5),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });

  test("normal:[1,1,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 0, 0)
    );
    const expected = [
      new EdgeIntersection(1, 5, 0.5),
      new EdgeIntersection(3, 7, 0.5),
      new VertexIntersection(2),
      new VertexIntersection(4),
      new VertexIntersection(6),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });

  test("normal:[1,1,0], point:[0.5,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0.5, 0, 0)
    );
    const expected = [
      new EdgeIntersection(2, 5, 0.5),
      new EdgeIntersection(1, 5, 0.75),
      new EdgeIntersection(4, 5, 0.5),
      new EdgeIntersection(4, 7, 0.5),
      new EdgeIntersection(3, 7, 0.75),
      new EdgeIntersection(6, 7, 0.5),
      new EdgeIntersection(4, 8, 0.25),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });
});
