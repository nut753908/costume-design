import {
  EdgeIntersection,
  type EdgeIntersectionJSON,
} from "src/cross-section/intersection/edge-intersection";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("EdgeIntersection", () => {
  test("constructor()", () => {
    const ei = new EdgeIntersection(0, 1, 0.5, true);
    expect(ei.backV).toBe(0);
    expect(ei.frontV).toBe(1);
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

  describe("equals()", () => {
    test("if (!(i instanceof EdgeIntersection))", () => {
      const ei = new EdgeIntersection(0, 1, 0.5);
      const vi = new VertexIntersection(0);
      expect(ei.equals(vi)).toBe(false);
    });

    describe("else", () => {
      test.each([
        [[0, 1], [0, 1], true],
        [[0, 1], [1, 0], false],
        [[0, 1], [0, 2], false],
        [[0, 1], [2, 1], false],
      ])(
        "params1:%j, params2:%j, expected:%o",
        (params1, params2, expected) => {
          const ei1 = new EdgeIntersection(...params1, 0.5);
          const ei2 = new EdgeIntersection(...params2, 0.5);
          expect(ei1.equals(ei2)).toBe(expected);
        }
      );
    });
  });

  describe("has()", () => {
    test("if (!(i instanceof VertexIntersection))", () => {
      const ei1 = new EdgeIntersection(0, 1, 0.5);
      const ei2 = new EdgeIntersection(0, 1, 0.5);
      expect(ei1.has(ei2)).toBe(false);
    });

    describe("else", () => {
      test.each([
        [[0, 1], [0], true],
        [[0, 1], [1], true],
        [[0, 1], [2], false],
      ])(
        "eiParams:%j, viParams:%j, expected:%o",
        (eiParams, viParams, expected) => {
          const ei = new EdgeIntersection(...eiParams, 0.5);
          const vi = new VertexIntersection(...viParams);
          expect(ei.has(vi)).toBe(expected);
        }
      );
    });
  });

  test("toString()", () => {
    const ei = new EdgeIntersection(0, 1, 0.5, true);
    expect(ei.toString()).toBe("0,1");
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
      type: "EdgeIntersection",
      backV: 0,
      frontV: 1,
      u: 0.5,
      checked: true,
    };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ei1 = new EdgeIntersection().fromJSON({
      type: "EdgeIntersection",
      backV: 0,
      frontV: 1,
      u: 0.5,
      checked: true,
    });
    const ei2 = new EdgeIntersection(0, 1, 0.5, true);
    expect(ei1).toEqual(ei2);
  });
});
