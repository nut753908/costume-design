import {
  ControlPoint2,
  type ControlPoint2JSON,
} from "src/hair-bundle/curve/control-point-2";
import { Circular } from "src/math/circular";
import { rotate180 } from "src/math/utils";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("ControlPoint2", () => {
  test("constructor()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    expect(cp.middlePos).toEqual(new THREE.Vector2(1, 2));
    expect(cp.leftPos).toEqual(new THREE.Vector2(3, 4));
    expect(cp.rightPos).toEqual(new THREE.Vector2(5, 6));
    expect(cp.isSyncRadius).toBe(false);
    expect(cp.isSyncRadius).toBe(false);
    expect(cp.leftV).toEqual(new THREE.Vector2(2, 2));
    expect(cp.leftC.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(cp.leftC.angle).toBeCloseTo(45);
    expect(cp.rightV).toEqual(new THREE.Vector2(4, 4));
    expect(cp.rightC.radius).toBeCloseTo(4 * Math.SQRT2);
    expect(cp.rightC.angle).toBeCloseTo(45);
  });

  test("updateFromMiddlePos()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    cp.middlePos.copy(new THREE.Vector2(7, 8));
    cp.updateFromMiddlePos();
    expect(cp.leftPos).toEqual(new THREE.Vector2(7 + 2, 8 + 2));
    expect(cp.rightPos).toEqual(new THREE.Vector2(7 + 4, 8 + 4));
  });

  test("updateFromLeftPos()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    cp.leftPos.copy(new THREE.Vector2(7, 8));
    cp.updateFromLeftPos();
    expect(cp.leftV).toEqual(new THREE.Vector2(6, 6));
    expect(cp.leftC.radius).toBeCloseTo(6 * Math.SQRT2);
    expect(cp.leftC.angle).toBeCloseTo(45);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromRightPos()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    cp.rightPos.copy(new THREE.Vector2(7, 8));
    cp.updateFromRightPos();
    expect(cp.rightV).toEqual(new THREE.Vector2(6, 6));
    expect(cp.rightC.radius).toBeCloseTo(6 * Math.SQRT2);
    expect(cp.rightC.angle).toBeCloseTo(45);
    // Skip the this.syncRightToLeft() test.
  });

  test("updateFromLeftC()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    cp.leftC.copy(new Circular(6 * Math.SQRT2, 45));
    cp.updateFromLeftC();
    expect(cp.leftV.x).toBeCloseTo(6);
    expect(cp.leftV.y).toBeCloseTo(6);
    expect(cp.leftPos.x).toBeCloseTo(1 + 6);
    expect(cp.leftPos.y).toBeCloseTo(2 + 6);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromRightC()", () => {
    const cp = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    cp.rightC.copy(new Circular(6 * Math.SQRT2, 45));
    cp.updateFromRightC();
    expect(cp.rightV.x).toBeCloseTo(6);
    expect(cp.rightV.y).toBeCloseTo(6);
    expect(cp.rightPos.x).toBeCloseTo(1 + 6);
    expect(cp.rightPos.y).toBeCloseTo(2 + 6);
    // Skip the this.syncRightToLeft() test.
  });

  describe("syncLeftToRight()", () => {
    test.each([
      [
        false,
        false,
        new Circular(4 * Math.SQRT2, 45),
        new THREE.Vector2(4, 4),
        new THREE.Vector2(1 + 4, 2 + 4),
      ],
      [
        true,
        false,
        new Circular(2 * Math.SQRT2, 45),
        new THREE.Vector2(2, 2),
        new THREE.Vector2(1 + 2, 2 + 2),
      ],
      [
        false,
        true,
        new Circular(4 * Math.SQRT2, rotate180(45)),
        new THREE.Vector2(-4, -4),
        new THREE.Vector2(1 - 4, 2 - 4),
      ],
      [
        true,
        true,
        new Circular(2 * Math.SQRT2, rotate180(45)),
        new THREE.Vector2(-2, -2),
        new THREE.Vector2(1 - 2, 2 - 2),
      ],
    ])(
      "isSyncRadius:%o, isSyncAngle:%o",
      (isSyncRadius, isSyncAngle, rightC, rightV, rightPos) => {
        const cp = new ControlPoint2(
          new THREE.Vector2(1, 2),
          new THREE.Vector2(3, 4),
          new THREE.Vector2(5, 6),
          isSyncRadius,
          isSyncAngle
        );
        cp.syncLeftToRight();
        expect(cp.rightC.radius).toBeCloseTo(rightC.radius);
        expect(cp.rightC.angle).toBeCloseTo(rightC.angle);
        expect(cp.rightV.x).toBeCloseTo(rightV.x);
        expect(cp.rightV.y).toBeCloseTo(rightV.y);
        expect(cp.rightPos.x).toBeCloseTo(rightPos.x);
        expect(cp.rightPos.y).toBeCloseTo(rightPos.y);
      }
    );
  });

  describe("syncRightToLeft()", () => {
    test.each([
      [
        false,
        false,
        new Circular(2 * Math.SQRT2, 45),
        new THREE.Vector2(2, 2),
        new THREE.Vector2(1 + 2, 2 + 2),
      ],
      [
        true,
        false,
        new Circular(4 * Math.SQRT2, 45),
        new THREE.Vector2(4, 4),
        new THREE.Vector2(1 + 4, 2 + 4),
      ],
      [
        false,
        true,
        new Circular(2 * Math.SQRT2, rotate180(45)),
        new THREE.Vector2(-2, -2),
        new THREE.Vector2(1 - 2, 2 - 2),
      ],
      [
        true,
        true,
        new Circular(4 * Math.SQRT2, rotate180(45)),
        new THREE.Vector2(-4, -4),
        new THREE.Vector2(1 - 4, 2 - 4),
      ],
    ])(
      "isSyncRadius:%o, isSyncAngle:%o",
      (isSyncRadius, isSyncAngle, leftC, leftV, leftPos) => {
        const cp = new ControlPoint2(
          new THREE.Vector2(1, 2),
          new THREE.Vector2(3, 4),
          new THREE.Vector2(5, 6),
          isSyncRadius,
          isSyncAngle
        );
        cp.syncRightToLeft();
        expect(cp.leftC.radius).toBeCloseTo(leftC.radius);
        expect(cp.leftC.angle).toBeCloseTo(leftC.angle);
        expect(cp.leftV.x).toBeCloseTo(leftV.x);
        expect(cp.leftV.y).toBeCloseTo(leftV.y);
        expect(cp.leftPos.x).toBeCloseTo(leftPos.x);
        expect(cp.leftPos.y).toBeCloseTo(leftPos.y);
      }
    );
  });

  test("clone()", () => {
    const cp1 = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    const cp2 = cp1.clone();
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });

  test("copy()", () => {
    const cp1 = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    const cp2 = new ControlPoint2().copy(cp1);
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });

  const _json: ControlPoint2JSON = {
    middlePos: [1, 2],
    leftPos: [3, 4],
    rightPos: [5, 6],
    isSyncRadius: false,
    isSyncAngle: false,
    type: "ControlPoint2",
    leftV: [2, 2],
    leftC: { radius: 2 * Math.SQRT2, angle: 45 }, // Assume there is no rounding error.
    rightV: [4, 4],
    rightC: { radius: 4 * Math.SQRT2, angle: 45 }, // Assume there is no rounding error.
  };

  test("toJSON()", () => {
    const cp1 = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    const json1 = cp1.toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const cp1 = new ControlPoint2().fromJSON(_json);
    const cp2 = new ControlPoint2(
      new THREE.Vector2(1, 2),
      new THREE.Vector2(3, 4),
      new THREE.Vector2(5, 6),
      false,
      false
    );
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });
});
