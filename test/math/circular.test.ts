import { Circular } from "src/math/circular";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Circle", () => {
  describe("constructor()", () => {
    test("default params", () => {
      const c = new Circular();
      expect(c.radius).toBe(1);
      expect(c.angle).toBe(0);
    });

    test("specified params", () => {
      const c = new Circular(2, 90);
      expect(c.radius).toBe(2);
      expect(c.angle).toBe(90);
    });
  });

  describe("get x()", () => {
    describe("when the angle increases by 90 degrees", () => {
      test.each([
        [1, 0, 1],
        [1, 90, 0],
        [1, 180, -1],
        [1, 270, 0],
      ])("radius:%i, angle:%i, x:%d", (radius, angle, x) => {
        const c = new Circular(radius, angle);
        expect(c.x).toBeCloseTo(x);
      });
    });

    describe("when the radius increases by 1", () => {
      test.each([
        [1, 0, 1],
        [2, 0, 2],
        [3, 0, 3],
        [1, 90, 0],
        [2, 90, 0],
        [3, 90, 0],
      ])("radius:%i, angle:%i, x:%d", (radius, angle, x) => {
        const c = new Circular(radius, angle);
        expect(c.x).toBeCloseTo(x);
      });
    });
  });

  describe("get y()", () => {
    describe("when the angle increases by 90 degrees", () => {
      test.each([
        [1, 0, 0],
        [1, 90, 1],
        [1, 180, 0],
        [1, 270, -1],
      ])("radius:%i, angle:%i, y:%d", (radius, angle, y) => {
        const c = new Circular(radius, angle);
        expect(c.y).toBeCloseTo(y);
      });
    });

    describe("when the radius increases by 1", () => {
      test.each([
        [1, 0, 0],
        [2, 0, 0],
        [3, 0, 0],
        [1, 90, 1],
        [2, 90, 2],
        [3, 90, 3],
      ])("radius:%i, angle:%i, y:%d", (radius, angle, y) => {
        const c = new Circular(radius, angle);
        expect(c.y).toBeCloseTo(y);
      });
    });
  });

  describe("setFromVector2()", () => {
    describe("when x and y change in a circular fashion", () => {
      test.each([
        [1, 0, 1, 0],
        [0, 1, 1, 90],
        [-1, 0, 1, 180],
        [0, -1, 1, 270],
      ])("x:%i, y:%i, radius:%d, angle:%d", (x, y, radius, angle) => {
        const c = new Circular();
        c.setFromVector2(new THREE.Vector2(x, y));
        expect(c.radius).toBeCloseTo(radius);
        expect(c.angle).toBeCloseTo(angle);
      });
    });

    describe("when x or y increases by 1", () => {
      test.each([
        [1, 0, 1, 0],
        [2, 0, 2, 0],
        [3, 0, 3, 0],
        [0, 1, 1, 90],
        [0, 2, 2, 90],
        [0, 3, 3, 90],
      ])("x:%i, y:%i, radius:%d, angle:%d", (x, y, radius, angle) => {
        const c = new Circular();
        c.setFromVector2(new THREE.Vector2(x, y));
        expect(c.radius).toBeCloseTo(radius);
        expect(c.angle).toBeCloseTo(angle);
      });
    });
  });

  test("clone()", () => {
    const c1 = new Circular(2, 90);
    const c2 = c1.clone();
    expect(c1).toEqual(c2);
  });

  test("copy()", () => {
    const c1 = new Circular(2, 90);
    const c2 = new Circular().copy(c1);
    expect(c1).toEqual(c2);
  });

  test("toJSON()", () => {
    const json1 = new Circular(2, 90).toJSON();
    const json2 = { radius: 2, angle: 90 };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const c1 = new Circular().fromJSON({ radius: 2, angle: 90 });
    const c2 = new Circular(2, 90);
    expect(c1).toEqual(c2);
  });
});
