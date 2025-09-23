import {
  splitGeometryUsingIl,
  splitGeometryUsingIls,
} from "src/cross-section/ara/split";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import * as THREE from "three";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("splitGeometryUsingIls()", () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, "error");
  });

  // This example is imported from test/cross-section/intersection/intersection-loop.test.ts.
  test("three triangular pyramids example", () => {
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
    const normalsArray = [
      new THREE.Vector3(-1, -1, -1).normalize().toArray(),
      new THREE.Vector3(3, -1, -1).normalize().toArray(),
      new THREE.Vector3(-1, -1, 3).normalize().toArray(),
      new THREE.Vector3(-1, 3, -1).normalize().toArray(),
      //
      new THREE.Vector3(-6, 1, 0).normalize().toArray(),
      new THREE.Vector3(2, -3, -4).normalize().toArray(),
      new THREE.Vector3(2, -3, 4).normalize().toArray(),
      new THREE.Vector3(2, 5, 0).normalize().toArray(),
      //
      new THREE.Vector3(-1, 0, -1).normalize().toArray(),
      new THREE.Vector3(1, -1, 0).normalize().toArray(),
      new THREE.Vector3(-1, 0, 1).normalize().toArray(),
      new THREE.Vector3(1, 1, 0).normalize().toArray(),
    ].flat();
    const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
    const uvsArray = [
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
    const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", positions);
    geometry.setAttribute("normal", normals);
    geometry.setAttribute("uv", uvs);

    const ils = [
      new IntersectionLoop(
        [
          new EdgeIntersection(1, 3, 0.5),
          new EdgeIntersection(0, 3, 0.5),
          new EdgeIntersection(2, 3, 0.5),
        ],
        true
      ),
      new IntersectionLoop(
        [
          new EdgeIntersection(5, 7, 0.5),
          new EdgeIntersection(6, 7, 0.5),
          new VertexIntersection(4),
        ],
        true
      ),
      new IntersectionLoop(
        [
          new EdgeIntersection(9, 11, 0.5),
          new VertexIntersection(8),
          new VertexIntersection(10),
        ],
        true
      ),
    ];
    const inputGeometry = geometry.clone();
    const inputIls = ils.map((il) => il.clone());
    const obj = splitGeometryUsingIls(inputGeometry, inputIls);
    inputGeometry.uuid = geometry.uuid;
    expect(inputGeometry).toEqual(geometry);
    expect(inputIls).toEqual(ils);

    const newIndicesArray = [
      [0, 1, 2],
      // [0, 1, 3], // removed
      // [1, 2, 3], // removed
      // [2, 0, 3], // removed
      //
      [4, 5, 6],
      // [4, 5, 7], // removed
      // [5, 6, 7], // removed
      // [6, 4, 7], // removed
      //
      [8, 9, 10],
      // [8, 9, 11], // removed
      // [9, 10, 11], // removed
      [10, 8, 11],
      //
      [3, 12, 13], // added
      [12, 0, 13], // added
      [12, 1, 0], // added
      [3, 13, 14], // added
      [13, 0, 14], // added
      [0, 2, 14], // added
      [3, 14, 12], // added
      [14, 2, 12], // added
      [2, 1, 12], // added
      //
      [7, 15, 16], // added
      [15, 5, 16], // added
      [5, 6, 16], // added
      [7, 16, 4], // added
      [16, 6, 4], // added
      [4, 15, 7], // added
      [4, 5, 15], // added
      //
      [11, 17, 8], // added
      [17, 9, 8], // added
      [10, 17, 11], // added
      [10, 9, 17], // added
    ].flat();
    const newIndices = new THREE.Uint16BufferAttribute(newIndicesArray, 1);
    const newPositionsArray = [
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
      //
      [1 + (0 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 1 + (0 - 1) * 0.5], // added
      //
      [3 + (3 - 3) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0.5 - 0) * 0.5], // added
      [3 + (3 - 3) * 0.5, 0 + (1 - 0) * 0.5, 1 + (0.5 - 1) * 0.5], // added
      //
      [5 + (5 - 5) * 0.5, 0 + (1 - 0) * 0.5, 0.5 + (0.5 - 0.5) * 0.5], // added
    ].flat();
    const newPositions = new THREE.Float32BufferAttribute(newPositionsArray, 3);
    const n0 = new THREE.Vector3(-1, -1, -1).normalize();
    const n1 = new THREE.Vector3(3, -1, -1).normalize();
    const n2 = new THREE.Vector3(-1, -1, 3).normalize();
    const n3 = new THREE.Vector3(-1, 3, -1).normalize();
    const n4 = new THREE.Vector3(-6, 1, 0).normalize();
    const n5 = new THREE.Vector3(2, -3, -4).normalize();
    const n6 = new THREE.Vector3(2, -3, 4).normalize();
    const n7 = new THREE.Vector3(2, 5, 0).normalize();
    const n8 = new THREE.Vector3(-1, 0, -1).normalize();
    const n9 = new THREE.Vector3(1, -1, 0).normalize();
    const n10 = new THREE.Vector3(-1, 0, 1).normalize();
    const n11 = new THREE.Vector3(1, 1, 0).normalize();
    const newNormalsArray = [
      n0.toArray(),
      n1.toArray(),
      n2.toArray(),
      n3.toArray(),
      //
      n4.toArray(),
      n5.toArray(),
      n6.toArray(),
      n7.toArray(),
      //
      n8.toArray(),
      n9.toArray(),
      n10.toArray(),
      n11.toArray(),
      //
      new THREE.Vector3(
        n1.x + (n3.x - n1.x) * 0.5,
        n1.y + (n3.y - n1.y) * 0.5,
        n1.z + (n3.z - n1.z) * 0.5
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
        n2.x + (n3.x - n2.x) * 0.5,
        n2.y + (n3.y - n2.y) * 0.5,
        n2.z + (n3.z - n2.z) * 0.5
      )
        .normalize()
        .toArray(), // added
      //
      new THREE.Vector3(
        n5.x + (n7.x - n5.x) * 0.5,
        n5.y + (n7.y - n5.y) * 0.5,
        n5.z + (n7.z - n5.z) * 0.5
      )
        .normalize()
        .toArray(), // added
      new THREE.Vector3(
        n6.x + (n7.x - n6.x) * 0.5,
        n6.y + (n7.y - n6.y) * 0.5,
        n6.z + (n7.z - n6.z) * 0.5
      )
        .normalize()
        .toArray(), // added
      //
      new THREE.Vector3(
        n9.x + (n11.x - n9.x) * 0.5,
        n9.y + (n11.y - n9.y) * 0.5,
        n9.z + (n11.z - n9.z) * 0.5
      )
        .normalize()
        .toArray(), // added
    ].flat();
    const newNormals = new THREE.Float32BufferAttribute(newNormalsArray, 3);
    const newUvsArray = [
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
      //
      [0.2 + (0.1 - 0.2) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      [0.1 + (0.1 - 0.1) * 0.5, 0 + (0.1 - 0) * 0.5], // added
      [0 + (0.1 - 0) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      //
      [0.5 + (0.4 - 0.5) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      [0.3 + (0.4 - 0.3) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      //
      [0.8 + (0.7 - 0.8) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
    ].flat();
    const newUvs = new THREE.Float32BufferAttribute(newUvsArray, 2);
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setIndex(newIndices);
    newGeometry.setAttribute("position", newPositions);
    newGeometry.setAttribute("normal", newNormals);
    newGeometry.setAttribute("uv", newUvs);

    const newIls = [
      new IntersectionLoop(
        [
          new VertexIntersection(12),
          new VertexIntersection(13),
          new VertexIntersection(14),
        ],
        true
      ),
      new IntersectionLoop(
        [
          new VertexIntersection(15),
          new VertexIntersection(16),
          new VertexIntersection(4),
        ],
        true
      ),
      new IntersectionLoop(
        [
          new VertexIntersection(17),
          new VertexIntersection(8),
          new VertexIntersection(10),
        ],
        true
      ),
    ];

    const expected = {
      geometry: newGeometry,
      ils: newIls,
    };
    obj.geometry.uuid = newGeometry.uuid;
    expect(obj.ils).toEqual(expected.ils);

    const objIndices = obj.geometry.getIndex() as THREE.Uint16BufferAttribute;
    const objPositions = obj.geometry.getAttribute(
      "position"
    ) as THREE.Float32BufferAttribute;
    const objNormals = obj.geometry.getAttribute(
      "normal"
    ) as THREE.Float32BufferAttribute;
    const objUvs = obj.geometry.getAttribute(
      "uv"
    ) as THREE.Float32BufferAttribute;

    const expectedIndices =
      expected.geometry.getIndex() as THREE.Uint16BufferAttribute;
    const expectedPositions = expected.geometry.getAttribute(
      "position"
    ) as THREE.Float32BufferAttribute;
    const expectedNormals = expected.geometry.getAttribute(
      "normal"
    ) as THREE.Float32BufferAttribute;
    const expectedUvs = expected.geometry.getAttribute(
      "uv"
    ) as THREE.Float32BufferAttribute;

    expect(objIndices.itemSize).toBe(expectedIndices.itemSize);
    expect(objIndices.count).toBe(expectedIndices.count);
    expect(objIndices.array).toEqual(expectedIndices.array);
    expect(objPositions.itemSize).toBe(expectedPositions.itemSize);
    expect(objPositions.count).toBe(expectedPositions.count);
    expect(objPositions.array.length).toBe(expectedPositions.array.length);
    for (let i = 0, l = objPositions.array.length; i < l; i++) {
      expect(objPositions.array[i]).toBeCloseTo(expectedPositions.array[i]);
    }
    expect(objNormals.itemSize).toBe(expectedNormals.itemSize);
    expect(objNormals.count).toBe(expectedNormals.count);
    expect(objNormals.array.length).toBe(expectedNormals.array.length);
    for (let i = 0, l = objNormals.array.length; i < l; i++) {
      expect(objNormals.array[i]).toBeCloseTo(expectedNormals.array[i]);
    }
    expect(objUvs.itemSize).toBe(expectedUvs.itemSize);
    expect(objUvs.count).toBe(expectedUvs.count);
    expect(objUvs.array.length).toBe(expectedUvs.array.length);
    for (let i = 0, l = objUvs.array.length; i < l; i++) {
      expect(objUvs.array[i]).toBeCloseTo(expectedUvs.array[i]);
    }
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe("splitGeometryUsingIl()", () => {
  // This example is imported from test/cross-section/intersection/intersection-loop.test.ts.
  describe("three triangular pyramids example", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    test("all intersections are edges", () => {
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
      const normalsArray = [
        new THREE.Vector3(-1, -1, -1).normalize().toArray(),
        new THREE.Vector3(3, -1, -1).normalize().toArray(),
        new THREE.Vector3(-1, -1, 3).normalize().toArray(),
        new THREE.Vector3(-1, 3, -1).normalize().toArray(),
        //
        new THREE.Vector3(-6, 1, 0).normalize().toArray(),
        new THREE.Vector3(2, -3, -4).normalize().toArray(),
        new THREE.Vector3(2, -3, 4).normalize().toArray(),
        new THREE.Vector3(2, 5, 0).normalize().toArray(),
        //
        new THREE.Vector3(-1, 0, -1).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 0, 1).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
      ].flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const uvsArray = [
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
      const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute("position", positions);
      geometry.setAttribute("normal", normals);
      geometry.setAttribute("uv", uvs);

      const il = new IntersectionLoop(
        [
          new EdgeIntersection(1, 3, 0.5),
          new EdgeIntersection(0, 3, 0.5),
          new EdgeIntersection(2, 3, 0.5),
        ],
        true
      );
      const inputGeometry = geometry.clone();
      const inputIl = il.clone();
      const obj = splitGeometryUsingIl(inputGeometry, inputIl);
      inputGeometry.uuid = geometry.uuid;
      expect(inputGeometry).toEqual(geometry);
      expect(inputIl).toEqual(il);

      const newIndicesArray = [
        [0, 1, 2],
        // [0, 1, 3], // removed
        // [1, 2, 3], // removed
        // [2, 0, 3], // removed
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
        //
        [3, 12, 13], // added
        [12, 0, 13], // added
        [12, 1, 0], // added
        [3, 13, 14], // added
        [13, 0, 14], // added
        [0, 2, 14], // added
        [3, 14, 12], // added
        [14, 2, 12], // added
        [2, 1, 12], // added
      ].flat();
      const newIndices = new THREE.Uint16BufferAttribute(newIndicesArray, 1);
      const newPositionsArray = [
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
        //
        [1 + (0 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 1 + (0 - 1) * 0.5], // added
      ].flat();
      const newPositions = new THREE.Float32BufferAttribute(
        newPositionsArray,
        3
      );
      const n0 = new THREE.Vector3(-1, -1, -1).normalize();
      const n1 = new THREE.Vector3(3, -1, -1).normalize();
      const n2 = new THREE.Vector3(-1, -1, 3).normalize();
      const n3 = new THREE.Vector3(-1, 3, -1).normalize();
      const newNormalsArray = [
        n0.toArray(),
        n1.toArray(),
        n2.toArray(),
        n3.toArray(),
        //
        new THREE.Vector3(-6, 1, 0).normalize().toArray(),
        new THREE.Vector3(2, -3, -4).normalize().toArray(),
        new THREE.Vector3(2, -3, 4).normalize().toArray(),
        new THREE.Vector3(2, 5, 0).normalize().toArray(),
        //
        new THREE.Vector3(-1, 0, -1).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 0, 1).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
        //
        new THREE.Vector3(
          n1.x + (n3.x - n1.x) * 0.5,
          n1.y + (n3.y - n1.y) * 0.5,
          n1.z + (n3.z - n1.z) * 0.5
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
          n2.x + (n3.x - n2.x) * 0.5,
          n2.y + (n3.y - n2.y) * 0.5,
          n2.z + (n3.z - n2.z) * 0.5
        )
          .normalize()
          .toArray(), // added
      ].flat();
      const newNormals = new THREE.Float32BufferAttribute(newNormalsArray, 3);
      const newUvsArray = [
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
        //
        [0.2 + (0.1 - 0.2) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
        [0.1 + (0.1 - 0.1) * 0.5, 0 + (0.1 - 0) * 0.5], // added
        [0 + (0.1 - 0) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      ].flat();
      const newUvs = new THREE.Float32BufferAttribute(newUvsArray, 2);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setIndex(newIndices);
      newGeometry.setAttribute("position", newPositions);
      newGeometry.setAttribute("normal", newNormals);
      newGeometry.setAttribute("uv", newUvs);

      const newIl = new IntersectionLoop(
        [
          new VertexIntersection(12),
          new VertexIntersection(13),
          new VertexIntersection(14),
        ],
        true
      );

      const expected = {
        geometry: newGeometry,
        il: newIl,
      };
      obj.geometry.uuid = newGeometry.uuid;
      expect(obj.il).toEqual(expected.il);

      const objIndices = obj.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const objPositions = obj.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const objNormals = obj.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const objUvs = obj.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      const expectedIndices =
        expected.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const expectedPositions = expected.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const expectedNormals = expected.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const expectedUvs = expected.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      expect(objIndices.itemSize).toBe(expectedIndices.itemSize);
      expect(objIndices.count).toBe(expectedIndices.count);
      expect(objIndices.array).toEqual(expectedIndices.array);
      expect(objPositions.itemSize).toBe(expectedPositions.itemSize);
      expect(objPositions.count).toBe(expectedPositions.count);
      expect(objPositions.array.length).toBe(expectedPositions.array.length);
      for (let i = 0, l = objPositions.array.length; i < l; i++) {
        expect(objPositions.array[i]).toBeCloseTo(expectedPositions.array[i]);
      }
      expect(objNormals.itemSize).toBe(expectedNormals.itemSize);
      expect(objNormals.count).toBe(expectedNormals.count);
      expect(objNormals.array.length).toBe(expectedNormals.array.length);
      for (let i = 0, l = objNormals.array.length; i < l; i++) {
        expect(objNormals.array[i]).toBeCloseTo(expectedNormals.array[i]);
      }
      expect(objUvs.itemSize).toBe(expectedUvs.itemSize);
      expect(objUvs.count).toBe(expectedUvs.count);
      expect(objUvs.array.length).toBe(expectedUvs.array.length);
      for (let i = 0, l = objUvs.array.length; i < l; i++) {
        expect(objUvs.array[i]).toBeCloseTo(expectedUvs.array[i]);
      }
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("one intersection is a vertex, two intersections are edges", () => {
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
      const normalsArray = [
        new THREE.Vector3(-1, -1, -1).normalize().toArray(),
        new THREE.Vector3(3, -1, -1).normalize().toArray(),
        new THREE.Vector3(-1, -1, 3).normalize().toArray(),
        new THREE.Vector3(-1, 3, -1).normalize().toArray(),
        //
        new THREE.Vector3(-6, 1, 0).normalize().toArray(),
        new THREE.Vector3(2, -3, -4).normalize().toArray(),
        new THREE.Vector3(2, -3, 4).normalize().toArray(),
        new THREE.Vector3(2, 5, 0).normalize().toArray(),
        //
        new THREE.Vector3(-1, 0, -1).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 0, 1).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
      ].flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const uvsArray = [
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
      const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute("position", positions);
      geometry.setAttribute("normal", normals);
      geometry.setAttribute("uv", uvs);

      const il = new IntersectionLoop(
        [
          new EdgeIntersection(5, 7, 0.5),
          new EdgeIntersection(6, 7, 0.5),
          new VertexIntersection(4),
        ],
        true
      );
      const inputGeometry = geometry.clone();
      const inputIl = il.clone();
      const obj = splitGeometryUsingIl(inputGeometry, inputIl);
      inputGeometry.uuid = geometry.uuid;
      expect(inputGeometry).toEqual(geometry);
      expect(inputIl).toEqual(il);

      const newIndicesArray = [
        [0, 1, 2],
        [0, 1, 3],
        [1, 2, 3],
        [2, 0, 3],
        //
        [4, 5, 6],
        // [4, 5, 7], // removed
        // [5, 6, 7], // removed
        // [6, 4, 7], // removed
        //
        [8, 9, 10],
        [8, 9, 11],
        [9, 10, 11],
        [10, 8, 11],
        //
        [7, 12, 13], // added
        [12, 5, 13], // added
        [5, 6, 13], // added
        [7, 13, 4], // added
        [13, 6, 4], // added
        [4, 12, 7], // added
        [4, 5, 12], // added
      ].flat();
      const newIndices = new THREE.Uint16BufferAttribute(newIndicesArray, 1);
      const newPositionsArray = [
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
        //
        [3 + (3 - 3) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0.5 - 0) * 0.5], // added
        [3 + (3 - 3) * 0.5, 0 + (1 - 0) * 0.5, 1 + (0.5 - 1) * 0.5], // added
      ].flat();
      const newPositions = new THREE.Float32BufferAttribute(
        newPositionsArray,
        3
      );
      const n4 = new THREE.Vector3(-6, 1, 0).normalize();
      const n5 = new THREE.Vector3(2, -3, -4).normalize();
      const n6 = new THREE.Vector3(2, -3, 4).normalize();
      const n7 = new THREE.Vector3(2, 5, 0).normalize();
      const newNormalsArray = [
        new THREE.Vector3(-1, -1, -1).normalize().toArray(),
        new THREE.Vector3(3, -1, -1).normalize().toArray(),
        new THREE.Vector3(-1, -1, 3).normalize().toArray(),
        new THREE.Vector3(-1, 3, -1).normalize().toArray(),
        //
        n4.toArray(),
        n5.toArray(),
        n6.toArray(),
        n7.toArray(),
        //
        new THREE.Vector3(-1, 0, -1).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 0, 1).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
        //
        new THREE.Vector3(
          n5.x + (n7.x - n5.x) * 0.5,
          n5.y + (n7.y - n5.y) * 0.5,
          n5.z + (n7.z - n5.z) * 0.5
        )
          .normalize()
          .toArray(), // added
        new THREE.Vector3(
          n6.x + (n7.x - n6.x) * 0.5,
          n6.y + (n7.y - n6.y) * 0.5,
          n6.z + (n7.z - n6.z) * 0.5
        )
          .normalize()
          .toArray(), // added
      ].flat();
      const newNormals = new THREE.Float32BufferAttribute(newNormalsArray, 3);
      const newUvsArray = [
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
        //
        [0.5 + (0.4 - 0.5) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
        [0.3 + (0.4 - 0.3) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      ].flat();
      const newUvs = new THREE.Float32BufferAttribute(newUvsArray, 2);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setIndex(newIndices);
      newGeometry.setAttribute("position", newPositions);
      newGeometry.setAttribute("normal", newNormals);
      newGeometry.setAttribute("uv", newUvs);

      const newIl = new IntersectionLoop(
        [
          new VertexIntersection(12),
          new VertexIntersection(13),
          new VertexIntersection(4),
        ],
        true
      );

      const expected = {
        geometry: newGeometry,
        il: newIl,
      };
      obj.geometry.uuid = newGeometry.uuid;
      expect(obj.il).toEqual(expected.il);

      const objIndices = obj.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const objPositions = obj.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const objNormals = obj.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const objUvs = obj.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      const expectedIndices =
        expected.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const expectedPositions = expected.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const expectedNormals = expected.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const expectedUvs = expected.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      expect(objIndices.itemSize).toBe(expectedIndices.itemSize);
      expect(objIndices.count).toBe(expectedIndices.count);
      expect(objIndices.array).toEqual(expectedIndices.array);
      expect(objPositions.itemSize).toBe(expectedPositions.itemSize);
      expect(objPositions.count).toBe(expectedPositions.count);
      expect(objPositions.array.length).toBe(expectedPositions.array.length);
      for (let i = 0, l = objPositions.array.length; i < l; i++) {
        expect(objPositions.array[i]).toBeCloseTo(expectedPositions.array[i]);
      }
      expect(objNormals.itemSize).toBe(expectedNormals.itemSize);
      expect(objNormals.count).toBe(expectedNormals.count);
      expect(objNormals.array.length).toBe(expectedNormals.array.length);
      for (let i = 0, l = objNormals.array.length; i < l; i++) {
        expect(objNormals.array[i]).toBeCloseTo(expectedNormals.array[i]);
      }
      expect(objUvs.itemSize).toBe(expectedUvs.itemSize);
      expect(objUvs.count).toBe(expectedUvs.count);
      expect(objUvs.array.length).toBe(expectedUvs.array.length);
      for (let i = 0, l = objUvs.array.length; i < l; i++) {
        expect(objUvs.array[i]).toBeCloseTo(expectedUvs.array[i]);
      }
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("two intersection are vertices, one intersections is an edge", () => {
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
      const normalsArray = [
        new THREE.Vector3(-1, -1, -1).normalize().toArray(),
        new THREE.Vector3(3, -1, -1).normalize().toArray(),
        new THREE.Vector3(-1, -1, 3).normalize().toArray(),
        new THREE.Vector3(-1, 3, -1).normalize().toArray(),
        //
        new THREE.Vector3(-6, 1, 0).normalize().toArray(),
        new THREE.Vector3(2, -3, -4).normalize().toArray(),
        new THREE.Vector3(2, -3, 4).normalize().toArray(),
        new THREE.Vector3(2, 5, 0).normalize().toArray(),
        //
        new THREE.Vector3(-1, 0, -1).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 0, 1).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
      ].flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const uvsArray = [
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
      const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute("position", positions);
      geometry.setAttribute("normal", normals);
      geometry.setAttribute("uv", uvs);

      const il = new IntersectionLoop(
        [
          new EdgeIntersection(9, 11, 0.5),
          new VertexIntersection(8),
          new VertexIntersection(10),
        ],
        true
      );
      const inputGeometry = geometry.clone();
      const inputIl = il.clone();
      const obj = splitGeometryUsingIl(inputGeometry, inputIl);
      inputGeometry.uuid = geometry.uuid;
      expect(inputGeometry).toEqual(geometry);
      expect(inputIl).toEqual(il);

      const newIndicesArray = [
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
        // [8, 9, 11], // removed
        // [9, 10, 11], // removed
        [10, 8, 11], // removed
        //
        [11, 12, 8], // added
        [12, 9, 8], // added
        [10, 12, 11], // added
        [10, 9, 12], // added
      ].flat();
      const newIndices = new THREE.Uint16BufferAttribute(newIndicesArray, 1);
      const newPositionsArray = [
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
        //
        [5 + (5 - 5) * 0.5, 0 + (1 - 0) * 0.5, 0.5 + (0.5 - 0.5) * 0.5], // added
      ].flat();
      const newPositions = new THREE.Float32BufferAttribute(
        newPositionsArray,
        3
      );
      const n8 = new THREE.Vector3(-1, 0, -1).normalize();
      const n9 = new THREE.Vector3(1, -1, 0).normalize();
      const n10 = new THREE.Vector3(-1, 0, 1).normalize();
      const n11 = new THREE.Vector3(1, 1, 0).normalize();
      const newNormalsArray = [
        new THREE.Vector3(-1, -1, -1).normalize().toArray(),
        new THREE.Vector3(3, -1, -1).normalize().toArray(),
        new THREE.Vector3(-1, -1, 3).normalize().toArray(),
        new THREE.Vector3(-1, 3, -1).normalize().toArray(),
        //
        new THREE.Vector3(-6, 1, 0).normalize().toArray(),
        new THREE.Vector3(2, -3, -4).normalize().toArray(),
        new THREE.Vector3(2, -3, 4).normalize().toArray(),
        new THREE.Vector3(2, 5, 0).normalize().toArray(),
        //
        n8.toArray(),
        n9.toArray(),
        n10.toArray(),
        n11.toArray(),
        //
        new THREE.Vector3(
          n9.x + (n11.x - n9.x) * 0.5,
          n9.y + (n11.y - n9.y) * 0.5,
          n9.z + (n11.z - n9.z) * 0.5
        )
          .normalize()
          .toArray(), // added
      ].flat();
      const newNormals = new THREE.Float32BufferAttribute(newNormalsArray, 3);
      const newUvsArray = [
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
        //
        [0.8 + (0.7 - 0.8) * 0.5, 0.2 + (0.1 - 0.2) * 0.5], // added
      ].flat();
      const newUvs = new THREE.Float32BufferAttribute(newUvsArray, 2);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setIndex(newIndices);
      newGeometry.setAttribute("position", newPositions);
      newGeometry.setAttribute("normal", newNormals);
      newGeometry.setAttribute("uv", newUvs);

      const newIl = new IntersectionLoop(
        [
          new VertexIntersection(12),
          new VertexIntersection(8),
          new VertexIntersection(10),
        ],
        true
      );

      const expected = {
        geometry: newGeometry,
        il: newIl,
      };
      obj.geometry.uuid = newGeometry.uuid;
      expect(obj.il).toEqual(expected.il);

      const objIndices = obj.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const objPositions = obj.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const objNormals = obj.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const objUvs = obj.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      const expectedIndices =
        expected.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const expectedPositions = expected.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const expectedNormals = expected.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const expectedUvs = expected.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      expect(objIndices.itemSize).toBe(expectedIndices.itemSize);
      expect(objIndices.count).toBe(expectedIndices.count);
      expect(objIndices.array).toEqual(expectedIndices.array);
      expect(objPositions.itemSize).toBe(expectedPositions.itemSize);
      expect(objPositions.count).toBe(expectedPositions.count);
      expect(objPositions.array.length).toBe(expectedPositions.array.length);
      for (let i = 0, l = objPositions.array.length; i < l; i++) {
        expect(objPositions.array[i]).toBeCloseTo(expectedPositions.array[i]);
      }
      expect(objNormals.itemSize).toBe(expectedNormals.itemSize);
      expect(objNormals.count).toBe(expectedNormals.count);
      expect(objNormals.array.length).toBe(expectedNormals.array.length);
      for (let i = 0, l = objNormals.array.length; i < l; i++) {
        expect(objNormals.array[i]).toBeCloseTo(expectedNormals.array[i]);
      }
      expect(objUvs.itemSize).toBe(expectedUvs.itemSize);
      expect(objUvs.count).toBe(expectedUvs.count);
      expect(objUvs.array.length).toBe(expectedUvs.array.length);
      for (let i = 0, l = objUvs.array.length; i < l; i++) {
        expect(objUvs.array[i]).toBeCloseTo(expectedUvs.array[i]);
      }
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("plane example", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    /**
     * flat layout:
     *   2(0, 1) 3(1, 1)
     *   0(0, 0) 1(1, 0)  ◤1 ◢0
     */
    test("check if il.closed is false", () => {
      const indicesArray = [
        [0, 1, 3],
        [0, 3, 2],
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const normalsArray = [
        new THREE.Vector3(-1, -1, 0).normalize().toArray(),
        new THREE.Vector3(1, -1, 0).normalize().toArray(),
        new THREE.Vector3(-1, 1, 0).normalize().toArray(),
        new THREE.Vector3(1, 1, 0).normalize().toArray(),
      ].flat();
      const normals = new THREE.Float32BufferAttribute(normalsArray, 3);
      const uvsArray = [
        [0, 0],
        [0.1, 0],
        [0.1, 0],
        [0.1, 0.1],
      ].flat();
      const uvs = new THREE.Float32BufferAttribute(uvsArray, 2);
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute("position", positions);
      geometry.setAttribute("normal", normals);
      geometry.setAttribute("uv", uvs);

      const il = new IntersectionLoop(
        [
          new EdgeIntersection(1, 3, 0.5),
          new EdgeIntersection(0, 3, 0.5),
          new EdgeIntersection(0, 2, 0.5),
        ],
        false
      );
      const inputGeometry = geometry.clone();
      const inputIl = il.clone();
      const obj = splitGeometryUsingIl(inputGeometry, inputIl);
      inputGeometry.uuid = geometry.uuid;
      expect(inputGeometry).toEqual(geometry);
      expect(inputIl).toEqual(il);

      /**
       * flat layout:
       *   2(0, 1) 3(1, 1)
       *   0(0, 0) 1(1, 0)  ◤1 ◢0
       */
      const newIndicesArray = [
        // [0, 1, 3], // removed
        // [0, 3, 2], // removed
        //
        [3, 4, 5], // added
        [4, 1, 5], // added
        [1, 0, 5], // added
        [5, 0, 6], // added
        [3, 5, 2], // added
        [5, 6, 2], // added
      ].flat();
      const newIndices = new THREE.Uint16BufferAttribute(newIndicesArray, 1);
      const newPositionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        //
        [1 + (1 - 1) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (1 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
        [0 + (0 - 0) * 0.5, 0 + (1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      ].flat();
      const newPositions = new THREE.Float32BufferAttribute(
        newPositionsArray,
        3
      );
      const n0 = new THREE.Vector3(-1, -1, 0).normalize();
      const n1 = new THREE.Vector3(1, -1, 0).normalize();
      const n2 = new THREE.Vector3(-1, 1, 0).normalize();
      const n3 = new THREE.Vector3(1, 1, 0).normalize();
      const newNormalsArray = [
        n0.toArray(),
        n1.toArray(),
        n2.toArray(),
        n3.toArray(),
        //
        new THREE.Vector3(
          n1.x + (n3.x - n1.x) * 0.5,
          n1.y + (n3.y - n1.y) * 0.5,
          n1.z + (n3.z - n1.z) * 0.5
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
          n0.x + (n2.x - n0.x) * 0.5,
          n0.y + (n2.y - n0.y) * 0.5,
          n0.z + (n2.z - n0.z) * 0.5
        )
          .normalize()
          .toArray(), // added
      ].flat();
      const newNormals = new THREE.Float32BufferAttribute(newNormalsArray, 3);
      const newUvsArray = [
        [0, 0],
        [0.1, 0],
        [0.1, 0],
        [0.1, 0.1],
        //
        [0.1 + (0.1 - 0.1) * 0.5, 0 + (0.1 - 0) * 0.5], // added
        [0 + (0.1 - 0) * 0.5, 0 + (0.1 - 0) * 0.5], // added
        [0 + (0.1 - 0) * 0.5, 0 + (0 - 0) * 0.5], // added
      ].flat();
      const newUvs = new THREE.Float32BufferAttribute(newUvsArray, 2);
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setIndex(newIndices);
      newGeometry.setAttribute("position", newPositions);
      newGeometry.setAttribute("normal", newNormals);
      newGeometry.setAttribute("uv", newUvs);

      const newIl = new IntersectionLoop(
        [
          new VertexIntersection(4),
          new VertexIntersection(5),
          new VertexIntersection(6),
        ],
        false
      );

      const expected = {
        geometry: newGeometry,
        il: newIl,
      };
      obj.geometry.uuid = newGeometry.uuid;
      expect(obj.il).toEqual(expected.il);

      const objIndices = obj.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const objPositions = obj.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const objNormals = obj.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const objUvs = obj.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      const expectedIndices =
        expected.geometry.getIndex() as THREE.Uint16BufferAttribute;
      const expectedPositions = expected.geometry.getAttribute(
        "position"
      ) as THREE.Float32BufferAttribute;
      const expectedNormals = expected.geometry.getAttribute(
        "normal"
      ) as THREE.Float32BufferAttribute;
      const expectedUvs = expected.geometry.getAttribute(
        "uv"
      ) as THREE.Float32BufferAttribute;

      expect(objIndices.itemSize).toBe(expectedIndices.itemSize);
      expect(objIndices.count).toBe(expectedIndices.count);
      expect(objIndices.array).toEqual(expectedIndices.array);
      expect(objPositions.itemSize).toBe(expectedPositions.itemSize);
      expect(objPositions.count).toBe(expectedPositions.count);
      expect(objPositions.array.length).toBe(expectedPositions.array.length);
      for (let i = 0, l = objPositions.array.length; i < l; i++) {
        expect(objPositions.array[i]).toBeCloseTo(expectedPositions.array[i]);
      }
      expect(objNormals.itemSize).toBe(expectedNormals.itemSize);
      expect(objNormals.count).toBe(expectedNormals.count);
      expect(objNormals.array.length).toBe(expectedNormals.array.length);
      for (let i = 0, l = objNormals.array.length; i < l; i++) {
        expect(objNormals.array[i]).toBeCloseTo(expectedNormals.array[i]);
      }
      expect(objUvs.itemSize).toBe(expectedUvs.itemSize);
      expect(objUvs.count).toBe(expectedUvs.count);
      expect(objUvs.array.length).toBe(expectedUvs.array.length);
      for (let i = 0, l = objUvs.array.length; i < l; i++) {
        expect(objUvs.array[i]).toBeCloseTo(expectedUvs.array[i]);
      }
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
