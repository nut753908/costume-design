import {
  EdgeLoopStack,
  type EdgeLoopStackJSON,
} from "src/cross-section/edge-loop-stack";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("EdgeLoopStack", () => {
  test("constructor()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const s = new EdgeLoopStack(vertices, true);
    expect(s.vertices).toEqual(vertices);
    expect(s.closed).toBe(true);
  });

  test("getPoints()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const s = new EdgeLoopStack(vertices, true);
    const array = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25, 26],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(s.getPoints(positions)).toEqual([
      [
        new THREE.Vector3(0, 1, 2),
        new THREE.Vector3(3, 4, 5),
        new THREE.Vector3(6, 7, 8),
      ],
      [
        new THREE.Vector3(9, 10, 11),
        new THREE.Vector3(12, 13, 14),
        new THREE.Vector3(15, 16, 17),
      ],
    ]);
  });

  test("clone()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const s1 = new EdgeLoopStack(vertices, true);
    const s2 = s1.clone();
    expect(s1).toEqual(s2);
  });

  test("copy()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const s1 = new EdgeLoopStack(vertices, true);
    const s2 = new EdgeLoopStack().copy(s1);
    expect(s1).toEqual(s2);
  });

  test("toJSON()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const json1 = new EdgeLoopStack(vertices, true).toJSON();
    const json2: EdgeLoopStackJSON = { vertices, closed: true };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const vertices = [
      [0, 1, 2],
      [3, 4, 5],
    ];
    const s1 = new EdgeLoopStack().fromJSON({ vertices, closed: true });
    const s2 = new EdgeLoopStack(vertices, true);
    expect(s1).toEqual(s2);
  });
});
