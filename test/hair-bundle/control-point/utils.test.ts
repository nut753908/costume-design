import {
  atan2In2PI,
  getAngles,
  reverseInPI,
  rotate180,
  rotatePI,
  safeAcos,
  safeAsin,
} from "src/hair-bundle/control-point/utils";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

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

describe("getAngles()", () => {
  test.each([
    [new THREE.Vector3(1, 1, 1), new THREE.Vector3(45, 45, 45)],
    [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 90, 0)],
    [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 90)],
    [new THREE.Vector3(0, 0, 1), new THREE.Vector3(90, 0, 0)],
  ])("v:%j, expected:%j", (v, expected) => {
    expect(getAngles(v)).toEqual(expected);
  });
});
