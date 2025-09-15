import {
  EdgeIntersection,
  type EdgeIntersectionJSON,
} from "src/cross-section/intersection/edge-intersection";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("EdgeIntersection", () => {
  test("constructor()", () => {
    const ei = new EdgeIntersection(0, 1, 0.5, true);
    expect(ei.topV).toBe(0);
    expect(ei.bottomV).toBe(1);
    expect(ei.u).toBe(0.5);
    expect(ei.checked).toBe(true);
  });

  test("getPoints()", () => {
    const ei = new EdgeIntersection(0, 1, 0.5, true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(ei.getPoint(positions)).toEqual(
      new THREE.Vector3(0 + (3 - 0) * 0.5, 1 + (4 - 1) * 0.5, 2 + (5 - 2) * 0.5)
    );
  });

  test("clone()", () => {
    const ei1 = new EdgeIntersection(0, 1, 0.5, true);
    const ei2 = ei1.clone();
    expect(ei1).toEqual(ei2);
  });

  test("copy()", () => {
    const ei1 = new EdgeIntersection(0, 1, 0.5, true);
    const ei2 = new EdgeIntersection().copy(ei1);
    expect(ei1).toEqual(ei2);
  });

  test("toJSON()", () => {
    const json1 = new EdgeIntersection(0, 1, 0.5, true).toJSON();
    const json2: EdgeIntersectionJSON = {
      topV: 0,
      bottomV: 1,
      u: 0.5,
      checked: true,
    };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ei1 = new EdgeIntersection().fromJSON({
      topV: 0,
      bottomV: 1,
      u: 0.5,
      checked: true,
    });
    const ei2 = new EdgeIntersection(0, 1, 0.5, true);
    expect(ei1).toEqual(ei2);
  });
});
