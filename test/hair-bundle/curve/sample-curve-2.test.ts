import {
  circleCurve2,
  constant0Curve2,
  constant1Curve2,
  gentlyDescendingCurve2,
  gentlyDescendingCurve2InRadians,
  gentlyRisingCurve2,
  gentlyRisingCurve2InRadians,
  smallCircleCurve2,
} from "src/hair-bundle/curve/sample-curve-2";
import type * as THREE from "three";
import { describe, expect, test } from "vitest";

function expectV2CloseTo(v: THREE.Vector2, x: number, y: number) {
  expect(v.x).toBeCloseTo(x);
  expect(v.y).toBeCloseTo(y);
}

describe("circleCurve2", () => {
  test("has 5 cps forming a closed unit circle", () => {
    expect(circleCurve2.cps.length).toBe(5);
    const K = (4 * (Math.sqrt(2) - 1)) / 3;
    expectV2CloseTo(circleCurve2.cps[0].middlePos, 0, -1);
    expectV2CloseTo(circleCurve2.cps[0].leftPos, -K, -1);
    expectV2CloseTo(circleCurve2.cps[0].rightPos, K, -1);
    expectV2CloseTo(circleCurve2.cps[1].middlePos, 1, 0);
    expectV2CloseTo(circleCurve2.cps[2].middlePos, 0, 1);
    expectV2CloseTo(circleCurve2.cps[3].middlePos, -1, 0);
    // The last cp closes the loop back to the first cp's position.
    expect(circleCurve2.cps[4].middlePos).toEqual(
      circleCurve2.cps[0].middlePos
    );
  });
});

describe("smallCircleCurve2", () => {
  test("is circleCurve2 scaled by radius 0.5", () => {
    expectV2CloseTo(smallCircleCurve2.cps[0].middlePos, 0, -0.5);
    expectV2CloseTo(smallCircleCurve2.cps[1].middlePos, 0.5, 0);
    expectV2CloseTo(smallCircleCurve2.cps[2].middlePos, 0, 0.5);
    expectV2CloseTo(smallCircleCurve2.cps[3].middlePos, -0.5, 0);
  });
});

describe("gentlyRisingCurve2", () => {
  test("rises from y=1 to y=2 over aspect(3) * yLength(1) on x", () => {
    expect(gentlyRisingCurve2.cps.length).toBe(2);
    expectV2CloseTo(gentlyRisingCurve2.cps[0].middlePos, 0, 1);
    expectV2CloseTo(gentlyRisingCurve2.cps[0].leftPos, -1, 1);
    expectV2CloseTo(gentlyRisingCurve2.cps[0].rightPos, 1, 1);
    expectV2CloseTo(gentlyRisingCurve2.cps[1].middlePos, 3, 2);
    expectV2CloseTo(gentlyRisingCurve2.cps[1].leftPos, 2, 2);
    expectV2CloseTo(gentlyRisingCurve2.cps[1].rightPos, 4, 2);
  });
});

describe("gentlyDescendingCurve2", () => {
  test("descends from y=2 to y=1", () => {
    expectV2CloseTo(gentlyDescendingCurve2.cps[0].middlePos, 0, 2);
    expectV2CloseTo(gentlyDescendingCurve2.cps[1].middlePos, 3, 1);
  });
});

describe("gentlyRisingCurve2InRadians", () => {
  test("rises from y=0 to y=PI over aspect(3) * yLength(PI) on x", () => {
    expectV2CloseTo(gentlyRisingCurve2InRadians.cps[0].middlePos, 0, 0);
    expectV2CloseTo(
      gentlyRisingCurve2InRadians.cps[1].middlePos,
      3 * Math.PI,
      Math.PI
    );
  });
});

describe("gentlyDescendingCurve2InRadians", () => {
  test("descends from y=PI to y=0", () => {
    expectV2CloseTo(
      gentlyDescendingCurve2InRadians.cps[0].middlePos,
      0,
      Math.PI
    );
    expectV2CloseTo(
      gentlyDescendingCurve2InRadians.cps[1].middlePos,
      3 * Math.PI,
      0
    );
  });
});

describe("constant1Curve2", () => {
  test("stays at y=1 with handle length floor(3/3)=1", () => {
    expect(constant1Curve2.cps.length).toBe(2);
    expectV2CloseTo(constant1Curve2.cps[0].middlePos, 0, 1);
    expectV2CloseTo(constant1Curve2.cps[0].leftPos, -1, 1);
    expectV2CloseTo(constant1Curve2.cps[0].rightPos, 1, 1);
    expectV2CloseTo(constant1Curve2.cps[1].middlePos, 3, 1);
    expectV2CloseTo(constant1Curve2.cps[1].leftPos, 2, 1);
    expectV2CloseTo(constant1Curve2.cps[1].rightPos, 4, 1);
  });
});

describe("constant0Curve2", () => {
  test("stays at y=0", () => {
    expectV2CloseTo(constant0Curve2.cps[0].middlePos, 0, 0);
    expectV2CloseTo(constant0Curve2.cps[1].middlePos, 3, 0);
  });
});
