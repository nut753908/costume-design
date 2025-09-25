import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  VertexIntersection,
  type VertexIntersectionJSON,
} from "src/cross-section/intersection/vertex-intersection";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("VertexIntersection", () => {
  test("constructor()", () => {
    const vi = new VertexIntersection(0, true);
    expect(vi.v).toBe(0);
    expect(vi.checked).toBe(true);
  });

  test("getPoints()", () => {
    const vi = new VertexIntersection(0, true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(vi.getPoint(positions)).toEqual(new THREE.Vector3(0, 1, 2));
  });

  test("getNormal()", () => {
    const vi = new VertexIntersection(0, true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const normals = new THREE.Float32BufferAttribute(array, 3);
    const normal = vi.getNormal(normals);
    const expected = new THREE.Vector3(0, 1, 2).normalize();
    expect(normal.x).toBeCloseTo(expected.x);
    expect(normal.y).toBeCloseTo(expected.y);
    expect(normal.z).toBeCloseTo(expected.z);
  });

  test("getUv()", () => {
    const vi = new VertexIntersection(0, true);
    const array = [0, 1, 2, 3, 4, 5];
    const uvs = new THREE.Float32BufferAttribute(array, 2);
    expect(vi.getUv(uvs)).toEqual(new THREE.Vector2(0, 1));
  });

  describe("equals()", () => {
    test("if (!(i instanceof VertexIntersection))", () => {
      const vi = new VertexIntersection(0);
      const ei = new EdgeIntersection(0, 1, 0.5);
      expect(vi.equals(ei)).toBe(false);
    });

    describe("else", () => {
      test.each([
        [[0], [0], true],
        [[0], [1], false],
      ])(
        "params1:%j, params2:%j, expected:%o",
        (params1, params2, expected) => {
          const vi1 = new VertexIntersection(...params1);
          const vi2 = new VertexIntersection(...params2);
          expect(vi1.equals(vi2)).toBe(expected);
        }
      );
    });
  });

  describe("has()", () => {
    test("if (!(i instanceof EdgeIntersection))", () => {
      const vi1 = new VertexIntersection(0);
      const vi2 = new VertexIntersection(0);
      expect(vi1.has(vi2)).toBe(false);
    });

    describe("else", () => {
      test.each([
        [[0], [0, 1], true],
        [[1], [0, 1], true],
        [[2], [0, 1], false],
      ])(
        "viParams:%j, eiParams:%j, expected:%o",
        (viParams, eiParams, expected) => {
          const vi = new VertexIntersection(...viParams);
          const ei = new EdgeIntersection(...eiParams, 0.5);
          expect(vi.has(ei)).toBe(expected);
        }
      );
    });
  });

  test("toString()", () => {
    const vi = new VertexIntersection(0, true);
    expect(vi.toString()).toBe("0");
  });

  test("clone()", () => {
    const vi1 = new VertexIntersection(0, true);
    const vi2 = vi1.clone();
    expect(vi1).toEqual(vi2);
  });

  test("copy()", () => {
    const vi1 = new VertexIntersection(0, true);
    const vi2 = new VertexIntersection().copy(vi1);
    expect(vi1).toEqual(vi2);
  });

  test("toJSON()", () => {
    const json1 = new VertexIntersection(0, true).toJSON();
    const json2: VertexIntersectionJSON = {
      type: "VertexIntersection",
      v: 0,
      checked: true,
    };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const vi1 = new VertexIntersection().fromJSON({
      type: "VertexIntersection",
      v: 0,
      checked: true,
    });
    const vi2 = new VertexIntersection(0, true);
    expect(vi1).toEqual(vi2);
  });
});
