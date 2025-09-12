import { Edge, type EdgeJSON } from "src/cross-section/edge";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Edge", () => {
  test("constructor()", () => {
    const e = new Edge(0, 1, true);
    expect(e.v1).toBe(0);
    expect(e.v2).toBe(1);
    expect(e.checked).toBe(true);
  });

  test("getPoints()", () => {
    const e = new Edge(0, 1, true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(e.getPoints(positions)).toEqual([
      new THREE.Vector3(0, 1, 2),
      new THREE.Vector3(3, 4, 5),
    ]);
  });

  describe("equals()", () => {
    test.each([
      [[0, 1], [0, 1], true],
      [[0, 1], [1, 0], true],
      [[0, 1], [0, 2], false],
      [[0, 1], [2, 1], false],
    ])("params1:%j, params2:%j, expected:%o", (params1, params2, expected) => {
      const e1 = new Edge(...params1);
      const e2 = new Edge(...params2);
      expect(e1.equals(e2)).toBe(expected);
    });
  });

  test("clone()", () => {
    const e1 = new Edge(0, 1, true);
    const e2 = e1.clone();
    expect(e1).toEqual(e2);
  });

  test("copy()", () => {
    const e1 = new Edge(0, 1, true);
    const e2 = new Edge().copy(e1);
    expect(e1).toEqual(e2);
  });

  test("toJSON()", () => {
    const json1 = new Edge(0, 1, true).toJSON();
    const json2: EdgeJSON = { v1: 0, v2: 1, checked: true };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const e1 = new Edge().fromJSON({ v1: 0, v2: 1, checked: true });
    const e2 = new Edge(0, 1, true);
    expect(e1).toEqual(e2);
  });
});
