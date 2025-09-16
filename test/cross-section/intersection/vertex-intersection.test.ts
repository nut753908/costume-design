import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  VertexIntersection,
  type VertexIntersectionJSON,
} from "src/cross-section/intersection/vertex-intersection";
import * as THREE from "three";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi as vitestVi,
} from "vitest";

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

  describe("equals()", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vitestVi.spyOn(console, "error");
    });

    test("if (!(i instanceof VertexIntersection))", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
(!(i instanceof VertexIntersection)
- i: {"bottomV":0,"topV":1,"u":0.5,"checked":false}
`);
      });
      const vi = new VertexIntersection(0);
      const ei = new EdgeIntersection(0, 1, 0.5);
      expect(vi.equals(ei)).toBe(false);
      expect(spy).toHaveBeenCalledTimes(1);
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
          expect(spy).toHaveBeenCalledTimes(0);
        }
      );
    });
  });

  describe("has()", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vitestVi.spyOn(console, "error");
    });

    test("if (!(i instanceof EdgeIntersection))", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
(!(i instanceof EdgeIntersection)
- i: {"v":0,"checked":false}
`);
      });
      const vi1 = new VertexIntersection(0);
      const vi2 = new VertexIntersection(0);
      expect(vi1.has(vi2)).toBe(false);
      expect(spy).toHaveBeenCalledTimes(1);
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
          expect(spy).toHaveBeenCalledTimes(0);
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
    const json2: VertexIntersectionJSON = { v: 0, checked: true };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const vi1 = new VertexIntersection().fromJSON({ v: 0, checked: true });
    const vi2 = new VertexIntersection(0, true);
    expect(vi1).toEqual(vi2);
  });
});
