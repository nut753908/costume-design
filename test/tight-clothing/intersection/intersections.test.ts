import { createAllEdges } from "src/tight-clothing/centerline/edges";
import { EdgeIntersection } from "src/tight-clothing/intersection/edge-intersection";
import { convertToLists } from "src/tight-clothing/intersection/indices";
import { createAllIntersections } from "src/tight-clothing/intersection/intersections";
import { VertexIntersection } from "src/tight-clothing/intersection/vertex-intersection";
import { FreePlane } from "src/tight-clothing/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("createAllIntersections()", () => {
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
    [1, 1, 0], // indices not contained in indicesArray are removed.
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

  test("normal:[0,1,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
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

  test("normal:[1,0,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
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
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0.5, 0, 0)
    );
    const expected = [
      new EdgeIntersection(4, 5, 0.5),
      new EdgeIntersection(1, 5, 0.5),
      new EdgeIntersection(1, 2, 0.5),
      new EdgeIntersection(7, 8, 0.5),
      new EdgeIntersection(4, 8, 0.5),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });

  test("normal:[1,1,0], point:[0,0,0]", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
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
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤4 ◢5  ◤6 ◢7
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤0 ◢1  ◤2 ◢3
     */
    const plane = new FreePlane(
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0.5, 0, 0)
    );
    const expected = [
      new EdgeIntersection(4, 5, 0.5),
      new EdgeIntersection(1, 5, 0.75),
      new EdgeIntersection(2, 5, 0.5),
      new EdgeIntersection(6, 7, 0.5),
      new EdgeIntersection(3, 7, 0.75),
      new EdgeIntersection(4, 7, 0.5),
      new EdgeIntersection(4, 8, 0.25),
    ];
    expect(createAllIntersections(plane, allEdges, positions)).toEqual(
      expected
    );
  });
});
