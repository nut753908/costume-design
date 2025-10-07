import {
  atan2In2PI,
  isInvalidIndex,
  reverseInPI,
  rotate180,
  rotatePI,
  safeAcos,
  safeAsin,
} from "src/hair-bundle/math/utils";
import { describe, expect, test, vi } from "vitest";

describe("safeAsin()", () => {
  test.each([
    [-2, 1, -Math.PI / 2],
    [-1, 1, -Math.PI / 2],
    [0, 1, 0],
    [1, 1, Math.PI / 2],
    [2, 1, Math.PI / 2],
    [1, 0, 0],
  ])(
    "opposite:%i, hypotenuse:%i, expected:%d",
    (opposite, hypotenuse, expected) => {
      expect(safeAsin(opposite, hypotenuse)).toBeCloseTo(expected);
    }
  );
});

describe("safeAcos()", () => {
  test.each([
    [-2, 1, Math.PI],
    [-1, 1, Math.PI],
    [0, 1, Math.PI / 2],
    [1, 1, 0],
    [2, 1, 0],
    [1, 0, 0],
  ])(
    "adjacent:%i, hypotenuse:%i, expected:%d",
    (adjacent, hypotenuse, expected) => {
      expect(safeAcos(adjacent, hypotenuse)).toBeCloseTo(expected);
    }
  );
});

describe("atan2In2PI()", () => {
  test.each([
    [0, 1, 0],
    [1, 0, Math.PI / 2],
    [0, -1, Math.PI],
    [-1, 0, (3 * Math.PI) / 2],
  ])("y:%i, x:%i, expected:%d", (y, x, expected) => {
    expect(atan2In2PI(y, x)).toBeCloseTo(expected);
  });
});

describe("reverseInPI()", () => {
  const a90 = Math.PI / 2;
  const a180 = Math.PI;

  test.each([
    [0, a180],
    [a90, a90],
    [a180, 0],
  ])("angle:%d, expected:%d", (angle, expected) => {
    expect(reverseInPI(angle)).toBeCloseTo(expected);
  });
});

describe("rotatePI()", () => {
  const a90 = Math.PI / 2;
  const a180 = Math.PI;
  const a270 = (3 * Math.PI) / 2;
  const a360 = 2 * Math.PI;

  test.each([
    [0, a180],
    [a90, a270],
    [a180, 0],
    [a270, a90],
    [a360, a180],
  ])("angle:%d, expected:%d", (angle, expected) => {
    expect(rotatePI(angle)).toBeCloseTo(expected);
  });
});

describe("rotate180()", () => {
  test.each([
    [0, 180],
    [90, 270],
    [180, 0],
    [270, 90],
    [360, 180],
  ])("angle:%d, expected:%i", (angle, expected) => {
    expect(rotate180(angle)).toBeCloseTo(expected);
  });
});

describe("isInvalidIndex()", () => {
  test.each([
    [1.1, 0, 2, true, "the index(1.1) is not integer."],
    [1, 0.1, 2, true, "the min(0.1) is not integer."],
    [1, 0, 2.1, true, "the max(2.1) is not integer."],
    [-1, 0, 2, true, "the index(-1) is out of range [0,2]."],
    [0, 0, 2, false, undefined],
    [1, 0, 2, false, undefined],
    [2, 0, 2, false, undefined],
    [3, 0, 2, true, "the index(3) is out of range [0,2]."],
  ])(
    "index:%d, min:%d, max:%d, expected:%o",
    (index, min, max, expected, msg) => {
      const spy = vi.spyOn(console, "error");
      if (msg !== undefined) {
        spy.mockImplementationOnce((v) => expect(v).toBe(msg));
      }
      expect(isInvalidIndex(index, min, max)).toBe(expected);
      expect(spy).toHaveBeenCalledTimes(msg !== undefined ? 1 : 0);
    }
  );
});
